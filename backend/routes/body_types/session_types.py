from pydantic import BaseModel

class SessionStartData(BaseModel):
    goal:str

class SessionEndData(BaseModel):
    duration: float

class TabData(BaseModel):
    url:str | None
    duration:float

class UrlData(BaseModel):
    url: str
    title: str