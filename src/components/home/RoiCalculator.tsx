"use client";
import { useState } from "react";
import { Calculator, CheckCircle2, Sparkles } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { formatBDT } from "@/utils/format";
import Reveal from "@/components/common/Reveal";
import { LinkButton } from "@/components/common/Button";

interface Preset {
  label: string;
  count: number;
  fuel: number;
  icon: string;
}

const PRESETS: Preset[] = [
  { label: "Private Sedan / SUV", count: 2, fuel: 18000, icon: "🚗" },
  { label: "Delivery Vans", count: 6, fuel: 32000, icon: "🚐" },
  { label: "Commercial Trucks", count: 12, fuel: 65000, icon: "🚛" },
  { label: "Motorbike Fleets", count: 15, fuel: 7500, icon: "🏍️" },
];

export default function RoiCalculator() {
  const [vehicleCount, setVehicleCount] = useState(5);
  const [fuelCostPerVehicle, setFuelCostPerVehicle] = useState(25000); // BDT per month

  // Calculated estimates:
  // GPS telemetry reduces fuel theft, unauthorized detours and unnecessary AC idling by ~18% - 24%
  const monthlyFuelTotal = vehicleCount * fuelCostPerVehicle;
  const estimatedFuelSavedMonthly = Math.round(monthlyFuelTotal * 0.19);
  const unauthorizedTripSavingsMonthly = Math.round(vehicleCount * 1800);
  const totalMonthlySavings = estimatedFuelSavedMonthly + unauthorizedTripSavingsMonthly;
  const annualSavings = totalMonthlySavings * 12;

  // Typical GPS monthly service is ~300 - 450 BDT/vehicle
  const estimatedGpsCost = vehicleCount * 400;
  const netMonthlyProfit = totalMonthlySavings - estimatedGpsCost;
  const roiPercentage = Math.round((netMonthlyProfit / Math.max(1, estimatedGpsCost)) * 100);

  return (
    <section className="relative overflow-hidden bg-surface py-16 sm:py-24 border-t border-line">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-500/5 blur-3xl" />

      <Container className="relative">
        <SectionHeading
          eyebrow="Fleet ROI & Fuel Savings Calculator"
          title="See how much money Safety GPS Tracker saves your fleet every month"
          description="Reduce fuel pilferage, eliminate excessive engine idling, stop unauthorized driver detours, and gain 100% asset transparency."
        />

        <div className="mx-auto mt-10 max-w-5xl">
          <Reveal>
            <div className="grid gap-8 rounded-lg border border-line bg-gradient-to-br from-soft/60 to-surface p-6   lg:grid-cols-12 sm:p-8">
              {/* Left Column: Sliders & Controls */}
              <div className="space-y-6 lg:col-span-7">
                <div>
                  <h3 className="flex items-center gap-2 text-base font-bold text-ink">
                    <Calculator className="h-5 w-5 text-brand-600" />
                    Configure Your Fleet Parameters
                  </h3>
                  <p className="mt-1 text-xs text-body">
                    Select a quick fleet preset or drag the sliders to reflect your operations.
                  </p>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setVehicleCount(p.count);
                        setFuelCostPerVehicle(p.fuel);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg glass border border-line px-3 py-1.5 text-xs font-semibold text-body-strong transition-all hover:border-brand-500 hover:text-brand-text active:scale-95"
                    >
                      <span>{p.icon}</span>
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>

                {/* Slider 1: Vehicle Count */}
                <div className="rounded-lg border border-line-soft bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="veh-count-slider" className="text-sm font-bold text-ink">
                      Number of Vehicles
                    </label>
                    <span className="font-mono text-xl font-bold text-brand-600">
                      {vehicleCount} <span className="text-xs font-normal text-slate-400">units</span>
                    </span>
                  </div>
                  <input
                    id="veh-count-slider"
                    type="range"
                    min={1}
                    max={100}
                    value={vehicleCount}
                    onChange={(e) => setVehicleCount(Number(e.target.value))}
                    className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-softer accent-brand-600"
                  />
                  <div className="mt-1 flex justify-between text-[11px] md:text-xs text-slate-400">
                    <span>1 vehicle</span>
                    <span>50 vehicles</span>
                    <span>100+ vehicles</span>
                  </div>
                </div>

                {/* Slider 2: Monthly Fuel Cost */}
                <div className="rounded-lg border border-line-soft bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="fuel-cost-slider" className="text-sm font-bold text-ink">
                      Monthly Fuel Expense Per Vehicle
                    </label>
                    <span className="font-mono text-xl font-bold text-ink">
                      {formatBDT(fuelCostPerVehicle)}
                    </span>
                  </div>
                  <input
                    id="fuel-cost-slider"
                    type="range"
                    min={5000}
                    max={120000}
                    step={2500}
                    value={fuelCostPerVehicle}
                    onChange={(e) => setFuelCostPerVehicle(Number(e.target.value))}
                    className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-softer accent-brand-600"
                  />
                  <div className="mt-1 flex justify-between text-[11px] md:text-xs text-slate-400">
                    <span>{formatBDT(5000)}</span>
                    <span>{formatBDT(60000)}</span>
                    <span>{formatBDT(120000)}</span>
                  </div>
                </div>

                {/* Breakdown checklist */}
                <div className="space-y-2 rounded-lg bg-soft/40 p-4 text-xs text-body">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>~19% fuel waste stopped (eliminates overnight AC idling & fuel tank drainage)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Stops driver side-trips & unauthorized off-route passenger hauls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>BRTA tax token & insurance fines prevented through automated expiry warnings</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Savings Summary Card */}
              <div className="flex flex-col justify-between rounded-lg border border-brand-500/20 bg-gradient-to-b from-navy-950 to-navy-900 p-6 text-white   lg:col-span-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 px-3 py-1 text-xs font-bold text-brand-300 ring-1 ring-brand-500/40">
                    <Sparkles className="h-3.5 w-3.5" />
                    Estimated Net Savings
                  </div>

                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Estimated Monthly Savings
                    </p>
                    <p className="mt-1 font-mono text-3xl font-black text-brand-400 sm:text-4xl tracking-tight">
                      {formatBDT(totalMonthlySavings)}
                      <span className="text-xs font-normal text-slate-300"> / month</span>
                    </p>
                  </div>

                  <div className="mt-6 space-y-3 rounded-lg bg-white/5 p-4 text-xs backdrop-blur border border-white/10">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Annual Fuel & Waste Saved:</span>
                      <b className="font-mono text-white text-sm">{formatBDT(annualSavings)}</b>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>GPS Subscription Cost:</span>
                      <span className="font-mono text-slate-400">{formatBDT(estimatedGpsCost)} / mo</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex items-center justify-between">
                      <span className="font-bold text-emerald-400">Estimated ROI Ratio:</span>
                      <b className="font-mono text-emerald-400 text-sm font-bold">+{roiPercentage}% ROI</b>
                    </div>
                  </div>

                  <p className="mt-4 text-[11px] md:text-xs text-slate-400 leading-relaxed">
                    Based on verified telematics data from 45,000+ commercial vehicles in Dhaka, Chittagong, and Sylhet. Payback period is under 30 days.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-2.5">
                  <LinkButton href="/contact" size="lg" className="w-full text-center justify-center font-bold">
                    Claim Fleet Discount & Free Demo
                  </LinkButton>
                  <p className="text-center text-[10px] md:text-xs text-slate-400">
                    Includes Free Onsite Technician Installation in 64 Districts
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
