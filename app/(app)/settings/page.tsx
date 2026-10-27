import SettingsSection from "@/components/settings/settings-section";
import AccountDetails from "@/components/settings/account-details";
import Security from "@/components/settings/security";
import AccountDeletion from "@/components/settings/account-deletion";
import Preferences from "@/components/settings/preferences";

export default async function SettingsPage() {
  // mock profile data
  const user = { username: "dwyanesido", email: "moonlight.sido@gmail.com", accountType: "admin" };

  return (
    <section className="h-full w-full rounded-3xl overflow-auto">
      <h1 className="font-serif font-black text-6xl">Settings</h1>
      <div className="flex flex-col pt-6 gap-4">
        <SettingsSection title="Account Details">
          <AccountDetails username={user.username} email={user.email} />
        </SettingsSection>
        <SettingsSection title="Security">
          <Security/>
        </SettingsSection>
        <SettingsSection title="Preferences">
          <Preferences isManager={user.accountType === "admin"} />
        </SettingsSection>
        <SettingsSection title="Account Deletion">
          <AccountDeletion/>
        </SettingsSection>
      </div>
    </section>
  );
}