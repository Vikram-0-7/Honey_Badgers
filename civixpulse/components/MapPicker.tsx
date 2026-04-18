"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";

// ✅ FIX marker icon issue (important for Next.js)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapPicker({ onSelect }: any) {
    const [position, setPosition] = useState<any>(null);

    // ✅ Get user's current location (auto-detect)
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const coords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                };
                setPosition(coords);
                onSelect(coords);
            });
        }
    }, []);

    function LocationMarker() {
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
                onSelect(e.latlng);
            },
        });

        return position ? <Marker position={position} /> : null;
    }

    return (
        <MapContainer
            center={position || [17.7, 83.3]}
            zoom={13}
            className="h-48 w-full border"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
        </MapContainer>
    );
}