import os
from pathlib import Path
from pydantic_settings import BaseSettings
from functools import lru_cache

# .env fica na raiz do projeto (um nivel acima de backend/), mas o app pode ser
# iniciado de backend/ ou da raiz. Resolvemos o caminho de forma absoluta.
# config.py -> backend/app/config.py: parents[2] = raiz do projeto.
_PROJECT_ROOT = Path(__file__).resolve().parents[2]
_ENV_CANDIDATES = [_PROJECT_ROOT / ".env", Path(__file__).resolve().parents[1] / ".env"]
_ENV_FILE = next((str(p) for p in _ENV_CANDIDATES if p.exists()), ".env")


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Postador Auto"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Supabase
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str

    # OpenRouter (gerencia todas as IAs: Claude, GPT, etc.)
    OPENROUTER_API_KEY: str

    # Modelos via OpenRouter (padrao pode ser mudado no frontend)
    OPENROUTER_TEXT_MODEL: str = "anthropic/claude-sonnet-4"
    OPENROUTER_IMAGE_MODEL: str = "openai/dall-e-3"

    # Social Media APIs
    INSTAGRAM_ACCESS_TOKEN: str = ""
    FACEBOOK_ACCESS_TOKEN: str = ""
    TWITTER_BEARER_TOKEN: str = ""
    TWITTER_API_KEY: str = ""
    TWITTER_API_SECRET: str = ""
    TWITTER_ACCESS_TOKEN: str = ""
    TWITTER_ACCESS_SECRET: str = ""
    LINKEDIN_ACCESS_TOKEN: str = ""
    TIKTOK_ACCESS_TOKEN: str = ""
    YOUTUBE_ACCESS_TOKEN: str = ""

    # CORS (comma-separated). Vite dev server roda em 5173 por padrao.
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    class Config:
        env_file = _ENV_FILE
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
