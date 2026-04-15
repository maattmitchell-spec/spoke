const GREEN = "#556B2F";
const GREEN_DARK = "#3A4A1E";
const GREEN_LIGHT = "#7A9B30";
const DARK = "#1A1E0F";

const ACTIVITY_TYPES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
        <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
        <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
      </svg>
    ),
    label: "Rides",
    description: "Gravel, road, and trail rides curated for every pace. Find your next rolling adventure.",
    color: "#166534",
    bg: "#f0fdf4",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0" /><path d="M7 20l2-6 3 2 2-8" /><path d="M20 20a9.65 9.65 0 0 0-3-7" />
      </svg>
    ),
    label: "Runs",
    description: "Local group runs from casual jogs to trail crushers. All paces, all welcome.",
    color: "#1e40af",
    bg: "#eff6ff",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l4-8 4 4 3-6 4 10" /><path d="M3 17h18" />
      </svg>
    ),
    label: "Hikes",
    description: "Summits, ridge lines, and hidden trails. Discover routes worth the early alarm.",
    color: "#92400e",
    bg: "#fffbeb",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    label: "Meetups",
    description: "Coffee rides, post-hike hangs, remote-work socials. Community IRL.",
    color: "#6d28d9",
    bg: "#f5f3ff",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Create your profile",
    body: "Sign up in seconds. Add your name, city, and the kinds of adventures you're into.",
  },
  {
    number: "02",
    title: "Browse or host an event",
    body: "Explore curated rides, runs, hikes, and meetups near you — or create one in under a minute.",
  },
  {
    number: "03",
    title: "Show up and move",
    body: "No feeds, no noise. Just a time, a place, and the people who said they'd be there.",
  },
];

const QUOTES = [
  {
    text: "Finally an app that understands remote work doesn't mean staying inside.",
    name: "Alex M.",
    role: "Software engineer · Boulder, CO",
  },
  {
    text: "I've met more people through Spoke in a month than in a year of Slack happy hours.",
    name: "Priya S.",
    role: "Product designer · Austin, TX",
  },
  {
    text: "Found my Saturday riding crew on week one. These are my people.",
    name: "Jordan K.",
    role: "Founder · Bend, OR",
  },
];

function SpokeWordmark() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg width="22" height="22" viewBox="0 0 100 100">
        <line x1="50" y1="50" x2="90"    y2="50"    stroke={GREEN} strokeWidth="3" strokeLinecap="round"/>
        <line x1="50" y1="50" x2="78.28" y2="21.72" stroke={GREEN} strokeWidth="3" strokeLinecap="round"/>
        <line x1="50" y1="50" x2="50"    y2="10"    stroke={GREEN} strokeWidth="3" strokeLinecap="round"/>
        <line x1="50" y1="50" x2="21.72" y2="21.72" stroke={GREEN} strokeWidth="3" strokeLinecap="round"/>
        <line x1="50" y1="50" x2="10"    y2="50"    stroke={GREEN} strokeWidth="3" strokeLinecap="round"/>
        <line x1="50" y1="50" x2="21.72" y2="78.28" stroke={GREEN} strokeWidth="3" strokeLinecap="round"/>
        <line x1="50" y1="50" x2="50"    y2="90"    stroke={GREEN} strokeWidth="3" strokeLinecap="round"/>
        <line x1="50" y1="50" x2="78.28" y2="78.28" stroke={GREEN} strokeWidth="3" strokeLinecap="round"/>
        <path
          d="M 73.00 50.00 L 64.78 43.88 L 66.26 33.74 L 56.12 35.22 L 50.00 27.00 L 43.88 35.22 L 33.74 33.74 L 35.22 43.88 L 27.00 50.00 L 35.22 56.12 L 33.74 66.26 L 43.88 64.78 L 50.00 73.00 L 56.12 64.78 L 66.26 66.26 L 64.78 56.12 Z M 60 50 A 10 10 0 1 0 40 50 A 10 10 0 1 0 60 50 Z"
          fill={GREEN} fillRule="evenodd"
        />
        <circle cx="90"    cy="50"    r="5" stroke={GREEN} strokeWidth="3" fill="none"/>
        <circle cx="78.28" cy="21.72" r="5" stroke={GREEN} strokeWidth="3" fill="none"/>
        <circle cx="50"    cy="10"    r="5" stroke={GREEN} strokeWidth="3" fill="none"/>
        <circle cx="21.72" cy="21.72" r="5" stroke={GREEN} strokeWidth="3" fill="none"/>
        <circle cx="10"    cy="50"    r="5" stroke={GREEN} strokeWidth="3" fill="none"/>
        <circle cx="21.72" cy="78.28" r="5" stroke={GREEN} strokeWidth="3" fill="none"/>
        <circle cx="50"    cy="90"    r="5" stroke={GREEN} strokeWidth="3" fill="none"/>
        <circle cx="78.28" cy="78.28" r="5" stroke={GREEN} strokeWidth="3" fill="none"/>
      </svg>
      <span style={{ fontSize: 18, fontWeight: 700, color: DARK, letterSpacing: "-0.4px" }}>spoke</span>
    </div>
  );
}

