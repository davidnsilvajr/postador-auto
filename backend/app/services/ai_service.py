import httpx
import json
from typing import Optional
from app.config import get_settings
from app.database import supabase


# ---------- helpers ----------

def get_brand_context(brand_id: str) -> dict:
    brand_r = supabase.table("brands").select("*").eq("id", brand_id).execute()
    guideline_r = supabase.table("brand_guidelines").select("*").eq("brand_id", brand_id).execute()
    return {
        "brand": brand_r.data[0] if brand_r.data else {},
        "guideline": guideline_r.data[0] if guideline_r.data else {},
    }


def _openrouter_chat(system: str, user_msg: str, model: Optional[str] = None) -> str:
    """Send a chat completion via OpenRouter (OpenAI-compatible API)"""
    settings = get_settings()

    resp = httpx.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Postador Auto",
        },
        json={
            "model": model or settings.OPENROUTER_TEXT_MODEL,
            "temperature": 0.8,
            "max_tokens": 4096,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user_msg},
            ],
        },
        timeout=60.0,
    )
    data = resp.json()

    if "error" in data:
        raise ValueError(f"OpenRouter error: {data['error']}")

    return data["choices"][0]["message"]["content"]


def _extract_json(text: str) -> dict:
    """Extract JSON from Markdown code blocks"""
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
    elif "```" in text:
        text = text.split("```")[1].split("```")[0].strip()
    return json.loads(text)


# ---------- public API ----------

def generate_post_content(
    topic: str,
    brand_id: str,
    platforms: list[str],
    tone: Optional[str] = None,
    language: str = "pt-BR",
    campaign: Optional[str] = None,
) -> dict:
    ctx = get_brand_context(brand_id)
    brand = ctx["brand"]
    guideline = ctx["guideline"]

    system_prompt = f"""Voce e um social media marketing profissional especializado em criar conteudo de alta performance para redes sociais brasileiras.

## Sobre a marca:
- Nome: {brand.get('name', 'N/A')}
- Industria: {brand.get('industry', 'N/A')}
- Descricao: {brand.get('description', 'N/A')}
- Tom de voz: {tone or brand.get('tone_of_voice', 'N/A')}
- Tagline: {guideline.get('tagline', 'N/A')}
- Palavras-chave: {', '.join(guideline.get('keywords', []))}
- Voz da marca: {guideline.get('brand_voice_description', 'N/A')}
- NAO usar: {', '.join(guideline.get('do_not_say', [])) if guideline.get('do_not_say') else 'Nada especifico'}
- SEMPRE incluir: {', '.join(guideline.get('must_include', [])) if guideline.get('must_include') else 'Nada especifico'}
- Campanha: {campaign or 'Nenhuma campanha especifica'}

Responda EXCLUSIVAMENTE em JSON valido:
{{
  "captions": {{
    "instagram": "caption aqui",
    "facebook": "caption aqui",
    "twitter": "caption aqui (max 280 chars)",
    "linkedin": "caption aqui (tom mais profissional)"
  }},
  "hashtags": ["#hashtag1", "#hashtag2", "..."],
  "image_prompt": "descricao detalhada da imagem para gerar",
  "variations": ["variacao 1", "variacao 2", "variacao 3"],
  "best_posting_times": ["09:00", "12:00", "18:00", "20:00"],
  "content_pillars": ["educacional", "inspiracional", "promocional"]
}}"""

    user_msg = f"Crie conteudo para:\n\nTema: {topic}\nPlataformas: {', '.join(platforms)}"
    raw = _openrouter_chat(system_prompt, user_msg)
    return _extract_json(raw)


def generate_image(image_prompt: str, brand_id: Optional[str] = None) -> str:
    """Generate image via OpenRouter-compatible image model"""
    settings = get_settings()

    if brand_id:
        ctx = get_brand_context(brand_id)
        guideline = ctx["guideline"]
        if guideline.get("primary_color"):
            image_prompt += f"\nUse the primary color #{guideline['primary_color']} in the image."

    resp = httpx.post(
        "https://openrouter.ai/api/v1/images/generations",
        headers={
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": settings.OPENROUTER_IMAGE_MODEL,
            "prompt": image_prompt,
            "n": 1,
            "size": "1024x1024",
        },
        timeout=60.0,
    )

    data = resp.json()
    return data["data"][0]["url"]  # may vary by provider


def suggest_content_pillars(brand_id: str) -> list[dict]:
    ctx = get_brand_context(brand_id)
    brand = ctx["brand"]

    system_prompt = f"""Voce e um estrategista de marketing digital.
Based na marca abaixo, sugira 5-8 content pillars.

Marca: {brand.get('name', 'N/A')}
Industria: {brand.get('industry', 'N/A')}
Descricao: {brand.get('description', 'N/A')}

JSON: {{"pillars": [{{"name": "nome", "description": "descricao", "examples": []}}]}}"""

    raw = _openrouter_chat(system_prompt, "Sugira content pillars para esta marca.")
    return _extract_json(raw).get("pillars", [])


def generate_monthly_calendar(brand_id: str, month: int, year: int) -> list[dict]:
    ctx = get_brand_context(brand_id)

    system_prompt = f"""Crie um calendario de conteudo mensal.
Marca: {ctx['brand'].get('name', 'N/A')}
Industria: {ctx['brand'].get('industry', 'N/A')}
Mes: {month}/{year}

JSON: {{"calendar": [{{"date": "YYYY-MM-DD", "topic": "tema", "content_pillar": "pilar", "platform": ["instagram"]}}]}}"""

    raw = _openrouter_chat(system_prompt, f"Crie o calendario para {month}/{year}.")
    return _extract_json(raw).get("calendar", [])


def rewrite_for_platform(caption: str, platform: str, brand_context: dict) -> str:
    specs = {
        "instagram": "Ate 2200 chars, visual, emojis moderados, hashtags no final. Tom casual.",
        "facebook": "Ate 5000 chars, conversacional mas informativo.",
        "twitter": "MAXIMO 280 caracteres. Direto e impactante.",
        "linkedin": "Profissional e analitico. Dados e insights. Sem emojis.",
        "tiktok": "Curto e divertido. Ate 100 chars de texto na tela.",
        "youtube": "Descritivo e SEO-otimizado. Inclua timestamps e CTAs.",
    }

    raw = _openrouter_chat(
        f"Voce e um copywriter especialista em {platform}. {specs.get(platform, '')}",
        f"Reescreva este caption para {platform}:\n\n{caption}",
    )
    return raw
