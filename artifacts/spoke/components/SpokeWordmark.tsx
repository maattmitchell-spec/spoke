import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

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

  // 100×100 internal viewBox — hub-and-spoke network icon
  // Hub
  const hx = 50, hy = 50, hr = 11;
  // Satellites: [cx, cy, r]
  const nodes: [number, number, number][] = [
    [20, 22, 7],   // top-left  (small)
    [80, 20, 14],  // top-right (large)
    [16, 50, 7],   // left      (small)
    [18, 78, 14],  // bot-left  (large)
    [82, 74, 7],   // bot-right (small)
  ];
  const sw = 4;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Spokes — drawn first so circles sit on top */}
      {nodes.map(([cx, cy], i) => (
        <Line
          key={i}
          x1={hx} y1={hy} x2={cx} y2={cy}
          stroke={c} strokeWidth={sw} strokeLinecap="round"
        />
      ))}

      {/* Hub */}
      <Circle cx={hx} cy={hy} r={hr} stroke={c} strokeWidth={sw} fill="none" />

      {/* Satellite nodes */}
      {nodes.map(([cx, cy, r], i) => (
        <Circle key={i} cx={cx} cy={cy} r={r} stroke={c} strokeWidth={sw} fill="none" />
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
