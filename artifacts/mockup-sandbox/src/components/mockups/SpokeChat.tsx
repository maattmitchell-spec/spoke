const GREEN = "#556B2F";
const BG = "#0D0F08";
const CARD = "#161A0F";
const BORDER = "#2A3018";
const MUTED = "#6B7A50";
const FG = "#E8EDD8";

const messages = [
  { id: 1, user: "Alex Chen", avatar: "AC", time: "8:12 AM", text: "Who's bringing the extra tubes? I have one but this is a long route 🚵", mine: false },
  { id: 2, user: "Me", avatar: "MM", time: "8:15 AM", text: "I've got two! Also packing a pump. We good on weather?", mine: true },
  { id: 3, user: "Jordan Lee", avatar: "JL", time: "8:18 AM", text: "Checked the forecast — marine layer until 8am then clearing. Should be epic once we hit Hawk Hill 🤙", mine: false },
  { id: 4, user: "Alex Chen", avatar: "AC", time: "8:22 AM", text: "Perfect. Meet at the Rodeo Beach parking lot at 6:15 to sort gear?", mine: false },
  { id: 5, user: "Me", avatar: "MM", time: "8:24 AM", text: "Works for me 👍", mine: true },
  { id: 6, user: "Sam Torres", avatar: "ST", time: "8:30 AM", text: "Just joined! Super excited for this one. First time riding Marin 🌊", mine: false },
];

export default function SpokeChat() {
  return (
    <div style={{
      width: 390,
      height: 844,
      background: BG,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflow: "hidden",
      position: "relative",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Status bar */}
      <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", paddingTop: 8, flexShrink: 0 }}>
        <div style={{ color: FG, fontSize: 13, fontWeight: 600 }}>9:41</div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", color: FG, fontSize: 11 }}>
          <span>●●●</span><span>WiFi</span><span>🔋</span>
        </div>
      </div>

      {/* Header */}
      <div style={{
        padding: "8px 20px 12px",
        borderBottom: `1px solid ${BORDER}`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 18,
          background: "#1E2812",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: FG, fontSize: 18,
        }}>←</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: FG, fontWeight: 700, fontSize: 15 }}>Dawn Patrol Gravel Ride</div>
          <div style={{ color: MUTED, fontSize: 11, marginTop: 1 }}>8 members · SAT APR 5 at 6:30 AM</div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: 18,
          background: "#1E2812",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16,
        }}>ℹ️</div>
      </div>

      {/* Date divider */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "16px 20px 8px", flexShrink: 0,
      }}>
        <div style={{ flex: 1, height: 1, background: BORDER }} />
        <div style={{ color: MUTED, fontSize: 11 }}>Today</div>
        <div style={{ flex: 1, height: 1, background: BORDER }} />
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: "0 16px", overflowY: "hidden", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: "flex",
            flexDirection: msg.mine ? "row-reverse" : "row",
            alignItems: "flex-end",
            gap: 8,
          }}>
            {!msg.mine && (
              <div style={{
                width: 30, height: 30, borderRadius: 15,
                background: GREEN,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 11, fontWeight: 700,
                flexShrink: 0,
              }}>{msg.avatar}</div>
            )}
            <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", alignItems: msg.mine ? "flex-end" : "flex-start" }}>
              {!msg.mine && (
                <div style={{ color: MUTED, fontSize: 10, marginBottom: 3, paddingLeft: 4 }}>{msg.user}</div>
              )}
              <div style={{
                background: msg.mine ? GREEN : CARD,
                border: msg.mine ? "none" : `1px solid ${BORDER}`,
                borderRadius: msg.mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                padding: "9px 13px",
                color: msg.mine ? "#fff" : FG,
                fontSize: 13,
                lineHeight: 1.5,
              }}>{msg.text}</div>
              <div style={{ color: MUTED, fontSize: 10, marginTop: 3, paddingLeft: 4, paddingRight: 4 }}>{msg.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div style={{
        padding: "12px 16px 34px",
        borderTop: `1px solid ${BORDER}`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: BG,
        flexShrink: 0,
      }}>
        <div style={{
          flex: 1,
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 22,
          padding: "10px 16px",
          color: MUTED,
          fontSize: 14,
        }}>Message the group...</div>
        <div style={{
          width: 40, height: 40,
          borderRadius: 20,
          background: GREEN,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 18,
        }}>↑</div>
      </div>
    </div>
  );
}
