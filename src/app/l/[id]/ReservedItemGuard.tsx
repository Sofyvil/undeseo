"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export function ReservedItemGuard({
  enabled,
  productUrl,
  className,
  children,
}: {
  enabled: boolean;
  productUrl: string | null;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const backButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    backButtonRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function handleClickCapture(e: MouseEvent<HTMLDivElement>) {
    if (!enabled) return;
    const target = e.target as HTMLElement;
    if (target.closest("[data-reserved-trigger]")) {
      e.preventDefault();
      setOpen(true);
    }
  }

  return (
    <div className={className} onClickCapture={handleClickCapture}>
      {children}

      {open &&
        createPortal(
          <div
            className="animate-modal-fade fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-5 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={(e) => e.stopPropagation()}
              className="animate-modal-pop w-full max-w-sm rounded-[20px] border border-line bg-white px-6 py-7 text-center shadow-xl"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue">
                <Image src="/icon-gift.png" alt="" width={30} height={30} />
              </div>

              <h2
                id={titleId}
                className="font-display text-[1.3rem] font-semibold leading-snug text-ink"
              >
                Este regalo ya está reservado
              </h2>
              <p className="mt-2.5 text-[0.92rem] leading-snug text-ink-soft">
                Otro invitado ya eligió regalarlo, así evitamos regalos
                repetidos.
              </p>
              <p className="mt-1.5 text-[0.92rem] leading-snug text-ink-soft">
                Te invitamos a elegir otro de la lista.
              </p>

              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  ref={backButtonRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-full bg-sage py-3 text-[0.9rem] font-semibold text-white transition-colors hover:bg-sage-dark"
                >
                  Volver a la lista
                </button>
                {productUrl && (
                  <a
                    href={productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rounded-full border border-line bg-white py-3 text-[0.9rem] font-semibold text-sage-dark transition-colors hover:bg-cream-2"
                  >
                    Ver producto
                  </a>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
