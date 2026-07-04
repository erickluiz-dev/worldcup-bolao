from pydantic import BaseModel


class TeamResponse(BaseModel):
    id: int
    name: str
    group: str