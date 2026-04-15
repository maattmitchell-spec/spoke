import React from "react";

const GREEN = "#556B2F";
const DARK = "#1A1E0F";
const EFFECTIVE_DATE = "April 14, 2026";

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

const SECTIONS: Section[] = [
  {
    id: "overview",
    title: "Overview",
    content: (
      <>
        <P>
          Spoke ("we", "us", or "our") is a mobile application that helps remote workers discover and
          join curated outdoor adventures — rides, runs, hikes, and meetups — in their local area.
        </P>
        <P>
          We built Spoke with privacy as a foundation. The short version: <Strong>we do not operate
          a backend server, we do not collect your personal data for any commercial purpose, and
          virtually all of your app data lives exclusively on your own device.</Strong>
        </P>
        <P>
          This policy explains in plain language what information is involved when you use Spoke,
          where it lives, and your rights regarding it.
        </P>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: (
      <>
        <SubHeading>1. Account Information (via Clerk)</SubHeading>
        <P>
          When you sign up or sign in, authentication is handled entirely by{" "}
          <A href="https://clerk.com">Clerk</A>, a third-party identity provider. Depending on your
          sign-in method, Clerk may collect and store:
        </P>
        <BulletList items={[
          "Your email address",
          "Your full name",
          "A profile photo URL (when signing in with Google or Apple)",
          "An OAuth access token (when signing in with Google or Apple)",
        ]} />
        <P>
          Spoke does not have direct access to your password. If you sign in with email and
          password, your credentials are stored and managed solely by Clerk. Please review{" "}
          <A href="https://clerk.com/privacy">Clerk's Privacy Policy</A> for details on how they
          handle authentication data.
        </P>

        <SubHeading>2. Profile and App Data (on-device only)</SubHeading>
        <P>
          Any additional information you add inside the app — your display name, city, profile bio,
          avatar image, header image, and your event activity history — is stored exclusively in
          your device's local storage (AsyncStorage). <Strong>This data is never transmitted to or
          stored on a Spoke server.</Strong>
        </P>

        <SubHeading>3. Location</SubHeading>
        <P>
          Spoke asks you to enter your city as a text label on your profile. We do not request
          access to your device's GPS or precise location at any time. No location data is
          collected, transmitted, or stored by Spoke.
        </P>

        <SubHeading>4. Device Information</SubHeading>
        <P>
          We do not collect device identifiers, advertising IDs, IP addresses, or any device
          telemetry.
        </P>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    content: (
      <>
        <P>The limited information involved in running Spoke is used solely to:</P>
        <BulletList items={[
          "Authenticate you and maintain your session (handled by Clerk)",
          "Display your name and city on your profile within the app",
          "Associate you with events you have joined or created",
          "Allow you to personalise your profile with a bio, avatar, and header image",
        ]} />
        <P>
          We do not use your information for advertising, profiling, analytics, or any commercial
          purpose beyond operating the app for you.
        </P>
      </>
    ),
  },
  {
    id: "data-storage",
    title: "Data Storage and Security",
    content: (
      <>
        <P>
          <Strong>On-device data:</Strong> Your profile details, preferences, and activity history
          are stored in your device's local AsyncStorage. This data does not leave your device and
          is removed when you uninstall the app.
        </P>
        <P>
          <Strong>Authentication data:</Strong> Your account credentials and identity information
          are stored on Clerk's infrastructure, which is SOC 2 Type II certified and employs
          industry-standard encryption in transit (TLS) and at rest.
        </P>
        <P>
          <Strong>Spoke infrastructure:</Strong> Spoke does not operate its own servers or
          databases. There is no Spoke backend that stores your data.
        </P>
      </>
    ),
  },
  {
    id: "third-party",
    title: "Third-Party Services",
    content: (
      <>
        <P>Spoke integrates with the following third-party services:</P>
        <TableSection rows={[
          { service: "Clerk", purpose: "User authentication and identity management", link: "https://clerk.com/privacy" },
          { service: "Apple Sign In", purpose: "Optional OAuth sign-in on iOS", link: "https://www.apple.com/legal/privacy/" },
          { service: "Google Sign In", purpose: "Optional OAuth sign-in on all platforms", link: "https://policies.google.com/privacy" },
        ]} />
        <P>
          We do not share your information with any other third parties, including advertisers,
          data brokers, or analytics platforms.
        </P>
      </>
    ),
  },
  {
    id: "children",
    title: "Children's Privacy",
    content: (
      <>
        <P>
          Spoke is not directed at children under the age of 13 (or 16 in the European Economic
          Area). We do not knowingly collect personal information from children. If you believe a
          child has provided us with personal information, please contact us at the address below
          and we will take steps to delete it promptly.
        </P>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your Rights and Choices",
    content: (
      <>
        <P>You have full control over your information:</P>
        <BulletList items={[
          "Edit your display name and location at any time via Settings → Account → Edit profile",
          "Delete your profile bio, avatar, or header image at any time from your Profile tab",
          "Sign out of the app to end your authenticated session",
          "Uninstall the app to immediately and permanently remove all locally stored data from your device",
          "Request deletion of your Clerk account (which removes your authentication identity) by contacting us at support@spokecommunity.app",
        ]} />
        <P>
          If you are located in the European Economic Area, United Kingdom, or California, you may
          have additional rights including the right to access, correct, or delete personal data
          held about you. Please contact us to exercise any such rights.
        </P>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: (
      <>
        <P>
          On-device data is retained until you uninstall the app. Clerk retains your authentication
          account until you request deletion. Upon receiving a deletion request, we will instruct
          Clerk to delete your account within 30 days.
        </P>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: (
      <>
        <P>
          We may update this Privacy Policy from time to time. When we do, we will revise the
          "Effective Date" at the top of this page. For significant changes, we will provide
          in-app notice. Your continued use of Spoke after any update constitutes your acceptance
          of the revised policy.
        </P>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    content: (
      <>
        <P>
          If you have questions, concerns, or requests regarding this Privacy Policy or the
          handling of your personal information, please contact us at:
        </P>
        <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "20px 24px", marginTop: 8 }}>
          <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: DARK }}>Spoke</p>
          <a href="mailto:support@spokecommunity.app" style={{ fontSize: 14, color: GREEN, textDecoration: "none" }}>
            support@spokecommunity.app
          </a>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: "#6b7280" }}>We aim to respond within 2 business days.</p>
        </div>
      </>
    ),
  },
];

