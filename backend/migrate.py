#!/usr/bin/env python3
"""
Migration runner para o Postador Auto.

Aplica os arquivos SQL em supabase/migrations/ em ordem, rastreando quais
já foram executados numa tabela _migrations no próprio banco.

Uso:
    python migrate.py               # aplica todas as migrations pendentes
    python migrate.py --schema      # aplica o schema inicial (supabase/schema.sql) primeiro
    python migrate.py --status      # lista o status de cada migration

Requisitos:
    DATABASE_URL=postgresql://postgres:[senha]@db.[ref].supabase.co:5432/postgres
    (definir no .env na raiz do projeto)

Como obter a DATABASE_URL no Supabase:
    Dashboard → Settings → Database → Connection string → URI
"""

import argparse
import os
import sys
from pathlib import Path

import psycopg2
from psycopg2.extensions import connection as PGConnection

# Resolve raiz do projeto (este script fica em backend/)
PROJECT_ROOT = Path(__file__).resolve().parents[1]
MIGRATIONS_DIR = PROJECT_ROOT / "supabase" / "migrations"
SCHEMA_FILE = PROJECT_ROOT / "supabase" / "schema.sql"

# Carrega .env manualmente (evita dependência de pydantic_settings aqui)
_env_file = PROJECT_ROOT / ".env"
if _env_file.exists():
    for line in _env_file.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, val = line.partition("=")
            os.environ.setdefault(key.strip(), val.strip())


def get_connection(db_url: str = "") -> PGConnection:
    url = db_url or os.environ.get("DATABASE_URL", "")
    if not url:
        sys.exit(
            "\n[ERRO] DATABASE_URL não definida.\n"
            "Use --db-url ou defina DATABASE_URL no .env\n"
            "Formato Supabase pooler: postgresql://postgres.[ref]:[senha]@aws-1-[region].pooler.supabase.com:5432/postgres\n"
            "Obtenha a senha em: Supabase Dashboard → Settings → Database\n"
        )
    return psycopg2.connect(url)


def ensure_migrations_table(conn: PGConnection) -> None:
    with conn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS _migrations (
                id          SERIAL PRIMARY KEY,
                filename    TEXT UNIQUE NOT NULL,
                applied_at  TIMESTAMPTZ DEFAULT NOW()
            );
        """)
    conn.commit()


def applied_migrations(conn: PGConnection) -> set[str]:
    with conn.cursor() as cur:
        cur.execute("SELECT filename FROM _migrations ORDER BY filename;")
        return {row[0] for row in cur.fetchall()}


def run_sql_file(conn: PGConnection, path: Path) -> None:
    sql = path.read_text(encoding="utf-8")
    with conn.cursor() as cur:
        cur.execute(sql)
    conn.commit()


def record_migration(conn: PGConnection, filename: str) -> None:
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO _migrations (filename) VALUES (%s) ON CONFLICT DO NOTHING;",
            (filename,),
        )
    conn.commit()


def get_migration_files() -> list[Path]:
    if not MIGRATIONS_DIR.exists():
        return []
    return sorted(MIGRATIONS_DIR.glob("*.sql"))


def cmd_status(conn: PGConnection) -> None:
    ensure_migrations_table(conn)
    done = applied_migrations(conn)
    files = get_migration_files()

    if not files:
        print("Nenhum arquivo de migration encontrado em supabase/migrations/")
        return

    print(f"\n{'Status':<12} {'Arquivo'}")
    print("-" * 50)
    for f in files:
        status = "✓ aplicada" if f.name in done else "✗ pendente"
        print(f"{status:<12} {f.name}")
    print()


def cmd_apply(conn: PGConnection, apply_schema: bool) -> None:
    ensure_migrations_table(conn)
    done = applied_migrations(conn)

    # Schema inicial (opcional, marcado como "0000_schema.sql" no tracker)
    if apply_schema:
        marker = "0000_schema.sql"
        if marker not in done:
            if not SCHEMA_FILE.exists():
                print(f"[AVISO] {SCHEMA_FILE} não encontrado, pulando schema inicial.")
            else:
                print(f"Aplicando schema inicial: {SCHEMA_FILE.name} ...", end=" ")
                try:
                    run_sql_file(conn, SCHEMA_FILE)
                    record_migration(conn, marker)
                    print("OK")
                except Exception as exc:
                    conn.rollback()
                    print(f"ERRO\n  {exc}")
                    sys.exit(1)
        else:
            print(f"[OK] Schema inicial já aplicado.")

    # Migrations incrementais
    files = get_migration_files()
    if not files:
        print("Nenhuma migration encontrada em supabase/migrations/")
        return

    applied_count = 0
    for mig in files:
        if mig.name in done:
            print(f"[OK] {mig.name} já aplicada.")
            continue
        print(f"Aplicando {mig.name} ...", end=" ", flush=True)
        try:
            run_sql_file(conn, mig)
            record_migration(conn, mig.name)
            print("OK")
            applied_count += 1
        except Exception as exc:
            conn.rollback()
            print(f"ERRO\n  {exc}")
            sys.exit(1)

    if applied_count == 0:
        print("\nNenhuma migration nova para aplicar.")
    else:
        print(f"\n{applied_count} migration(s) aplicada(s) com sucesso.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Postador Auto — Migration Runner")
    parser.add_argument(
        "--schema",
        action="store_true",
        help="Aplicar o schema inicial (supabase/schema.sql) antes das migrations",
    )
    parser.add_argument(
        "--status",
        action="store_true",
        help="Listar status das migrations sem aplicar nada",
    )
    parser.add_argument(
        "--db-url",
        dest="db_url",
        default="",
        help="URL de conexão PostgreSQL (sobrescreve DATABASE_URL do .env)",
    )
    args = parser.parse_args()

    conn = get_connection(args.db_url)
    try:
        if args.status:
            cmd_status(conn)
        else:
            cmd_apply(conn, apply_schema=args.schema)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
