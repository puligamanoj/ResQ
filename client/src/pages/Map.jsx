import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  Polyline,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// =====================================================
// RESCUE TEAMS
// =====================================================

const rescueTeams = [
  {
    id: 1,
    name: "Rescue Team Alpha",
    position: [16.52, 80.62],
  },
  {
    id: 2,
    name: "Rescue Team Bravo",
    position: [18.30, 82.44],
  },
  {
    id: 3,
    name: "Rescue Team Charlie",
    position: [14.40, 78.50],
  },
];

// =====================================================
// SIMULATED DISASTER / WEATHER SURGE AREAS
// =====================================================

const surgeAreas = [
  {
    id: "SURGE-01",
    name: "Flood Surge Alpha",
    location: "Vijayawada",
    position: [16.5062, 80.648],
    people: 120,
    urgency: 75,
    vulnerability: 70,
    priority: 72,
  },

  {
    id: "SURGE-02",
    name: "Flood Surge Beta",
    location: "Kakinada",
    position: [16.9891, 82.2475],
    people: 180,
    urgency: 82,
    vulnerability: 75,
    priority: 81,
  },

  {
    id: "SURGE-03",
    name: "Critical Flood Surge",
    location: "Machilipatnam",
    position: [16.1875, 81.1389],
    people: 300,
    urgency: 100,
    vulnerability: 95,
    priority: 94,
  },

  {
    id: "SURGE-04",
    name: "Coastal Emergency",
    location: "Visakhapatnam",
    position: [17.6868, 83.2185],
    people: 250,
    urgency: 90,
    vulnerability: 82,
    priority: 88,
  },

  {
    id: "SURGE-05",
    name: "River Flood Zone",
    location: "Eluru",
    position: [16.7107, 81.0952],
    people: 160,
    urgency: 78,
    vulnerability: 80,
    priority: 79,
  },
];

// =====================================================
// RESCUE TEAM ICON
// =====================================================

