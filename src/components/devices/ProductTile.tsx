"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Eye, Heart, Phone, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button, LinkButton } from "@/components/common/Button";
import DeviceVisual from "./DeviceVisual";
import { SITE } from "@/lib/site";
import { deviceUrl } from "@/data/catalogue";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { openDeviceModal, setCartOpen, openDemoModal } from "@/store/slices/uiSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { cn, formatBDT } from "@/utils/format";
import ProductArt from "./ProductArt";
import type { Device } from "@/types";

export type TileProps = {
  image?: string;
  /** illustrated artwork shown instead of the photo */
  art?: React.ReactNode;
  visual?: Device["visual"];
  name: string;
  sub?: string;
  category?: string;
  specs?: { label: string; value: string }[];
  features?: string[];
  price?: number;
  priceDisplay?: string;
  monthly?: number;
  monthlyDisplay?: string;
  hot?: boolean;
  tag?: string;
  /** open details (quick view / modal); or `href` to navigate instead */
  onView?: () => void;
  href?: string;
  wished?: boolean;
  onWish?: () => void;
  /** add to cart; when absent a "Get Quote" button is shown */
  onAdd?: () => void;
  added?: boolean;
};

/**
 * Product card styled after the home page's DeviceCard:
 * - Rounded-md glass border with subtle hover elevation
 * - Transparent product image with wishlist heart
 * - Category eyebrow, bold title, 3 key specs, and 3 feature checkmarks
 * - Large price readout + monthly charge
 * - Dual action buttons: "Specs & Sensor" + "Order Now" / "Get Quote"
 */
export default function ProductTile({
  image,
  art,
  visual,
  name,
  sub,
  category,
  price,
  priceDisplay,
  monthly,
  monthlyDisplay,
  hot,
  onView,
  href,
  wished,
  onWish,
  onAdd,
  added,
}: TileProps) {
  const displayPrice = priceDisplay ?? (price ? formatBDT(price) : "Price on request");
  const displayMonthly = monthlyDisplay ?? (monthly ? `+ ${formatBDT(monthly)}/mo` : undefined);

  return (
    <motion.article
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-softer/80 transition-all duration-300 dark:bg-navy-900/90"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[858/600] w-full overflow-hidden bg-transparent">
        {hot && (
          <span className="absolute left-2 top-2 sm:left-3 sm:top-3 z-10 rounded-full bg-brand-600 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-white">
            Hot
          </span>
        )}

        {/* Wishlist Heart */}
        {onWish && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWish();
            }}
            aria-pressed={wished}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              "absolute right-2 top-2 sm:right-3 sm:top-3 z-10 grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full shadow-sm backdrop-blur-md transition-all hover:scale-105",
              wished
                ? "bg-red-50 text-red-500 ring-1 ring-red-300 dark:bg-red-950/60"
                : "bg-surface/85 text-slate-400 ring-1 ring-line hover:text-brand-text hover:bg-surface"
            )}
          >
            <Heart className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", wished && "fill-current")} />
          </button>
        )}

        {/* Media / Link */}
        {href ? (
          <Link href={href} aria-label={name} className="block h-full w-full">
            {art ? art : image ? (
              <Image
                src={image}
                alt={name}
                fill
                sizes="(min-width:1024px) 33vw, 100vw"
                className="object-contain"
              />
            ) : visual ? (
              <DeviceVisual kind={visual} />
            ) : null}
          </Link>
        ) : (
          <div onClick={onView} className="h-full w-full cursor-pointer">
            {art ? art : image ? (
              <Image
                src={image}
                alt={name}
                fill
                sizes="(min-width:1024px) 33vw, 100vw"
                className="object-contain"
              />
            ) : visual ? (
              <DeviceVisual kind={visual} />
            ) : null}
          </div>
        )}
      </div>

      {/* Card Content Area */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="truncate text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
          {category || sub}
        </p>

        {href ? (
          <Link
            href={href}
            className="mt-0.5 block truncate text-sm sm:text-[15px] font-medium leading-snug text-ink transition-colors hover:text-brand-text"
            title={name}
          >
            {name}
          </Link>
        ) : (
          <h3
            onClick={onView}
            className="mt-0.5 truncate text-sm sm:text-[15px] font-medium leading-snug text-ink cursor-pointer transition-colors hover:text-brand-text"
            title={name}
          >
            {name}
          </h3>
        )}

        {/* Bottom Price & Actions */}
        <div className="mt-auto pt-3">
          {/* fixed two lines (price + monthly) so every card is the same height */}
          <div className="flex justify-between">
            <p className="truncate text-base sm:text-lg font-semibold leading-tight tracking-tight text-ink">{displayPrice}</p>
            <p className="mt-0.5 h-4 truncate text-[11px] leading-4 text-body sm:text-xs">{displayMonthly ?? "\u00a0"}</p>

          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {onAdd ? (
              <Button
                size="sm"
                variant={added ? "outline" : "primary"}
                onClick={onAdd}
                className={cn("flex-1 py-1.5 text-xs font-medium", added && "border-emerald-600 text-emerald-700 dark:text-emerald-400")}
              >
                {added ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>Order Now</span>
                  </>
                )}
              </Button>
            ) : (
              <LinkButton href={`tel:${SITE.phone}`} size="sm" variant="outline" className="flex-1 py-1.5 text-xs font-medium">
                <Phone className="h-3.5 w-3.5" />
                <span>Get Quote</span>
              </LinkButton>
            )}

            {onView && (
              <button
                type="button"
                onClick={onView}
                title="Quick view specs"
                aria-label="View specs"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-surface text-slate-500 shadow-xs transition-colors hover:bg-brand-50 hover:text-brand-text dark:bg-navy-800 dark:hover:bg-navy-700"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/** ProductTile wired to the store for a device: specs, features, quick view, wishlist, and cart. */
export function DeviceTile({ d }: { d: Device }) {
  const dispatch = useAppDispatch();
  const wished = useAppSelector((s) => s.wishlist.ids.includes(d.id));
  const added = useAppSelector((s) => s.cart.items.some((i) => i.id === `dev-${d.id}`));

  return (
    <ProductTile
      art={<ProductArt d={d} />}
      visual={d.visual}
      name={d.name}
      category={d.category}
      sub={d.subcategory}
      specs={d.specs}
      features={d.features}
      price={d.price}
      priceDisplay={d.price ? formatBDT(d.price) : "Price on request"}
      monthly={d.monthly}
      monthlyDisplay={d.monthly ? `+ ${formatBDT(d.monthly)}/mo` : undefined}
      hot={!!d.price}
      href={deviceUrl(d)}
      onView={() => dispatch(openDeviceModal(d.id))}
      wished={wished}
      onWish={() => {
        dispatch(toggleWishlist(d.id));
        toast.success(wished ? `${d.name} removed from wishlist` : `${d.name} added to wishlist`);
      }}
      added={added}
      onAdd={
        d.price
          ? () => {
            dispatch(addToCart({ id: `dev-${d.id}`, kind: "device", name: d.name, price: d.price!, monthly: d.monthly }));
            dispatch(setCartOpen(true));
            toast.success(`${d.name} added to cart`);
          }
          : () => {
            dispatch(openDemoModal(`Quote request: ${d.name}`));
          }
      }
    />
  );
}

export function categoryTag(category: string) {
  if (category.startsWith("Video")) return "VIDEO";
  if (category.startsWith("Voice")) return "VOICE";
  if (category.startsWith("Vehicle")) return "HW";
  return "GPS";
}