from pydantic import BaseModel

class SessionStartData(BaseModel):
    goal: str

class UrlData(BaseModel):
    url: str
    title: str = ""

class TabTimeData(BaseModel):
    url: str
    duration: float

class EndSessionData(BaseModel):
    totalTimeElapsed: float | None = None