const rescueIcon = L.divIcon({
  className: "resq-marker",

  html: `
    <div
      style="
        width:38px;
        height:38px;
        border-radius:50%;
        background:#16a34a;
        border:3px solid white;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:19px;
        box-shadow:0 0 22px rgba(34,197,94,0.8);
      "
    >
      🚑
    </div>
  `,

  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

// =====================================================
// EMERGENCY ICON
// =====================================================

const emergencyIcon = L.divIcon({
  className: "resq-marker",

  html: `
    <div
      style="
        width:34px;
        height:34px;
        border-radius:50%;
        background:#ef4444;
        border:3px solid white;
        display:flex;
        align-items:center;
        justify-content:center;
        color:white;
        font-size:16px;
        font-weight:900;
        box-shadow:0 0 22px rgba(239,68,68,0.9);
        animation:resqEmergencyPulse 1.4s infinite;
      "
    >
      !
    </div>
  `,

  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

// =====================================================
// MAIN MAP
// =====================================================

function Map() {
  const [apDistricts, setApDistricts] =
    useState(null);

  const [emergencies, setEmergencies] =
    useState([]);

  const [allocations, setAllocations] =
    useState([]);

  const [status, setStatus] =
    useState("SYSTEM READY");

  const [replanning, setReplanning] =
    useState(false);

  // ===================================================
  // LOAD AP GEOJSON
  // ===================================================

  useEffect(() => {
    fetch("/ap-districts.geojson")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Unable to load AP district GeoJSON"
          );
        }

        return response.json();
      })
      .then((data) => {
        const validFeatures =
          data.features.filter(
            (feature) => {
              if (!feature.geometry) {
                return false;
              }

              return (
                feature.geometry.type ===
                  "Polygon" ||
                feature.geometry.type ===
                  "MultiPolygon"
              );
            }
          );

        setApDistricts({
          ...data,
          features: validFeatures,
        });
      })
      .catch((error) => {
        console.error(
          "GeoJSON error:",
          error
        );
      });
  }, []);

  // ===================================================
  // DISTANCE CALCULATION
  // ===================================================

  function calculateDistance(
    pointA,
    pointB
  ) {
    const latDifference =
      pointA[0] - pointB[0];

    const lngDifference =
      pointA[1] - pointB[1];

    return Math.sqrt(
      latDifference *
        latDifference +
        lngDifference *
          lngDifference
    );
  }

  // ===================================================
  // DYNAMIC RESOURCE ALLOCATION
  //
  // Priority is considered first.
  // Distance is then used to select the
  // closest available rescue team.
  // ===================================================

  function allocateTeams(
    activeEmergencies
  ) {
    if (
      activeEmergencies.length === 0
    ) {
      return [];
    }

    // Highest priority first
    const sortedEmergencies = [
      ...activeEmergencies,
    ].sort(
      (a, b) =>
        b.priority - a.priority
    );

    // Copy available teams
    const availableTeams = [
      ...rescueTeams,
    ];

    const newAllocations = [];

    for (
      const emergency of
      sortedEmergencies
    ) {
      if (
        availableTeams.length === 0
      ) {
        break;
      }

      let closestTeamIndex = 0;

      let closestDistance =
        Infinity;

      availableTeams.forEach(
        (team, index) => {
          const distance =
            calculateDistance(
              team.position,
              emergency.position
            );

          if (
            distance <
            closestDistance
          ) {
            closestDistance =
              distance;

            closestTeamIndex =
              index;
          }
        }
      );

      const selectedTeam =
        availableTeams.splice(
          closestTeamIndex,
          1
        )[0];

      newAllocations.push({
        team: selectedTeam,
        emergency: emergency,
      });
    }

    return newAllocations;
  }

  // ===================================================
  // ADD WEATHER SURGE
  // ===================================================

  function simulateWeatherSurge() {
    if (
      emergencies.length >=
      surgeAreas.length
    ) {
      setStatus(
        "ALL SURGE AREAS ACTIVE"
      );

      return;
    }

    setReplanning(true);

    setStatus(
      "WEATHER SURGE DETECTED"
    );

    const nextSurge =
      surgeAreas[
        emergencies.length
      ];

    const updatedEmergencies = [
      ...emergencies,
      nextSurge,
    ];

    setTimeout(() => {
      const newAllocations =
        allocateTeams(
          updatedEmergencies
        );

      setEmergencies(
        updatedEmergencies
      );

      setAllocations(
        newAllocations
      );

      setStatus(
        "PRIORITIES RECALCULATED"
      );

      setReplanning(false);
    }, 1200);
  }

  // ===================================================
  // ADD CRITICAL EMERGENCY
  // ===================================================

  function addNewEmergency() {
    if (
      emergencies.some(
        (emergency) =>
          emergency.id ===
          "SURGE-03"
      )
    ) {
      setStatus(
        "CRITICAL SURGE ALREADY ACTIVE"
      );

      return;
    }

    setReplanning(true);

    setStatus(
      "NEW CRITICAL EMERGENCY DETECTED"
    );

    const criticalEmergency =
      surgeAreas[2];

    const updatedEmergencies = [
      ...emergencies,
      criticalEmergency,
    ];

    setTimeout(() => {
      setStatus(
        "RECALCULATING RESOURCE PRIORITIES..."
      );
    }, 700);

    setTimeout(() => {
      const newAllocations =
        allocateTeams(
          updatedEmergencies
        );

      setEmergencies(
        updatedEmergencies
      );

      setAllocations(
        newAllocations
      );

      setStatus(
        "RESOURCES REALLOCATED"
      );

      setReplanning(false);
    }, 1800);
  }

  // ===================================================
  // RESET
  // ===================================================

  function resetSimulation() {
    setEmergencies([]);

    setAllocations([]);

    setReplanning(false);

    setStatus(
      "SYSTEM READY"
    );
  }

  // ===================================================
  // DISTRICT STYLE
  // ===================================================

  const districtStyle = {
    color: "#22b8f0",
    weight: 1.5,
    fillColor: "#0b2945",
    fillOpacity: 0.85,
  };

  // ===================================================
  // DISTRICT INTERACTION
  // ===================================================

  function onEachDistrict(
    feature,
    layer
  ) {
    const name =
      feature.properties?.NAME ||
      feature.properties?.DISTRICT ||
      feature.properties?.district ||
      feature.properties?.name ||
      feature.properties?.District ||
      "AP District";

    layer.bindTooltip(name, {
      sticky: true,
      className:
        "district-tooltip",
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
        event.target.setStyle(
          districtStyle
        );
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

  // ===================================================
  // CREATE PATH FOR A TEAM
  // ===================================================

  function getTeamPath(
    allocation
  ) {
    const start =
      allocation.team.position;

    const end =
      allocation.emergency.position;

    const middle = [
      (start[0] + end[0]) / 2 +
        0.25,

      (start[1] + end[1]) / 2,
    ];

    return [
      start,
      middle,
      end,
    ];
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#020617",
        overflow: "hidden",
      }}
    >

      {/* =================================================
          COMMAND CENTER
      ================================================= */}

      <div
        style={{
          position: "absolute",

          zIndex: 2000,

          top: "50%",

          left: "40px",

          transform:
            "translateY(-50%)",

          width: "420px",

          maxHeight:
            "calc(100vh - 80px)",

          padding: "30px",

          background:
            "rgba(2,6,23,0.97)",

          border:
            "2px solid rgba(56,189,248,0.55)",

          borderRadius: "16px",

          color: "#e2e8f0",

          backdropFilter:
            "blur(16px)",

          boxShadow:
            "0 20px 60px rgba(0,0,0,0.55)",

          overflowY: "auto",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            fontSize: 14,

            letterSpacing: 2.5,

            color: "#38bdf8",

            fontWeight: 800,

            marginBottom: 8,
          }}
        >
          RESQ COMMAND CENTER
        </div>

        <div
          style={{
            fontSize: 29,

            fontWeight: 800,

            marginBottom: 6,
          }}
        >
          Dynamic Allocation
        </div>

        <div
          style={{
            fontSize: 14,

            color: "#94a3b8",

            marginBottom: 20,
          }}
        >
          Multi-zone disaster response
        </div>

        {/* STATUS */}

        <div
          style={{
            padding:
              "13px 14px",

            marginBottom: 15,

            background:
              replanning
                ? "rgba(220,38,38,0.16)"
                : "rgba(14,116,144,0.16)",

            border:
              replanning
                ? "1px solid rgba(220,38,38,0.5)"
                : "1px solid rgba(56,189,248,0.35)",

            borderRadius: 8,

            fontSize: 13,

            fontWeight: 800,

            color:
              replanning
                ? "#f87171"
                : "#38bdf8",

            textAlign: "center",
          }}
        >
          {replanning
            ? "⚠ REPLANNING RESPONSE"
            : status}
        </div>

        {/* =================================================
            ADD WEATHER SURGE
        ================================================= */}

        <button
          onClick={
            simulateWeatherSurge
          }
          disabled={
            replanning ||
            emergencies.length >=
              surgeAreas.length
          }
          style={{
            width: "100%",

            height: 64,

            marginBottom: 12,

            border: "none",

            borderRadius: 10,

            background:
              replanning ||
              emergencies.length >=
                surgeAreas.length
                ? "#334155"
                : "#0284c7",

            color: "white",

            fontSize: 16,

            fontWeight: 800,

            cursor:
              replanning ||
              emergencies.length >=
                surgeAreas.length
                ? "not-allowed"
                : "pointer",
          }}
        >
          🌧️ ADD WEATHER SURGE
        </button>

        {/* =================================================
            CRITICAL EMERGENCY
        ================================================= */}

        <button
          onClick={
            addNewEmergency
          }
          disabled={
            replanning ||
            emergencies.length === 0 ||
            emergencies.some(
              (emergency) =>
                emergency.id ===
                "SURGE-03"
            )
          }
          style={{
            width: "100%",

            height: 64,

            marginBottom: 12,

            border: "none",

            borderRadius: 10,

            background:
              !replanning &&
              emergencies.length > 0 &&
              !emergencies.some(
                (emergency) =>
                  emergency.id ===
                  "SURGE-03"
              )
                ? "#dc2626"
                : "#334155",

            color: "white",

            fontSize: 16,

            fontWeight: 800,

            cursor:
              !replanning &&
              emergencies.length > 0 &&
              !emergencies.some(
                (emergency) =>
                  emergency.id ===
                  "SURGE-03"
              )
                ? "pointer"
                : "not-allowed",
          }}
        >
          🚨 + NEW CRITICAL EMERGENCY
        </button>

        {/* RESET */}

        <button
          onClick={
            resetSimulation
          }
          style={{
            width: "100%",

            height: 56,

            border:
              "1px solid #475569",

            borderRadius: 10,

            background:
              "rgba(15,23,42,0.6)",

            color: "#cbd5e1",

            fontSize: 15,

            fontWeight: 700,

            cursor: "pointer",
          }}
        >
          RESET SIMULATION
        </button>

        {/* =================================================
            ACTIVE SURGE AREAS
        ================================================= */}

        <div
          style={{
            marginTop: 22,

            paddingTop: 18,

            borderTop:
              "1px solid #334155",
          }}
        >

          <div
            style={{
              fontSize: 11,

              color: "#64748b",

              letterSpacing: 1.5,

              marginBottom: 12,
            }}
          >
            ACTIVE SURGE AREAS (
            {emergencies.length})
          </div>

          {emergencies.length ===
            0 && (
            <div
              style={{
                fontSize: 13,

                color: "#64748b",

                padding:
                  "10px 0",
              }}
            >
              No active emergencies
            </div>
          )}

          {emergencies.map(
            (emergency) => {
              const allocation =
                allocations.find(
                  (item) =>
                    item.emergency
                      .id ===
                    emergency.id
                );

              return (
                <div
                  key={
                    emergency.id
                  }
                  style={{
                    padding:
                      "13px 14px",

                    marginBottom: 8,

                    borderRadius: 8,

                    background:
                      allocation
                        ? "rgba(34,197,94,0.10)"
                        : "rgba(15,23,42,0.7)",

                    border:
                      allocation
                        ? "1px solid rgba(34,197,94,0.45)"
                        : "1px solid #334155",
                  }}
                >

                  <div
                    style={{
                      display: "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",
                    }}
                  >

                    <div>

                      <div
                        style={{
                          fontSize: 14,

                          fontWeight: 800,
                        }}
                      >
                        {allocation
                          ? "🚑 "
                          : "🔴 "}

                        {
                          emergency.location
                        }
                      </div>

                      <div
                        style={{
                          fontSize: 11,

                          color: "#94a3b8",

                          marginTop: 4,
                        }}
                      >
                        {
                          emergency.people
                        }{" "}
                        people affected
                      </div>

                      {allocation && (
                        <div
                          style={{
                            fontSize: 10,

                            color: "#22d3ee",

                            marginTop: 4,
                          }}
                        >
                          {
                            allocation
                              .team
                              .name
                          }
                        </div>
                      )}

                    </div>

                    <div
                      style={{
                        textAlign:
                          "right",
                      }}
                    >

                      <div
                        style={{
                          fontSize: 20,

                          fontWeight: 900,

                          color:
                            emergency.priority >=
                            90
                              ? "#f87171"
                              : emergency.priority >=
                                  80
                                ? "#fbbf24"
                                : "#38bdf8",
                        }}
                      >
                        {
                          emergency.priority
                        }
                      </div>

                      <div
                        style={{
                          fontSize: 9,

                          color: "#64748b",

                          letterSpacing: 1,
                        }}
                      >
                        PRIORITY
                      </div>

                    </div>

                  </div>

                </div>
              );
            }
          )}
        </div>

        {/* =================================================
            RESOURCE ALLOCATION
        ================================================= */}

        {allocations.length >
          0 && (
          <div
            style={{
              marginTop: 18,

              paddingTop: 18,

              borderTop:
                "1px solid #334155",
            }}
          >

            <div
              style={{
                fontSize: 11,

                color: "#64748b",

                letterSpacing: 1.5,

                marginBottom: 12,
              }}
            >
              RESOURCE ALLOCATION
            </div>

            {allocations.map(
              (allocation) => (
                <div
                  key={`${allocation.team.id}-${allocation.emergency.id}`}
                  style={{
                    padding:
                      "12px 14px",

                    marginBottom: 8,

                    background:
                      "rgba(14,116,144,0.10)",

                    border:
                      "1px solid rgba(56,189,248,0.25)",

                    borderRadius: 8,
                  }}
                >

                  <div
                    style={{
                      fontSize: 14,

                      fontWeight: 800,
                    }}
                  >
                    🚑{" "}
                    {
                      allocation
                        .team
                        .name
                    }
                  </div>

                  <div
                    style={{
                      marginTop: 5,

                      fontSize: 13,

                      color:
                        "#22d3ee",

                      fontWeight: 700,
                    }}
                  >
                    →{" "}
                    {
                      allocation
                        .emergency
                        .location
                    }
                  </div>

                  <div
                    style={{
                      marginTop: 4,

                      fontSize: 11,

                      color:
                        "#94a3b8",
                    }}
                  >
                    Priority:{" "}
                    <strong>
                      {
                        allocation
                          .emergency
                          .priority
                      }
                    </strong>
                  </div>

                </div>
              )
            )}
          </div>
        )}

        {/* =================================================
            ALGORITHM MESSAGE
        ================================================= */}

        {emergencies.length >
          1 && (
          <div
            style={{
              marginTop: 12,

              padding: 14,

              background:
                "rgba(34,197,94,0.08)",

              border:
                "1px solid rgba(34,197,94,0.3)",

              borderRadius: 8,

              fontSize: 12,

              lineHeight: 1.6,

              color: "#86efac",
            }}
          >

            <strong>
              ✓ DYNAMIC REALLOCATION
            </strong>

            <br />

            {emergencies.length} active
            emergency zones evaluated.

            <br />

            Resources allocated using
            priority and proximity.

            <br />

            New emergencies trigger
            automatic replanning.

          </div>
        )}

      </div>

      {/* =================================================
          MAP
      ================================================= */}

      <MapContainer
        center={[
          16.5,
          78.8,
        ]}
        zoom={7}

        dragging={false}

        scrollWheelZoom={false}

        doubleClickZoom={false}

        touchZoom={false}

        boxZoom={false}

        keyboard={false}

        zoomControl={false}

        attributionControl={false}

        style={{
          width: "100%",
          height: "100vh",
          background:
            "#020617",
        }}
      >
        <TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution="&copy; OpenStreetMap contributors"
/>

        {/* AP DISTRICTS */}

        {apDistricts && (
          <GeoJSON
            data={apDistricts}
            style={districtStyle}
            onEachFeature={
              onEachDistrict
            }
          />
        )}

        {/* =================================================
            ALL RESCUE TEAMS
        ================================================= */}

        {rescueTeams.map(
          (team) => {
            const allocation =
              allocations.find(
                (item) =>
                  item.team.id ===
                  team.id
              );

            return (
              <Marker
                key={team.id}
                position={
                  team.position
                }
                icon={
                  rescueIcon
                }
              >
                <Popup>

                  <strong>
                    {team.name}
                  </strong>

                  <br />

                  Status:{" "}

                  {allocation
                    ? "DEPLOYED"
                    : "AVAILABLE"}

                  {allocation && (
                    <>
                      <br />

                      Destination:{" "}
                      {
                        allocation
                          .emergency
                          .location
                      }

                      <br />

                      Priority:{" "}
                      {
                        allocation
                          .emergency
                          .priority
                      }
                    </>
                  )}

                </Popup>
              </Marker>
            );
          }
        )}

        {/* =================================================
            ALL EMERGENCY MARKERS
        ================================================= */}

        {emergencies.map(
          (emergency) => (
            <Marker
              key={
                emergency.id
              }
              position={
                emergency.position
              }
              icon={
                emergencyIcon
              }
            >
              <Popup>

                <strong>
                  {
                    emergency.name
                  }
                </strong>

                <br />

                Location:{" "}
                {
                  emergency.location
                }

                <br />

                People affected:{" "}
                {
                  emergency.people
                }

                <br />

                Urgency:{" "}
                {
                  emergency.urgency
                }

                <br />

                Vulnerability:{" "}
                {
                  emergency.vulnerability
                }

                <br />

                Priority:{" "}
                {
                  emergency.priority
                }

              </Popup>
            </Marker>
          )
        )}

        {/* =================================================
            FLOOD AREAS
        ================================================= */}

        {emergencies.map(
          (emergency) => (
            <Circle
              key={`circle-${emergency.id}`}
              center={
                emergency.position
              }
              radius={4000}
              pathOptions={{
                color:
                  "#ef4444",

                weight: 2,

                fillColor:
                  "#ef4444",

                fillOpacity:
                  0.08,

                dashArray:
                  "8 8",
              }}
            />
          )
        )}

        {/* =================================================
            ALL DYNAMIC RESCUE PATHS
        ================================================= */}

        {allocations.map(
          (allocation) => (
            <Polyline
              key={`path-${allocation.team.id}-${allocation.emergency.id}`}
              positions={getTeamPath(
                allocation
              )}
              pathOptions={{
                color:
                  "#22d3ee",

                weight: 5,

                opacity: 0.9,

                dashArray:
                  "14 9",
              }}
            />
          )
        )}

      </MapContainer>

      {/* =================================================
          MAP LEGEND
      ================================================= */}

      <div
        style={{
          position: "absolute",

          zIndex: 1500,

          bottom: 25,

          left: 25,

          padding:
            "16px 18px",

          background:
            "rgba(2,6,23,0.94)",

          border:
            "1px solid rgba(56,189,248,0.35)",

          borderRadius: 9,

          color: "#cbd5e1",

          fontSize: 13,
        }}
      >

        <div
          style={{
            color: "#38bdf8",

            fontSize: 12,

            fontWeight: 800,

            letterSpacing: 1.5,

            marginBottom: 10,
          }}
        >
          MAP LEGEND
        </div>

        <div
          style={{
            marginBottom: 7,
          }}
        >
          🔴 Emergency
        </div>

        <div
          style={{
            marginBottom: 7,
          }}
        >
          🚑 Rescue Team
        </div>

        <div>
          <span
            style={{
              color:
                "#22d3ee",

              fontSize: 18,
            }}
          >
            ┄
          </span>{" "}
          Active Rescue Path
        </div>

      </div>

      {/* =================================================
          ANIMATIONS / STYLES
      ================================================= */}

      <style>
        {`
          @keyframes resqEmergencyPulse {
            0% {
              transform: scale(1);
              box-shadow:
                0 0 10px
                rgba(239,68,68,0.6);
            }

            50% {
              transform: scale(1.18);
              box-shadow:
                0 0 28px
                rgba(239,68,68,1);
            }

            100% {
              transform: scale(1);
              box-shadow:
                0 0 10px
                rgba(239,68,68,0.6);
            }
          }

          .leaflet-container {
            font-family: Arial, sans-serif;
          }

          .district-tooltip {
            background: #020617;
            color: #e2e8f0;
            border: 1px solid #38bdf8;
            border-radius: 5px;
            font-weight: 600;
          }
        `}
      </style>

    </div>
  );
}

export default Map;