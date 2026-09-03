export const EVENTS = [
  { id: "cumple", label: "Cumpleaños", image: "/icons/torta.png" },
  { id: "baby_shower", label: "Baby shower", image: "/icons/osito.png" },
  { id: "nacimiento", label: "Nacimiento", image: "/icons/chupete.png" },
  { id: "bautismo", label: "Bautismo", image: "/icons/paloma.png" },
  { id: "comunion", label: "Comunión", image: "/icons/libro_cruz.png" },
  { id: "quince", label: "15 años", image: "/icons/corona.png" },
  { id: "casamiento", label: "Casamiento", image: "/icons/anillos.png" },
  { id: "mudanza", label: "Casa nueva / Mudanza", image: "/icons/casa.png" },
  { id: "graduacion", label: "Graduación / Recibida", emoji: "🎓" },
  { id: "otro", label: "Otro evento", image: "/icons/estrellas.png" },
];

export const EVENT_LABELS: Record<string, string> = Object.fromEntries(
  EVENTS.map((e) => [e.id, e.label])
);
