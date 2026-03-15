from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.event import handlePrevTab, handleSwitchTab

router = APIRouter()


class StoreDurationBody(BaseModel):
    sessionId: str
    url: str
    duration: float


class SwitchTabBody(BaseModel):
    sessionId: str
    url: str
    title: str


@router.post("/store-duration")
async def store_duration(body: StoreDurationBody):
    handlePrevTab(body.sessionId, body.url, body.duration)

@router.post("/switch-tab")
async def switch_tab(body: SwitchTabBody):
    relevance = await handleSwitchTab(body.sessionId, body.url, body.title)
    return relevance