"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";

export default function ComplaintMap({ lat, lng }: any) {
    if (!lat || !lng) return null;

    return (
        <MapContainer center={[lat, lng]} zoom={15} className="h-64 w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[lat, lng]} />
        </MapContainer>
    );
}