import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to update map center
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function LiveLocationMap({ buddyLocation, onClose }) {
  const [myLocation, setMyLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    // Watch position for live updates
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setMyLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setError(null);
      },
      (error) => {
        console.error("Location error:", error);
        setError("Unable to retrieve your location");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
        <div className="bg-red-900 p-6 rounded-xl text-white max-w-md">
          <h3 className="font-bold text-xl mb-2">Location Error</h3>
          <p>{error}</p>
          <button
            onClick={onClose}
            className="mt-4 w-full p-2 bg-white text-black rounded-lg font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!myLocation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-purple-900 p-6 rounded-xl text-white">
          <div className="animate-spin text-4xl mb-3">📍</div>
          <p className="font-semibold">Getting your location...</p>
        </div>
      </div>
    );
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const distance = buddyLocation
    ? calculateDistance(
        myLocation.lat,
        myLocation.lng,
        buddyLocation.latitude,
        buddyLocation.longitude
      )
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-purple-900 text-white">
        <div>
          <h2 className="font-bold text-xl">📍 Live Location</h2>
          {distance && (
            <p className="text-sm text-purple-200">
              Distance:{" "}
              {distance < 1000
                ? `${Math.round(distance)}m`
                : `${(distance / 1000).toFixed(2)}km`}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-3xl hover:text-gray-300 transition"
        >
          ×
        </button>
      </div>

      {/* Map */}
      <div className="flex-1">
        <MapContainer
          center={[myLocation.lat, myLocation.lng]}
          zoom={17}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapUpdater center={[myLocation.lat, myLocation.lng]} />

          {/* Your location marker */}
          <Marker position={[myLocation.lat, myLocation.lng]}>
            <Popup>
              <div className="text-center">
                <p className="font-bold">📍 You</p>
                <p className="text-xs">
                  Accuracy: ±{Math.round(myLocation.accuracy)}m
                </p>
              </div>
            </Popup>
          </Marker>

          {/* Accuracy circle */}
          <Circle
            center={[myLocation.lat, myLocation.lng]}
            radius={myLocation.accuracy}
            pathOptions={{
              color: "blue",
              fillColor: "blue",
              fillOpacity: 0.1,
              weight: 2,
            }}
          />

          {/* Buddy location */}
          {buddyLocation && (
            <>
              <Marker
                position={[buddyLocation.latitude, buddyLocation.longitude]}
              >
                <Popup>
                  <div className="text-center">
                    <p className="font-bold">👤 Tea Buddy</p>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[buddyLocation.latitude, buddyLocation.longitude]}
                radius={50}
                pathOptions={{
                  color: "red",
                  fillColor: "red",
                  fillOpacity: 0.2,
                  weight: 2,
                }}
              />
            </>
          )}

          {/* 1KM radius circle */}
          <Circle
            center={[myLocation.lat, myLocation.lng]}
            radius={1000}
            pathOptions={{
              color: "purple",
              fillColor: "purple",
              fillOpacity: 0.05,
              weight: 2,
              dashArray: "10, 10",
            }}
          />
        </MapContainer>
      </div>

      {/* Info Footer */}
      <div className="p-4 bg-gray-900 text-white text-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <p className="font-semibold">🔵 Your Location</p>
            <p className="text-xs text-gray-400">Updates in real-time</p>
          </div>
          {buddyLocation && (
            <div>
              <p className="font-semibold">🔴 Buddy's Location</p>
              <p className="text-xs text-gray-400">Live tracking</p>
            </div>
          )}
          <div>
            <p className="font-semibold">⭕ 1KM Radius</p>
            <p className="text-xs text-gray-400">Search area</p>
          </div>
        </div>
      </div>
    </div>
  );
}
