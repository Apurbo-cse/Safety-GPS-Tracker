"use client";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/common/Modal";
import { LinkButton } from "@/components/common/Button";
import { features } from "@/data/features";
import { isPackageFeature, packagesFor } from "@/lib/featurePackages";
import { formatBDT } from "@/utils/format";
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
            {f.image ? <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-md bg-white p-1.5 ring-1 ring-line"><Image src={f.image} alt="" width={64} height={64} className="h-full w-full object-contain" /></span> : <span className="grid h-12 w-12 place-items-center rounded-md bg-brand-50 text-brand-text"><DynIcon name={f.icon} className="h-6 w-6" /></span>}
            <span className="rounded-full bg-softer px-2.5 py-1 text-xs font-semibold text-body">{f.category}</span>
          </div>
          <p className="text-sm leading-relaxed text-body-strong">{f.description}</p>
          <p className="mt-3 text-sm leading-relaxed text-body">{f.detail}</p>
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-body">Included in</p>
            {isPackageFeature(f.id) ? (
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {packagesFor(f.id).map((p) => <li key={p.id} className="flex items-center justify-between gap-2 rounded-md bg-soft px-3 py-2 text-sm"><span className="truncate font-medium text-ink">{p.name}</span><span className="shrink-0 text-xs tabular-nums text-body">{formatBDT(p.devicePrice)} + {formatBDT(p.monthlyCharge)}/mo</span></li>)}
              </ul>
            ) : <p className="mt-1 text-sm text-body">A platform capability. The price list does not break this feature down per package — ask sales to confirm for your package.</p>}
          </div>
          <p className="mt-4 rounded-md bg-soft p-3 text-xs text-slate-500">Availability can differ by package. Check the <Link href="/pricing" className="font-semibold text-brand-text underline" onClick={() => dispatch(openFeatureModal(null))}>pricing comparison</Link> for exactly what each plan lists.</p>
          <div className="mt-5 flex gap-3">
            <LinkButton href="/pricing" size="sm" onClick={() => dispatch(openFeatureModal(null))}>View pricing</LinkButton>
          </div>
        </div>
      )}
    </Modal>
  );
}
