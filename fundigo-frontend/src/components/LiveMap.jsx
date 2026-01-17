import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"

const center = { lat: -1.286389, lng: 36.817223 }

export default function LiveMap({ mechanics = [], customer }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_KEY,
  })

  if (!isLoaded) return <p>Loading map...</p>

  return (
    <div className="h-96 w-full rounded overflow-hidden">
      <GoogleMap center={center} zoom={13} mapContainerStyle={{ height: "100%", width: "100%" }}>
        {customer && (
          <Marker position={{ lat: customer.lat, lng: customer.lng }} label="You" />
        )}

        {mechanics.map((m) => (
          <Marker
            key={m.id}
            position={{ lat: m.lat, lng: m.lng }}
            label={m.name}
          />
        ))}
      </GoogleMap>
    </div>
  )
}
