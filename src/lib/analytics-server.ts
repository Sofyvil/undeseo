import { PostHog } from "posthog-node";

let client: PostHog | null = null;

function getClient() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  if (!client) {
    client = new PostHog(key, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return client;
}

// Usar esto desde server actions para eventos clave (creación de lista,
// reserva de un regalo, etc). distinctId puede ser el user id, el mail,
// o cualquier identificador estable de quien hace la acción.
export async function trackServer(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>
) {
  const ph = getClient();
  if (!ph) return;
  ph.capture({ distinctId, event, properties });
  await ph.shutdown();
}
