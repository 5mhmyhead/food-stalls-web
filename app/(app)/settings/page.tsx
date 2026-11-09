import SettingsSection from "@/components/settings/settings-section";
import AccountDetails from "@/components/settings/account-details";
import Security from "@/components/settings/security";
import AccountDeletion from "@/components/settings/account-deletion";
import Preferences from "@/components/settings/preferences";
import { verifyUser } from "@/lib/dal";

export default async function SettingsPage() {
  const user = await verifyUser();

  return (
    <section className="h-full w-full rounded-3xl overflow-auto">
      <h1 className="font-serif font-black text-6xl pl-2">Settings</h1>
      <div className="flex flex-col pt-6 gap-4">
        <SettingsSection title="Account Details">
          <AccountDetails
            username={user.username}
            email={user.email}
            accountType={user.role}
          />
        </SettingsSection>
        <SettingsSection title="Security">
          <Security accountType={user.role} />
        </SettingsSection>
        <SettingsSection title="Preferences">
          <Preferences isManager={user.role === "ADMIN"} />
        </SettingsSection>
        <SettingsSection title="Account Deletion">
          <AccountDeletion />
        </SettingsSection>
      </div>
    </section>
  );
}
