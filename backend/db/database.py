from sqlalchemy import create_engine;
from sqlalchemy.orm import sessionmaker, DeclarativeBase;

DATABASE_URL = "sqlite:///centre.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(bind=engine)

class Base(DeclarativeBase):
    pass

def init_db():
    from db.models import Session, TabEvent
    Base.metadata.create_all(bind=engine)