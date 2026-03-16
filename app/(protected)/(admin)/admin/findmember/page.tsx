"use client"

import { useState, useMemo, useEffect } from "react"
import "leaflet/dist/leaflet.css"
import dynamic from "next/dynamic"
import { useMap } from "react-leaflet"
import L from "leaflet"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
)

type Member = {
  id: number
  name: string
  birthCity: string
  birthLat: number
  birthLng: number
  liveCity: string
  liveLat: number
  liveLng: number
  phone: string
}

function FitBounds({ members, mode }: { members: Member[]; mode: "birth" | "live" }) {
  const map = useMap()

  useEffect(() => {
    if (!members.length) return

    const bounds = members
      .map((m) => [
        mode === "birth" ? m.birthLat : m.liveLat,
        mode === "birth" ? m.birthLng : m.liveLng,
      ])
      .filter((coord) => coord[0] && coord[1])

    if (bounds.length > 0) {
      map.fitBounds(bounds as any, { padding: [50, 50], maxZoom: 10 })
    }
  }, [members, mode, map])

  return null
}

const members: Member[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    birthCity: "Delhi",
    birthLat: 28.6139,
    birthLng: 77.209,
    liveCity: "Mumbai",
    liveLat: 19.076,
    liveLng: 72.8777,
    phone: "9876543210",
  },
  {
    id: 2,
    name: "Prashant Sharma",
    birthCity: "Faridabad",
    birthLat: 28.4329,
    birthLng: 77.4107,
    liveCity: "Gurugram",
    liveLat: 28.4595,
    liveLng: 77.0266,
    phone: "9876556789",
  },
  {
    id: 3,
    name: "Amit Verma",
    birthCity: "Jaipur",
    birthLat: 26.9124,
    birthLng: 75.7873,
    liveCity: "Delhi",
    liveLat: 28.6139,
    liveLng: 77.209,
    phone: "9898989898",
  },
]

export default function FindMember() {
  const position: [number, number] = [28.6139, 77.209]

  const [citySearch, setCitySearch] = useState("")
  const [mode, setMode] = useState<"birth" | "live">("birth")

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const city = mode === "birth" ? m.birthCity : m.liveCity
      return city.toLowerCase().includes(citySearch.toLowerCase())
    })
  }, [citySearch, mode])

  return (
    <div className="min-h-screen p-8 space-y-8 bg-gradient-to-b from-green-50 to-emerald-100">

      <div>
        <h1 className="text-3xl font-serif mb-2 text-emerald-900">
          Find Member By City
        </h1>
        <p className="text-emerald-700">
          Search members by birthplace or residence city
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder={`Search by ${
            mode === "birth" ? "Birthplace" : "Residence"
          } city...`}
          value={citySearch}
          onChange={(e) => setCitySearch(e.target.value)}
          className="border border-emerald-300 bg-white p-3 flex-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />

        <div className="flex gap-2">

          <button
            onClick={() => setMode("birth")}
            className={`px-4 py-3 rounded-lg font-medium transition ${
              mode === "birth"
                ? "bg-emerald-700 text-white"
                : "bg-white border border-emerald-300 text-emerald-800"
            }`}
          >
            Birthplace
          </button>

          <button
            onClick={() => setMode("live")}
            className={`px-4 py-3 rounded-lg font-medium transition ${
              mode === "live"
                ? "bg-emerald-700 text-white"
                : "bg-white border border-emerald-300 text-emerald-800"
            }`}
          >
            Residence
          </button>

        </div>

      </div>
         <div className="overflow-x-auto border border-emerald-200 rounded-xl bg-white shadow">

        <table className="w-full text-sm">

          <thead className="bg-emerald-100 text-emerald-900">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">Phone</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.map((member) => (
              <tr
                key={member.id}
                className="border-t hover:bg-emerald-50"
              >
                <td className="p-3">{member.name}</td>
                <td className="p-3">
                  {mode === "birth"
                    ? member.birthCity
                    : member.liveCity}
                </td>
                <td className="p-3">{member.phone}</td>
              </tr>
            ))}
          </tbody>

        </table>

        {filteredMembers.length === 0 && (
          <div className="p-6 text-center text-emerald-600">
            No members found.
          </div>
        )}

      </div>

      <div className="rounded-xl overflow-hidden shadow-lg border border-emerald-200">

        <MapContainer
          center={position}
          zoom={5}
          style={{ height: "420px", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          />

          <FitBounds members={filteredMembers} mode={mode} />

          {filteredMembers.map((member) => {
            const lat =
              mode === "birth" ? member.birthLat : member.liveLat
            const lng =
              mode === "birth" ? member.birthLng : member.liveLng

            return (
              <Marker key={member.id} position={[lat, lng]}>
                <Popup>
                  <strong>{member.name}</strong>
                  <br />
                  {mode === "birth"
                    ? member.birthCity
                    : member.liveCity}
                  <br />
                  {member.phone}
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>

      </div>

   

    </div>
  )
}