import { useState } from "react";

const GREEN = "#1A9E4F";
const DARK = "#0A1F12";

const FAQS = [
  {
    q: "How do I create a new event?",
    a: "Tap the + New button in the top-right corner of the Explore screen. Fill in the event type (ride, run, hike, or meetup), set a location, date, time, and difficulty level, then tap Publish. Your event will appear immediately for others in the area to find and join.",
  },
  {
    q: "How do I join an event?",
    a: "Browse events on the Explore tab or check the Schedule tab for upcoming events. Tap any event card to view the details, then tap the Join button. You'll see a confirmation and the event will appear in your Schedule.",
  },
  {
    q: "How do I edit my profile name or location?",
    a: "Tap the Profile tab at the bottom of the screen. Tap the Edit profile button below your name in the green hero area, or go to Settings → Account → Edit profile. Update your name and city, then tap Save.",
  },
  {
    q: "How do I change my password?",
    a: "Go to Settings (the menu icon on your Profile tab), then tap Account → Change password. Enter your current password and your new password twice, then tap Update. If you signed up with Google or Apple, password change is managed through those providers.",
  },
  {
    q: "How do I change the app theme?",
    a: "Go to Settings and look for the Theme toggle at the top of the page. You can switch between Light, Dark, and System (which follows your device setting).",
  },
  {
    q: "Why can't I see events near me?",
    a: "Events are created by other Spoke members in your area. If your area is new to Spoke, there may not be events yet — create one! You can also search by location name using the search bar on the Explore tab.",
  },
  {
    q: "How do I invite friends to Spoke?",
    a: "Go to Settings → App → Invite friends. This opens your device's native share sheet so you can send an invite via iMessage, WhatsApp, email, or any other app installed on your phone.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your profile and activity data is stored entirely on your device — nothing is sent to a Spoke server. Sign-in is handled by Clerk, an industry-standard auth platform. Your location is a display label only and is never tracked or shared.",
  },
  {
    q: "How do I delete my account?",
    a: "To fully remove your account, sign out of the app and contact us at the email below. We'll delete your Clerk account within 48 hours. Uninstalling the app removes all locally stored data from your device immediately.",
  },
  {
    q: "The app isn't loading correctly. What should I do?",
    a: "Try closing and reopening the app. If the issue persists, go to your device's app settings, clear the app cache, and relaunch. If the problem continues, email us with your device model and iOS/Android version and we'll help.",
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
        flexShrink: 0,
        color: GREEN,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "18px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: DARK, lineHeight: 1.4 }}>{q}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <p
          style={{
            margin: "0 0 18px",
            fontSize: 14,
            color: "#4b5563",
            lineHeight: 1.7,
          }}
        >
          {a}
        </p>
      )}
    </div>
  );
}

export default function Support() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: "100vh", backgroundColor: "#f9fafb" }}>

      {/* Header */}
      <header
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 24px",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto", height: 64, display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
            <line x1="59" y1="50" x2="88" y2="50" stroke={GREEN} strokeWidth="3" strokeLinecap="round"/>
            <line x1="56.36" y1="43.64" x2="76.87" y2="23.13" stroke={GREEN} strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="41" x2="50" y2="12" stroke={GREEN} strokeWidth="3" strokeLinecap="round"/>
            <line x1="43.64" y1="43.64" x2="23.13" y2="23.13" stroke={GREEN} strokeWidth="3" strokeLinecap="round"/>
            <line x1="41" y1="50" x2="12" y2="50" stroke={GREEN} strokeWidth="3" strokeLinecap="round"/>
            <line x1="43.64" y1="56.36" x2="23.13" y2="76.87" stroke={GREEN} strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="59" x2="50" y2="88" stroke={GREEN} strokeWidth="3" strokeLinecap="round"/>
            <line x1="56.36" y1="56.36" x2="76.87" y2="76.87" stroke={GREEN} strokeWidth="3" strokeLinecap="round"/>
            <path d="M 59.00 50.00 L 62.93 44.64 L 56.36 43.64 L 55.36 37.07 L 50.00 41.00 L 44.64 37.07 L 43.64 43.64 L 37.07 44.64 L 41.00 50.00 L 37.07 55.36 L 43.64 56.36 L 44.64 62.93 L 50.00 59.00 L 55.36 62.93 L 56.36 56.36 L 62.93 55.36 Z" stroke={GREEN} strokeWidth="3" fill="none" strokeLinejoin="miter"/>
            <circle cx="88" cy="50" r="5" stroke={GREEN} strokeWidth="3" fill="none"/>
            <circle cx="76.87" cy="23.13" r="5" stroke={GREEN} strokeWidth="3" fill="none"/>
            <circle cx="50" cy="12" r="5" stroke={GREEN} strokeWidth="3" fill="none"/>
            <circle cx="23.13" cy="23.13" r="5" stroke={GREEN} strokeWidth="3" fill="none"/>
            <circle cx="12" cy="50" r="5" stroke={GREEN} strokeWidth="3" fill="none"/>
            <circle cx="23.13" cy="76.87" r="5" stroke={GREEN} strokeWidth="3" fill="none"/>
            <circle cx="50" cy="88" r="5" stroke={GREEN} strokeWidth="3" fill="none"/>
            <circle cx="76.87" cy="76.87" r="5" stroke={GREEN} strokeWidth="3" fill="none"/>
          </svg>
          <span style={{ fontSize: 18, fontWeight: 700, color: DARK, letterSpacing: "-0.4px" }}>spoke</span>
          <span
            style={{
              marginLeft: 8,
              fontSize: 12,
              fontWeight: 600,
              color: GREEN,
              backgroundColor: "#f0fdf4",
              border: `1px solid ${GREEN}33`,
              borderRadius: 20,
              padding: "2px 10px",
            }}
          >
            Support
          </span>
        </div>
      </header>

      {/* Hero */}
      <section
        style={{
          backgroundColor: DARK,
          padding: "56px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: GREEN + "22",
              border: `1px solid ${GREEN}44`,
              marginBottom: 20,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 12px",
              letterSpacing: "-0.8px",
            }}
          >
            How can we help?
          </h1>
          <p style={{ fontSize: 16, color: "#9ca3af", margin: 0, lineHeight: 1.6 }}>
            Find answers to common questions about Spoke, or reach out directly and we'll get back to you.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "48px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              color: GREEN,
              marginBottom: 24,
              marginTop: 0,
            }}
          >
            Frequently Asked Questions
          </h2>
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: "0 24px",
            }}
          >
            {FAQS.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{ padding: "0 24px 64px" }}>
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 32,
            display: "flex",
            gap: 24,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: "#f0fdf4",
              border: `1px solid ${GREEN}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK, margin: "0 0 6px", letterSpacing: "-0.3px" }}>
              Still need help?
            </h3>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 16px", lineHeight: 1.6 }}>
              Can't find what you're looking for? Send us a message and we'll respond within 1–2 business days.
            </p>
            <a
              href="mailto:support@spokecommunity.app"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                backgroundColor: GREEN,
                color: "#fff",
                borderRadius: 10,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              support@spokecommunity.app
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid #e5e7eb",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
          © {new Date().getFullYear()} Spoke · Made for remote adventurers
        </p>
      </footer>
    </div>
  );
}
