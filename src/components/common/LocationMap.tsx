"use client";
import dynamic from "next/dynamic";
import Skeleton from "./Skeleton";

const Inner = dynamic(() => import("./LocationMapInner"), { ssr: false, loading: () => <Skeleton className="h-full min-h-72 w-full" /> });

export default function LocationMap({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  return <Inner lat={lat} lng={lng} label={label} />;
}
