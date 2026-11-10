"use client";
import { Building2 } from "lucide-react";
import Container from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { useAppDispatch } from "@/store/hooks";
import { openDemoModal } from "@/store/slices/uiSlice";

export default function CorporateCta() {
  const dispatch = useAppDispatch();
  return (
    <section className="pb-16">
      <Container>
        <div className="flex flex-col items-start gap-5 rounded-lg border border-brand-100 bg-brand-50 p-6 sm:flex-row sm:items-center sm:p-8">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand-600 text-white"><Building2 className="h-6 w-6" /></span>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-ink">Need a custom corporate package?</h2>
            <p className="mt-1 text-sm text-body">Tell us about your fleet size and requirements and our corporate sales team will prepare a proposal.</p>
          </div>
          <Button onClick={() => dispatch(openDemoModal("Custom corporate package enquiry"))}>Request corporate package</Button>
        </div>
      </Container>
    </section>
  );
}
