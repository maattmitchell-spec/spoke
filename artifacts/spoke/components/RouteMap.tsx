import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React from "react";
import {
  Image,
  ScrollView,
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
  alltrailsUrl?: string;
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
  Linking.openURL(
    `comgooglemaps://?daddr=${lat},${lng}&directionsmode=driving`
  ).catch(() =>
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${encoded}`
    )
  );
}

function openUrl(url: string) {
  Linking.openURL(url).catch(() => null);
}

export function RouteMap({ coordinates, location, type, ridewithgpsUrl, alltrailsUrl }: Props) {
  const colors = useColors();
  const { lat, lng } = coordinates;
  const mapUrl = buildStaticMapUrl(lat, lng);

  const showRideWithGPS = type === "ride" && !!ridewithgpsUrl;
  const showAllTrails = (type === "hike" || type === "run") && !!alltrailsUrl;
  const hasExtraButton = showRideWithGPS || showAllTrails;

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
            Map preview unavailable
          </Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.buttons}
      >
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: colors.secondary,
              borderColor: colors.border,
              borderRadius: colors.radius / 1.5,
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

        {showAllTrails && (
          <TouchableOpacity
            style={[
              styles.btn,
              {
                backgroundColor: "#3D8C40",
                borderRadius: colors.radius / 1.5,
                borderWidth: 0,
              },
            ]}
            onPress={() => openUrl(alltrailsUrl!)}
            activeOpacity={0.75}
          >
            <Feather name="trending-up" size={15} color="#fff" />
            <Text style={[styles.btnText, { color: "#fff" }]}>
              View on AllTrails
            </Text>
          </TouchableOpacity>
        )}

        {showRideWithGPS && (
          <TouchableOpacity
            style={[
              styles.btn,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius / 1.5,
                borderWidth: 0,
              },
            ]}
            onPress={() => openUrl(ridewithgpsUrl!)}
            activeOpacity={0.75}
          >
            <Feather name="map-pin" size={15} color={colors.primaryForeground} />
            <Text style={[styles.btnText, { color: colors.primaryForeground }]}>
              View on RideWithGPS
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
  btnText: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },
});
