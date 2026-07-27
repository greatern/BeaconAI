import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LatLngLiteral } from "leaflet";

import "../../lib/leafletIcons";

interface LocationPickerProps {
  value: LatLngLiteral;
  onChange: (position: LatLngLiteral) => void;
}

function ClickCapture({ onChange }: { onChange: (position: LatLngLiteral) => void }) {
  useMapEvents({
    click(event) {
      onChange({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });

  return null;
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [center] = useState(value);

  return (
    <div className="rounded-2xl overflow-hidden border border-stone-200 h-72">
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={value} />
        <ClickCapture onChange={onChange} />
      </MapContainer>
    </div>
  );
}
