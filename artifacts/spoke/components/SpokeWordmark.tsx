import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Rect } from "react-native-svg";

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

  const knobCount = 18;
  const knobH = size * 0.1;
  const knobW = size * 0.072;
  const tireStroke = size * 0.058;

  const rimR = size / 2 - knobH - tireStroke / 2 - size * 0.015;
  const hubR = size * 0.07;
  const spokeCount = 14;

  const knobBaseR = rimR + tireStroke / 2 - 0.5;

  const spokes = Array.from({ length: spokeCount }, (_, i) => {
    const angle = (i * Math.PI * 2) / spokeCount;
    return {
      x1: cx + Math.cos(angle) * hubR * 1.7,
      y1: cy + Math.sin(angle) * hubR * 1.7,
      x2: cx + Math.cos(angle) * (rimR - tireStroke * 0.3),
      y2: cy + Math.sin(angle) * (rimR - tireStroke * 0.3),
    };
  });

  const knobs = Array.from({ length: knobCount }, (_, i) => {
    const angleDeg = (i * 360) / knobCount;
    const isMain = i % 2 === 0;
    const h = isMain ? knobH : knobH * 0.72;
    const w = isMain ? knobW : knobW * 0.78;
    return { angleDeg, h, w };
  });

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle
        cx={cx}
        cy={cy}
        r={rimR}
        stroke={c}
        strokeWidth={tireStroke}
        fill="none"
      />

      {knobs.map(({ angleDeg, h, w }, i) => (
        <Rect
          key={i}
          x={cx - w / 2}
          y={cy - knobBaseR - h}
          width={w}
          height={h + tireStroke * 0.4}
          rx={w * 0.35}
          fill={c}
          transform={`rotate(${angleDeg} ${cx} ${cy})`}
        />
      ))}

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
