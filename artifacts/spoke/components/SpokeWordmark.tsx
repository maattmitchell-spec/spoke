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

  // All coordinates are in a 100×100 internal viewBox, scaled by `size`
  // Hub circle (left, larger)
  const hubCx = 28;
  const hubCy = 50;
  const hubR = 17;

  // Top-right circle
  const topCx = 74;
  const topCy = 14;
  const nodeR = 13;

  // Bottom-right circle
  const botCx = 74;
  const botCy = 86;

  const sw = 7.5; // stroke width

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Connector lines drawn first so circles sit on top */}
      <Line
        x1={hubCx} y1={hubCy}
        x2={topCx} y2={topCy}
        stroke={c}
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <Line
        x1={hubCx} y1={hubCy}
        x2={botCx} y2={botCy}
        stroke={c}
        strokeWidth={sw}
        strokeLinecap="round"
      />

      {/* Hub circle */}
      <Circle
        cx={hubCx} cy={hubCy} r={hubR}
        stroke={c} strokeWidth={sw} fill="none"
      />

      {/* Top circle */}
      <Circle
        cx={topCx} cy={topCy} r={nodeR}
        stroke={c} strokeWidth={sw} fill="none"
      />

      {/* Bottom circle */}
      <Circle
        cx={botCx} cy={botCy} r={nodeR}
        stroke={c} strokeWidth={sw} fill="none"
      />
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
