from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import User
from .schemas import UserCreate, UserLogin, OTPRequest, OTPVerify
from .security import hash_password, verify_password, create_access_token
from .otp import generate_otp, store_otp, verify_otp, send_sms

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if user.email:
        existing = db.query(User).filter(User.email == user.email).first()
        if existing:
            raise HTTPException(400, "Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password_hash=hash_password(user.password),
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}

@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = None

    if credentials.email:
        user = db.query(User).filter(User.email == credentials.email).first()
    elif credentials.phone:
        user = db.query(User).filter(User.phone == credentials.phone).first()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(401, "Invalid credentials")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/send-otp")
def send_otp(request: OTPRequest):
    otp = generate_otp()
    store_otp(request.phone, otp)
    send_sms(request.phone, f"Your FundiGo OTP is: {otp}")
    return {"message": "OTP sent successfully"}

@router.post("/verify-otp")
def verify_otp_endpoint(request: OTPVerify, db: Session = Depends(get_db)):
    if not verify_otp(request.phone, request.otp):
        raise HTTPException(400, "Invalid or expired OTP")
    
    user = db.query(User).filter(User.phone == request.phone).first()
    if user:
        user.is_verified = True
        db.commit()
    
    return {"message": "Phone verified successfully"}
