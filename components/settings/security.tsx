"use client";

import TextField from "../text-field";

export default function Security() {
  return(
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-serif font-bold">Change Password</h2>
        <p className="text-muted">Your new password should contain at least 8 characters, a capital letter, and a number.</p>
      </div>
      <form className="flex flex-col gap-4">
        <div className="grid gap-4 grid-cols-2">
          <TextField id="currentPassword" name="currentPassword" label="Current Password" type="password" />
          <TextField id="newPassword" name="newPassword" label="New password" type="password" />
        </div>
      
        <div className="flex items-center gap-4">
          <button type="submit" className="btn-primary">
            Change Password
          </button>
        </div>
      </form>
      <hr className="border-t-2 border-background" />
      <div className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold">Sign Out of All Devices</h2>
          <p className="text-muted">
            This will sign you out of all sessions and devices, except this one.
          </p>
        </div>
        <button type="submit" className="btn-primary">
          Sign Out
        </button>
      </div>
    </div>
  );
}