from db.storage import *

def final_update_session(sessionId:str, duration:float):
    session = get_session(session_id=sessionId)
    if not session:
        raise LookupError("Session not found")
    update_session(sessionId, UpdateSessionSchema(goal=session.goal, duration=session.duration))
