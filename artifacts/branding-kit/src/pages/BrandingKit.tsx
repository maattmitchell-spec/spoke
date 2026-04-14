import { useEffect, useRef, useState } from "react";

const GREEN = "#1A9E4F";
const GREEN_DARK = "#0F6832";
const GREEN_LIGHT = "#2EBD6A";
const WHITE = "#FFFFFF";
const OFF_WHITE = "#F5FAF7";
const DARK = "#0A1F12";

// Build the hub-and-spoke SVG string in a given color
function hubSpokeSvg(color: string, size = 100) {
  const hx = 50, hy = 50, hubR = 13, nodeR = 8, spokeLen = 34, sw = 6;
  const satellites = Array.from({ length: 6 }, (_, i) => {
    const rad = (i * 60 * Math.PI) / 180;
    return { cx: hx + spokeLen * Math.cos(rad), cy: hy - spokeLen * Math.sin(rad) };
  });
  const lines = satellites
    .map(
      (s) =>
        `<line x1="${hx}" y1="${hy}" x2="${s.cx.toFixed(2)}" y2="${s.cy.toFixed(2)}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`
    )
    .join("");
  const circles = satellites
    .map((s) => `<circle cx="${s.cx.toFixed(2)}" cy="${s.cy.toFixed(2)}" r="${nodeR}" fill="${color}"/>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">${lines}<circle cx="${hx}" cy="${hy}" r="${hubR}" fill="${color}"/>${circles}</svg>`;
}

function svgToImage(svgStr: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = reject;
    img.src = url;
  });
}

function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const a = document.createElement("a");
  a.download = filename;
  a.href = canvas.toDataURL("image/png");
  a.click();
}

type Asset = {
  id: string;
  label: string;
  platform: string;
  dimensions: string;
  w: number;
  h: number;
  draw: (ctx: CanvasRenderingContext2D, logo: HTMLImageElement, logoWhite: HTMLImageElement) => void;
};

