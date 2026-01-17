import { useState } from "react"
import api from "../api/axios"

export default function PaymentPage({ requestId }) {
  const [phone, setPhone] = useState("")
  const [amount, setAmount] = useState("")

  const pay = async () => {
    await api.post("/api/payments/initiate", {
      service_request_id: requestId,
      phone,
      amount,
    })
    alert("M-Pesa prompt sent to your phone")
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Pay Mechanic</h2>

      <input
        placeholder="Phone (2547...)"
        className="border p-2 w-full mb-2"
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        placeholder="Amount"
        className="border p-2 w-full mb-4"
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={pay}
        className="bg-green-600 text-white p-2 w-full rounded"
      >
        Pay with M-Pesa
      </button>
    </div>
  )
}
