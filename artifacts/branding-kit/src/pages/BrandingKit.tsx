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
      // logo centered with 80px margin = 640px logo area
      ctx.drawImage(logoWhite, 80, 80, 640, 640);
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
      ctx.drawImage(logoGreen, 80, 80, 640, 640);
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

      // Section boundaries
      const div1X = 570;
      const div2X = 1200;

      // Logo — centred on the divider line, vertically centred
      const logoSize = 210;
      const logoX = div1X - logoSize - 16;
      const logoY = (396 - logoSize) / 2;
      ctx.drawImage(logoWhite, logoX, logoY, logoSize, logoSize);

      // Divider 1
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(div1X, 72);
      ctx.lineTo(div1X, 324);
      ctx.stroke();

      // Centre section: wordmark + tagline (left-aligned, vertically centred)
      const tx = div1X + 52;
      ctx.fillStyle = WHITE;
      ctx.font = "bold 78px DM Sans, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("spoke", tx, 182);

      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.font = "26px DM Sans, sans-serif";
      ctx.fillText("Curated outdoor adventures", tx, 238);
      ctx.fillText("for remote workers", tx, 272);

      // Divider 2
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(div2X, 72);
      ctx.lineTo(div2X, 324);
      ctx.stroke();

      // Right column: activity types stacked vertically, centred
      const acts: [string, string][] = [
        ["🚴", "Rides"],
        ["🏃", "Runs"],
        ["🏔", "Hikes"],
        ["☕", "Meetups"],
      ];
      const pillH = 44, pillGap = 56, pillW = 210;
      const pillBlockH = (acts.length - 1) * pillGap + pillH;
      const pillStartY = (396 - pillBlockH) / 2;
      const rx = div2X + 52;
      ctx.font = "bold 24px DM Sans, sans-serif";
      acts.forEach(([icon, label], i) => {
        const y = pillStartY + i * pillGap;
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        roundRect(ctx, rx, y, pillW, pillH, 10);
        ctx.fillStyle = WHITE;
        ctx.textAlign = "left";
        ctx.fillText(`${icon}  ${label}`, rx + 16, y + pillH * 0.68);
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

  // ── App Store (1290 × 2796 · iPhone 6.7") ─────────────────────────────────
  // ── App Previews ───────────────────────────────────────────────────────────
  {
    id: "store-preview-1",
    label: "App Preview 1 — Hero",
    platform: "App Store",
    dimensions: "1290 × 2796",
    w: 1290, h: 2796,
    draw(ctx, _g, logoWhite) {
      const g = ctx.createLinearGradient(0, 0, 0, 2796);
      g.addColorStop(0, "#071a0d"); g.addColorStop(0.45, GREEN_DARK); g.addColorStop(1, GREEN);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1290, 2796);
      // Decorative arcs
      ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 180;
      ctx.beginPath(); ctx.arc(1500, 200, 1100, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(-200, 2700, 900, 0, Math.PI * 2); ctx.stroke();
      // Logo
      ctx.drawImage(logoWhite, 370, 220, 550, 550);
      // Headline
      ctx.textAlign = "center"; ctx.fillStyle = WHITE;
      ctx.font = "bold 172px DM Sans, sans-serif";
      ctx.fillText("Find your", 645, 960);
      ctx.fillStyle = "rgba(255,255,255,0.88)"; ctx.fillText("trail.", 645, 1160);
      ctx.fillStyle = WHITE; ctx.fillText("Find your", 645, 1430);
      ctx.fillStyle = "rgba(255,255,255,0.88)"; ctx.fillText("crew.", 645, 1630);
      // Divider
      ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fillRect(395, 1720, 500, 3);
      // Tagline
      ctx.fillStyle = "rgba(255,255,255,0.52)"; ctx.font = "68px DM Sans, sans-serif";
      ctx.fillText("Outdoor adventures", 645, 1840); ctx.fillText("for remote workers", 645, 1928);
      // Activity pills
      const pills1 = ["Rides", "Runs", "Hikes", "Meetups"];
      pills1.forEach((p, i) => {
        const px = 80 + i * 285; const py = 2080;
        ctx.fillStyle = "rgba(255,255,255,0.11)";
        roundRect(ctx, px, py, 255, 96, 48); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 1.5;
        roundRect(ctx, px, py, 255, 96, 48); ctx.stroke();
        ctx.fillStyle = WHITE; ctx.font = "bold 48px DM Sans, sans-serif";
        ctx.fillText(p, px + 127, py + 62);
      });
      // Bottom mark
      ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.font = "44px DM Sans, sans-serif";
      ctx.fillText("spoke", 645, 2700);
    },
  },
  {
    id: "store-preview-2",
    label: "App Preview 2 — Activities",
    platform: "App Store",
    dimensions: "1290 × 2796",
    w: 1290, h: 2796,
    draw(ctx, _g, logoWhite) {
      ctx.fillStyle = OFF_WHITE; ctx.fillRect(0, 0, 1290, 2796);
      // Green top band
      const g = ctx.createLinearGradient(0, 0, 0, 860);
      g.addColorStop(0, GREEN_DARK); g.addColorStop(1, GREEN);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1290, 860);
      // Logo + wordmark
      ctx.drawImage(logoWhite, 80, 72, 160, 160);
      ctx.fillStyle = WHITE; ctx.font = "bold 88px DM Sans, sans-serif";
      ctx.textAlign = "left"; ctx.fillText("spoke", 270, 188);
      // Headline
      ctx.textAlign = "center"; ctx.fillStyle = WHITE;
      ctx.font = "bold 118px DM Sans, sans-serif";
      ctx.fillText("Four ways to", 645, 470); ctx.fillText("adventure.", 645, 610);
      ctx.fillStyle = "rgba(255,255,255,0.58)"; ctx.font = "60px DM Sans, sans-serif";
      ctx.fillText("Choose your style", 645, 740);
      // Activity cards
      const acts2 = [
        { label: "Rides", color: GREEN, icon: "🚴", desc: "Road, gravel & mountain" },
        { label: "Runs", color: "#0284C7", icon: "🏃", desc: "Trails, roads & track" },
        { label: "Hikes", color: "#D97706", icon: "🥾", desc: "Day hikes & backpacking" },
        { label: "Meetups", color: "#7C3AED", icon: "🤝", desc: "Social & coworking" },
      ];
      acts2.forEach(({ label, color, icon, desc }, i) => {
        const cy = 940 + i * 430;
        ctx.fillStyle = WHITE; roundRect(ctx, 80, cy, 1130, 390, 32); ctx.fill();
        ctx.fillStyle = color; roundRect(ctx, 80, cy, 22, 390, 11); ctx.fill();
        ctx.fillStyle = color + "1A";
        ctx.beginPath(); ctx.arc(224, cy + 195, 94, 0, Math.PI * 2); ctx.fill();
        ctx.font = "90px sans-serif"; ctx.textAlign = "center"; ctx.fillText(icon, 224, cy + 232);
        ctx.textAlign = "left"; ctx.fillStyle = DARK;
        ctx.font = "bold 84px DM Sans, sans-serif"; ctx.fillText(label, 368, cy + 164);
        ctx.fillStyle = "#6B7D72"; ctx.font = "52px DM Sans, sans-serif"; ctx.fillText(desc, 368, cy + 262);
      });
      ctx.textAlign = "center"; ctx.fillStyle = "#9DB5A3"; ctx.font = "40px DM Sans, sans-serif";
      ctx.fillText("spoke — outdoor adventures for remote workers", 645, 2730);
    },
  },
  {
    id: "store-preview-3",
    label: "App Preview 3 — Community",
    platform: "App Store",
    dimensions: "1290 × 2796",
    w: 1290, h: 2796,
    draw(ctx, _g, logoWhite) {
      ctx.fillStyle = "#0A1F12"; ctx.fillRect(0, 0, 1290, 2796);
      // Concentric arcs
      for (let i = 1; i <= 5; i++) {
        ctx.strokeStyle = `rgba(46,189,106,${0.03 + i * 0.015})`; ctx.lineWidth = 70;
        ctx.beginPath(); ctx.arc(645, 2400, i * 360, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.drawImage(logoWhite, 80, 72, 170, 170);
      ctx.textAlign = "center"; ctx.fillStyle = WHITE;
      ctx.font = "bold 148px DM Sans, sans-serif"; ctx.fillText("Your crew", 645, 440);
      ctx.fillStyle = GREEN_LIGHT; ctx.fillText("is waiting.", 645, 612);
      ctx.fillStyle = "rgba(255,255,255,0.48)"; ctx.font = "64px DM Sans, sans-serif";
      ctx.fillText("Connect with remote workers", 645, 760); ctx.fillText("who love the outdoors", 645, 848);
      const members = [
        { name: "Alex Chen", tag: "Cyclist · SF", initials: "AC", color: GREEN },
        { name: "Maya Ross", tag: "Trail runner · Austin", initials: "MR", color: "#0284C7" },
        { name: "Sam Park", tag: "Hiker · Denver", initials: "SP", color: "#D97706" },
        { name: "Jordan Lee", tag: "Cyclist · NYC", initials: "JL", color: "#7C3AED" },
        { name: "Taylor Kim", tag: "Hiker · Portland", initials: "TK", color: "#059669" },
      ];
      members.forEach((m, i) => {
        const cy = 1020 + i * 280;
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        roundRect(ctx, 80, cy, 1130, 244, 24); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.07)"; ctx.lineWidth = 1;
        roundRect(ctx, 80, cy, 1130, 244, 24); ctx.stroke();
        ctx.fillStyle = m.color;
        ctx.beginPath(); ctx.arc(204, cy + 122, 78, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = WHITE; ctx.font = "bold 62px DM Sans, sans-serif";
        ctx.textAlign = "center"; ctx.fillText(m.initials, 204, cy + 142);
        ctx.textAlign = "left"; ctx.fillStyle = WHITE;
        ctx.font = "bold 62px DM Sans, sans-serif"; ctx.fillText(m.name, 332, cy + 106);
        ctx.fillStyle = "rgba(255,255,255,0.46)"; ctx.font = "46px DM Sans, sans-serif"; ctx.fillText(m.tag, 332, cy + 170);
        ctx.fillStyle = GREEN_LIGHT;
        ctx.beginPath(); ctx.arc(1162, cy + 122, 20, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = GREEN; roundRect(ctx, 195, 2480, 900, 140, 70); ctx.fill();
      ctx.fillStyle = WHITE; ctx.font = "bold 68px DM Sans, sans-serif";
      ctx.textAlign = "center"; ctx.fillText("Join your crew →", 645, 2564);
    },
  },

  // ── Screenshots ────────────────────────────────────────────────────────────
  {
    id: "store-screen-1",
    label: "Screenshot 1 — Explore",
    platform: "App Store",
    dimensions: "1290 × 2796",
    w: 1290, h: 2796,
    draw(ctx, _g, logoWhite) {
      ctx.fillStyle = OFF_WHITE; ctx.fillRect(0, 0, 1290, 2796);
      const g = ctx.createLinearGradient(0, 0, 0, 680);
      g.addColorStop(0, GREEN_DARK); g.addColorStop(1, GREEN);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1290, 680);
      ctx.textAlign = "center"; ctx.fillStyle = WHITE;
      ctx.font = "bold 118px DM Sans, sans-serif";
      ctx.fillText("Discover", 645, 196); ctx.fillText("adventures", 645, 332); ctx.fillText("near you", 645, 468);
      ctx.fillStyle = "rgba(255,255,255,0.58)"; ctx.font = "56px DM Sans, sans-serif";
      ctx.fillText("Curated events for remote workers", 645, 580);
      // Search bar
      ctx.fillStyle = WHITE; roundRect(ctx, 80, 730, 1130, 108, 54); ctx.fill();
      ctx.fillStyle = "#B0C4B8"; ctx.font = "50px DM Sans, sans-serif"; ctx.textAlign = "left";
      ctx.fillText("🔍  Search by location or name...", 140, 800);
      // Filter pills
      const filt = ["All", "Rides", "Runs", "Hikes", "Meetups"];
      let fx = 80;
      filt.forEach((f, i) => {
        const fw = f.length * 36 + 64; ctx.fillStyle = i === 0 ? GREEN : WHITE;
        roundRect(ctx, fx, 890, fw, 82, 41); ctx.fill();
        ctx.fillStyle = i === 0 ? WHITE : DARK; ctx.font = "bold 42px DM Sans, sans-serif";
        ctx.textAlign = "center"; ctx.fillText(f, fx + fw / 2, 943); fx += fw + 18;
      });
      // Event cards
      const evs = [
        { title: "Dawn Patrol Gravel Ride", type: "RIDE", col: GREEN, loc: "Marin Headlands, CA", dist: "42 mi", going: "8/12" },
        { title: "Saturday Sunrise Run", type: "RUN", col: "#0284C7", loc: "Presidio, SF", dist: "10 km", going: "14/20" },
        { title: "Muir Woods Trail Hike", type: "HIKE", col: "#D97706", loc: "Mill Valley, CA", dist: "8 mi", going: "6/10" },
      ];
      evs.forEach((e, i) => {
        const cy = 1020 + i * 560;
        ctx.fillStyle = WHITE; roundRect(ctx, 80, cy, 1130, 520, 28); ctx.fill();
        const ig = ctx.createLinearGradient(0, cy, 0, cy + 240);
        ig.addColorStop(0, e.col + "CC"); ig.addColorStop(1, e.col + "55");
        ctx.fillStyle = ig; roundRect(ctx, 80, cy, 1130, 240, 28); ctx.fill();
        ctx.fillStyle = e.col; roundRect(ctx, 114, cy + 186, 148, 50, 8); ctx.fill();
        ctx.fillStyle = WHITE; ctx.font = "bold 32px DM Sans, sans-serif"; ctx.textAlign = "left";
        ctx.fillText(e.type, 134, cy + 222);
        ctx.fillStyle = DARK; ctx.font = "bold 62px DM Sans, sans-serif"; ctx.fillText(e.title, 114, cy + 316);
        ctx.fillStyle = "#6B7D72"; ctx.font = "44px DM Sans, sans-serif"; ctx.fillText("📍 " + e.loc, 114, cy + 376);
        ctx.fillStyle = OFF_WHITE; roundRect(ctx, 114, cy + 420, 180, 66, 10); ctx.fill();
        ctx.fillStyle = DARK; ctx.font = "bold 40px DM Sans, sans-serif";
        ctx.textAlign = "center"; ctx.fillText(e.dist, 204, cy + 462);
        ctx.fillStyle = GREEN; roundRect(ctx, 900, cy + 420, 240, 66, 33); ctx.fill();
        ctx.fillStyle = WHITE; ctx.font = "bold 44px DM Sans, sans-serif"; ctx.fillText("Join", 1020, cy + 462);
      });
    },
  },
  {
    id: "store-screen-2",
    label: "Screenshot 2 — Event Detail",
    platform: "App Store",
    dimensions: "1290 × 2796",
    w: 1290, h: 2796,
    draw(ctx, _g, logoWhite) {
      ctx.fillStyle = OFF_WHITE; ctx.fillRect(0, 0, 1290, 2796);
      const g = ctx.createLinearGradient(0, 0, 0, 680);
      g.addColorStop(0, GREEN_DARK); g.addColorStop(1, GREEN);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1290, 680);
      ctx.textAlign = "center"; ctx.fillStyle = WHITE;
      ctx.font = "bold 118px DM Sans, sans-serif";
      ctx.fillText("Every detail", 645, 220); ctx.fillText("in one view", 645, 360);
      ctx.fillStyle = "rgba(255,255,255,0.58)"; ctx.font = "58px DM Sans, sans-serif";
      ctx.fillText("Tap any event to see everything", 645, 480);
      // Event hero card
      const hg = ctx.createLinearGradient(0, 730, 0, 1020);
      hg.addColorStop(0, GREEN + "CC"); hg.addColorStop(1, GREEN_DARK + "99");
      ctx.fillStyle = hg; roundRect(ctx, 80, 730, 1130, 290, 28); ctx.fill();
      ctx.fillStyle = WHITE; roundRect(ctx, 114, 940, 148, 50, 8); ctx.fill();
      ctx.fillStyle = GREEN; ctx.font = "bold 32px DM Sans, sans-serif"; ctx.textAlign = "left";
      ctx.fillText("RIDE", 130, 975);
      // Title + detail card
      ctx.fillStyle = WHITE; roundRect(ctx, 80, 1030, 1130, 1560, 28); ctx.fill();
      ctx.fillStyle = DARK; ctx.font = "bold 76px DM Sans, sans-serif"; ctx.textAlign = "left";
      ctx.fillText("Dawn Patrol Gravel Ride", 114, 1132);
      ctx.fillStyle = "#6B7D72"; ctx.font = "50px DM Sans, sans-serif";
      ctx.fillText("📅  SAT APR 5 · 6:30 AM", 114, 1212);
      ctx.fillText("📍  Marin Headlands, CA", 114, 1280);
      // Stat pills
      const stats = [["42 mi", "DIST"], ["3,200 ft", "ELEV"], ["Hard", "LEVEL"]];
      stats.forEach(([val, lbl], i) => {
        const sx = 114 + i * 350;
        ctx.fillStyle = OFF_WHITE; roundRect(ctx, sx, 1330, 310, 120, 14); ctx.fill();
        ctx.fillStyle = DARK; ctx.font = "bold 58px DM Sans, sans-serif"; ctx.textAlign = "center";
        ctx.fillText(val, sx + 155, 1404);
        ctx.fillStyle = "#6B7D72"; ctx.font = "38px DM Sans, sans-serif"; ctx.fillText(lbl, sx + 155, 1446);
      });
      // Divider
      ctx.fillStyle = "#E8F0EB"; ctx.fillRect(114, 1490, 1062, 2);
      // Host row
      ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(174, 1580, 60, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = WHITE; ctx.font = "bold 52px DM Sans, sans-serif"; ctx.textAlign = "center";
      ctx.fillText("AC", 174, 1598);
      ctx.textAlign = "left"; ctx.fillStyle = DARK; ctx.font = "bold 54px DM Sans, sans-serif";
      ctx.fillText("Alex Chen", 264, 1568); ctx.fillStyle = "#6B7D72"; ctx.font = "44px DM Sans, sans-serif";
      ctx.fillText("8/12 going · Organiser", 264, 1622);
      ctx.fillStyle = "#E8F0EB"; ctx.fillRect(114, 1676, 1062, 2);
      // About
      ctx.fillStyle = DARK; ctx.font = "bold 54px DM Sans, sans-serif"; ctx.fillText("About", 114, 1762);
      ctx.fillStyle = "#6B7D72"; ctx.font = "46px DM Sans, sans-serif";
      const about = "A fast-paced gravel ride through the Marin Headlands. All levels welcome — bring snacks and layers.";
      const words = about.split(" "); let line = ""; let ay = 1832;
      words.forEach((w) => {
        const test = line + w + " ";
        if (ctx.measureText(test).width > 1062) { ctx.fillText(line, 114, ay); line = w + " "; ay += 64; }
        else line = test;
      }); ctx.fillText(line, 114, ay);
      // Join CTA
      ctx.fillStyle = GREEN; roundRect(ctx, 114, 2450, 1062, 120, 60); ctx.fill();
      ctx.fillStyle = WHITE; ctx.font = "bold 68px DM Sans, sans-serif"; ctx.textAlign = "center";
      ctx.fillText("Join this event", 645, 2524);
    },
  },
  {
    id: "store-screen-3",
    label: "Screenshot 3 — Schedule",
    platform: "App Store",
    dimensions: "1290 × 2796",
    w: 1290, h: 2796,
    draw(ctx, _g, logoWhite) {
      ctx.fillStyle = OFF_WHITE; ctx.fillRect(0, 0, 1290, 2796);
      const g = ctx.createLinearGradient(0, 0, 0, 680);
      g.addColorStop(0, GREEN_DARK); g.addColorStop(1, GREEN);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1290, 680);
      ctx.textAlign = "center"; ctx.fillStyle = WHITE;
      ctx.font = "bold 118px DM Sans, sans-serif";
      ctx.fillText("Never miss", 645, 220); ctx.fillText("an adventure", 645, 360);
      ctx.fillStyle = "rgba(255,255,255,0.58)"; ctx.font = "58px DM Sans, sans-serif";
      ctx.fillText("Your outdoor calendar, always in sync", 645, 480);
      // Section header
      ctx.textAlign = "left"; ctx.fillStyle = "#6B7D72"; ctx.font = "bold 48px DM Sans, sans-serif";
      ctx.fillText("UPCOMING · 4 EVENTS", 114, 768);
      // Schedule rows
      const sched = [
        { title: "Dawn Patrol Gravel Ride", date: "SAT APR 5", time: "6:30 AM", type: "RIDE", col: GREEN },
        { title: "Saturday Sunrise Run", date: "SAT APR 5", time: "7:00 AM", type: "RUN", col: "#0284C7" },
        { title: "Muir Woods Trail Hike", date: "SUN APR 6", time: "9:00 AM", type: "HIKE", col: "#D97706" },
        { title: "Remote Worker Meetup", date: "TUE APR 8", time: "6:00 PM", type: "MEETUP", col: "#7C3AED" },
        { title: "Gravel Group Ride", date: "SAT APR 12", time: "7:30 AM", type: "RIDE", col: GREEN },
        { title: "Half-Marathon Training", date: "SUN APR 13", time: "8:00 AM", type: "RUN", col: "#0284C7" },
      ];
      ctx.fillStyle = WHITE; roundRect(ctx, 80, 800, 1130, sched.length * 240 + 40, 28); ctx.fill();
      sched.forEach((s, i) => {
        const ry = 840 + i * 240;
        if (i > 0) { ctx.fillStyle = "#EEF3F0"; ctx.fillRect(114, ry - 20, 1062, 1); }
        ctx.fillStyle = s.col; ctx.beginPath(); ctx.arc(180, ry + 90, 52, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = WHITE; ctx.font = "bold 30px DM Sans, sans-serif"; ctx.textAlign = "center";
        ctx.fillText(s.type.slice(0, 2), 180, ry + 102);
        ctx.textAlign = "left"; ctx.fillStyle = DARK; ctx.font = "bold 58px DM Sans, sans-serif";
        ctx.fillText(s.title, 270, ry + 74);
        ctx.fillStyle = "#6B7D72"; ctx.font = "44px DM Sans, sans-serif";
        ctx.fillText(s.date + " · " + s.time, 270, ry + 136);
        ctx.fillStyle = "#E8F5ED"; roundRect(ctx, 1020, ry + 60, 130, 56, 10); ctx.fill();
        ctx.fillStyle = GREEN; ctx.font = "bold 34px DM Sans, sans-serif";
        ctx.textAlign = "center"; ctx.fillText("✓", 1085, ry + 96);
      });
    },
  },
  {
    id: "store-screen-4",
    label: "Screenshot 4 — Community",
    platform: "App Store",
    dimensions: "1290 × 2796",
    w: 1290, h: 2796,
    draw(ctx, _g, logoWhite) {
      ctx.fillStyle = OFF_WHITE; ctx.fillRect(0, 0, 1290, 2796);
      const g = ctx.createLinearGradient(0, 0, 0, 680);
      g.addColorStop(0, GREEN_DARK); g.addColorStop(1, GREEN);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1290, 680);
      ctx.textAlign = "center"; ctx.fillStyle = WHITE;
      ctx.font = "bold 118px DM Sans, sans-serif";
      ctx.fillText("Meet your", 645, 220); ctx.fillText("outdoor crew", 645, 360);
      ctx.fillStyle = "rgba(255,255,255,0.58)"; ctx.font = "58px DM Sans, sans-serif";
      ctx.fillText("Remote workers who live for the outdoors", 645, 480);
      // Member cards
      const crew = [
        { name: "Alex Chen", tag: "Cyclist · San Francisco", initials: "AC", color: GREEN, events: "12 events" },
        { name: "Maya Ross", tag: "Trail Runner · Austin", initials: "MR", color: "#0284C7", events: "8 events" },
        { name: "Sam Park", tag: "Hiker · Denver", initials: "SP", color: "#D97706", events: "15 events" },
        { name: "Jordan Lee", tag: "Cyclist · New York", initials: "JL", color: "#7C3AED", events: "6 events" },
        { name: "Taylor Kim", tag: "Hiker · Portland", initials: "TK", color: "#059669", events: "11 events" },
        { name: "Riley Wang", tag: "Runner · Seattle", initials: "RW", color: "#DC2626", events: "9 events" },
      ];
      ctx.fillStyle = WHITE; roundRect(ctx, 80, 740, 1130, crew.length * 230 + 40, 28); ctx.fill();
      crew.forEach((m, i) => {
        const ry = 780 + i * 230;
        if (i > 0) { ctx.fillStyle = "#EEF3F0"; ctx.fillRect(114, ry - 16, 1062, 1); }
        ctx.fillStyle = m.color; ctx.beginPath(); ctx.arc(196, ry + 99, 76, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = WHITE; ctx.font = "bold 62px DM Sans, sans-serif"; ctx.textAlign = "center";
        ctx.fillText(m.initials, 196, ry + 119);
        ctx.textAlign = "left"; ctx.fillStyle = DARK; ctx.font = "bold 60px DM Sans, sans-serif";
        ctx.fillText(m.name, 316, ry + 83);
        ctx.fillStyle = "#6B7D72"; ctx.font = "44px DM Sans, sans-serif"; ctx.fillText(m.tag, 316, ry + 143);
        ctx.fillStyle = "#E8F5ED"; roundRect(ctx, 972, ry + 64, 200, 68, 14); ctx.fill();
        ctx.fillStyle = GREEN; ctx.font = "bold 36px DM Sans, sans-serif";
        ctx.textAlign = "center"; ctx.fillText(m.events, 1072, ry + 105);
      });
    },
  },
  {
    id: "store-screen-5",
    label: "Screenshot 5 — Profile",
    platform: "App Store",
    dimensions: "1290 × 2796",
    w: 1290, h: 2796,
    draw(ctx, _g, logoWhite) {
      ctx.fillStyle = OFF_WHITE; ctx.fillRect(0, 0, 1290, 2796);
      // Green hero bg
      const g = ctx.createLinearGradient(0, 0, 0, 900);
      g.addColorStop(0, GREEN_DARK); g.addColorStop(1, GREEN);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1290, 900);
      // Headline above profile
      ctx.textAlign = "center"; ctx.fillStyle = WHITE;
      ctx.font = "bold 118px DM Sans, sans-serif";
      ctx.fillText("Track your", 645, 180); ctx.fillText("adventure journey", 645, 316);
      ctx.fillStyle = "rgba(255,255,255,0.58)"; ctx.font = "58px DM Sans, sans-serif";
      ctx.fillText("Every mile. Every summit. Every ride.", 645, 436);
      // Avatar
      ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.beginPath(); ctx.arc(645, 700, 110, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = WHITE; ctx.font = "bold 96px DM Sans, sans-serif"; ctx.fillText("AC", 645, 734);
      ctx.fillStyle = WHITE; ctx.font = "bold 72px DM Sans, sans-serif"; ctx.fillText("Alex Chen", 645, 844);
      // Stats bar
      ctx.fillStyle = WHITE; roundRect(ctx, 80, 940, 1130, 200, 28); ctx.fill();
      const stats2 = [["12", "Rides"], ["418", "Miles"], ["34k ft", "Elevation"], ["8", "Events"]];
      stats2.forEach(([val, lbl], i) => {
        const sx = 164 + i * 264;
        if (i > 0) { ctx.fillStyle = "#EEF3F0"; ctx.fillRect(sx - 20, 970, 1, 140); }
        ctx.fillStyle = DARK; ctx.font = "bold 68px DM Sans, sans-serif"; ctx.textAlign = "center";
        ctx.fillText(val, sx + 90, 1050);
        ctx.fillStyle = "#6B7D72"; ctx.font = "36px DM Sans, sans-serif"; ctx.fillText(lbl.toUpperCase(), sx + 90, 1100);
      });
      // Badges section
      ctx.textAlign = "left"; ctx.fillStyle = "#6B7D72"; ctx.font = "bold 48px DM Sans, sans-serif";
      ctx.fillText("BADGES", 114, 1232);
      ctx.fillStyle = WHITE; roundRect(ctx, 80, 1250, 1130, 190, 28); ctx.fill();
      const badges = ["Early Adopter", "First Ride", "New Member", "Community"];
      badges.forEach((b, i) => {
        const bx = 114 + i * 276;
        ctx.fillStyle = OFF_WHITE; roundRect(ctx, bx, 1278, 252, 132, 16); ctx.fill();
        ctx.fillStyle = GREEN; ctx.font = "32px DM Sans, sans-serif"; ctx.textAlign = "center";
        ctx.fillText("🏅", bx + 126, 1332);
        ctx.fillStyle = DARK; ctx.font = "bold 30px DM Sans, sans-serif"; ctx.fillText(b, bx + 126, 1376);
      });
      // Recent activity
      ctx.textAlign = "left"; ctx.fillStyle = "#6B7D72"; ctx.font = "bold 48px DM Sans, sans-serif";
      ctx.fillText("RECENT ACTIVITY", 114, 1544);
      ctx.fillStyle = WHITE; roundRect(ctx, 80, 1562, 1130, 800, 28); ctx.fill();
      const recents = [
        { title: "Dawn Patrol Gravel Ride", type: "RIDE", col: GREEN, date: "SAT APR 5" },
        { title: "Saturday Sunrise Run", type: "RUN", col: "#0284C7", date: "FRI APR 4" },
        { title: "Muir Woods Hike", type: "HIKE", col: "#D97706", date: "SUN MAR 30" },
      ];
      recents.forEach((r, i) => {
        const ry = 1600 + i * 244;
        if (i > 0) { ctx.fillStyle = "#EEF3F0"; ctx.fillRect(114, ry - 16, 1062, 1); }
        ctx.fillStyle = r.col + "22"; roundRect(ctx, 134, ry + 16, 100, 100, 14); ctx.fill();
        ctx.fillStyle = r.col; ctx.font = "bold 36px DM Sans, sans-serif";
        ctx.textAlign = "center"; ctx.fillText(r.type.slice(0,2), 184, ry + 72);
        ctx.textAlign = "left"; ctx.fillStyle = DARK; ctx.font = "bold 56px DM Sans, sans-serif";
        ctx.fillText(r.title, 260, ry + 66);
        ctx.fillStyle = "#6B7D72"; ctx.font = "42px DM Sans, sans-serif"; ctx.fillText(r.date, 260, ry + 124);
        ctx.fillStyle = "#E8F5ED"; roundRect(ctx, 1010, ry + 40, 148, 56, 28); ctx.fill();
        ctx.fillStyle = GREEN; ctx.font = "bold 36px DM Sans, sans-serif"; ctx.textAlign = "center";
        ctx.fillText("Going", 1084, ry + 76);
      });
    },
  },
  {
    id: "store-screen-6",
    label: "Screenshot 6 — Sign Up",
    platform: "App Store",
    dimensions: "1290 × 2796",
    w: 1290, h: 2796,
    draw(ctx, logoGreen, logoWhite) {
      ctx.fillStyle = OFF_WHITE; ctx.fillRect(0, 0, 1290, 2796);
      const g = ctx.createLinearGradient(0, 0, 0, 680);
      g.addColorStop(0, GREEN_DARK); g.addColorStop(1, GREEN);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1290, 680);
      ctx.textAlign = "center"; ctx.fillStyle = WHITE;
      ctx.font = "bold 118px DM Sans, sans-serif";
      ctx.fillText("Get started", 645, 220); ctx.fillText("in seconds", 645, 360);
      ctx.fillStyle = "rgba(255,255,255,0.58)"; ctx.font = "58px DM Sans, sans-serif";
      ctx.fillText("Multiple ways to join the community", 645, 480);
      // Auth card
      ctx.fillStyle = WHITE; roundRect(ctx, 80, 730, 1130, 1700, 28); ctx.fill();
      // Logo in card
      ctx.drawImage(logoGreen, 501, 780, 120, 120); ctx.textAlign = "left";
      ctx.fillStyle = DARK; ctx.font = "bold 68px DM Sans, sans-serif"; ctx.fillText("spoke", 645, 848);
      ctx.fillStyle = DARK; ctx.font = "bold 86px DM Sans, sans-serif"; ctx.textAlign = "center";
      ctx.fillText("Join spoke", 645, 1020);
      ctx.fillStyle = "#6B7D72"; ctx.font = "52px DM Sans, sans-serif";
      ctx.fillText("Find your trail. Find your crew.", 645, 1098);
      // Social buttons
      ctx.fillStyle = OFF_WHITE; roundRect(ctx, 160, 1150, 970, 110, 20); ctx.fill();
      ctx.fillStyle = "#EA4335"; ctx.font = "bold 56px DM Sans, sans-serif"; ctx.fillText("G", 320, 1220);
      ctx.fillStyle = DARK; ctx.font = "60px DM Sans, sans-serif"; ctx.fillText("Continue with Google", 500, 1220);
      ctx.fillStyle = DARK; roundRect(ctx, 160, 1290, 970, 110, 20); ctx.fill();
      ctx.fillStyle = WHITE; ctx.font = "bold 56px DM Sans, sans-serif"; ctx.fillText("   Continue with Apple", 280, 1360);
      // Divider
      ctx.fillStyle = "#D8E9DE"; ctx.fillRect(160, 1450, 380, 2);
      ctx.fillStyle = "#6B7D72"; ctx.font = "44px DM Sans, sans-serif"; ctx.fillText("or", 645, 1466);
      ctx.fillStyle = "#D8E9DE"; ctx.fillRect(750, 1450, 380, 2);
      // Email field
      ctx.strokeStyle = "#D8E9DE"; ctx.lineWidth = 2;
      roundRect(ctx, 160, 1500, 970, 110, 16); ctx.stroke();
      ctx.fillStyle = "#B0C4B8"; ctx.font = "50px DM Sans, sans-serif"; ctx.textAlign = "left";
      ctx.fillText("you@example.com", 200, 1568);
      ctx.strokeStyle = "#D8E9DE"; roundRect(ctx, 160, 1640, 970, 110, 16); ctx.stroke();
      ctx.fillText("Password", 200, 1708);
      // CTA
      ctx.fillStyle = GREEN; roundRect(ctx, 160, 1790, 970, 120, 60); ctx.fill();
      ctx.fillStyle = WHITE; ctx.font = "bold 64px DM Sans, sans-serif"; ctx.textAlign = "center";
      ctx.fillText("Create account", 645, 1864);
      ctx.fillStyle = "#6B7D72"; ctx.font = "46px DM Sans, sans-serif"; ctx.fillText("Already have an account?  Sign in", 645, 1990);
    },
  },
  {
    id: "store-screen-7",
    label: "Screenshot 7 — Create Event",
    platform: "App Store",
    dimensions: "1290 × 2796",
    w: 1290, h: 2796,
    draw(ctx, _g, logoWhite) {
      ctx.fillStyle = OFF_WHITE; ctx.fillRect(0, 0, 1290, 2796);
      const g = ctx.createLinearGradient(0, 0, 0, 680);
      g.addColorStop(0, GREEN_DARK); g.addColorStop(1, GREEN);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1290, 680);
      ctx.textAlign = "center"; ctx.fillStyle = WHITE;
      ctx.font = "bold 118px DM Sans, sans-serif";
      ctx.fillText("Lead your next", 645, 220); ctx.fillText("adventure", 645, 360);
      ctx.fillStyle = "rgba(255,255,255,0.58)"; ctx.font = "58px DM Sans, sans-serif";
      ctx.fillText("Create an event in minutes", 645, 480);
      // Form card
      ctx.fillStyle = WHITE; roundRect(ctx, 80, 730, 1130, 1780, 28); ctx.fill();
      ctx.textAlign = "left"; ctx.fillStyle = DARK; ctx.font = "bold 74px DM Sans, sans-serif";
      ctx.fillText("New Event", 114, 832);
      // Type picker
      ctx.fillStyle = "#6B7D72"; ctx.font = "44px DM Sans, sans-serif"; ctx.fillText("Activity type", 114, 940);
      const types = ["🚴 Ride", "🏃 Run", "🥾 Hike", "🤝 Meetup"];
      types.forEach((t, i) => {
        const tx = 114 + i * 264; const ty = 968;
        const isSelected = i === 0;
        ctx.fillStyle = isSelected ? GREEN : "#EEF3F0"; roundRect(ctx, tx, ty, 240, 88, 20); ctx.fill();
        ctx.fillStyle = isSelected ? WHITE : DARK; ctx.font = "bold 38px DM Sans, sans-serif";
        ctx.textAlign = "center"; ctx.fillText(t, tx + 120, ty + 55);
      });
      // Fields
      const fields = [
        ["Event name", "Dawn Patrol Gravel Ride"],
        ["Location", "Marin Headlands, CA"],
        ["Date & time", "SAT APR 5 · 6:30 AM"],
        ["Max attendees", "12 riders"],
        ["Distance", "42 mi"],
        ["Difficulty", "Hard"],
      ];
      ctx.textAlign = "left";
      fields.forEach(([lbl, val], i) => {
        const fy = 1120 + i * 192;
        ctx.fillStyle = "#6B7D72"; ctx.font = "44px DM Sans, sans-serif"; ctx.fillText(lbl, 114, fy);
        ctx.strokeStyle = "#D8E9DE"; ctx.lineWidth = 2; roundRect(ctx, 114, fy + 18, 1062, 100, 14); ctx.stroke();
        ctx.fillStyle = i === 0 ? DARK : "#6B7D72"; ctx.font = `${i === 0 ? "bold " : ""}50px DM Sans, sans-serif`;
        ctx.fillText(val, 152, fy + 83);
      });
      // Publish button
      ctx.fillStyle = GREEN; roundRect(ctx, 114, 2290, 1062, 120, 60); ctx.fill();
      ctx.fillStyle = WHITE; ctx.font = "bold 64px DM Sans, sans-serif"; ctx.textAlign = "center";
      ctx.fillText("Publish event", 645, 2364);
    },
  },
  {
    id: "store-screen-8",
    label: "Screenshot 8 — Filters & Search",
    platform: "App Store",
    dimensions: "1290 × 2796",
    w: 1290, h: 2796,
    draw(ctx, _g, logoWhite) {
      ctx.fillStyle = OFF_WHITE; ctx.fillRect(0, 0, 1290, 2796);
      const g = ctx.createLinearGradient(0, 0, 0, 680);
      g.addColorStop(0, GREEN_DARK); g.addColorStop(1, GREEN);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1290, 680);
      ctx.textAlign = "center"; ctx.fillStyle = WHITE;
      ctx.font = "bold 118px DM Sans, sans-serif";
      ctx.fillText("Find your", 645, 220); ctx.fillText("perfect adventure", 645, 360);
      ctx.fillStyle = "rgba(255,255,255,0.58)"; ctx.font = "58px DM Sans, sans-serif";
      ctx.fillText("Powerful filters to narrow your search", 645, 480);
      // Search bar
      ctx.fillStyle = WHITE; roundRect(ctx, 80, 730, 1130, 110, 55); ctx.fill();
      ctx.fillStyle = "#B0C4B8"; ctx.font = "50px DM Sans, sans-serif"; ctx.textAlign = "left";
      ctx.fillText("🔍  Search by location or name...", 140, 800);
      // Filter panel
      ctx.fillStyle = WHITE; roundRect(ctx, 80, 890, 1130, 1600, 28); ctx.fill();
      ctx.fillStyle = DARK; ctx.font = "bold 70px DM Sans, sans-serif"; ctx.textAlign = "left";
      ctx.fillText("Filters", 114, 990);
      // Activity type section
      ctx.fillStyle = "#6B7D72"; ctx.font = "bold 48px DM Sans, sans-serif"; ctx.fillText("ACTIVITY TYPE", 114, 1088);
      const atypes = [["Rides", GREEN, true], ["Runs", "#0284C7", true], ["Hikes", "#D97706", false], ["Meetups", "#7C3AED", false]];
      let ax = 114;
      atypes.forEach(([lbl, col, sel]: any) => {
        const aw = (lbl as string).length * 40 + 72; ctx.fillStyle = sel ? col : "#EEF3F0";
        roundRect(ctx, ax, 1108, aw, 88, 44); ctx.fill();
        ctx.fillStyle = sel ? WHITE : DARK; ctx.font = "bold 44px DM Sans, sans-serif";
        ctx.textAlign = "center"; ctx.fillText(lbl as string, ax + aw / 2, 1158); ax += aw + 20;
      });
      ctx.fillStyle = "#EEF3F0"; ctx.fillRect(114, 1250, 1062, 2);
      // Difficulty
      ctx.textAlign = "left"; ctx.fillStyle = "#6B7D72"; ctx.font = "bold 48px DM Sans, sans-serif";
      ctx.fillText("DIFFICULTY", 114, 1348);
      const diffs = [["Any level", true], ["Easy", false], ["Moderate", false], ["Hard", true]];
      let dx = 114;
      diffs.forEach(([lbl, sel]: any) => {
        const dw = (lbl as string).length * 34 + 60; ctx.fillStyle = sel ? GREEN : "#EEF3F0";
        roundRect(ctx, dx, 1368, dw, 80, 40); ctx.fill();
        ctx.fillStyle = sel ? WHITE : DARK; ctx.font = "bold 40px DM Sans, sans-serif";
        ctx.textAlign = "center"; ctx.fillText(lbl as string, dx + dw / 2, 1416); dx += dw + 16;
      });
      ctx.fillStyle = "#EEF3F0"; ctx.fillRect(114, 1506, 1062, 2);
      // Distance
      ctx.textAlign = "left"; ctx.fillStyle = "#6B7D72"; ctx.font = "bold 48px DM Sans, sans-serif";
      ctx.fillText("MAX DISTANCE", 114, 1600);
      ctx.fillStyle = "#EEF3F0"; roundRect(ctx, 114, 1618, 1062, 12, 6); ctx.fill();
      ctx.fillStyle = GREEN; roundRect(ctx, 114, 1618, 640, 12, 6); ctx.fill();
      ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(754, 1624, 32, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#6B7D72"; ctx.font = "44px DM Sans, sans-serif";
      ctx.fillText("Up to 40 miles", 114, 1710);
      ctx.fillStyle = "#EEF3F0"; ctx.fillRect(114, 1760, 1062, 2);
      // Date
      ctx.fillStyle = "#6B7D72"; ctx.font = "bold 48px DM Sans, sans-serif"; ctx.fillText("DATE RANGE", 114, 1854);
      const dates = ["Any time", "This week", "This weekend", "This month"];
      dates.forEach((d, i) => {
        const dr = i < 2 ? 1874 + i * 100 : 1874 + i * 100;
        const ry = 1874 + i * 104;
        ctx.fillStyle = i === 2 ? "#EEF3F0" : "transparent";
        ctx.fillStyle = i === 1 ? GREEN : "#EEF3F0";
        roundRect(ctx, 114, ry, 1062, 90, 14); ctx.fill();
        ctx.fillStyle = i === 1 ? WHITE : DARK; ctx.font = "bold 46px DM Sans, sans-serif";
        ctx.textAlign = "left"; ctx.fillText(d, 160, ry + 56);
      });
      // Apply button
      ctx.fillStyle = GREEN; roundRect(ctx, 114, 2360, 1062, 116, 58); ctx.fill();
      ctx.fillStyle = WHITE; ctx.font = "bold 64px DM Sans, sans-serif"; ctx.textAlign = "center";
      ctx.fillText("Apply filters", 645, 2432);
    },
  },
  {
    id: "store-screen-9",
    label: "Screenshot 9 — Event Chat",
    platform: "App Store",
    dimensions: "1290 × 2796",
    w: 1290, h: 2796,
    draw(ctx, _g, logoWhite) {
      ctx.fillStyle = OFF_WHITE; ctx.fillRect(0, 0, 1290, 2796);
      const g = ctx.createLinearGradient(0, 0, 0, 680);
      g.addColorStop(0, GREEN_DARK); g.addColorStop(1, GREEN);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1290, 680);
      ctx.textAlign = "center"; ctx.fillStyle = WHITE;
      ctx.font = "bold 118px DM Sans, sans-serif";
      ctx.fillText("Stay in the loop", 645, 220); ctx.fillText("with your crew", 645, 360);
      ctx.fillStyle = "rgba(255,255,255,0.58)"; ctx.font = "58px DM Sans, sans-serif";
      ctx.fillText("Chat with event attendees in real time", 645, 480);
      // Chat header bar
      ctx.fillStyle = WHITE; roundRect(ctx, 80, 730, 1130, 120, 0); ctx.fill();
      ctx.fillStyle = WHITE; ctx.fillRect(80, 794, 1130, 56);
      ctx.fillStyle = DARK; ctx.font = "bold 60px DM Sans, sans-serif"; ctx.textAlign = "left";
      ctx.fillText("← Dawn Patrol Gravel Ride", 120, 800);
      ctx.fillStyle = "#6B7D72"; ctx.font = "42px DM Sans, sans-serif";
      ctx.fillText("8 members · Chat", 120, 850);
      ctx.fillStyle = "#EEF3F0"; ctx.fillRect(80, 850, 1130, 2);
      // Messages
      const msgs = [
        { from: "Alex Chen", initials: "AC", col: GREEN, text: "Weather looks perfect for tomorrow! 🌄", time: "6:45 PM", mine: false },
        { from: "Me", initials: "YO", col: "#7C3AED", text: "Can't wait! Bringing extra layers just in case", time: "6:48 PM", mine: true },
        { from: "Maya Ross", initials: "MR", col: "#0284C7", text: "Meeting at the Headlands parking lot at 6:15am?", time: "6:52 PM", mine: false },
        { from: "Alex Chen", initials: "AC", col: GREEN, text: "Yes! Park near the main trailhead. See you all there 🚴", time: "6:54 PM", mine: false },
        { from: "Me", initials: "YO", col: "#7C3AED", text: "Perfect, see you all in the morning! 💪", time: "6:55 PM", mine: true },
        { from: "Sam Park", initials: "SP", col: "#D97706", text: "Stoked! This is gonna be epic 🔥", time: "7:01 PM", mine: false },
      ];
      let my = 900;
      msgs.forEach((m) => {
        const isLong = m.text.length > 48;
        const bh = isLong ? 180 : 140;
        if (!m.mine) {
          ctx.fillStyle = m.col; ctx.beginPath(); ctx.arc(154, my + 60, 50, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = WHITE; ctx.font = "bold 38px DM Sans, sans-serif"; ctx.textAlign = "center"; ctx.fillText(m.initials, 154, my + 76);
          ctx.fillStyle = WHITE; roundRect(ctx, 224, my, 820, bh, 24); ctx.fill();
          ctx.textAlign = "left"; ctx.fillStyle = "#6B7D72"; ctx.font = "36px DM Sans, sans-serif"; ctx.fillText(m.from, 260, my + 46);
          ctx.fillStyle = DARK; ctx.font = "46px DM Sans, sans-serif";
          if (isLong) { ctx.fillText(m.text.slice(0, 42), 260, my + 98); ctx.fillText(m.text.slice(42), 260, my + 152); }
          else ctx.fillText(m.text, 260, my + 106);
        } else {
          ctx.fillStyle = GREEN; roundRect(ctx, 246, my, 820, bh, 24); ctx.fill();
          ctx.fillStyle = WHITE; ctx.font = "46px DM Sans, sans-serif"; ctx.textAlign = "left";
          if (isLong) { ctx.fillText(m.text.slice(0, 42), 280, my + 82); ctx.fillText(m.text.slice(42), 280, my + 140); }
          else ctx.fillText(m.text, 280, my + 106);
        }
        ctx.fillStyle = "#9DB5A3"; ctx.font = "34px DM Sans, sans-serif";
        ctx.textAlign = m.mine ? "right" : "left"; ctx.fillText(m.time, m.mine ? 1066 : 224, my + bh + 20);
        my += bh + 56;
      });
      // Input bar
      ctx.fillStyle = WHITE; roundRect(ctx, 80, 2580, 1130, 110, 55); ctx.fill();
      ctx.fillStyle = "#B0C4B8"; ctx.font = "50px DM Sans, sans-serif"; ctx.textAlign = "left";
      ctx.fillText("Message the crew...", 140, 2648);
      ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(1130, 2635, 52, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = WHITE; ctx.font = "bold 52px DM Sans, sans-serif"; ctx.textAlign = "center"; ctx.fillText("↑", 1130, 2651);
    },
  },
  {
    id: "store-screen-10",
    label: "Screenshot 10 — Dark Mode",
    platform: "App Store",
    dimensions: "1290 × 2796",
    w: 1290, h: 2796,
    draw(ctx, _g, logoWhite) {
      ctx.fillStyle = "#090E0B"; ctx.fillRect(0, 0, 1290, 2796);
      // Dark green header band
      const g = ctx.createLinearGradient(0, 0, 0, 680);
      g.addColorStop(0, "#050F08"); g.addColorStop(1, "#0A1F12");
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1290, 680);
      ctx.textAlign = "center"; ctx.fillStyle = WHITE;
      ctx.font = "bold 118px DM Sans, sans-serif";
      ctx.fillText("Looks great", 645, 220); ctx.fillText("day or night", 645, 360);
      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "58px DM Sans, sans-serif";
      ctx.fillText("Full dark mode, beautifully designed", 645, 480);
      // Dark search bar
      ctx.fillStyle = "#111A14"; roundRect(ctx, 80, 730, 1130, 108, 54); ctx.fill();
      ctx.fillStyle = "#7A9484"; ctx.font = "50px DM Sans, sans-serif"; ctx.textAlign = "left";
      ctx.fillText("🔍  Search by location or name...", 140, 800);
      // Dark filter pills
      const dfilt = ["All", "Rides", "Runs", "Hikes", "Meetups"];
      let dfx = 80;
      dfilt.forEach((f, i) => {
        const dfw = f.length * 36 + 64; ctx.fillStyle = i === 0 ? GREEN_LIGHT : "#111A14";
        roundRect(ctx, dfx, 890, dfw, 82, 41); ctx.fill();
        ctx.fillStyle = i === 0 ? "#0A1F12" : "#EDF5F0"; ctx.font = "bold 42px DM Sans, sans-serif";
        ctx.textAlign = "center"; ctx.fillText(f, dfx + dfw / 2, 943); dfx += dfw + 18;
      });
      // Dark event cards
      const devs = [
        { title: "Dawn Patrol Gravel Ride", type: "RIDE", col: GREEN_LIGHT, loc: "Marin Headlands, CA", dist: "42 mi" },
        { title: "Saturday Sunrise Run", type: "RUN", col: "#38BDF8", loc: "Presidio, SF", dist: "10 km" },
        { title: "Muir Woods Trail Hike", type: "HIKE", col: "#FCD34D", loc: "Mill Valley, CA", dist: "8 mi" },
      ];
      devs.forEach((e, i) => {
        const cy = 1020 + i * 560;
        ctx.fillStyle = "#111A14"; roundRect(ctx, 80, cy, 1130, 520, 28); ctx.fill();
        const ig = ctx.createLinearGradient(0, cy, 0, cy + 240);
        ig.addColorStop(0, e.col + "44"); ig.addColorStop(1, "#111A14");
        ctx.fillStyle = ig; roundRect(ctx, 80, cy, 1130, 240, 28); ctx.fill();
        ctx.fillStyle = e.col; roundRect(ctx, 114, cy + 186, 148, 50, 8); ctx.fill();
        ctx.fillStyle = "#090E0B"; ctx.font = "bold 32px DM Sans, sans-serif"; ctx.textAlign = "left";
        ctx.fillText(e.type, 134, cy + 222);
        ctx.fillStyle = "#EDF5F0"; ctx.font = "bold 62px DM Sans, sans-serif"; ctx.fillText(e.title, 114, cy + 316);
        ctx.fillStyle = "#7A9484"; ctx.font = "44px DM Sans, sans-serif"; ctx.fillText("📍 " + e.loc, 114, cy + 376);
        ctx.fillStyle = "#0D2016"; roundRect(ctx, 114, cy + 420, 180, 66, 10); ctx.fill();
        ctx.fillStyle = "#EDF5F0"; ctx.font = "bold 40px DM Sans, sans-serif"; ctx.textAlign = "center"; ctx.fillText(e.dist, 204, cy + 462);
        ctx.fillStyle = GREEN_LIGHT; roundRect(ctx, 900, cy + 420, 240, 66, 33); ctx.fill();
        ctx.fillStyle = "#0A1F12"; ctx.font = "bold 44px DM Sans, sans-serif"; ctx.fillText("Join", 1020, cy + 462);
      });
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

  const platforms = ["Icon Mark", "LinkedIn", "Instagram", "App Store"] as const;

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
