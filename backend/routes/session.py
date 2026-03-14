from fastapi import APIRouter;
router = APIRouter()

@router.post("/start")
async def tmp1():
    return None

@router.patch("/pause")
async def tmp2():
    return None

@router.patch("/resume")
async def tmp3():
    return None

@router.delete("/end")
async def tmp4():
    return None

@router.get("/timer")
async def tmp5():
    return None

