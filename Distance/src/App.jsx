import  { useEffect, useState } from "react";
import { calculateDistance } from "./distanceUtils";

function App() {
  const [creatorLocation, setCreatorLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState("");

  const getLocation = (callback) => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        callback({ lat: latitude, lon: longitude });
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
      }
    );
  };

  useEffect(() => {
    // Get the creator's location when the site loads
    getLocation(setCreatorLocation);
  }, []);

  useEffect(() => {
    // Get the user's location once the creator's location is set
    if (creatorLocation) {
      getLocation(setUserLocation);
    }
  }, [creatorLocation]);

  useEffect(() => {
    // Calculate distance when both locations are available
    if (creatorLocation && userLocation) {
      const dist = calculateDistance(
        creatorLocation.lat,
        creatorLocation.lon,
        userLocation.lat,
        userLocation.lon
      );
      setDistance(dist.toFixed(2)); // Round to 2 decimal places
    }
  }, [creatorLocation, userLocation]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Distance Calculator</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!creatorLocation && !error && <p>Fetching creators location...</p>}
      {creatorLocation && !userLocation && <p>Fetching users location...</p>}
      {creatorLocation && userLocation && (
        <div>
          <p>
            Creator s location: latitude: {creatorLocation.lat}, longitude:{" "}
            {creatorLocation.lon}.
          </p>
          <p>
            Your location: latitude: {userLocation.lat}, longitude:{" "}
            {userLocation.lon}.
          </p>
          {distance ? (
            <h2>
              The distance between us is <strong>{distance} km</strong>.
            </h2>
          ) : (
            <p>Calculating distance...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
