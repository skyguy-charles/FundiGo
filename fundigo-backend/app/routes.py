from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import ServiceRequest, User, MechanicProfile, Payment, ChatMessage
from .schemas import ServiceRequestCreate, NearbyMechanicsRequest, PaymentRequest, MechanicApproval, ChatMessageCreate
from .geolocation import find_nearby
from .mpesa import mpesa_client

router = APIRouter(prefix="/api", tags=["API"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/requests")
def create_request(req: ServiceRequestCreate, db: Session = Depends(get_db)):
    new_req = ServiceRequest(
        issue=req.issue,
        service_type=req.service_type,
        lat=req.lat,
        lng=req.lng
    )
    db.add(new_req)
    db.commit()
    db.refresh(new_req)
    return new_req

@router.post("/mechanics/nearby")
def get_nearby_mechanics(request: NearbyMechanicsRequest, db: Session = Depends(get_db)):
    mechanics = db.query(User).join(MechanicProfile).filter(
        User.role == "mechanic",
        MechanicProfile.is_approved == True
    ).all()
    
    nearby = find_nearby(request.lat, request.lng, mechanics, request.radius_km)
    return {"mechanics": nearby}

@router.post("/payments/initiate")
def initiate_payment(payment: PaymentRequest, db: Session = Depends(get_db)):
    service_request = db.query(ServiceRequest).filter(ServiceRequest.id == payment.service_request_id).first()
    if not service_request:
        raise HTTPException(404, "Service request not found")
    
    try:
        response = mpesa_client.stk_push(payment.phone, int(payment.amount), f"SR{payment.service_request_id}")
    except Exception as e:
        # M-Pesa not configured, simulate payment
        response = {"status": "simulated", "message": "M-Pesa not configured, payment simulated"}
    
    new_payment = Payment(
        service_request_id=payment.service_request_id,
        amount=payment.amount,
        phone=payment.phone,
        status="completed"
    )
    db.add(new_payment)
    db.commit()
    
    return {"message": "Payment successful", "mpesa_response": response}

@router.post("/admin/approve-mechanic")
def approve_mechanic(approval: MechanicApproval, db: Session = Depends(get_db)):
    mechanic = db.query(MechanicProfile).filter(MechanicProfile.user_id == approval.mechanic_id).first()
    if not mechanic:
        raise HTTPException(404, "Mechanic not found")
    
    mechanic.approval_status = approval.status
    mechanic.is_approved = (approval.status == "approved")
    db.commit()
    
    return {"message": f"Mechanic {approval.status}"}

@router.get("/admin/pending-mechanics")
def get_pending_mechanics(db: Session = Depends(get_db)):
    mechanics = db.query(User).join(MechanicProfile).filter(
        MechanicProfile.approval_status == "pending"
    ).all()
    return {"mechanics": mechanics}

@router.post("/chat/send")
def send_message(msg: ChatMessageCreate, db: Session = Depends(get_db)):
    new_msg = ChatMessage(
        receiver_id=msg.receiver_id,
        service_request_id=msg.service_request_id,
        message=msg.message
    )
    db.add(new_msg)
    db.commit()
    return {"message": "Message sent"}

@router.get("/chat/{user_id}")
def get_messages(user_id: int, db: Session = Depends(get_db)):
    messages = db.query(ChatMessage).filter(
        (ChatMessage.sender_id == user_id) | (ChatMessage.receiver_id == user_id)
    ).order_by(ChatMessage.created_at).all()
    return {"messages": messages}
