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

  // 100×100 viewBox — filled hub-and-spoke, 6 satellites at 60° intervals
  const hx = 50, hy = 50;
  const hubR = 13;
  const nodeR = 8;
  const spokeLen = 34; // center-to-center distance
  const sw = 6; // spoke line width

  // 6 evenly-spaced satellites starting at 0° (right), stepping 60° CCW
  // SVG y-axis is flipped, so sin is negated for "up"
  const satellites = Array.from({ length: 6 }, (_, i) => {
    const deg = i * 60;
    const rad = (deg * Math.PI) / 180;
    return {
      cx: hx + spokeLen * Math.cos(rad),
      cy: hy - spokeLen * Math.sin(rad),
    };
  });

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Filled spokes drawn first so circles sit on top */}
      {satellites.map((s, i) => (
        <Line
          key={i}
          x1={hx} y1={hy}
          x2={s.cx} y2={s.cy}
          stroke={c}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      ))}

      {/* Filled hub */}
      <Circle cx={hx} cy={hy} r={hubR} fill={c} />

      {/* Filled satellite dots */}
      {satellites.map((s, i) => (
        <Circle key={i} cx={s.cx} cy={s.cy} r={nodeR} fill={c} />
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
