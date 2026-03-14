from pydantic import BaseModel

class SessionStartData(BaseModel):
    goal:str

class TabData(BaseModel):
    url:str | None
    duration:float