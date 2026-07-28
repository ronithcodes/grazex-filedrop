from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FileRead(BaseModel):
    id: str
    filename: str
    original_name: str
    extension: str
    mime_type: str
    size: int
    upload_time: datetime
    download_count: int
    uploader: str | None
    share_id: str
    download_url: str

    model_config = ConfigDict(from_attributes=True)


class FileRename(BaseModel):
    original_name: str


class UploadResult(BaseModel):
    file: FileRead
    message: str = "File uploaded successfully"
