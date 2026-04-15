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

  // 100×100 viewBox — filled gear hub with hollow center + 8 spokes + terminal circles
  // Gear: 8 teeth at spoke angles (outerR=23), valleys between (innerR=16), hole at center (r=10)
  // Spokes drawn from center outward; filled gear sits on top and naturally masks inner portions
  // Terminals: small hollow circles (r=5) at spoke tips (r=40 from center)

  const GEAR_PATH =
    "M 73.00 50.00 L 64.78 43.88 L 66.26 33.74 L 56.12 35.22 L 50.00 27.00 " +
    "L 43.88 35.22 L 33.74 33.74 L 35.22 43.88 L 27.00 50.00 L 35.22 56.12 " +
    "L 33.74 66.26 L 43.88 64.78 L 50.00 73.00 L 56.12 64.78 L 66.26 66.26 " +
    "L 64.78 56.12 Z " +
    "M 60 50 A 10 10 0 1 0 40 50 A 10 10 0 1 0 60 50 Z";

  const spokes = [
    { x2: 90,    y2: 50    },
    { x2: 78.28, y2: 21.72 },
    { x2: 50,    y2: 10    },
    { x2: 21.72, y2: 21.72 },
    { x2: 10,    y2: 50    },
    { x2: 21.72, y2: 78.28 },
    { x2: 50,    y2: 90    },
    { x2: 78.28, y2: 78.28 },
  ];

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Spokes — drawn first so filled gear covers their inner ends */}
      {spokes.map((s, i) => (
        <Line
          key={i}
          x1={50} y1={50}
          x2={s.x2} y2={s.y2}
          stroke={c}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}

      {/* Filled gear with hollow center (evenodd) */}
      <Path
        d={GEAR_PATH}
        fill={c}
        fillRule="evenodd"
      />

      {/* Terminal hollow circles at spoke tips */}
      {spokes.map((s, i) => (
        <Circle
          key={i}
          cx={s.x2}
          cy={s.y2}
          r={5}
          stroke={c}
          strokeWidth={3}
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
