import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#93A692",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="9" width="16" height="10" rx="1.5" />
          <path d="M4 9h16" />
          <path d="M12 9v10" />
          <path d="M8 9c-1.4 0-2.5-1-2.5-2.4C5.5 5.2 6.6 4 8 4c1.7 0 3 1.7 4 5-1 0-2.6 0-4 0z" />
          <path d="M16 9c1.4 0 2.5-1 2.5-2.4C18.5 5.2 17.4 4 16 4c-1.7 0-3 1.7-4 5 1 0 2.6 0 4 0z" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
