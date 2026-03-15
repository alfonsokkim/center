from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from services.event import handlePrevTab, handleSwitchTab

router = APIRouter()

class UrlBody(BaseModel):
    url: str
    title: str


class TabTimeBody(BaseModel):
    url: str
    elapsedSeconds: int


@router.post("/session/url")
async def new_tab(body: UrlBody, sessionId: str = Header(...)):
    relevance = await handleSwitchTab(sessionId, body.url, body.title)
    return {"score": relevance}


@router.post("/session/tabtime")
async def tab_time(body: TabimeBody, sessionId: str = Header(...)):
    handlePrevTab(sessionId, body.url, body.elapsedSeconds)
    return