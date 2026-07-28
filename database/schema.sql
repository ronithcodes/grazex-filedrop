CREATE TABLE IF NOT EXISTS files (
    id VARCHAR(36) PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    extension VARCHAR(24) NOT NULL,
    mime_type VARCHAR(120) NOT NULL,
    size INTEGER NOT NULL,
    upload_time TIMESTAMPTZ NOT NULL,
    download_count INTEGER NOT NULL DEFAULT 0,
    uploader VARCHAR(120),
    share_id VARCHAR(32) UNIQUE NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_files_share_id ON files (share_id);
CREATE INDEX IF NOT EXISTS ix_files_extension ON files (extension);
CREATE INDEX IF NOT EXISTS ix_files_uploader ON files (uploader);
