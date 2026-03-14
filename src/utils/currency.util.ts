export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

export function formatPrice(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function calculateTotalPrice(
  pricePerNight: number,
  checkIn: Date,
  checkOut: Date,
): number {
  const nights = diffInDays(checkIn, checkOut);
  return pricePerNight * nights;
}

import { diffInDays } from "./date.util";