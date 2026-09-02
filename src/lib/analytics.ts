"use client";

import posthog from "posthog-js";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

let initialized = false;

export function initPostHog() {
  if (initialized || !KEY || typeof window === "undefined") return;
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: false,
    capture_pageleave: true,
  });
  initialized = true;
}

// Usar esto desde cualquier componente de cliente para marcar un momento
// importante, ej: track("lista_creada", { eventType: "baby_shower" })
export function track(event: string, props?: Record<string, unknown>) {
  initPostHog();
  if (!KEY || typeof window === "undefined") return;
  posthog.capture(event, props);
}
