import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("customer")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await api.post("/auth/register", {
        name,
        email,
        phone,
        password,
        role,
      })
      alert("Registration successful! Please login.")
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Email or phone already exists.")
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-6 rounded w-80 shadow">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <input
          placeholder="Name"
          className="w-full border p-2 mb-2"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          className="w-full border p-2 mb-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Phone"
          className="w-full border p-2 mb-2"
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-2"
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="w-full border p-2 mb-4"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="customer">Customer</option>
          <option value="mechanic">Mechanic</option>
          <option value="admin">Admin</option>
        </select>
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Register
        </button>
        <p className="text-center mt-2 text-sm">
          Already have an account?{" "}
          <a href="/" className="text-blue-600">
            Login
          </a>
        </p>
      </form>
    </div>
  )
}
