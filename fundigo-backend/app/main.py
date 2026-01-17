from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .auth import router as auth_router
from .routes import router as request_router
from .websocket import manager

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FundiGo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(request_router)

@app.get("/")
def root():
    return {"message": "FundiGo backend running"}

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Broadcast or send to specific user
            if "receiver_id" in data:
                await manager.send_message(data["receiver_id"], {
                    "sender_id": user_id,
                    "message": data["message"]
                })
    except WebSocketDisconnect:
        manager.disconnect(user_id)
