from fastapi import APIRouter, Depends, File, Query, Request, UploadFile, status
from fastapi.responses import FileResponse, RedirectResponse
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.core.database import get_db
from app.schemas.file import FileRead, FileRename, UploadResult
from app.services.files import FileService

router = APIRouter()


def serialize_file(request: Request, stored: object) -> FileRead:
    share_id = getattr(stored, "share_id")
    return FileRead(
        id=getattr(stored, "id"),
        filename=getattr(stored, "filename"),
        original_name=getattr(stored, "original_name"),
        extension=getattr(stored, "extension"),
        mime_type=getattr(stored, "mime_type"),
        size=getattr(stored, "size"),
        upload_time=getattr(stored, "upload_time"),
        download_count=getattr(stored, "download_count"),
        uploader=getattr(stored, "uploader"),
        share_id=share_id,
        download_url=str(request.url_for("download_file", share_id=share_id)),
    )


def get_file_service(settings: Settings = Depends(get_settings)) -> FileService:
    return FileService(settings)


@router.post("/upload", response_model=UploadResult, status_code=status.HTTP_201_CREATED)
async def upload_file(
    request: Request,
    upload: UploadFile = File(...),
    db: Session = Depends(get_db),
    service: FileService = Depends(get_file_service),
) -> UploadResult:
    stored = await service.create(db, upload)
    return UploadResult(file=serialize_file(request, stored))


@router.get("/file/{share_id}", response_model=FileRead)
def get_file(
    share_id: str,
    request: Request,
    db: Session = Depends(get_db),
    service: FileService = Depends(get_file_service),
) -> FileRead:
    return serialize_file(request, service.get(db, share_id))


@router.get("/download/{share_id}", name="download_file")
def download_file(
    share_id: str,
    db: Session = Depends(get_db),
    service: FileService = Depends(get_file_service),
) -> FileResponse:
    stored, path = service.download_path(db, share_id)
    return FileResponse(path, media_type=stored.mime_type, filename=stored.original_name)


@router.get("/f/{share_id}", name="share_link")
def share_link(share_id: str) -> RedirectResponse:
    return RedirectResponse(url=f"/download/{share_id}", status_code=status.HTTP_307_TEMPORARY_REDIRECT)


@router.delete("/file/{share_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_file(
    share_id: str,
    db: Session = Depends(get_db),
    service: FileService = Depends(get_file_service),
) -> None:
    service.delete(db, share_id)


@router.patch("/file/{share_id}", response_model=FileRead)
def rename_file(
    share_id: str,
    payload: FileRename,
    request: Request,
    db: Session = Depends(get_db),
    service: FileService = Depends(get_file_service),
) -> FileRead:
    return serialize_file(request, service.rename(db, share_id, payload.original_name))


@router.get("/files", response_model=list[FileRead])
def list_files(
    request: Request,
    search: str | None = Query(default=None),
    sort: str = Query(default="newest", pattern="^(newest|name|size|downloads)$"),
    db: Session = Depends(get_db),
    service: FileService = Depends(get_file_service),
) -> list[FileRead]:
    return [serialize_file(request, stored) for stored in service.list(db, search=search, sort=sort)]
