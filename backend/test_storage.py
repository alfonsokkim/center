# backend/test_storage.py

from db.database import init_db
from db.storage import create_session, get_session, update_session, create_event, get_events, update_event
from db.schema import UpdateSessionSchema, UpdateTabEventSchema

# setup
init_db()

# test create session
session = create_session(goal="Write a literature review")
print("Created session:", session.id, session.goal)

# test get session
fetched = get_session(session.id)
print("Fetched session:", fetched.id, fetched.goal)

# test update session
updated = update_session(session.id, UpdateSessionSchema(goal="win the hackathon", duration=3600.0))
print("Updated session duration:", updated.duration)
print("Updated session goal:", updated.goal)

# test create event
event = create_event(
    session_id=session.id,
    url="reddit.com/r/gaming"
)
print("Created event:", event.id, event.url)
if not event.relevance_score:
    print("No score yet.")

# test get events
events = get_events(session.id)
print("Events for session:", len(events))

updatedEvent = update_event(events[0].id, UpdateTabEventSchema(relevance_score=67.0, time_spent=67.0))
print("Updated event duration:", updatedEvent.time_spent)
print("Updated relevance score:", updatedEvent.relevance_score)