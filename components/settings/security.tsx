"use client";

import { useActionState } from "react";
import TextField from "../text-field";
import { changePassword, signOutOtherDevices } from "@/components/auth/actions";

export default function Security() {
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
        <h2 className="text-xl font-serif font-bold">Change Password</h2>
        <p className="text-muted">
          Your new password should contain at least 8 characters, a capital
          letter, and a number.
        </p>
      </div>
      <form className="flex flex-col gap-4" action={pwAction}>
        <div className="grid gap-4 grid-cols-2">
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
          <p
            className={`text-sm ${pwState.success ? "text-green-700" : "text-red-600"}`}
            role="status"
          >
            {pwState.message}
          </p>
        )}

        <div className="flex items-center gap-4">
          <button type="submit" disabled={pwPending} className="btn-primary">
            {pwPending ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
      <hr className="border-t-2 border-background" />
      <form action={soAction} className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold">
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
          <p
            className={`text-sm ${soState.success ? "text-green-700" : "text-red-600"}`}
            role="status"
          >
            {soState.message}
          </p>
        )}
      </form>
    </div>
  );
}
