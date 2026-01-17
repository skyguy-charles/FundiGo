from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: str | None = None
    phone: str
    password: str
    role: str = "customer"

class UserLogin(BaseModel):
    email: str | None = None
    phone: str | None = None
    password: str

class OTPRequest(BaseModel):
    phone: str

class OTPVerify(BaseModel):
    phone: str
    otp: str

class ServiceRequestCreate(BaseModel):
    issue: str
    service_type: str
    lat: float
    lng: float

class MechanicApproval(BaseModel):
    mechanic_id: int
    status: str  # approved | rejected

class PaymentRequest(BaseModel):
    service_request_id: int
    phone: str
    amount: float

class ChatMessageCreate(BaseModel):
    receiver_id: int
    service_request_id: int | None = None
    message: str

class NearbyMechanicsRequest(BaseModel):
    lat: float
    lng: float
    radius_km: float = 10
