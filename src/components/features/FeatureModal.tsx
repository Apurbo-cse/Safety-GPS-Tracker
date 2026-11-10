"use client";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/common/Modal";
import { LinkButton } from "@/components/common/Button";
import { features } from "@/data/features";
import { DynIcon } from "@/lib/icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openFeatureModal } from "@/store/slices/uiSlice";

export default function FeatureModal() {
  const dispatch = useAppDispatch();
  const id = useAppSelector((s) => s.ui.featureModalId);
  const f = features.find((x) => x.id === id);
  return (
    <Modal open={!!f} onClose={() => dispatch(openFeatureModal(null))} title={f?.title ?? ""}>
      {f && (
        <div>
          <div className="mb-4 flex items-center gap-3">
            {f.image ? <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-xl bg-white p-1.5 ring-1 ring-line"><Image src={f.image} alt="" width={64} height={64} className="h-full w-full object-contain" /></span> : <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-text"><DynIcon name={f.icon} className="h-6 w-6" /></span>}
            <span className="rounded-full bg-softer px-2.5 py-1 text-xs font-semibold text-body">{f.category}</span>
          </div>
          <p className="text-sm leading-relaxed text-body-strong">{f.description}</p>
          <p className="mt-3 text-sm leading-relaxed text-body">{f.detail}</p>
          <p className="mt-4 rounded-lg bg-soft p-3 text-xs text-slate-500">Availability can differ by package. Check the <Link href="/pricing" className="font-semibold text-brand-text underline" onClick={() => dispatch(openFeatureModal(null))}>pricing comparison</Link> for exactly what each plan lists.</p>
          <div className="mt-5 flex gap-3">
            <LinkButton href="/pricing" size="sm" onClick={() => dispatch(openFeatureModal(null))}>View pricing</LinkButton>
          </div>
        </div>
      )}
    </Modal>
  );
}
