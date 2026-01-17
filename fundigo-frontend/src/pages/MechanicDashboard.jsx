import { useEffect, useState } from "react"
import api from "../api/axios"

export default function MechanicDashboard() {
  const [jobs, setJobs] = useState([])
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    loadNearbyJobs()
  }, [])

  const loadNearbyJobs = async () => {
    try {
      const res = await api.get("/api/requests/nearby?lat=-1.28&lng=36.81")
      setJobs(res.data || [])
    } catch (e) {
      setJobs([])
    }
  }

  const acceptJob = async (jobId) => {
    await api.post(`/api/requests/${jobId}/accept`)
    alert("Job accepted!")
    loadNearbyJobs()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-orange-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">FundiGo - Mechanic Dashboard</h1>
          <button onClick={() => {
            localStorage.clear()
            window.location.href = '/'
          }} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">📍 Nearby Jobs</h2>
          
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No jobs available nearby</p>
              <p className="text-gray-400 text-sm mt-2">Check back later for new requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job, i) => (
                <div key={i} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{job.issue || "Car Issue"}</h3>
                      <p className="text-gray-600 mt-1">
                        📍 {job.distance_km ? `${job.distance_km} km away` : "Location available"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Service Type: <span className="font-semibold">{job.service_type}</span>
                      </p>
                      {job.price && (
                        <p className="text-green-600 font-bold mt-2">KSh {job.price}</p>
                      )}
                    </div>
                    <button
                      onClick={() => acceptJob(job.id)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      Accept Job
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">💰 Earnings</h3>
            <div className="text-center py-8">
              <p className="text-4xl font-bold text-green-600">KSh 0</p>
              <p className="text-gray-500 mt-2">Total earnings this month</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">⭐ Rating</h3>
            <div className="text-center py-8">
              <p className="text-4xl font-bold text-yellow-500">0.0</p>
              <p className="text-gray-500 mt-2">Average rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
