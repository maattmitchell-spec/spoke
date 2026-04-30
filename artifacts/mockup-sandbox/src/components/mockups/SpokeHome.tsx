const GREEN = "#556B2F";
const GREEN_LIGHT = "#7A9B30";
const BG = "#0D0F08";
const CARD = "#161A0F";
const BORDER = "#2A3018";
const MUTED = "#6B7A50";
const FG = "#E8EDD8";

const events = [
  {
    id: 1,
    type: "ride",
    badge: "Group Ride",
    badgeColor: "#556B2F",
    title: "Dawn Patrol Gravel Ride",
    date: "SAT APR 5 · 6:30 AM",
    location: "Marin Headlands, CA",
    distance: "42 mi",
    elevation: "3,200 ft",
    difficulty: "hard",
    diffColor: "#D62828",
    attendees: 8,
    max: 12,
    host: "AC",
    joined: false,
    tags: ["gravel", "dawn", "coastal"],
    img: "🌄",
  },
  {
    id: 2,
    type: "run",
    badge: "Trail Run",
    badgeColor: "#3A6B4A",
    title: "Fire Road Trail Run",
    date: "SUN APR 6 · 7:00 AM",
    location: "Tilden Park, CA",
    distance: "8 mi",
    elevation: "900 ft",
    difficulty: "moderate",
    diffColor: "#E07B39",
    attendees: 5,
    max: 10,
    host: "MP",
    joined: true,
    tags: ["trail", "hills", "fog"],
    img: "🌲",
  },
  {
    id: 3,
    type: "hike",
    badge: "Hike",
    badgeColor: "#4A6B3A",
    title: "Half Dome Day Hike",
    date: "SAT APR 12 · 5:00 AM",
    location: "Yosemite, CA",
    distance: "14 mi",
    elevation: "4,800 ft",
    difficulty: "hard",
    diffColor: "#D62828",
    attendees: 3,
    max: 6,
    host: "JL",
    joined: false,
    tags: ["epic", "cables", "yosemite"],
    img: "⛰️",
  },
];

function EventCard({ ev }: { ev: typeof events[0] }) {
  const pct = (ev.attendees / ev.max) * 100;
  return (
    <div style={{
      background: CARD,
      border: `1px solid ${BORDER}`,
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 12,
    }}>
      <div style={{
        height: 110,
        background: ev.type === "ride"
          ? "linear-gradient(135deg, #1a2a0a 0%, #2d4a1a 100%)"
          : ev.type === "run"
          ? "linear-gradient(135deg, #0a1a15 0%, #1a3a28 100%)"
          : "linear-gradient(135deg, #0a150a 0%, #1a2d0a 100%)",
        display: "flex",
        alignItems: "flex-end",
        padding: "10px 12px",
        position: "relative",
      }}>
        <div style={{ fontSize: 40, position: "absolute", top: 14, right: 14, opacity: 0.4 }}>{ev.img}</div>
        <div>
          <div style={{
            display: "inline-block",
            background: ev.badgeColor,
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 20,
            marginBottom: 4,
            letterSpacing: 0.5,
          }}>{ev.badge}</div>
          <div style={{ color: FG, fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>{ev.title}</div>
        </div>
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 8, color: MUTED, fontSize: 11 }}>
          <span>📅 {ev.date}</span>
        </div>
        <div style={{ color: MUTED, fontSize: 11, marginBottom: 8 }}>📍 {ev.location}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {ev.distance && (
            <div style={{ background: "#1E2812", borderRadius: 8, padding: "4px 8px", fontSize: 11, color: FG }}>
              🏁 {ev.distance}
            </div>
          )}
          {ev.elevation && (
            <div style={{ background: "#1E2812", borderRadius: 8, padding: "4px 8px", fontSize: 11, color: FG }}>
              ⛰ {ev.elevation}
            </div>
          )}
          <div style={{ background: "#1E2812", borderRadius: 8, padding: "4px 8px", fontSize: 11, color: ev.diffColor, fontWeight: 600 }}>
            {ev.difficulty}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: 1, marginRight: 12 }}>
            <div style={{ background: BORDER, borderRadius: 4, height: 4, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, background: GREEN, height: "100%", borderRadius: 4 }} />
            </div>
            <div style={{ color: MUTED, fontSize: 10, marginTop: 3 }}>{ev.attendees}/{ev.max} going</div>
          </div>
          <div style={{
            background: ev.joined ? "transparent" : GREEN,
            border: ev.joined ? `1.5px solid ${BORDER}` : "none",
            color: ev.joined ? MUTED : "#fff",
            fontSize: 12,
            fontWeight: 700,
            padding: "6px 14px",
            borderRadius: 10,
          }}>
            {ev.joined ? "Going ✓" : "Join"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
          {ev.tags.map(t => (
            <div key={t} style={{ background: "#1A2010", borderRadius: 6, padding: "2px 7px", fontSize: 10, color: MUTED }}>#{t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SpokeHome() {
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
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ color: FG, fontSize: 11 }}>●●●</div>
          <div style={{ color: FG, fontSize: 11 }}>WiFi</div>
          <div style={{ color: FG, fontSize: 11 }}>🔋</div>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: "12px 20px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: MUTED, fontSize: 12, marginBottom: 2 }}>Good morning 👋</div>
          <div style={{ color: FG, fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Discover</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "#1E2812", border: `1px solid ${BORDER}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: FG, fontSize: 16,
          }}>🔔</div>
          <div style={{
            width: 36, height: 36, borderRadius: 18,
            background: GREEN,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 14, fontWeight: 700,
          }}>MM</div>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, padding: "8px 20px", overflowX: "hidden" }}>
        {["All", "Rides", "Runs", "Hikes", "Meetups"].map((f, i) => (
          <div key={f} style={{
            background: i === 0 ? GREEN : "#1E2812",
            color: i === 0 ? "#fff" : MUTED,
            padding: "6px 14px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            border: i === 0 ? "none" : `1px solid ${BORDER}`,
            whiteSpace: "nowrap",
          }}>{f}</div>
        ))}
      </div>

      {/* Events list */}
      <div style={{ padding: "4px 20px 20px", overflowY: "hidden", height: "calc(100% - 180px)" }}>
        {events.map(ev => <EventCard key={ev.id} ev={ev} />)}
      </div>

      {/* Tab bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "#0D0F08",
        borderTop: `1px solid ${BORDER}`,
        display: "flex",
        padding: "10px 0 24px",
      }}>
        {[
          { icon: "🏠", label: "Discover", active: true },
          { icon: "📅", label: "Schedule", active: false },
          { icon: "👥", label: "Community", active: false },
          { icon: "👤", label: "Profile", active: false },
        ].map(tab => (
          <div key={tab.label} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 3,
          }}>
            <div style={{ fontSize: 20 }}>{tab.icon}</div>
            <div style={{
              fontSize: 10, fontWeight: tab.active ? 700 : 400,
              color: tab.active ? GREEN_LIGHT : MUTED,
            }}>{tab.label}</div>
            {tab.active && <div style={{ width: 4, height: 4, borderRadius: 2, background: GREEN_LIGHT }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
