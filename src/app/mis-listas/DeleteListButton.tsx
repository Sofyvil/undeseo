"use client";

import { deleteList } from "./actions";

export function DeleteListButton({
  listId,
  listName,
}: {
  listId: string;
  listName: string;
}) {
  return (
    <form
      action={() => deleteList(listId)}
      onSubmit={(e) => {
        const ok = window.confirm(
          `¿Borrar "${listName}"? Esta acción no se puede deshacer: se van a borrar la lista y todos sus regalos.`
        );
        if (!ok) e.preventDefault();
      }}
    >
      <button
        type="submit"
        aria-label={`Borrar lista ${listName}`}
        className="text-[0.75rem] text-rose-dark underline shrink-0"
      >
        Borrar
      </button>
    </form>
  );
}
