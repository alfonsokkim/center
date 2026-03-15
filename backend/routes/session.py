from fastapi import APIRouter, Header, Query
from pydantic import BaseModel

from db.schema import UpdateSessionSchema
from db.storage import create_session, get_events, get_recent_events, get_session, update_session
from services.event import handlePrevTab, handleSwitchTab

router = APIRouter()


class SessionGoalBody(BaseModel):
    goal: str


class UrlBody(BaseModel):
    url: str
    title: str = ""


class TabTimeBody(BaseModel):
    url: str
    duration: float


class EndSessionBody(BaseModel):
    totalTimeElapsed: float | None = None


@router.post("/goal")
async def start_session(body: SessionGoalBody):
    session = create_session(goal=body.goal)
    return {"sessionId": session.id, "statuscode": 200}


@router.post("/url")
async def new_tab(body: UrlBody, sessionId: str = Header(..., alias="sessionId")):
    relevance = await handleSwitchTab(sessionId, body.url, body.title)
    return {"score": relevance}


@router.post("/tabtime")
async def tab_time(body: TabTimeBody, sessionId: str = Header(..., alias="sessionId")):
    handlePrevTab(sessionId, body.url, body.duration)
    return {"status": "ok"}


@router.post("/end")
async def end_session(
    body: EndSessionBody | None = None,
    sessionId: str = Header(..., alias="sessionId"),
):
    session = get_session(sessionId)
    if not session:
        raise LookupError("Session not found")

    if body and body.totalTimeElapsed is not None:
        update_session(sessionId, UpdateSessionSchema(duration=body.totalTimeElapsed))

    return {"status": "ok"}


@router.get("/events/recent")
async def get_recent_tab_events(limit: int = Query(default=6, ge=1, le=24)):
    events = get_recent_events(limit)
    return {
        "events": [
            {
                "id": event.id,
                "sessionId": event.session_id,
                "url": event.url,
                "title": event.title,
                "relevanceScore": event.relevance_score or 0.0,
                "duration": event.time_spent or 0.0,
            }
            for event in events
        ]
    }


@router.get("/{session_id}")
async def get_session_stats(session_id: str):
    session = get_session(session_id)
    if not session:
        raise LookupError("Session not found")

    events = get_events(session_id) or []

    return {
        "sessionId": session.id,
        "goal": session.goal,
        "duration": session.duration,
        "events": [
            {
                "id": event.id,
                "url": event.url,
                "title": event.title,
                "relevanceScore": event.relevance_score,
                "duration": event.time_spent,
            }
            for event in events
        ],
    }
