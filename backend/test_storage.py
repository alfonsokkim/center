# backend/test_storage.py

from db.database import init_db
from db.storage import create_session, get_session, update_session, create_event, get_events, update_event
from db.schema import UpdateSessionSchema, UpdateTabEventSchema
from services.event import handlePrevTab

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

print("\n--- Test handlePrevTab: valid url and session ---")
try:
    handlePrevTab(session.id, "reddit.com/r/gaming", 120.0)
    print("PASS: event updated successfully")
except Exception as e:
    print("FAIL:", e)


print("\n--- Test handlePrevTab: empty url ---")
try:
    handlePrevTab(session.id, "", 120.0)
    print("FAIL: should have thrown ValueError")
except ValueError as e:
    print("PASS:", e)
except Exception as e:
    print("FAIL wrong exception:", e)


print("\n--- Test handlePrevTab: empty session_id ---")
try:
    handlePrevTab("", "reddit.com/r/gaming", 120.0)
    print("FAIL: should have thrown ValueError")
except ValueError as e:
    print("PASS:", e)
except Exception as e:
    print("FAIL wrong exception:", e)


print("\n--- Test handlePrevTab: invalid session_id ---")
try:
    handlePrevTab("fake-session-id", "reddit.com/r/gaming", 120.0)
    print("FAIL: should have thrown LookupError")
except LookupError as e:
    print("PASS:", e)
except Exception as e:
    print("FAIL wrong exception:", e)


print("\n--- Test handlePrevTab: url not in session ---")
try:
    handlePrevTab(session.id, "google.com", 120.0)
    print("FAIL: should have thrown LookupError")
except LookupError as e:
    print("PASS:", e)
except Exception as e:
    print("FAIL wrong exception:", e)