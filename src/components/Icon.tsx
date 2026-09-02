const PATHS: Record<string, React.ReactNode> = {
  tag: (
    <>
      <path d="M20 12.5L12.5 20a2 2 0 0 1-2.8 0l-5.7-5.7a2 2 0 0 1 0-2.8L11.5 4H18a2 2 0 0 1 2 2v6.5z" />
      <circle cx="15" cy="7" r="1.4" />
    </>
  ),
  balloon: (
    <>
      <path d="M12 3c-3.3 0-5.5 2.6-5.5 5.8 0 3.6 2.7 6.7 5.1 7.6.2.08.4.08.6 0 2.4-.9 5.1-4 5.1-7.6C17.5 5.6 15.3 3 12 3z" />
      <path d="M12 16.4v2.1M10.6 20.5c.4.5.9.8 1.4.8s1-.3 1.4-.8" />
    </>
  ),
  newborn: (
    <>
      <circle cx="12" cy="7" r="2.6" />
      <path d="M7 20c0-4.2 2.2-7 5-7s5 2.8 5 7" />
      <path d="M7 20h10" />
    </>
  ),
  cake: (
    <>
      <path d="M4 20v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6" />
      <path d="M3 20h18" />
      <path d="M8 12V9M16 12V9" />
      <path d="M12 12V6" />
      <path d="M12 6c-.9-.6-1-1.6-.2-2.6.6.9 1.4 1.2 1.4 2.1 0 .6-.5 1-1.2 1z" />
    </>
  ),
  sparkle: <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" />,
  list: (
    <>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6" r="1.3" />
      <circle cx="4.5" cy="12" r="1.3" />
      <circle cx="4.5" cy="18" r="1.3" />
    </>
  ),
  share: (
    <>
      <circle cx="6" cy="12" r="2.2" />
      <circle cx="18" cy="5.5" r="2.2" />
      <circle cx="18" cy="18.5" r="2.2" />
      <path d="M7.8 10.8l8.4-4.4M7.8 13.2l8.4 4.4" />
    </>
  ),
  gift: (
    <>
      <rect x="4" y="9" width="16" height="10" rx="1.5" />
      <path d="M4 9h16" />
      <path d="M12 9v10" />
      <path d="M8 9c-1.4 0-2.5-1-2.5-2.4C5.5 5.2 6.6 4 8 4c1.7 0 3 1.7 4 5-1 0-2.6 0-4 0z" />
      <path d="M16 9c1.4 0 2.5-1 2.5-2.4C18.5 5.2 17.4 4 16 4c-1.7 0-3 1.7-4 5 1 0 2.6 0 4 0z" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
      <path d="M4 9.5h16" />
      <path d="M8 3v4M16 3v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.8v4.5l3 2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-7.3 7-12.2A7 7 0 1 0 5 8.8C5 13.7 12 21 12 21z" />
      <circle cx="12" cy="8.8" r="2.3" />
    </>
  ),
};

export function Icon({
  name,
  className = "w-5 h-5",
}: {
  name: keyof typeof PATHS;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name]}
    </svg>
  );
}
