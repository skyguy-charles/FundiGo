import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    const res = await api.post("/auth/login", {
      email,
      password,
    })

    localStorage.setItem("token", res.data.access_token)
    const payload = JSON.parse(atob(res.data.access_token.split(".")[1]))
    localStorage.setItem("role", payload.role)

    navigate(`/${payload.role}`)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-6 rounded w-80 shadow">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          placeholder="Email"
          className="w-full border p-2 mb-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
        <p className="text-center mt-2 text-sm">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600">
            Register
          </a>
        </p>
      </form>
    </div>
  )
}
