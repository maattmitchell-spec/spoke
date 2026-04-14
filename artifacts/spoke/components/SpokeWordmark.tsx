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
  const cx = size / 2;
  const cy = size / 2;

  const treadStroke = size * 0.09;
  const tireStroke = size * 0.07;
  const gap = size * 0.012;

  const treadR = size / 2 - treadStroke / 2 - 0.5;
  const tireR = treadR - treadStroke / 2 - tireStroke / 2 - gap;
  const hubR = size * 0.075;

  const spokeCount = 14;
  const spokes = Array.from({ length: spokeCount }, (_, i) => {
    const angle = (i * Math.PI * 2) / spokeCount;
    return {
      x1: cx + Math.cos(angle) * hubR * 1.7,
      y1: cy + Math.sin(angle) * hubR * 1.7,
      x2: cx + Math.cos(angle) * (tireR - tireStroke * 0.35),
      y2: cy + Math.sin(angle) * (tireR - tireStroke * 0.35),
    };
  });

  const dashLen = size * 0.088;
  const gapLen = size * 0.058;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle
        cx={cx}
        cy={cy}
        r={tireR}
        stroke={c}
        strokeWidth={tireStroke}
        fill="none"
      />

      <Circle
        cx={cx}
        cy={cy}
        r={treadR}
        stroke={c}
        strokeWidth={treadStroke}
        fill="none"
        strokeDasharray={`${dashLen} ${gapLen}`}
        strokeLinecap="round"
      />

      {spokes.map((s, i) => (
        <Line
          key={i}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke={c}
          strokeWidth={size * 0.024}
          strokeLinecap="round"
        />
      ))}

      <Circle cx={cx} cy={cy} r={hubR * 1.45} fill={c} />
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
