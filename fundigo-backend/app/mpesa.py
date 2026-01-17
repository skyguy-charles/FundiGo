import requests
import base64
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

class MPesaClient:
    def __init__(self):
        self.consumer_key = os.getenv("MPESA_CONSUMER_KEY")
        self.consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")
        self.business_shortcode = os.getenv("MPESA_BUSINESS_SHORTCODE")
        self.passkey = os.getenv("MPESA_PASSKEY")
        self.callback_url = os.getenv("MPESA_CALLBACK_URL")
        
        env = os.getenv("MPESA_ENVIRONMENT", "sandbox")
        self.base_url = "https://sandbox.safaricom.co.ke" if env == "sandbox" else "https://api.safaricom.co.ke"
    
    def get_access_token(self):
        url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
        auth = base64.b64encode(f"{self.consumer_key}:{self.consumer_secret}".encode()).decode()
        headers = {"Authorization": f"Basic {auth}"}
        response = requests.get(url, headers=headers)
        return response.json().get("access_token")
    
    def stk_push(self, phone: str, amount: int, account_ref: str):
        token = self.get_access_token()
        url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
        
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        password = base64.b64encode(
            f"{self.business_shortcode}{self.passkey}{timestamp}".encode()
        ).decode()
        
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "BusinessShortCode": self.business_shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone,
            "PartyB": self.business_shortcode,
            "PhoneNumber": phone,
            "CallBackURL": self.callback_url,
            "AccountReference": account_ref,
            "TransactionDesc": "FundiGo Payment"
        }
        
        response = requests.post(url, json=payload, headers=headers)
        return response.json()

mpesa_client = MPesaClient()
