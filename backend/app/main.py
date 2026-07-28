from contextlib import asynccontextmanager
from datetime import datetime
from time import perf_counter

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address
from starlette.responses import JSONResponse

from app.api.files import router as files_router
from app.core.config import get_settings
from app.core.database import Base, engine
from app.models import file as _file_model

settings = get_settings()
console = Console()
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    started = perf_counter()
    settings.upload_path.mkdir(parents=True, exist_ok=True)
    Base.metadata.create_all(bind=engine)
    render_banner(perf_counter() - started)
    yield


def render_banner(startup_seconds: float) -> None:
    console.clear()
    table = Table(show_header=False, box=None, padding=(0, 2))
    table.add_row("Server", f"http://{settings.api_host}:{settings.api_port}")
    table.add_row("Database", settings.database_url)
    table.add_row("Upload Folder", str(settings.upload_path))
    table.add_row("Max Upload Size", f"{settings.max_upload_size_mb} MB")
    table.add_row("API Port", str(settings.api_port))
    table.add_row("Startup Time", f"{startup_seconds:.2f}s")
    table.add_row("Started", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    console.print(Panel.fit("[bold cyan]Grazex-FileDrop[/bold cyan]\n[white]Upload. Share. Download.[/white]", border_style="cyan"))
    console.print(table)


app = FastAPI(
    title=settings.app_name,
    description="Open-source file sharing API for instant upload links.",
    version="1.0.0",
    lifespan=lifespan,
)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(files_router)


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request, exc):
    return JSONResponse(status_code=429, content={"detail": "Too many requests"})


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": settings.app_name}