function AppStoreBadge() {
  return (
    <a
      href="#"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        backgroundColor: DARK,
        color: "#fff",
        borderRadius: 12,
        padding: "11px 20px",
        textDecoration: "none",
        border: "1px solid #ffffff22",
      }}
    >
      <svg width="18" height="22" viewBox="0 0 18 22" fill="white">
        <path d="M15.769 11.497c-.028-3.07 2.508-4.558 2.62-4.627-1.428-2.087-3.648-2.374-4.438-2.403-1.885-.193-3.685 1.12-4.641 1.12-.956 0-2.436-1.094-4.007-1.065-2.065.031-3.971 1.207-5.033 3.063-2.146 3.721-.55 9.233 1.539 12.252 1.022 1.474 2.233 3.127 3.831 3.067 1.54-.063 2.121-1.001 3.983-1.001 1.862 0 2.395 1.001 4.01.965 1.655-.027 2.708-1.499 3.722-2.979a14.8 14.8 0 0 0 1.69-3.436c-.043-.016-3.235-1.236-3.276-4.956zM12.665 2.9C13.509 1.878 14.079.495 13.92-.001c-1.23.05-2.717.822-3.598 1.845-.79.899-1.483 2.34-1.296 3.72 1.367.105 2.764-.698 3.639-1.664z"/>
      </svg>
      <div>
        <div style={{ fontSize: 10, opacity: 0.75, lineHeight: 1, fontWeight: 500 }}>Download on the</div>
        <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>App Store</div>
      </div>
    </a>
  );
}

function PlayStoreBadge() {
  return (
    <a
      href="#"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        backgroundColor: DARK,
        color: "#fff",
        borderRadius: 12,
        padding: "11px 20px",
        textDecoration: "none",
        border: "1px solid #ffffff22",
      }}
    >
      <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
        <path d="M0.432 0.199C0.16 0.487 0 0.933 0 1.508v16.984c0 .575.16 1.021.432 1.309l.071.069 9.516-9.516v-.224L.503.13.432.199z" fill="url(#g1)"/>
        <path d="M12.791 13.129l-3.171-3.172v-.224l3.172-3.172.072.041 3.759 2.136c1.073.609 1.073 1.606 0 2.215l-3.759 2.136-.073.04z" fill="url(#g2)"/>
        <path d="M12.864 13.089L9.62 9.845.432 19.033c.354.374.938.42 1.597.047l10.835-6.991z" fill="url(#g3)"/>
        <path d="M12.864 6.6L2.029-.39C1.37-.763.786-.717.432-.343L9.62 8.845l3.244-2.245z" fill="url(#g4)"/>
        <defs>
          <linearGradient id="g1" x1="8.733" y1="1.27" x2="-4.61" y2="14.614" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00A0FF"/><stop offset="1" stopColor="#0068FF"/>
          </linearGradient>
          <linearGradient id="g2" x1="17.703" y1="9.845" x2="-.135" y2="9.845" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD600"/><stop offset="1" stopColor="#FF9E00"/>
          </linearGradient>
          <linearGradient id="g3" x1="11.086" y1="11.544" x2="-3.847" y2="26.477" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF3A44"/><stop offset="1" stopColor="#C31162"/>
          </linearGradient>
          <linearGradient id="g4" x1="-1.666" y1="-3.748" x2="4.867" y2="2.786" gradientUnits="userSpaceOnUse">
            <stop stopColor="#32A071"/><stop offset="1" stopColor="#2DA771"/>
          </linearGradient>
        </defs>
      </svg>
      <div>
        <div style={{ fontSize: 10, opacity: 0.75, lineHeight: 1, fontWeight: 500 }}>Get it on</div>
        <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>Google Play</div>
      </div>
    </a>
  );
}

