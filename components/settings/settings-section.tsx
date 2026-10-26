
type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function SettingsSection({
  title,
  children,
}: SettingsSectionProps) {
  return (
    <div className="w-full rounded-3xl bg-surface p-6">
      <h2 className="font-serif font-bold text-4xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}