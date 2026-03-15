import json
from fastapi import APIRouter;
from routes.body_types.session_types import TabData, SessionStartData
from db.storage import *
from services.relevance import relevance_score_for_url
router = APIRouter()


@router.post("/goal")
async def start_session(sessionStart:SessionStartData):
    print(sessionStart.goal)
    session = create_session(sessionStart.goal)
    print(session.id)
    # return session.id
    print(json.dumps({
        "sessionId" : session.id,
        "statuscode" : 200
    }))
    return json.dumps({
        "sessionId" : session.id,
        "statuscode" : 200
    })


@router.post("/resume")
async def resume_session(tabdata:TabData):
    # use session id
    update_session()
    return 200


@router.post("/end")
async def end_session():
    # updateSession()
    return None

@router.get("/{sessionid}")
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
    

@router.delete("/{sessionid}")
async def reset_session():
    # save stats locally
    # reset session data
    return None
