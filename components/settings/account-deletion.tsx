"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TextField from "../text-field";

const CONFIRM_WORD = "DELETE";

export default function AccountDeletion() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [typed, setTyped] = useState("");

  const openDialog = () => {
    setTyped("");
    dialogRef.current?.showModal();
  };

  const handleDelete = async () => {
    try {
      // delete account logic
      router.replace("/");
    } catch(error) {
      console.error(error);
    }
  };

  return(
    <div className="flex flex-row items-center justify-between">
      <div>
        <h2 className="text-xl font-serif font-bold">Delete account</h2>
        <p className="text-muted">
          Permanently remove your account and everything attached to it.
        </p>
      </div>
      <button type="button" onClick={openDialog} className="btn-primary">
        Delete Account
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          // clicking the dimmed backdrop closes it
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto w-full max-w-md rounded-2xl bg-surface text-onSurface backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="flex flex-col gap-5 p-8">
          <h2 className="font-serif font-bold text-3xl">
            Delete your account?
          </h2>
          <p className="text-muted">
            This permanently deletes your profile and its associated order and menu history. It cannot be undone.
          </p>

          <TextField
            id="password"
            type="password"
            label="Type your password to confirm"
            required  
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="btn-primary"
            >
              Delete Account
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}