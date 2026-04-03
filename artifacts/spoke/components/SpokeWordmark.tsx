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
  const outerR = size / 2 - 1.5;
  const innerR = size * 0.08;
  const spokeCount = 8;
  const spokeInset = size * 0.14;

  const spokes = Array.from({ length: spokeCount }, (_, i) => {
    const angle = (i * Math.PI * 2) / spokeCount;
    return {
      x1: cx + Math.cos(angle) * innerR,
      y1: cy + Math.sin(angle) * innerR,
      x2: cx + Math.cos(angle) * (outerR - spokeInset * 0.1),
      y2: cy + Math.sin(angle) * (outerR - spokeInset * 0.1),
    };
  });

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle
        cx={cx}
        cy={cy}
        r={outerR}
        stroke={c}
        strokeWidth={size * 0.065}
        fill="none"
      />
      <Circle cx={cx} cy={cy} r={innerR * 1.2} fill={c} />
      {spokes.map((s, i) => (
        <Line
          key={i}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke={c}
          strokeWidth={size * 0.038}
          strokeLinecap="round"
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
