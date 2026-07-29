from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict


class RegisterRequest(BaseModel):

    first_name: str

    last_name: str

    email: EmailStr

    password: str


class LoginRequest(BaseModel):

    email: EmailStr

    password: str


class TokenResponse(BaseModel):

    access_token: str

    token_type: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    home_lat: Optional[float] = None
    home_lng: Optional[float] = None
    work_lat: Optional[float] = None
    work_lng: Optional[float] = None


class UserUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    home_lat: Optional[float] = None
    home_lng: Optional[float] = None
    work_lat: Optional[float] = None
    work_lng: Optional[float] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str