// ── Small helper components ──────────────────────────────────────
function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75, margin: "0 0 14px" }}>{children}</p>;
}
function Strong({ children }: { children: React.ReactNode }) {
  return <strong style={{ fontWeight: 600, color: DARK }}>{children}</strong>;
}
function A({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: GREEN, textDecoration: "underline" }}>{children}</a>;
}
function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, margin: "20px 0 8px", letterSpacing: "-0.2px" }}>{children}</h3>;
}
function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "0 0 14px", paddingLeft: 20 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 4 }}>{item}</li>
      ))}
    </ul>
  );
}
function TableSection({ rows }: { rows: { service: string; purpose: string; link: string }[] }) {
  return (
    <div style={{ overflowX: "auto", marginBottom: 14 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: DARK, borderBottom: "1px solid #e5e7eb" }}>Service</th>
            <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: DARK, borderBottom: "1px solid #e5e7eb" }}>Purpose</th>
            <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: DARK, borderBottom: "1px solid #e5e7eb" }}>Privacy Policy</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
              <td style={{ padding: "10px 14px", color: DARK, fontWeight: 500, borderBottom: "1px solid #e5e7eb" }}>{row.service}</td>
              <td style={{ padding: "10px 14px", color: "#4b5563", borderBottom: "1px solid #e5e7eb" }}>{row.purpose}</td>
              <td style={{ padding: "10px 14px", borderBottom: "1px solid #e5e7eb" }}>
                <a href={row.link} target="_blank" rel="noopener noreferrer" style={{ color: GREEN, textDecoration: "underline", fontSize: 13 }}>View ↗</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────
export default function PrivacyPolicy() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: "100vh", backgroundColor: "#f9fafb" }}>

      {/* Header */}
      <header style={{ backgroundColor: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", height: 64, display: "flex", alignItems: "center", gap: 10 }}>
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
          <span style={{
            marginLeft: 8, fontSize: 12, fontWeight: 600, color: GREEN,
            backgroundColor: "#f0fdf4", border: `1px solid ${GREEN}33`, borderRadius: 20, padding: "2px 10px",
          }}>
            Privacy Policy
          </span>
        </div>
      </header>

      {/* Hero */}
      <section style={{ backgroundColor: DARK, padding: "48px 24px 52px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 52, height: 52, borderRadius: 14,
            backgroundColor: GREEN + "22", border: `1px solid ${GREEN}44`, marginBottom: 20,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.8px" }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 14, color: "#9ca3af", margin: 0 }}>
            Effective date: {EFFECTIVE_DATE}
          </p>
        </div>
      </section>

      {/* Body */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px", display: "flex", gap: 40, alignItems: "flex-start" }}>

        {/* Table of contents — desktop sidebar */}
        <nav style={{
          width: 220, flexShrink: 0, position: "sticky", top: 24,
          display: "none", // hidden on small screens; shown via inline override below
        }}
          className="toc"
        >
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: GREEN, margin: "0 0 12px" }}>
            Contents
          </p>
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{
                display: "block", fontSize: 13, color: "#4b5563", textDecoration: "none",
                padding: "5px 0", borderLeft: "2px solid #e5e7eb", paddingLeft: 12, marginBottom: 2,
              }}
            >
              {s.title}
            </a>
          ))}
        </nav>

        {/* Sections */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {SECTIONS.map((section, i) => (
            <section
              key={section.id}
              id={section.id}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                padding: "28px 32px",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  backgroundColor: "#f0fdf4", border: `1px solid ${GREEN}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, color: GREEN, flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: DARK, margin: 0, letterSpacing: "-0.3px" }}>
                  {section.title}
                </h2>
              </div>
              {section.content}
            </section>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e5e7eb", padding: "24px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
          © {new Date().getFullYear()} Spoke · <a href="/branding-kit/support" style={{ color: "#9ca3af" }}>Support</a> · Effective {EFFECTIVE_DATE}
        </p>
      </footer>
    </div>
  );
}
