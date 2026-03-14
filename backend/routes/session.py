from fastapi import APIRouter;
from body_types.session_types import TabData, SessionStartData
from backend.db.storage import *
from backend.services.relevance import relevance_score_for_url
router = APIRouter()

@router.post("/start")
async def start_session(sessionStart:SessionStartData):
    session = create_session(sessionStart.goal)
    # store this session somewhere later
    return 200

@router.post("/resume")
async def resume_session(tabdata:TabData):
    update_session('pause', (0, tabdata.duration))
    return 200

@router.post("/end")
async def end_session():
    # storeSession()
    return None

@router.get()
async def get_stats():
    # get stats of current study session
    # get session id from session object retrieved in start_session
    get_events()
    return None

@router.post("/distraction")
async def log_distraction(tabdata:TabData):
    # duration, url
    out = relevance_score_for_url(tabdata.url)#, get_goal)
    return None
    

@router.delete()
async def reset_session():
    # save stats locally
    # reset session data
    return None
