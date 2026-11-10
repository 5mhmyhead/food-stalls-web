"use client";

import { useRef, useActionState } from "react";
import TextField from "../text-field";
import {
  updateProfile,
  revertToWorker,
  verifyAccessCode,
} from "@/components/auth/actions";

export interface AccountDetailsProps {
  username: string;
  email: string;
  accountType?: "WORKER" | "ADMIN";
}

export default function AccountDetails({
  username,
  email,
  accountType = "WORKER",
}: AccountDetailsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [state, action, pending] = useActionState(updateProfile, undefined);
  const [codeState, codeAction, checking] = useActionState(
    verifyAccessCode,
    undefined,
  );
  const [revertState, revertAction, reverting] = useActionState(
    revertToWorker,
    undefined,
  );

  const formattedRole = accountType.toLowerCase();

  return (
    <div className="flex flex-col gap-6">
      <form className="flex flex-col gap-4" action={action}>
        <div>
          <h2 className="font-serif text-xl font-bold">
            Change Account Details
          </h2>
          <p className="text-muted">
            You can change your username and email below.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField
            id="username"
            name="username"
            label="Username"
            required
            defaultValue={state?.username ?? username}
          />
          <TextField
            id="email"
            name="email"
            label="Email Address"
            type="email"
            required
            defaultValue={state?.email ?? email}
          />
        </div>

        {state?.message && (
          <p className="text-primary" role="status">
            {state.message}
          </p>
        )}

        <div className="flex items-center gap-4">
          <button type="submit" disabled={pending} className="btn-primary">
            {pending ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </form>

      <hr className="border-t-2 border-background" />

      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold">Account Type</h2>
            <p className="text-muted">
              Your current account type is{" "}
              <span className="font-bold capitalize text-onSurface">
                {formattedRole}
              </span>
              .
              {accountType === "WORKER" &&
                " If you have a staff access code, you can enter it below to upgrade your account to admin."}
              {accountType === "ADMIN" &&
                " You currently have full administrative access for the application."}
            </p>
          </div>
          {accountType === "ADMIN" && (
            <button
              type="button"
              onClick={() => dialogRef.current?.showModal()}
              className="btn-primary shrink-0"
            >
              Revert to Worker
            </button>
          )}
        </div>

        {accountType === "WORKER" && (
          <form action={codeAction} className="flex flex-col gap-4">
            <TextField
              id="accessCode"
              name="accessCode"
              label="Admin Access Code"
              autoComplete="off"
              spellCheck={false}
              required
              className="font-mono tracking-widest"
            />

            {codeState?.message && (
              <p
                className="text-primary"
                role="status"
              >
                {codeState.message}
              </p>
            )}

            <div className="flex items-center gap-4">
              <button type="submit" disabled={checking} className="btn-primary">
                {checking ? "Verifying..." : "Verify Access Code"}
              </button>
            </div>
          </form>
        )}
      </div>

      {accountType === "ADMIN" && (
        <dialog
          ref={dialogRef}
          onClick={(e) => {
            if (e.target === dialogRef.current) dialogRef.current?.close();
          }}
          className="m-auto w-full max-w-md rounded-2xl bg-surface text-onSurface backdrop:bg-black/60 backdrop:backdrop-blur-sm"
        >
          <form action={revertAction} className="flex flex-col gap-5 p-8">
            <h2 className="font-serif text-3xl font-bold">Revert to worker?</h2>
            <p className="text-muted">
              You will lose administrative access, including analytics and
              management privileges. You will need a staff access code to become
              an admin again.
            </p>

            <TextField
              id="revertPassword"
              name="password"
              type="password"
              label="Type your password to confirm"
              autoComplete="current-password"
              required
            />

            {revertState?.message && !revertState.success && (
              <p className="text-sm text-red-600" role="alert">
                {revertState.message}
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
              <button
                type="submit"
                disabled={reverting}
                className="btn-primary"
              >
                {reverting ? "Reverting..." : "Revert Account"}
              </button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
}
