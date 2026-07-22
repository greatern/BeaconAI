from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
import os

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("JWT_ALGORITHM")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password, hashed):
    return pwd_context.verify(password, hashed)


def create_access_token(data: dict, expires: int = 60):

    payload = data.copy()

    payload["exp"] = datetime.utcnow() + timedelta(minutes=expires)

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )