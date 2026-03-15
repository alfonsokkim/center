from fastapi import APIRouter, Header
from db.schema import UpdateSessionSchema
from db.storage import create_session, get_events, get_session, update_session
from routes.body_types.session_types import EndSessionData, SessionStartData, TabTimeData, UrlData
from services.event import handlePrevTab, handleSwitchTab

router = APIRouter()


@router.post("/goal")
async def start_session(sessionStart: SessionStartData):
    session = create_session(sessionStart.goal)
    return {
        "sessionId": session.id,
        "statuscode": 200,
    }


@router.post("/url")
async def sync_url(
    body: UrlData,
    session_id: str = Header(..., alias="sessionId")
):
    score = handleSwitchTab(session_id, body.url, body.title)
    return {"score": score}


@router.post("/tabtime")
async def sync_tab_time(
    body: TabTimeData,
    session_id: str = Header(..., alias="sessionId")
):
    handlePrevTab(session_id, body.url, body.duration)
    return {"status": "ok"}

@router.post("/end")
async def end_session(
    body: EndSessionData | None = None,
    session_id: str = Header(..., alias="sessionId")
):
    total_time = body.totalTimeElapsed if body else None
    if total_time is not None:
        update_session(session_id, UpdateSessionSchema(duration=total_time))
    return {"status": "ok"}


@router.delete("/{sessionid}")
async def reset_session(sessionid: str):
    session = get_session(sessionid)
    if not session:
        raise LookupError("Session not found")
    return {"status": "not-implemented"}


@router.get("/{sessionid}")
async def get_stats(sessionid: str):
    session = get_session(sessionid)
    if not session:
        raise LookupError("Session not found")

    events = get_events(sessionid) or []

    return {
        "sessionId": session.id,
        "goal": session.goal,
        "duration": session.duration,
        "events": [
            {
                "id": event.id,
                "url": event.url,
                "title": event.title,
                "relevance_score": event.relevance_score,
                "time_spent": event.time_spent,
            }
            for event in events
        ],
    }
