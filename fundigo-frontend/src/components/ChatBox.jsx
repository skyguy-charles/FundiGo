import { useEffect, useState } from "react"

export default function ChatBox() {
  const [socket, setSocket] = useState(null)
  const [msg, setMsg] = useState("")
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/chat")

    ws.onmessage = (e) => {
      setMessages((prev) => [...prev, e.data])
    }

    setSocket(ws)
    return () => ws.close()
  }, [])

  const send = () => {
    socket.send(msg)
    setMsg("")
  }

  return (
    <div className="border rounded p-3 w-full max-w-md">
      <div className="h-40 overflow-y-auto mb-2">
        {messages.map((m, i) => (
          <p key={i} className="text-sm bg-gray-100 p-1 mb-1 rounded">{m}</p>
        ))}
      </div>

      <div className="flex">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="border flex-1 p-1"
          placeholder="Type message..."
        />
        <button onClick={send} className="bg-blue-600 text-white px-3">
          Send
        </button>
      </div>
    </div>
  )
}
