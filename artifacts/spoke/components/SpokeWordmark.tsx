import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";

import { useColors } from "@/hooks/useColors";

interface Props {
  size?: number;
  color?: string;
  showLabel?: boolean;
  labelSize?: number;
}

export function BikeWheelIcon({
  size = 32,
  color,
}: {
  size?: number;
  color?: string;
}) {
  const colors = useColors();
  const c = color ?? colors.primary;

  // 100×100 viewBox — 8-spoke hub icon with gear-notched hub ring
  // Hub: alternating inner (r=9 at spoke angles) / outer (r=14 at mid angles) vertices → gear shape
  // Spokes: lines from hub inner points to terminal circles (r=38 from center)
  // Terminals: small hollow circles (r=5)
  const numSpokes = 8;
  const innerR = 9;
  const outerR = 14;
  const spokeEndR = 38;
  const termR = 5;
  const sw = 3;
  const hx = 50, hy = 50;

  const gearPts: string[] = [];
  const spokeLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const termCircles: { cx: number; cy: number }[] = [];

  for (let i = 0; i < numSpokes * 2; i++) {
    const angleRad = (i * 2 * Math.PI) / (numSpokes * 2);
    const r = i % 2 === 0 ? innerR : outerR;
    const x = hx + r * Math.cos(angleRad);
    const y = hy - r * Math.sin(angleRad);
    gearPts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);

    if (i % 2 === 0) {
      const spokeAngle = angleRad;
      const x2 = hx + spokeEndR * Math.cos(spokeAngle);
      const y2 = hy - spokeEndR * Math.sin(spokeAngle);
      spokeLines.push({ x1: x, y1: y, x2, y2 });
      termCircles.push({ cx: x2, cy: y2 });
    }
  }

  const gearPath = gearPts.join(" ") + " Z";

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Spokes */}
      {spokeLines.map((s, i) => (
        <Line
          key={i}
          x1={s.x1} y1={s.y1}
          x2={s.x2} y2={s.y2}
          stroke={c}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      ))}

      {/* Gear hub (hollow, outline only) */}
      <Path
        d={gearPath}
        stroke={c}
        strokeWidth={sw}
        strokeLinejoin="miter"
        fill="none"
      />

      {/* Terminal circles (hollow) */}
      {termCircles.map((t, i) => (
        <Circle
          key={i}
          cx={t.cx}
          cy={t.cy}
          r={termR}
          stroke={c}
          strokeWidth={sw}
          fill="none"
        />
      ))}
    </Svg>
  );
}

export function SpokeWordmark({ size = 32, color, showLabel = true, labelSize }: Props) {
  const colors = useColors();
  const c = color ?? colors.primary;
  const fs = labelSize ?? size * 0.75;

  return (
    <View style={styles.row}>
      <BikeWheelIcon size={size} color={c} />
      {showLabel && (
        <Text
          style={[
            styles.label,
            { color: c, fontSize: fs, marginLeft: size * 0.28 },
          ]}
        >
          spoke
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontFamily: "DMSans_700Bold",
    letterSpacing: -0.5,
  },
});