const ASSETS: Asset[] = [
  // ── Icon Mark ─────────────────────────────────────────────────────────────
  {
    id: "icon-green",
    label: "Icon — Green BG",
    platform: "Icon Mark",
    dimensions: "800 × 800",
    w: 800, h: 800,
    draw(ctx, _, logoWhite) {
      ctx.fillStyle = GREEN;
      ctx.fillRect(0, 0, 800, 800);
      // logo centered with generous padding (160px margin = 480px logo area)
      ctx.drawImage(logoWhite, 160, 160, 480, 480);
    },
  },
  {
    id: "icon-white",
    label: "Icon — White BG",
    platform: "Icon Mark",
    dimensions: "800 × 800",
    w: 800, h: 800,
    draw(ctx, logoGreen) {
      ctx.fillStyle = WHITE;
      ctx.fillRect(0, 0, 800, 800);
      ctx.drawImage(logoGreen, 160, 160, 480, 480);
    },
  },
  // ── LinkedIn ──────────────────────────────────────────────────────────────
  {
    id: "li-profile",
    label: "Profile Photo",
    platform: "LinkedIn",
    dimensions: "400 × 400",
    w: 400, h: 400,
    draw(ctx, _, logoWhite) {
      ctx.fillStyle = GREEN;
      ctx.fillRect(0, 0, 400, 400);
      // logo centered, 200px
      ctx.drawImage(logoWhite, 90, 60, 220, 220);
      ctx.fillStyle = WHITE;
      ctx.font = "bold 52px DM Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("spoke", 200, 330);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "22px DM Sans, sans-serif";
      ctx.fillText("outdoor adventures", 200, 368);
    },
  },
  {
    id: "li-banner",
    label: "Banner / Cover",
    platform: "LinkedIn",
    dimensions: "1584 × 396",
    w: 1584, h: 396,
    draw(ctx, _, logoWhite) {
      // Gradient bg (left dark → right light)
      const grad = ctx.createLinearGradient(0, 0, 1584, 396);
      grad.addColorStop(0, GREEN_DARK);
      grad.addColorStop(1, GREEN_LIGHT);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1584, 396);

      // Subtle dot pattern overlay
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      for (let x = 0; x < 1584; x += 48) {
        for (let y = 0; y < 396; y += 48) {
          ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Shift offset — everything moves right by 80px
      const offset = 80;

      // Large logo — left side, vertically centered
      const logoSize = 280;
      const logoX = 80 + offset;
      const logoY = (396 - logoSize) / 2;
      ctx.drawImage(logoWhite, logoX, logoY, logoSize, logoSize);

      // Vertical divider
      const divX = 420 + offset;
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(divX, 56);
      ctx.lineTo(divX, 340);
      ctx.stroke();

      // All text to the right of divider
      const tx = divX + 56;

      // Wordmark
      ctx.fillStyle = WHITE;
      ctx.font = "bold 96px DM Sans, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("spoke", tx, 152);

      // Tagline
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.font = "32px DM Sans, sans-serif";
      ctx.fillText("Curated outdoor adventures for remote workers", tx, 210);

      // Activity type pills in a row
      const acts = ["🚴 Rides", "🏃 Runs", "🏔 Hikes", "☕ Meetups"];
      ctx.font = "bold 26px DM Sans, sans-serif";
      let px = tx;
      acts.forEach((a) => {
        const tw = ctx.measureText(a).width + 32;
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        roundRect(ctx, px, 268, tw, 50, 25);
        ctx.fillStyle = WHITE;
        ctx.textAlign = "center";
        ctx.fillText(a, px + tw / 2, 300);
        ctx.textAlign = "left";
        px += tw + 14;
      });
    },
  },
  {
    id: "li-banner-2",
    label: "Banner — Trail & Crew",
    platform: "LinkedIn",
    dimensions: "1584 × 396",
    w: 1584, h: 396,
    draw(ctx, _, logoWhite) {
      // Deep dark green bg with a lighter right fade
      const grad = ctx.createLinearGradient(0, 0, 1584, 0);
      grad.addColorStop(0, "#071810");
      grad.addColorStop(0.55, GREEN_DARK);
      grad.addColorStop(1, GREEN);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1584, 396);

      // Subtle concentric-arc texture on the right
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 60;
      for (let r = 200; r <= 700; r += 160) {
        ctx.beginPath();
        ctx.arc(1584, 396, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Small "spoke" wordmark + icon — top-left corner
      ctx.drawImage(logoWhite, 56, 44, 72, 72);
      ctx.fillStyle = WHITE;
      ctx.font = "bold 38px DM Sans, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("spoke", 144, 93);

      // Thin horizontal rule below the logo strip
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(56, 136);
      ctx.lineTo(700, 136);
      ctx.stroke();

      // Hero headline — two lines, large
      ctx.fillStyle = WHITE;
      ctx.font = "bold 88px DM Sans, sans-serif";
      ctx.fillText("Find your trail.", 56, 240);
      ctx.fillText("Find your crew.", 56, 338);

      // Vertical divider
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(1040, 60);
      ctx.lineTo(1040, 336);
      ctx.stroke();

      // Right panel — activity list + tagline
      const rx = 1080;

      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "26px DM Sans, sans-serif";
      ctx.fillText("Adventures for remote workers", rx, 108);

      const acts: [string, string][] = [
        ["🚴", "Rides"],
        ["🏃", "Runs"],
        ["🏔", "Hikes"],
        ["☕", "Meetups"],
      ];
      ctx.font = "bold 30px DM Sans, sans-serif";
      acts.forEach(([icon, label], i) => {
        const y = 168 + i * 56;
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        roundRect(ctx, rx, y, 400, 46, 10);
        ctx.fillStyle = WHITE;
        ctx.textAlign = "left";
        ctx.fillText(`${icon}  ${label}`, rx + 20, y + 31);
      });
    },
  },
  {
    id: "li-post",
    label: "Post Image",
    platform: "LinkedIn",
    dimensions: "1200 × 627",
    w: 1200, h: 627,
    draw(ctx, logo, _) {
      // White background with green left panel
      ctx.fillStyle = GREEN;
      ctx.fillRect(0, 0, 420, 627);
      ctx.fillStyle = OFF_WHITE;
      ctx.fillRect(420, 0, 780, 627);

      // Logo on green panel
      ctx.drawImage(logo, 90, 80, 240, 240);
      ctx.fillStyle = WHITE;
      ctx.font = "bold 56px DM Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("spoke", 210, 400);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "22px DM Sans, sans-serif";
      ctx.fillText("adventure awaits", 210, 440);

      // Right panel content
      ctx.fillStyle = DARK;
      ctx.font = "bold 52px DM Sans, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("Find your crew.", 470, 170);
      ctx.fillText("Find your trail.", 470, 234);

      ctx.fillStyle = "#4A5568";
      ctx.font = "26px DM Sans, sans-serif";
      const subtext = "Connect with remote workers who share\nyour passion for the outdoors.";
      subtext.split("\n").forEach((line, i) => ctx.fillText(line, 470, 310 + i * 40));

      // Pill tags
      const tags = ["Rides", "Runs", "Hikes", "Meetups"];
      let tx = 470;
      ctx.font = "bold 20px DM Sans, sans-serif";
      tags.forEach((t) => {
        const w = ctx.measureText(t).width + 36;
        ctx.fillStyle = GREEN + "22";
        roundRect(ctx, tx, 430, w, 38, 19);
        ctx.fillStyle = GREEN_DARK;
        ctx.textAlign = "center";
        ctx.fillText(t, tx + w / 2, 454);
        ctx.textAlign = "left";
        tx += w + 12;
      });
    },
  },

  // ── Instagram ─────────────────────────────────────────────────────────────
  {
    id: "ig-profile",
    label: "Profile Photo",
    platform: "Instagram",
    dimensions: "1000 × 1000",
    w: 1000, h: 1000,
    draw(ctx, _, logoWhite) {
      ctx.fillStyle = GREEN;
      ctx.fillRect(0, 0, 1000, 1000);
      ctx.drawImage(logoWhite, 220, 140, 560, 560);
      ctx.fillStyle = WHITE;
      ctx.font = "bold 130px DM Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("spoke", 500, 840);
    },
  },
  {
    id: "ig-feed",
    label: "Feed Post",
    platform: "Instagram",
    dimensions: "1080 × 1080",
    w: 1080, h: 1080,
    draw(ctx, _, logoWhite) {
      const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
      grad.addColorStop(0, GREEN_DARK);
      grad.addColorStop(0.6, GREEN);
      grad.addColorStop(1, GREEN_LIGHT);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1080);

      // Decorative circles
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 80;
      ctx.beginPath(); ctx.arc(1080, 0, 480, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 1080, 320, 0, Math.PI * 2); ctx.stroke();

      // Logo
      ctx.drawImage(logoWhite, 350, 140, 380, 380);

      // Wordmark
      ctx.fillStyle = WHITE;
      ctx.font = "bold 110px DM Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("spoke", 540, 640);

      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "38px DM Sans, sans-serif";
      ctx.fillText("outdoor adventures for remote workers", 540, 705);

      // Activity pill row
      const acts = ["🚴 Ride", "🏃 Run", "🏔 Hike", "☕ Meet"];
      const totalW = acts.reduce((acc, a) => acc + ctx.measureText(a).width + 56, 0) + 24 * (acts.length - 1);
      let px = (1080 - totalW) / 2;
      ctx.font = "bold 34px DM Sans, sans-serif";
      acts.forEach((a) => {
        const w = ctx.measureText(a).width + 56;
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        roundRect(ctx, px, 800, w, 60, 30);
        ctx.fillStyle = WHITE;
        ctx.textAlign = "center";
        ctx.fillText(a, px + w / 2, 840);
        px += w + 24;
      });
    },
  },
  {
    id: "ig-story",
    label: "Story",
    platform: "Instagram",
    dimensions: "1080 × 1920",
    w: 1080, h: 1920,
    draw(ctx, _, logoWhite) {
      const grad = ctx.createLinearGradient(0, 0, 0, 1920);
      grad.addColorStop(0, GREEN_DARK);
      grad.addColorStop(0.5, GREEN);
      grad.addColorStop(1, GREEN_LIGHT);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);

      // Decorative circles
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = 120;
      ctx.beginPath(); ctx.arc(1080, 400, 600, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 1600, 500, 0, Math.PI * 2); ctx.stroke();

      // Logo
      ctx.drawImage(logoWhite, 240, 380, 600, 600);

      // Wordmark
      ctx.fillStyle = WHITE;
      ctx.font = "bold 160px DM Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("spoke", 540, 1120);

      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.font = "52px DM Sans, sans-serif";
      ctx.fillText("outdoor adventures", 540, 1210);
      ctx.fillText("for remote workers", 540, 1280);

      // CTA box
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      roundRect(ctx, 160, 1460, 760, 120, 60);
      ctx.fillStyle = WHITE;
      ctx.font = "bold 52px DM Sans, sans-serif";
      ctx.fillText("Join your crew →", 540, 1537);

      // Bottom tagline
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "36px DM Sans, sans-serif";
      ctx.fillText("linktr.ee/spoke", 540, 1820);
    },
  },
];

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

