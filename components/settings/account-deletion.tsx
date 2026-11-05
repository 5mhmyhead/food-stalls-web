"use client";

import { useRef } from "react";
import { useActionState } from "react";
import TextField from "../text-field";
import { deleteAccount } from "@/components/auth/actions";

export default function AccountDeletion() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState(deleteAccount, undefined);

  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        <h2 className="text-xl font-serif font-bold">Delete account</h2>
        <p className="text-muted">
          Permanently remove your account. Orders you handled stay in the
          shop&apos;s history.
        </p>
      </div>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="btn-primary"
      >
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
        <form action={action} className="flex flex-col gap-5 p-8">
          <h2 className="font-serif font-bold text-3xl">
            Delete your account?
          </h2>
          <p className="text-muted">
            This permanently deletes your account. Orders you handled stay in
            the shop&apos;s history. It cannot be undone.
          </p>

          <TextField
            id="deletePassword"
            name="password"
            type="password"
            label="Type your password to confirm"
            autoComplete="current-password"
            required
          />

          {state?.message && (
            <p className="text-sm text-red-600" role="alert">
              {state.message}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="btn-muted"
            >
              Cancel
            </button>
            <button type="submit" disabled={pending} className="btn-primary">
              {pending ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
