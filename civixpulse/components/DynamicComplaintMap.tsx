"use client";

import dynamic from "next/dynamic";

// Map components that use Leaflet must be loaded dynamically with ssr: false
// because they rely on the browser's window object.
const ComplaintMap = dynamic(() => import("@/components/ComplaintMap"), {
  ssr: false,
});

export default function DynamicComplaintMap({ lat, lng }: { lat: number; lng: number }) {
  return <ComplaintMap lat={lat} lng={lng} />;
}