type AssetState = {
  dataUrl: string | null;
  generating: boolean;
};

export default function BrandingKit() {
  const [assets, setAssets] = useState<Record<string, AssetState>>(() =>
    Object.fromEntries(ASSETS.map((a) => [a.id, { dataUrl: null, generating: false }]))
  );
  const logoRef = useRef<HTMLImageElement | null>(null);
  const logoWhiteRef = useRef<HTMLImageElement | null>(null);

  // Ensure every asset in ASSETS has a state entry (guards against HMR additions)
  useEffect(() => {
    setAssets((prev) => {
      const next = { ...prev };
      let changed = false;
      ASSETS.forEach((a) => {
        if (!next[a.id]) {
          next[a.id] = { dataUrl: null, generating: false };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, []);

  useEffect(() => {
    // Pre-load both logo variants then generate all assets
    Promise.all([
      svgToImage(hubSpokeSvg(GREEN, 100)),
      svgToImage(hubSpokeSvg(WHITE, 100)),
    ]).then(([green, white]) => {
      logoRef.current = green;
      logoWhiteRef.current = white;
      generateAll(green, white);
    });
  }, []);

  function generateAll(green: HTMLImageElement, white: HTMLImageElement) {
    ASSETS.forEach((asset) => generateAsset(asset, green, white));
  }

  function generateAsset(
    asset: Asset,
    greenLogo = logoRef.current,
    whiteLogo = logoWhiteRef.current
  ) {
    if (!greenLogo || !whiteLogo) return;
    setAssets((prev) => ({
      ...prev,
      [asset.id]: { ...prev[asset.id], generating: true },
    }));
    const canvas = document.createElement("canvas");
    canvas.width = asset.w;
    canvas.height = asset.h;
    const ctx = canvas.getContext("2d")!;
    asset.draw(ctx, greenLogo, whiteLogo);
    const dataUrl = canvas.toDataURL("image/png");
    setAssets((prev) => ({
      ...prev,
      [asset.id]: { dataUrl, generating: false },
    }));
  }

  function handleDownload(asset: Asset) {
    const state = assets[asset.id] ?? { dataUrl: null, generating: false };
    if (!state.dataUrl) return;
    const a = document.createElement("a");
    a.download = `spoke-${asset.id}-${asset.w}x${asset.h}.png`;
    a.href = state.dataUrl;
    a.click();
  }

  function handleDownloadAll() {
    ASSETS.forEach((asset) => handleDownload(asset));
  }

  const platforms = ["Icon Mark", "LinkedIn", "Instagram"] as const;

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#F5F8F6",
        minHeight: "100vh",
        color: "#0A1F12",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: GREEN,
          padding: "40px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="44" height="44" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 6 }, (_, i) => {
              const rad = (i * 60 * Math.PI) / 180;
              const cx = 50 + 34 * Math.cos(rad);
              const cy = 50 - 34 * Math.sin(rad);
              return (
                <g key={i}>
                  <line x1="50" y1="50" x2={cx} y2={cy} stroke="white" strokeWidth="6" strokeLinecap="round" />
                  <circle cx={cx} cy={cy} r="8" fill="white" />
                </g>
              );
            })}
            <circle cx="50" cy="50" r="13" fill="white" />
          </svg>
          <div>
            <div style={{ color: WHITE, fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>
              spoke
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Brand Kit</div>
          </div>
        </div>

        <button
          onClick={handleDownloadAll}
          style={{
            background: WHITE,
            color: GREEN_DARK,
            border: "none",
            borderRadius: 12,
            padding: "14px 28px",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "inherit",
          }}
        >
          ↓ Download All ({ASSETS.length} assets)
        </button>
      </div>

      {/* Brand tokens strip */}
      <div
        style={{
          background: WHITE,
          borderBottom: "1px solid #E2EDE7",
          padding: "20px 48px",
          display: "flex",
          alignItems: "center",
          gap: 40,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#6B8F77", fontWeight: 500 }}>Colors</span>
          {[
            { c: GREEN, label: "#1A9E4F" },
            { c: GREEN_DARK, label: "#0F6832" },
            { c: GREEN_LIGHT, label: "#2EBD6A" },
            { c: WHITE, label: "#FFFFFF", border: true },
            { c: DARK, label: "#0A1F12" },
          ].map((sw) => (
            <div key={sw.c} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: sw.c,
                  border: sw.border ? "1px solid #E2EDE7" : "none",
                }}
              />
              <span style={{ fontSize: 12, color: "#4A6659", fontFamily: "monospace" }}>
                {sw.label}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#6B8F77", fontWeight: 500 }}>Font</span>
          <span style={{ fontSize: 14, color: "#0A1F12", fontWeight: 600 }}>DM Sans</span>
        </div>
      </div>

      {/* Asset grids by platform */}
      <div style={{ padding: "40px 48px", maxWidth: 1400, margin: "0 auto" }}>
        {platforms.map((platform) => {
          const platformAssets = ASSETS.filter((a) => a.platform === platform);
          return (
            <div key={platform} style={{ marginBottom: 56 }}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0A1F12",
                  marginBottom: 24,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    background: GREEN + "18",
                    color: GREEN_DARK,
                    padding: "3px 12px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: 0.3,
                  }}
                >
                  {platform}
                </span>
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 20,
                }}
              >
                {platformAssets.map((asset) => {
                  const state = assets[asset.id] ?? { dataUrl: null, generating: false };
                  const aspect = (asset.h / asset.w) * 100;
                  const cappedAspect = Math.min(aspect, 70);

                  return (
                    <div
                      key={asset.id}
                      style={{
                        background: WHITE,
                        borderRadius: 16,
                        border: "1px solid #E2EDE7",
                        overflow: "hidden",
                      }}
                    >
                      {/* Preview */}
                      <div
                        style={{
                          position: "relative",
                          paddingTop: `${cappedAspect}%`,
                          background: "#EBF5EF",
                          overflow: "hidden",
                        }}
                      >
                        {state.dataUrl ? (
                          <img
                            src={state.dataUrl}
                            alt={asset.label}
                            style={{
                              position: "absolute",
                              inset: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#9CBFAA",
                              fontSize: 13,
                            }}
                          >
                            Generating…
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div
                        style={{
                          padding: "14px 16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#0A1F12" }}>
                            {asset.label}
                          </div>
                          <div style={{ fontSize: 12, color: "#6B8F77", marginTop: 2 }}>
                            {asset.dimensions}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(asset)}
                          disabled={!state.dataUrl}
                          style={{
                            background: state.dataUrl ? GREEN : "#D0E7D8",
                            color: WHITE,
                            border: "none",
                            borderRadius: 10,
                            padding: "8px 16px",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: state.dataUrl ? "pointer" : "not-allowed",
                            fontFamily: "inherit",
                            transition: "background 0.15s",
                          }}
                        >
                          ↓ PNG
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
