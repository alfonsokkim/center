from db.schema import UpdateTabEventSchema
from db.storage import create_event, get_event_from_url, get_session, update_event
from services.relevance import relevance_score_for_url


def handlePrevTab(session_id: str, url: str, duration: float):
    if not url:
        raise ValueError("URL cannot be empty")

    if not session_id:
        raise ValueError("Session ID cannot be empty")

    session = get_session(session_id)
    if not session:
        raise LookupError("Session not found")

    event = get_event_from_url(url, session_id)
    if not event:
        raise LookupError("Tab cannot be found")

    current_time_spent = event.time_spent or 0.0
    update_event(event.id, UpdateTabEventSchema(time_spent=current_time_spent + duration))


async def handleSwitchTab(session_id: str, url: str, title: str) -> float:
    if not url:
        raise ValueError("URL cannot be empty")

    if not session_id:
        raise ValueError("Session ID cannot be empty")

    session = get_session(session_id)
    if not session:
        raise LookupError("Session not found")

    event = get_event_from_url(url, session_id)
    if event:
        return float(event.relevance_score or 0.0)

    relevance = await relevance_score_for_url(url, session.goal)
    score = float(relevance.get("relevancy", 0.0))
    create_event(session_id, url, title or url, score)
    return score
