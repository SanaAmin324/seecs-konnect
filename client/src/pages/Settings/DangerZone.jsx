export default function DangerZone() {
  return (
    <section className="border border-destructive rounded-xl p-6">
      <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
      <button className="mt-4 text-sm text-destructive">
        Delete Account
      </button>
    </section>
  );
}
