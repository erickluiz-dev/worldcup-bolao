from pydantic import BaseModel, ConfigDict


class Stadium(BaseModel):

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    name: str
    city: str
    country: str