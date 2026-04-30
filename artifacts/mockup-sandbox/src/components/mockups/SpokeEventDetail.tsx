const GREEN = "#556B2F";
const GREEN_DARK = "#3A4A1E";
const BG = "#0D0F08";
const CARD = "#161A0F";
const BORDER = "#2A3018";
const MUTED = "#6B7A50";
const FG = "#E8EDD8";

export default function SpokeEventDetail() {
  return (
    <div style={{
      width: 390,
      height: 844,
      background: BG,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Hero image area */}
      <div style={{
        height: 260,
        background: "linear-gradient(135deg, #0a1a05 0%, #1a3a0a 50%, #2d4a1a 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)",
        }} />
        <div style={{ fontSize: 100, position: "absolute", top: -10, right: -10, opacity: 0.15 }}>🚵</div>

        {/* Status bar */}
        <div style={{ padding: "44px 20px 0", display: "flex", justifyContent: "space-between", position: "relative" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 18,
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 18,
          }}>←</div>
          <div style={{
            width: 36, height: 36, borderRadius: 18,
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 16,
          }}>↗</div>
        </div>

        <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.18)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 20,
            marginBottom: 6,
            backdropFilter: "blur(8px)",
          }}>Group Ride</div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 20, letterSpacing: -0.5, marginBottom: 6 }}>
            Dawn Patrol Gravel Ride
          </div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span>📅</span> SAT APR 5 · 6:30 AM
          </div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <span>📍</span> Marin Headlands, CA
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{
        display: "flex",
        borderBottom: `1px solid ${BORDER}`,
        padding: "12px 0",
      }}>
        {[
          { val: "42 mi", label: "Distance" },
          { val: "3,200 ft", label: "Elevation" },
          { val: "Hard", label: "Difficulty", color: "#D62828" },
        ].map((s, i) => (
          <div key={s.label} style={{
            flex: 1,
            textAlign: "center",
            borderRight: i < 2 ? `1px solid ${BORDER}` : "none",
          }}>
            <div style={{ color: s.color || FG, fontWeight: 700, fontSize: 15 }}>{s.val}</div>
            <div style={{ color: MUTED, fontSize: 11, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "16px 20px", overflowY: "hidden" }}>

        {/* Map section */}
        <div style={{ color: FG, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Location & Route</div>
        <div style={{
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 14,
          overflow: "hidden",
          marginBottom: 16,
        }}>
          <div style={{
            height: 120,
            background: "linear-gradient(135deg, #1a2a10 0%, #2a4020 50%, #1a3010 100%)",
            position: "relative",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.3 }}>
              {/* Fake map grid */}
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  position: "absolute",
                  left: `${i * 20}%`, top: 0, bottom: 0,
                  borderLeft: "1px solid rgba(255,255,255,0.1)",
                }} />
              ))}
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                  position: "absolute",
                  top: `${i * 25}%`, left: 0, right: 0,
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                }} />
              ))}
              {/* Road lines */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <path d="M 30 90 Q 80 60 150 50 Q 220 40 280 70 Q 340 90 370 40" stroke={GREEN} strokeWidth="2.5" fill="none" opacity="0.8" />
                <path d="M 30 90 Q 80 60 150 50 Q 220 40 280 70 Q 340 90 370 40" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
              </svg>
            </div>
            <div style={{
              width: 28, height: 28, borderRadius: 14,
              background: GREEN,
              border: "3px solid #fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
              zIndex: 2,
            }} />
          </div>
          <div style={{ display: "flex", gap: 8, padding: 10 }}>
            <div style={{
              flex: 1, display: "flex", alignItems: "center", gap: 6,
              background: "#1E2812", borderRadius: 8,
              padding: "8px 12px", fontSize: 12, color: FG, fontWeight: 600,
            }}>
              <span>🧭</span> Get Directions
            </div>
            <div style={{
              flex: 1, display: "flex", alignItems: "center", gap: 6,
              background: GREEN, borderRadius: 8,
              padding: "8px 12px", fontSize: 12, color: "#fff", fontWeight: 600,
            }}>
              <span>📍</span> RideWithGPS
            </div>
          </div>
        </div>

        {/* About */}
        <div style={{ color: FG, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>About this event</div>
        <div style={{ color: MUTED, fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>
          Classic Marin loop — Rodeo Beach to Hawk Hill and back. Expect marine layer, rugged fire roads, and cold air. Cafe stop mid-ride. Bring layers.
        </div>

        {/* Calendar button */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12,
          padding: "12px 14px", marginBottom: 12,
        }}>
          <span style={{ fontSize: 16 }}>📅</span>
          <div style={{ flex: 1, color: FG, fontSize: 13, fontWeight: 600 }}>Add to Google Calendar</div>
          <span style={{ color: MUTED, fontSize: 12 }}>↗</span>
        </div>
      </div>

      {/* Join button */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "12px 20px 34px",
        background: BG,
        borderTop: `1px solid ${BORDER}`,
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
          borderRadius: 14,
          padding: "16px",
          textAlign: "center",
          color: "#fff",
          fontSize: 16,
          fontWeight: 700,
        }}>
          Join this Ride
        </div>
      </div>
    </div>
  );
}
