"use client";

import { useActionState } from "react";
import TextField from "../text-field";
import { updateProfile } from "@/components/auth/actions";

export default function AccountDetails({
  username,
  email,
}: {
  username: string;
  email: string;
}) {
  const [state, action, pending] = useActionState(updateProfile, undefined);

  return (
    <div className="flex flex-col gap-6">
      <form className="flex flex-col gap-4" action={action}>
        <div>
          <h2 className="text-xl font-serif font-bold">Change Account Details</h2>
          <p className="text-muted">
            You can change your username and email below.
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2">
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
          <p
            className="text-primary"
            role="status"
          >
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

      <form className="flex flex-col gap-4" action="">
        <div>
          <h2 className="text-xl font-serif font-bold">Account Type</h2>
          <p className="text-muted">
            Your current account type is employee. If you have a staff access code, you can enter it below. This will upgrade your account to admin.
          </p>
        </div>

        <TextField
          id="staffCode"
          name="staffCode"
          label="Admin Access Code"
          autoComplete="off"
          spellCheck={false}
          required
        />

        <div className="flex items-center gap-4">
          <button type="submit"  className="btn-primary">
            Verify Access Code
          </button>
        </div>
      </form>
    </div>
  );
}
