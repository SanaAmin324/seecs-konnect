const ProfileComments = () => {
  const comments = [
    {
      id: 1,
      text: "This explanation really helped!",
      postTitle: "React Hooks",
      time: "2h ago",
    },
  ];

  return (
    <div className="space-y-4">
      {comments.map((c) => (
        <div key={c.id} className="bg-card border rounded-xl p-4">
          <p className="text-sm text-card-foreground">{c.text}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Commented on {c.postTitle} • {c.time}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProfileComments;
