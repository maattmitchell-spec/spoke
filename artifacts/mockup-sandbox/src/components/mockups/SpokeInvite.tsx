const GREEN = "#556B2F";
const GREEN_DARK = "#3A4A1E";
const BG = "#0D0F08";
const CARD = "#161A0F";
const BORDER = "#2A3018";
const MUTED = "#6B7A50";
const FG = "#E8EDD8";

export default function SpokeInvite() {
  return (
    <div style={{
      width: 390,
      height: 844,
      background: BG,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Status bar */}
      <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", paddingTop: 8 }}>
        <div style={{ color: FG, fontSize: 13, fontWeight: 600 }}>9:41</div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", color: FG, fontSize: 11 }}>
          <span>●●●</span><span>WiFi</span><span>🔋</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{
        height: 200,
        background: "linear-gradient(135deg, #0a180a 0%, #1a3010 50%, #2a4018 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.65))" }} />
        <div style={{ fontSize: 90, position: "absolute", top: -5, right: -5, opacity: 0.12 }}>🏔️</div>
        <div style={{ position: "absolute", top: 12, left: 20 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 18,
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 18,
          }}>←</div>
        </div>
        <div style={{ position: "absolute", bottom: 16, left: 20, right: 20 }}>
          <div style={{
            display: "inline-block", background: "rgba(255,255,255,0.18)",
            color: "#fff", fontSize: 11, fontWeight: 600,
            padding: "3px 10px", borderRadius: 20, marginBottom: 6,
          }}>Hike</div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Half Dome Day Hike</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>📅 SAT APR 12 · 5:00 AM &nbsp;·&nbsp; 📍 Yosemite, CA</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 20px 0", overflowY: "hidden" }}>

        {/* Invite Friends Section */}
        <div style={{ color: FG, fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Invite Friends</div>
        <div style={{
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
        }}>
          <div style={{ color: MUTED, fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
            Get your crew moving — share this activity and let them sign up on Spoke.
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{
              flex: 1,
              background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
              borderRadius: 10, padding: "11px 0",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 7, color: "#fff", fontSize: 13, fontWeight: 700,
            }}>
              <span>💬</span> Text a Friend
            </div>
            <div style={{
              flex: 1,
              background: "#1E2812",
              border: `1px solid ${BORDER}`,
              borderRadius: 10, padding: "11px 0",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 7, color: FG, fontSize: 13, fontWeight: 700,
            }}>
              <span>↗</span> Share to Socials
            </div>
          </div>
        </div>

        {/* Group Chat Section */}
        <div style={{ color: FG, fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Group Chat</div>
        <div style={{
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 16,
          padding: 14,
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 22,
            background: "#1E2812",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>💬</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: FG, fontWeight: 600, fontSize: 14 }}>Half Dome Day Hike</div>
            <div style={{ color: MUTED, fontSize: 12, marginTop: 2 }}>3 members going</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              background: GREEN,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              width: 20, height: 20,
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>2</div>
            <div style={{ color: MUTED, fontSize: 16 }}>›</div>
          </div>
        </div>

        {/* Calendar button */}
        <div style={{
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 16,
          padding: 14,
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 20 }}>📅</div>
          <div style={{ flex: 1, color: FG, fontWeight: 600, fontSize: 13 }}>Add to Google Calendar</div>
          <div style={{ color: MUTED, fontSize: 14 }}>↗</div>
        </div>

        {/* Attendance */}
        <div style={{ color: FG, fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Attendance</div>
        <div style={{
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 16,
          padding: 14,
        }}>
          <div style={{ color: FG, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
            3 <span style={{ color: MUTED, fontWeight: 400, fontSize: 14 }}>/ 6 spots filled</span>
          </div>
          <div style={{ background: BORDER, borderRadius: 4, height: 6, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ width: "50%", background: GREEN, height: "100%", borderRadius: 4 }} />
          </div>
          <div style={{ color: MUTED, fontSize: 12 }}>3 spots remaining</div>
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
          borderRadius: 14, padding: "16px",
          textAlign: "center", color: "#fff",
          fontSize: 16, fontWeight: 700,
        }}>
          Join this Hike
        </div>
      </div>
    </div>
  );
}
