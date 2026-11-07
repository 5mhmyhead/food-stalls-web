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
    <form className="flex flex-col gap-4" action={action}>
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
  );
}
