"use client";
import { useAppSelector } from "@/store/hooks";
import type { Permission } from "./api";

/** True when the signed-in person may do `permission` in the admin panel (the owner has them all). */
export function useCan(permission: Permission): boolean {
  return useAppSelector((s) => !!s.auth.user?.permissions.includes(permission));
}
