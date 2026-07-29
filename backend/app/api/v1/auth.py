from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    UserResponse,
    UserUpdateRequest,
    ChangePasswordRequest,
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):

    exists = (
        db.query(User)
        .filter(User.email == request.email)
        .first()
    )

    if exists:
        raise HTTPException(400, "Email already exists")

    user = User(
        first_name=request.first_name,
        last_name=request.last_name,
        email=request.email,
        password=hash_password(request.password),
    )

    db.add(user)

    db.commit()

    return {"message": "Registered successfully"}


@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):

    user = (
        db.query(User)
        .filter(User.email == request.email)
        .first()
    )

    if not user:
        raise HTTPException(401, "Invalid credentials")

    if not verify_password(
        request.password,
        user.password,
    ):
        raise HTTPException(401, "Invalid credentials")

    token = create_access_token(
        {
            "sub": user.email,
            "id": user.id,
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
    }


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserResponse)
def update_me(
    request: UserUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updates = request.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    return current_user


@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(request.current_password, current_user.password):
        raise HTTPException(401, "Current password is incorrect")

    current_user.password = hash_password(request.new_password)

    db.commit()

    return {"message": "Password updated successfully"}


@router.delete("/me", status_code=204)
def delete_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.delete(current_user)
    db.commit()