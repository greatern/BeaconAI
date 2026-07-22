from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func

from app.db.database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String)

    last_name = Column(String)

    email = Column(String, unique=True, nullable=False)

    password = Column(String, nullable=False)

    phone = Column(String)

    home_lat = Column(Float)

    home_lng = Column(Float)

    work_lat = Column(Float)

    work_lng = Column(Float)

    created_at = Column(DateTime(timezone=True), server_default=func.now())