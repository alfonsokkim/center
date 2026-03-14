from fastapi import APIRouter;
from body_types.session_types import TabData, SessionStartData
router = APIRouter()

@router.post("/start")
async def start_session(sessionStart:SessionStartData):
    #create_session(SessionStartData.goal)
    
    return 200

@router.post("/resume")
async def resume_session(tabdata:TabData):
    # duration
    # logs duration paused

    #update_session('pause', tabdata.duration)
    return 200

@router.post("/end")
async def end_session():
    # duration
    # logs duration and calculates final score
    # storeSession()
    return None

@router.get()
async def get_stats():
    # get stats of current study session
    # getEvents()
    return None

@router.post("/distraction")
async def log_distraction():
    # duration, url
    # logs distraction
    return None
    

@router.delete()
async def reset_session():
    # save stats locally
    # reset session data
    return None
