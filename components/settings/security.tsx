"use client";

import { useActionState } from "react";
import TextField from "../text-field";
import { changePassword, signOutOtherDevices } from "@/components/auth/actions";

interface SecurityProps {
  accountType?: "WORKER" | "ADMIN";
}

export default function Security({ accountType = "WORKER" }: SecurityProps) {
  const [pwState, pwAction, pwPending] = useActionState(
    changePassword,
    undefined,
  );
  const [soState, soAction, soPending] = useActionState(
    signOutOtherDevices,
    undefined,
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-serif text-xl font-bold">Change Password</h2>
        <p className="text-muted">
          Your new password should contain at least 8 characters, a capital
          letter, and a number.
        </p>
      </div>
      <form className="flex flex-col gap-4" action={pwAction}>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            id="currentPassword"
            name="currentPassword"
            label="Current Password"
            type="password"
            autoComplete="current-password"
            required
          />
          <TextField
            id="newPassword"
            name="newPassword"
            label="New password"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>

        {pwState?.message && (
          <p className="text-primary" role="status">
            {pwState.message}
          </p>
        )}

        <div className="flex items-center gap-4">
          <button type="submit" disabled={pwPending} className="btn-primary">
            {pwPending ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>

      {accountType === "ADMIN" && (
        <>
          <hr className="border-t-2 border-background" />

          <form className="flex flex-col gap-4" action="">
            <div>
              <h2 className="font-serif text-xl font-bold">Admin Access Code</h2>
              <p className="text-muted">
                Update the access code for workers to upgrade their account to admin.
              </p>
            </div>

            <TextField
              id="staffCode"
              name="staffCode"
              label="Staff access code"
              autoComplete="off"
              spellCheck={false}
              required
            />

            <div className="flex items-center gap-4">
              <button type="submit" className="btn-primary">
                Update Access Code
              </button>
            </div>
          </form>
        </>
      )}

      <hr className="border-t-2 border-background" />

      <form action={soAction} className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold">
              Sign Out of All Devices
            </h2>
            <p className="text-muted">
              This will sign you out of all sessions and devices, except this
              one.
            </p>
          </div>
          <button type="submit" disabled={soPending} className="btn-primary">
            {soPending ? "Signing out..." : "Sign Out"}
          </button>
        </div>
        {soState?.message && (
          <p className="text-primary" role="status">
            {soState.message}
          </p>
        )}
      </form>
    </div>
  );
}