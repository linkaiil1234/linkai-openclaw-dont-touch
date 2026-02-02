"use client";

import {
  Map,
  MapMarker,
  MapTileLayer,
  type LatLngExpression,
} from "@/components/ui/map";

// Define the component props
interface CountryMapProps {
  mapColor?: string;
}

// Country markers based on integration/agent distribution
const COUNTRIES = [
  {
    name: "United States",
    coordinates: [37.0902, -95.7129] satisfies LatLngExpression, // Center of USA
  },
  {
    name: "India",
    coordinates: [20.5937, 78.9629] satisfies LatLngExpression,
  },
  {
    name: "United Kingdom",
    coordinates: [55.3781, -3.436] satisfies LatLngExpression,
  },
  {
    name: "France",
    coordinates: [46.2276, 2.2137] satisfies LatLngExpression,
  },
];

const CountryMap: React.FC<CountryMapProps> = () => {
  return (
    <Map center={[20, 0]} zoom={2} className="h-full w-full z-10">
      <MapTileLayer />
      {COUNTRIES.map((country) => (
        <MapMarker key={country.name} position={country.coordinates} />
      ))}
    </Map>
  );
};

export default CountryMap;
