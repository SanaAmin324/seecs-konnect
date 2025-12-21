const ProfileAboutCard = () => {
  return (
    <div className="bg-card rounded-xl border p-4 space-y-2">
      <h3 className="font-semibold text-card-foreground">About</h3>
      <p className="text-sm text-muted-foreground">
        Software Engineering student interested in web development.
      </p>

      <div className="text-sm text-card-foreground">
        <p>🧠 Karma: 542</p>
        <p>📅 Joined: Sep 2023</p>
      </div>
    </div>
  );
};

export default ProfileAboutCard;
