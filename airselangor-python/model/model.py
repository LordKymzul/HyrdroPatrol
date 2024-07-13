from pydantic import BaseModel


class AveragePressure(BaseModel):
    location: str
    pressure: float
