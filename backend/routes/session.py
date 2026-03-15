from typing import Annotated
from fastapi import APIRouter, Header;
from routes.body_types.session_types import *
from db.storage import *
from services.relevance import relevance_score_for_url
from services.session_helper import *

from pydantic import BaseModel
from services.event import handlePrevTab, handleSwitchTab

router = APIRouter()


@router.post("/goal")
async def start_session(sessionStart:SessionStartData):
    session = create_session(sessionStart.goal)
    # return session.id
    return {
        "sessionId" : session.id,
        "statuscode" : 200
    }

"""
@router.post("/url")
async def get_url(urldata:UrlData, sessionId:Annotated[str | None, Header()] = None):
    print(urldata.url)
    print(urldata.title)
    print(sessionId)
    urldata.url
    urldata.title
    return {
        "score":0
    }


@router.post("/tabtime")
async def end_session(tabdata:TabData, sessionId:Annotated[str | None, Header()] = None):
    print(tabdata.url)
    print(tabdata.duration)
    print(sessionId)
    
    return None
"""

@router.post("/end")
async def reset_session(sessionEnd:SessionEndData, sessionId:Annotated[str | None, Header()] = None):
    # save stats locally
    final_update_session(sessionId=sessionId, duration=sessionEnd.duration)    
    return None

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
async def tab_time(body: TabTimeBody, sessionId: str = Header(...)):
    handlePrevTab(sessionId, body.url, body.elapsedSeconds)
    return
