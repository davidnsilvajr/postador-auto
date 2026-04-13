import os
from pydantic_settings import BaseSettings
from functools import lru_cache


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

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
