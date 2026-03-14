from db.database import SessionLocal
from db.models import Session, TabEvent
from db.schema import UpdateSessionSchema, UpdateTabEventSchema
from typing import Optional, List

# Session functions
# Called when timer starts for session
def create_session(goal: str) -> Session:
    db = SessionLocal()
    try:
        session = Session(
            goal=goal
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session
    finally:
        db.close()


def get_session(session_id: str) -> Optional[Session]:
    db = SessionLocal()
    try:
        return db.query(Session).filter(Session.id == session_id).first()
    finally:
        db.close()


def update_session(session_id: str, updates: UpdateSessionSchema) -> Optional[Session]:
    db = SessionLocal()
    try:
        session = db.query(Session).filter(Session.id == session_id).first()
        if not session:
            return None
        for key, value in updates.model_dump(exclude_none=True).items():
            setattr(session, key, value)
        db.commit()
        db.refresh(session)
        return session
    finally:
        db.close()


# Tab event
# called during on_click
def create_event(session_id: str, url: str) -> TabEvent:
    db = SessionLocal()
    try:
        event = TabEvent(
            session_id=session_id,
            url=url,
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        return event
    finally:
        db.close()


# url and duration passed here
# called during on_click
def update_event(event_id: str, updates: UpdateTabEventSchema) -> Optional[TabEvent]:
    db = SessionLocal()
    try:
        event = db.query(TabEvent).filter(TabEvent.id == event_id).first()
        if not event:
            return None
        for key, value in updates.model_dump(exclude_none=True).items():
            setattr(event, key, value)
        db.commit()
        db.refresh(event)
        return event
    finally:
        db.close()


def get_events(session_id: str) -> Optional[List[TabEvent]]:
    db = SessionLocal()
    try:
        return db.query(TabEvent).filter(TabEvent.session_id == session_id).all()
    finally:
        db.close()