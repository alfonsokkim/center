from pydantic import BaseModel
from typing import Optional

class UpdateSessionSchema(BaseModel):
    goal: Optional[str] = None
    duration: Optional[float] = None

class UpdateTabEventSchema(BaseModel):
    relevance_score: Optional[float] = None
    time_spent: Optional[float] = None