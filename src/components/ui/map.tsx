"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Type definition for coordinates (matches Leaflet's LatLngExpression)
export type LatLngExpression = [number, number] | { lat: number; lng: number };

// Create default icon for Leaflet markers
// This fixes the issue where Leaflet's default icon paths don't work in Next.js
const createDefaultIcon = () => {
  if (typeof window === "undefined") return null;

  return L.icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  });
};

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);

export interface MapProps {
  center: LatLngExpression;
  zoom?: number;
  children?: React.ReactNode;
  className?: string;
}

export interface MapMarkerProps {
  position: LatLngExpression;
  children?: React.ReactNode;
}

export function Map({ center, zoom = 2, children, className }: MapProps) {
  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
      >
        {children}
      </MapContainer>
    </div>
  );
}

export function MapTileLayer() {
  return (
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  );
}

export function MapMarker({ position, children }: MapMarkerProps) {
  // Create and memoize the default icon
  const icon = useMemo(() => createDefaultIcon(), []);

  // Don't render if icon couldn't be created (SSR)
  if (!icon) return null;

  return (
    <Marker position={position} icon={icon}>
      {children}
    </Marker>
  );
}
