import mimetypes
import secrets
import shutil
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from slugify import slugify
from sqlalchemy import Select, or_, select
from sqlalchemy.orm import Session

from app.core.config import Settings
from app.models.file import StoredFile


class FileService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.settings.upload_path.mkdir(parents=True, exist_ok=True)

    def _extension_for(self, filename: str) -> str:
        extension = Path(filename).suffix.lower().lstrip(".")
        if extension not in self.settings.allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type: .{extension or 'unknown'}",
            )
        return extension

    def _share_id(self, db: Session) -> str:
        while True:
            candidate = secrets.token_urlsafe(9).replace("-", "").replace("_", "")[:12]
            if not db.scalar(select(StoredFile).where(StoredFile.share_id == candidate)):
                return candidate

    def _storage_name(self, extension: str) -> str:
        return f"{secrets.token_hex(24)}.{extension}"

    def _public_name(self, filename: str) -> str:
        stem = Path(filename).stem
        extension = Path(filename).suffix
        safe_stem = slugify(stem)[:90] or "download"
        return f"{safe_stem}{extension.lower()}"

    def _stored_path(self, stored_filename: str) -> Path:
        path = (self.settings.upload_path / stored_filename).resolve()
        if self.settings.upload_path not in path.parents and path != self.settings.upload_path:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file path")
        return path

    async def create(self, db: Session, upload: UploadFile, uploader: str | None = None) -> StoredFile:
        extension = self._extension_for(upload.filename or "")
        public_name = self._public_name(upload.filename or f"upload.{extension}")
        stored_name = self._storage_name(extension)
        destination = self._stored_path(stored_name)
        size = 0

        with destination.open("wb") as buffer:
            while chunk := await upload.read(1024 * 1024):
                size += len(chunk)
                if size > self.settings.max_upload_size:
                    buffer.close()
                    destination.unlink(missing_ok=True)
                    raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File too large")
                buffer.write(chunk)

        mime_type = upload.content_type or mimetypes.guess_type(public_name)[0] or "application/octet-stream"
        stored = StoredFile(
            filename=stored_name,
            original_name=public_name,
            extension=extension,
            mime_type=mime_type,
            size=size,
            uploader=uploader,
            share_id=self._share_id(db),
        )
        db.add(stored)
        db.commit()
        db.refresh(stored)
        return stored

    def get(self, db: Session, share_id: str) -> StoredFile:
        stored = db.scalar(select(StoredFile).where(StoredFile.share_id == share_id))
        if stored is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
        return stored

    def list(self, db: Session, search: str | None = None, sort: str = "newest") -> list[StoredFile]:
        query: Select[tuple[StoredFile]] = select(StoredFile)
        if search:
            term = f"%{search.lower()}%"
            query = query.where(or_(StoredFile.original_name.ilike(term), StoredFile.extension.ilike(term)))
        if sort == "name":
            query = query.order_by(StoredFile.original_name.asc())
        elif sort == "size":
            query = query.order_by(StoredFile.size.desc())
        elif sort == "downloads":
            query = query.order_by(StoredFile.download_count.desc())
        else:
            query = query.order_by(StoredFile.upload_time.desc())
        return list(db.scalars(query).all())

    def download_path(self, db: Session, share_id: str) -> tuple[StoredFile, Path]:
        stored = self.get(db, share_id)
        path = self._stored_path(stored.filename)
        if not path.exists():
            raise HTTPException(status_code=status.HTTP_410_GONE, detail="File is no longer available")
        stored.download_count += 1
        db.commit()
        db.refresh(stored)
        return stored, path

    def rename(self, db: Session, share_id: str, new_name: str) -> StoredFile:
        stored = self.get(db, share_id)
        extension = self._extension_for(new_name)
        stored.original_name = self._public_name(new_name)
        stored.extension = extension
        db.commit()
        db.refresh(stored)
        return stored

    def delete(self, db: Session, share_id: str) -> None:
        stored = self.get(db, share_id)
        self._stored_path(stored.filename).unlink(missing_ok=True)
        db.delete(stored)
        db.commit()

    def copy_into_uploads(self, source: Path, filename: str) -> Path:
        extension = self._extension_for(filename)
        destination = self._stored_path(self._storage_name(extension))
        shutil.copyfile(source, destination)
        return destination
