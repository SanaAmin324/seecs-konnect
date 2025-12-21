const ProfileFavourites = () => {
  const docs = [
    { id: 1, title: "DSA Notes PDF", type: "PDF" },
    { id: 2, title: "OS Memory Management Slides", type: "Slides" },
  ];

  return (
    <div className="space-y-4">
      {docs.map((doc) => (
        <div key={doc.id} className="bg-white border rounded-xl p-4">
          <h4 className="font-medium">{doc.title}</h4>
          <p className="text-xs text-muted-foreground">{doc.type}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileFavourites;
