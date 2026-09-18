import { useEffect, useState } from "react";
import {
  MapContainer,
  GeoJSON,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const emergencies = [
  {
    id: 1,
    name: "Flood Emergency",
    location: "Vijayawada",
    position: [16.5062, 80.648],
    people: 120,
    urgency: "CRITICAL",
  },
  {
    id: 2,
    name: "Medical Emergency",
    location: "Kakinada",
    position: [16.9891, 82.2475],
    people: 45,
    urgency: "HIGH",
  },
  {
    id: 3,
    name: "Stranded Citizens",
    location: "Machilipatnam",
    position: [16.1875, 81.1389],
    people: 80,
    urgency: "HIGH",
  },
  {
    id: 4,
    name: "Evacuation Required",
    location: "Eluru",
    position: [16.7107, 81.0952],
    people: 60,
    urgency: "MEDIUM",
  },
];

const resources = [
  {
    id: 1,
    name: "Rescue Team Alpha",
    location: "Vijayawada",
    position: [16.52, 80.62],
    type: "Rescue Team",
  },
  {
    id: 2,
    name: "Medical Unit Bravo",
    location: "Guntur",
    position: [16.3067, 80.4365],
    type: "Medical",
  },
  {
    id: 3,
    name: "Relief Center",
    location: "Rajamahendravaram",
    position: [17.0005, 81.804],
    type: "Relief",
  },
];

const routes = [
  [
    [16.52, 80.62],
    [16.5062, 80.648],
  ],
  [
    [16.3067, 80.4365],
    [16.5062, 80.648],
  ],
  [
    [17.0005, 81.804],
    [16.9891, 82.2475],
  ],
];

const emergencyIcon = L.divIcon({
  className: "resq-marker",
  html: `
    <div class="marker-pulse">
      <div class="marker-dot">!</div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const resourceIcon = L.divIcon({
  className: "resq-marker",
  html: `
    <div class="resource-marker">+</div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

/* Automatically position AP on the screen */
function FitAP({ data }) {
  const map = useMap();

  useEffect(() => {
    if (!data) return;

    const layer = L.geoJSON(data);
    const bounds = layer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [0, 0],
        animate: false,
      });

      // Make Andhra Pradesh larger on screen
      map.setZoom(map.getZoom() + 0.4);
    }
  }, [data, map]);

  return null;
}

function Map() {
  const [apDistricts, setApDistricts] = useState(null);

  useEffect(() => {
    fetch("/ap-districts.geojson")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load ap-districts.geojson");
        }

        return response.json();
      })
      .then((data) => {
        console.log("AP GeoJSON loaded:", data);

        const validFeatures = data.features.filter((feature) => {
          if (!feature.geometry) return false;

          if (
            feature.geometry.type !== "Polygon" &&
            feature.geometry.type !== "MultiPolygon"
          ) {
            return false;
          }

          try {
            const layer = L.geoJSON(feature);
            return layer.getBounds().isValid();
          } catch {
            return false;
          }
        });

        console.log(
          "Valid AP districts:",
          validFeatures.length,
          "/",
          data.features.length
        );

        setApDistricts({
          ...data,
          features: validFeatures,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const districtStyle = {
    color: "#22b8f0",
    weight: 1.5,
    fillColor: "#0b2945",
    fillOpacity: 0.85,
  };

  function onEachDistrict(feature, layer) {
    const name =
      feature.properties?.NAME ||
      feature.properties?.DISTRICT ||
      feature.properties?.district ||
      feature.properties?.name ||
      feature.properties?.District ||
      "AP District";

    layer.bindTooltip(name, {
      sticky: true,
      className: "district-tooltip",
    });

    layer.on({
      mouseover: (event) => {
        event.target.setStyle({
          weight: 3,
          color: "#67e8f9",
          fillColor: "#164e63",
          fillOpacity: 0.95,
        });
      },

      mouseout: (event) => {
        event.target.setStyle(districtStyle);
      },

      click: () => {
        layer
          .bindPopup(
            `<strong>${name}</strong><br/>RESQ monitoring active`
          )
          .openPopup();
      },
    });
  }

  return (
    <div
      className="resq-map"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#020617",
      }}
    >
      <MapContainer
        center={[16.5, 80.65]}
        zoom={7}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
        zoomControl={false}
        style={{
          width: "100%",
          height: "100%",
          background: "#020617",
        }}
      >
        {apDistricts && <FitAP data={apDistricts} />}

        {apDistricts && (
          <GeoJSON
            data={apDistricts}
            style={districtStyle}
            onEachFeature={onEachDistrict}
          />
        )}

        {emergencies.map((emergency) => (
          <Marker
            key={emergency.id}
            position={emergency.position}
            icon={emergencyIcon}
          >
            <Popup>
              <strong>{emergency.name}</strong>
              <br />
              Location: {emergency.location}
              <br />
              Affected: {emergency.people}
              <br />
              Priority: {emergency.urgency}
            </Popup>
          </Marker>
        ))}

        {resources.map((resource) => (
          <Marker
            key={resource.id}
            position={resource.position}
            icon={resourceIcon}
          >
            <Popup>
              <strong>{resource.name}</strong>
              <br />
              Location: {resource.location}
              <br />
              Type: {resource.type}
            </Popup>
          </Marker>
        ))}

        {routes.map((route, index) => (
          <Polyline
            key={index}
            positions={route}
            pathOptions={{
              color: "#22d3ee",
              weight: 3,
              opacity: 0.8,
              dashArray: "8 8",
            }}
          />
        ))}
      </MapContainer>

      <div className="map-legend">
        <div className="legend-title">RESQ LIVE MAP</div>

        <div className="legend-item">
          <span className="legend-emergency">!</span>
          Emergency
        </div>

        <div className="legend-item">
          <span className="legend-resource">+</span>
          Resource
        </div>

        <div className="legend-item">
          <span className="legend-route"></span>
          Response Route
        </div>
      </div>
    </div>
  );
}

export default Map;