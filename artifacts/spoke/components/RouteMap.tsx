import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";
import type { Coordinates, EventType } from "@/constants/data";

interface Props {
  coordinates: Coordinates;
  location: string;
  type: EventType;
  ridewithgpsUrl?: string;
}

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? "";

function buildStaticMapUrl(lat: number, lng: number): string | null {
  if (!MAPBOX_TOKEN) return null;
  const marker = `pin-s+556B2F(${lng},${lat})`;
  return (
    `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/` +
    `${marker}/${lng},${lat},12,0/600x300@2x?access_token=${MAPBOX_TOKEN}`
  );
}

function openDirections(lat: number, lng: number, label: string) {
  const encoded = encodeURIComponent(label);
  Linking.openURL(`maps://?q=${encoded}&ll=${lat},${lng}`).catch(() =>
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    )
  );
}

function openRideWithGPS(url: string) {
  Linking.openURL(url).catch(() => null);
}

export function RouteMap({ coordinates, location, type, ridewithgpsUrl }: Props) {
  const colors = useColors();
  const { lat, lng } = coordinates;
  const mapUrl = buildStaticMapUrl(lat, lng);
  const showRideWithGPS = (type === "ride" || type === "run") && !!ridewithgpsUrl;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      {mapUrl ? (
        <Image
          source={{ uri: mapUrl }}
          style={[styles.map, { borderRadius: colors.radius }]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.mapPlaceholder,
            { backgroundColor: colors.secondary, borderRadius: colors.radius },
          ]}
        >
          <Feather name="map" size={28} color={colors.mutedForeground} />
          <Text style={[styles.placeholderText, { color: colors.mutedForeground }]}>
            Add EXPO_PUBLIC_MAPBOX_TOKEN to see the map
          </Text>
        </View>
      )}

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: colors.secondary,
              borderColor: colors.border,
              borderRadius: colors.radius / 1.5,
              flex: showRideWithGPS ? 1 : undefined,
            },
          ]}
          onPress={() => openDirections(lat, lng, location)}
          activeOpacity={0.75}
        >
          <Feather name="navigation" size={15} color={colors.primary} />
          <Text style={[styles.btnText, { color: colors.foreground }]}>
            Get Directions
          </Text>
        </TouchableOpacity>

        {showRideWithGPS && (
          <TouchableOpacity
            style={[
              styles.btn,
              styles.btnPrimary,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius / 1.5,
                flex: 1,
              },
            ]}
            onPress={() => openRideWithGPS(ridewithgpsUrl!)}
            activeOpacity={0.75}
          >
            <Feather name="map-pin" size={15} color={colors.primaryForeground} />
            <Text style={[styles.btnText, { color: colors.primaryForeground }]}>
              View on RideWithGPS
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: 180,
  },
  mapPlaceholder: {
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 24,
  },
  placeholderText: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  btnPrimary: {
    borderWidth: 0,
  },
  btnText: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },
});
