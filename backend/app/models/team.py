from pydantic import BaseModel, ConfigDict


class Team(BaseModel):

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    name: str
    group: str
    code: str
    flag: str