from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class StoredFile(Base):
    __tablename__ = "files"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    original_name: Mapped[str] = mapped_column(String(255), nullable=False)
    extension: Mapped[str] = mapped_column(String(24), index=True, nullable=False)
    mime_type: Mapped[str] = mapped_column(String(120), nullable=False)
    size: Mapped[int] = mapped_column(Integer, nullable=False)
    upload_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    download_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    uploader: Mapped[str | None] = mapped_column(String(120), index=True, nullable=True)
    share_id: Mapped[str] = mapped_column(String(32), unique=True, index=True, nullable=False)
