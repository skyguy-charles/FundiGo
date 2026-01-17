from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="customer")  # customer | mechanic | admin
    is_verified = Column(Boolean, default=False)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    mechanic_profile = relationship("MechanicProfile", back_populates="user", uselist=False)
    service_requests = relationship("ServiceRequest", foreign_keys="ServiceRequest.customer_id")
    payments = relationship("Payment", back_populates="user")


class MechanicProfile(Base):
    __tablename__ = "mechanic_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    skills = Column(String)
    experience_years = Column(Integer)
    garage_address = Column(String)
    rating = Column(Float, default=0)
    is_approved = Column(Boolean, default=False)
    approval_status = Column(String, default="pending")  # pending | approved | rejected
    documents = Column(Text, nullable=True)  # JSON string of document URLs
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="mechanic_profile")


class ServiceRequest(Base):
    __tablename__ = "service_requests"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"))
    mechanic_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    issue = Column(String)
    service_type = Column(String)  # home | garage | roadside
    status = Column(String, default="pending")  # pending | accepted | completed | cancelled
    lat = Column(Float)
    lng = Column(Float)
    price = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    service_request_id = Column(Integer, ForeignKey("service_requests.id"))
    amount = Column(Float)
    phone = Column(String)
    mpesa_receipt = Column(String, nullable=True)
    status = Column(String, default="pending")  # pending | completed | failed
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="payments")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    service_request_id = Column(Integer, ForeignKey("service_requests.id"), nullable=True)
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
