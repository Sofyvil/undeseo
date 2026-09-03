export const EVENTS = [
  { id: "cumple", label: "Cumpleaños", image: "/icons/torta.png" },
  { id: "baby_shower", label: "Baby shower", image: "/icons/osito.png" },
  { id: "nacimiento", label: "Nacimiento", image: "/icons/chupete.png" },
  { id: "bautismo", label: "Bautismo", emoji: "✝️" },
  { id: "comunion", label: "Comunión", emoji: "📖" },
  { id: "quince", label: "15 años", emoji: "👑" },
  { id: "casamiento", label: "Casamiento", emoji: "💍" },
  { id: "mudanza", label: "Casa nueva / Mudanza", emoji: "🏠" },
  { id: "otro", label: "Otro evento", image: "/icons/estrellas.png" },
];

export const EVENT_LABELS: Record<string, string> = Object.fromEntries(
  EVENTS.map((e) => [e.id, e.label])
);
