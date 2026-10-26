"use client";

import TextField from "../text-field";

export default function AccountDetails({
  username,
  email,
}: {
  username: string;
  email: string;
}) {

  return (
    <form className="flex flex-col gap-6">
      <div className="grid gap-4 grid-cols-2">
        <TextField id="username" name="username" label="Username" defaultValue={username} />
        <TextField id="email" name="email" label="Email Address" type="email" defaultValue={email} />
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" className="btn-primary">
          Update Profile
        </button>
      </div>
    </form>
  );
}