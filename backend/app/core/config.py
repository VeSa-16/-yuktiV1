from pydantic_settings import BaseSettings
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent  # backend/


class Settings(BaseSettings):
    database_url: str = f"sqlite:///{BASE_DIR / 'yukti.db'}"
    llm_api_key: str = ""
    llm_model: str = "claude-sonnet-4-6"
    gemini_api_key: str = ""
    env: str = "development"
    cors_origins: str = "*"
    seed_on_startup: bool = True

    class Config:
        env_file = ".env"


settings = Settings()
