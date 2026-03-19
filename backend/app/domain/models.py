from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class Candidate(BaseModel):
    id: Optional[str]
    name: str
    email: EmailStr
    mobile_number: str
    current_location: Optional[str]
    cv_url: Optional[str]
    photograph_url: Optional[str]
