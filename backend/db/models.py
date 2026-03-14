from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base
import uuid


class Session(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    goal = Column(String, nullable=False)
    duration = Column(Float, nullable=True)

    events = relationship("TabEvent", back_populates="session")


class TabEvent(Base):
    __tablename__ = "tab_events"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey("sessions.id"), nullable=False)
    url = Column(String, nullable=False)
    relevance_score = Column(Float, nullable=True)
    time_spent = Column(Float, default=0.0)

    session = relationship("Session", back_populates="events")
