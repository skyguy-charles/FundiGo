import random
from datetime import datetime, timedelta
from typing import Dict

# In-memory OTP storage (use Redis in production)
otp_store: Dict[str, dict] = {}

def generate_otp() -> str:
    return str(random.randint(100000, 999999))

def store_otp(phone: str, otp: str):
    otp_store[phone] = {
        "otp": otp,
        "expires": datetime.utcnow() + timedelta(minutes=5)
    }

def verify_otp(phone: str, otp: str) -> bool:
    if phone not in otp_store:
        return False
    
    stored = otp_store[phone]
    if datetime.utcnow() > stored["expires"]:
        del otp_store[phone]
        return False
    
    if stored["otp"] == otp:
        del otp_store[phone]
        return True
    
    return False

def send_sms(phone: str, message: str):
    # Integration with Africa's Talking or Twilio
    # For now, just print (replace with actual SMS API)
    print(f"SMS to {phone}: {message}")
    return True
