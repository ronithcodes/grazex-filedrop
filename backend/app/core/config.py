from functools import lru_cache
from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_DATABASE_URL = f"sqlite:///{(PROJECT_ROOT / 'database' / 'filedrop.db').as_posix()}"


class Settings(BaseSettings):
    app_name: str = "Grazex-FileDrop"
    database_url: str = Field(
        default=DEFAULT_DATABASE_URL,
        alias="DATABASE_URL",
    )
    secret_key: str = Field(default="change-me-in-production", alias="SECRET_KEY")
    max_upload_size: int = Field(default=100 * 1024 * 1024, alias="MAX_UPLOAD_SIZE")
    upload_folder: Path = Field(default=Path("uploads"), alias="UPLOAD_FOLDER")
    api_host: str = Field(default="0.0.0.0", alias="API_HOST")
    api_port: int = Field(default=8000, alias="API_PORT")
    auth_enabled: bool = Field(default=False, alias="AUTH_ENABLED")
    cors_origins: list[str] = Field(default=["http://localhost:5173"], alias="CORS_ORIGINS")
    allowed_extensions: set[str] = {
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "mp4",
        "mov",
        "avi",
        "pdf",
        "txt",
        "zip",
        "docx",
    }

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def upload_path(self) -> Path:
        if self.upload_folder.is_absolute():
            return self.upload_folder.resolve()
        return (PROJECT_ROOT / self.upload_folder).resolve()

    @property
    def max_upload_size_mb(self) -> int:
        return self.max_upload_size // (1024 * 1024)


@lru_cache
def get_settings() -> Settings:
    return Settings()
