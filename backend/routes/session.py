from fastapi import APIRouter;
router = APIRouter()

@router.post("/start")
async def start_session():
    # create storage for url duration
    return None

@router.post("/resume")
async def resume_session():
    # duration
    # logs duration paused
    return None

@router.post("/end")
async def end_session():
    # duration
    # logs duration and calculates final score
    return None

@router.get("")
async def get_stats():
    # get stats of current study session
    return None

@router.post("/distraction")
async def log_distraction():
    # duration, url
    # logs distraction
    return None
    
