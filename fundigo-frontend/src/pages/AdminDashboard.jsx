import { useEffect, useState } from "react"
import api from "../api/axios"

export default function AdminDashboard() {
  const [stats, setStats] = useState({})
  const [pendingMechanics, setPendingMechanics] = useState([])

  useEffect(() => {
    loadStats()
    loadPendingMechanics()
  }, [])

  const loadStats = async () => {
    try {
      const res = await api.get("/admin/stats")
      setStats(res.data)
    } catch (e) {
      setStats({ users: 0, mechanics: 0, jobs: 0 })
    }
  }

  const loadPendingMechanics = async () => {
    try {
      const res = await api.get("/api/admin/pending-mechanics")
      setPendingMechanics(res.data.mechanics || [])
    } catch (e) {
      setPendingMechanics([])
    }
  }

  const approveMechanic = async (mechanicId, status) => {
    await api.post("/api/admin/approve-mechanic", {
      mechanic_id: mechanicId,
      status
    })
    alert(`Mechanic ${status}!`)
    loadPendingMechanics()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">FundiGo - Admin Dashboard</h1>
          <button onClick={() => {
            localStorage.clear()
            window.location.href = '/'
          }} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Analytics Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total Users</p>
                <p className="text-4xl font-bold">{stats.users || 0}</p>
              </div>
              <div className="text-5xl opacity-50">👥</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Active Mechanics</p>
                <p className="text-4xl font-bold">{stats.mechanics || 0}</p>
              </div>
              <div className="text-5xl opacity-50">🔧</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total Jobs</p>
                <p className="text-4xl font-bold">{stats.jobs || 0}</p>
              </div>
              <div className="text-5xl opacity-50">📋</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Pending Mechanic Approvals</h3>
          
          {pendingMechanics.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending approvals</p>
          ) : (
            <div className="space-y-4">
              {pendingMechanics.map((mechanic) => (
                <div key={mechanic.id} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg">{mechanic.name}</h4>
                      <p className="text-gray-600">{mechanic.email}</p>
                      <p className="text-sm text-gray-500">{mechanic.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveMechanic(mechanic.id, "approved")}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => approveMechanic(mechanic.id, "rejected")}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
