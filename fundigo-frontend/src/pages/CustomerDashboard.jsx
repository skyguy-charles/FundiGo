import { useState } from "react"
import api from "../api/axios"
import LiveMap from "../components/LiveMap"
import ChatBox from "../components/ChatBox"
import PaymentPage from "./PaymentPage"

export default function CustomerDashboard() {
  const [issue, setIssue] = useState("")
  const [type, setType] = useState("home")
  const [showPayment, setShowPayment] = useState(false)
  const [requestId, setRequestId] = useState(null)
  const [mechanics, setMechanics] = useState([])

  const submit = async () => {
    const res = await api.post("/api/requests", {
      issue,
      service_type: type,
      lat: -1.286389,
      lng: 36.817223,
    })
    setRequestId(res.data.id)
    alert("Request sent! Nearby mechanics will be notified.")
    loadNearbyMechanics()
  }

  const loadNearbyMechanics = async () => {
    const res = await api.post("/api/mechanics/nearby", {
      lat: -1.286389,
      lng: 36.817223,
      radius_km: 10
    })
    setMechanics(res.data.mechanics)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">FundiGo - Customer</h1>
          <button onClick={() => {
            localStorage.clear()
            window.location.href = '/'
          }} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Request Mechanic</h2>
            
            <textarea
              placeholder="Describe your car problem in detail..."
              className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              onChange={(e) => setIssue(e.target.value)}
            />

            <select
              className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="home">🏠 Home Service</option>
              <option value="garage">🔧 Go to Garage</option>
              <option value="roadside">🚗 Roadside Assistance</option>
            </select>

            <button
              onClick={submit}
              className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Send Request
            </button>

            {requestId && (
              <button
                onClick={() => setShowPayment(true)}
                className="w-full mt-3 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                💳 Pay Mechanic
              </button>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Live Map</h2>
            <LiveMap mechanics={mechanics} customer={{ lat: -1.286389, lng: 36.817223 }} />
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Chat with Mechanic</h2>
            <ChatBox />
          </div>

          {showPayment && requestId && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <PaymentPage requestId={requestId} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
