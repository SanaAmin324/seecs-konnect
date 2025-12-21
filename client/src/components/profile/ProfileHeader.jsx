const ProfileHeader = () => {
  return (
    <div className="bg-white rounded-xl border p-5 flex items-center gap-4">
      <img
        src="https://i.pravatar.cc/80"
        alt="avatar"
        className="w-16 h-16 rounded-full"
      />

      <div>
        <h2 className="text-xl font-semibold">Fatima</h2>
        <p className="text-sm text-muted-foreground">
          542 karma • Joined Sep 2023
        </p>
        <p className="text-sm mt-1 text-gray-700">
          Software Engineering student
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
