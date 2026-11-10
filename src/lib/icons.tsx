import {
  Satellite, MapPin, Timer, Layers, Map, Navigation, Route, Lock, LockOpen, Power, DoorOpen,
  PlugZap, Siren, TriangleAlert, Fence, Gauge, History, CirclePlay, SquareParking, Clock,
  Activity, Fuel, Mic, Video, IdCard, Zap, Flag, FileText, ShieldCheck, Droplets, Wrench,
  Snowflake, Smartphone, Tablet, Monitor, Mail, BellRing, Car, Truck, HardHat, Bus, Bike,
  Ship, Building2, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Satellite, MapPin, Timer, Layers, Map, Navigation, Route, Lock, LockOpen, Power, DoorOpen,
  PlugZap, Siren, TriangleAlert, Fence, Gauge, History, PlayCircle: CirclePlay,
  ParkingSquare: SquareParking, Clock, Activity, Fuel, Mic, Video, IdCard, Zap, Flag, FileText,
  ShieldCheck, Droplets, Wrench, Snowflake, Smartphone, Tablet, Monitor, Mail, BellRing, Car,
  Truck, HardHat, Bus, Bike, Ship, Building2,
};

export function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? Satellite;
}

export function DynIcon({ name, className }: { name: string; className?: string }) {
  const I = ICONS[name] ?? Satellite;
  return <I className={className} />;
}
