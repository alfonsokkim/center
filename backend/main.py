from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from routes import session
from db.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Centre API is starting...")
    init_db()
    yield
    print("Centre API is shutting down...")


app = FastAPI(
    title="Centre API",
    description="Backend API for Centre - a focus tracking extension",
    version="1.0.0",
    lifespan=lifespan
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # we need to insert our chrome extension when it gets created -> allow_origins=["chrome-extension://xxxxx"]
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(session.router, prefix="/session")



# exception handlers

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(status_code=400, content={"detail": str(exc)})

@app.exception_handler(LookupError)
async def lookup_error_handler(request: Request, exc: LookupError):
    return JSONResponse(status_code=404, content={"detail": str(exc)})

@app.exception_handler(Exception)
async def general_error_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})



@app.get("/")
async def root():
    return {"status": "Centre API is running"}
