from db.storage import get_event_from_url, update_event, get_session
from db.schema import UpdateTabEventSchema

# note that we need to 
def handlePrevTab(session_id: str, url: str, duration: float):

    if not url:
        raise ValueError("URL cannot be empty")
    
    if not session_id:
        raise ValueError("Session ID cannot be empty")

    session = get_session(session_id)
    if not session:
        raise LookupError("Session not found") 
    
    event = get_event_from_url(url, session_id)
    # pass tabEventId instead of url (v1)
    if not event:
        # throw error if it does not exist in storage
        raise LookupError("Tab cannot be found")

    update_event(event.id, UpdateTabEventSchema(duration=duration))
