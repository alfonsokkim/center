from fastapi import FastAPI;
from fastapi.middleware.cors import CORSMiddleware;
from contextlib import asynccontextmanager;
from routes import score, session, analytics;

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Centre API is starting...")
    # create DB connection
    yield
    print("Centre API is shutting down...")
    # close DB connection


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

app.include_router(score.router, prefix="/score")
app.include_router(analytics.router, prefix="/analytics")
app.include_router(session.router, prefix="/session")

@app.get("/")
async def root():
    return {"status": "Centre API is running"}