export default function Marketing() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: "100vh", backgroundColor: "#fff" }}>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <SpokeWordmark />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="/branding-kit/support" style={{ fontSize: 14, fontWeight: 500, color: "#4b5563", textDecoration: "none", padding: "8px 14px" }}>Support</a>
            <a
              href="#download"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                backgroundColor: GREEN,
                borderRadius: 10,
                padding: "8px 18px",
                textDecoration: "none",
              }}
            >
              Download
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          background: `linear-gradient(160deg, ${DARK} 0%, #0d2b19 60%, #0f3d1e 100%)`,
          padding: "80px 24px 96px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", backgroundColor: GREEN + "0a", border: `1px solid ${GREEN}15` }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", backgroundColor: GREEN + "08", border: `1px solid ${GREEN}10` }} />

        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              backgroundColor: GREEN + "22",
              border: `1px solid ${GREEN}44`,
              borderRadius: 20,
              padding: "5px 14px",
              marginBottom: 28,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: GREEN_LIGHT }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: GREEN_LIGHT, letterSpacing: "0.5px" }}>
              For remote workers who go outside
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 60px)",
              fontWeight: 800,
              color: "#fff",
              margin: "0 0 20px",
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
            }}
          >
            Your next adventure
            <br />
            <span style={{ color: GREEN_LIGHT }}>starts here.</span>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#9ca3af",
              margin: "0 auto 40px",
              maxWidth: 520,
              lineHeight: 1.65,
            }}
          >
            Spoke connects remote workers with curated rides, runs, hikes, and meetups near them — no algorithms, no noise, just the next adventure.
          </p>

          <div id="download" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <AppStoreBadge />
            <PlayStoreBadge />
          </div>
        </div>
      </section>

      {/* Activity Types */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: GREEN, margin: "0 0 10px" }}>What's on Spoke</p>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, color: DARK, margin: 0, letterSpacing: "-0.8px" }}>
              Four ways to get outside
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {ACTIVITY_TYPES.map((type) => (
              <div
                key={type.label}
                style={{
                  backgroundColor: type.bg,
                  border: `1px solid ${type.color}22`,
                  borderRadius: 16,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: "#fff",
                    border: `1px solid ${type.color}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    color: type.color,
                  }}
                >
                  {type.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, margin: "0 0 8px", letterSpacing: "-0.3px" }}>{type.label}</h3>
                <p style={{ fontSize: 14, color: "#4b5563", margin: 0, lineHeight: 1.6 }}>{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "72px 24px", backgroundColor: "#f9fafb" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: GREEN, margin: "0 0 10px" }}>Simple by design</p>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, color: DARK, margin: 0, letterSpacing: "-0.8px" }}>
              How it works
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                style={{
                  display: "flex",
                  gap: 28,
                  alignItems: "flex-start",
                  paddingBottom: i < STEPS.length - 1 ? 40 : 0,
                  position: "relative",
                }}
              >
                {/* Line connector */}
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      left: 21,
                      top: 48,
                      width: 2,
                      height: "calc(100% - 48px)",
                      backgroundColor: GREEN + "33",
                    }}
                  />
                )}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: GREEN,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 800,
                    flexShrink: 0,
                    letterSpacing: "-0.3px",
                  }}
                >
                  {step.number}
                </div>
                <div style={{ paddingTop: 10 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: DARK, margin: "0 0 6px", letterSpacing: "-0.4px" }}>{step.title}</h3>
                  <p style={{ fontSize: 15, color: "#4b5563", margin: 0, lineHeight: 1.65 }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto / Values */}
      <section style={{ padding: "72px 24px", backgroundColor: DARK }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: GREEN_LIGHT, margin: "0 0 20px" }}>
            Our philosophy
          </p>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 800,
              color: "#fff",
              margin: "0 0 24px",
              letterSpacing: "-0.8px",
              lineHeight: 1.25,
            }}
          >
            Remote work gave us freedom.
            <br />
            <span style={{ color: GREEN_LIGHT }}>We're using it.</span>
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "#9ca3af",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            The best thing about working remotely isn't the commute you skipped — it's the trail you can ride at 2pm on a Tuesday. Spoke exists so you don't have to ride it alone.
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: GREEN, margin: "0 0 10px" }}>Community</p>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, color: DARK, margin: 0, letterSpacing: "-0.8px" }}>
              Hear it from the trail
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {QUOTES.map((q) => (
              <div
                key={q.name}
                style={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: 28,
                }}
              >
                <svg width="24" height="18" viewBox="0 0 24 18" fill={GREEN} style={{ marginBottom: 16, opacity: 0.6 }}>
                  <path d="M0 18V10.8C0 7.2 1.6 4.2 4.8 1.8L6.6 3.6C5 4.8 4 6.2 3.6 7.8H6V18H0zm12 0V10.8c0-3.6 1.6-6.6 4.8-9L18.6 3.6C17 4.8 16 6.2 15.6 7.8H18V18H12z"/>
                </svg>
                <p style={{ fontSize: 15, color: "#1f2937", margin: "0 0 20px", lineHeight: 1.65, fontStyle: "italic" }}>"{q.text}"</p>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{q.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{q.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        style={{
          margin: "0 24px 72px",
          maxWidth: 1080,
          marginLeft: "auto",
          marginRight: "auto",
          background: `linear-gradient(135deg, ${GREEN_DARK}, ${GREEN})`,
          borderRadius: 24,
          padding: "56px 40px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.8px" }}>
          Ready to find your crew?
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", margin: "0 auto 36px", maxWidth: 460 }}>
          Download Spoke, set up your profile, and show up to your first adventure this week.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <AppStoreBadge />
          <PlayStoreBadge />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e5e7eb", padding: "32px 24px" }}>
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <SpokeWordmark />
          <div style={{ display: "flex", gap: 24 }}>
            <a href="/branding-kit/support" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>Support</a>
            <a href="mailto:support@spokecommunity.app" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>Contact</a>
          </div>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>© {new Date().getFullYear()} Spoke · Made for remote adventurers</p>
        </div>
      </footer>
    </div>
  );
}
