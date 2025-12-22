import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfileSettings() {
  const [name, setName] = useState("");
  const [program, setProgram] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;
    const user = JSON.parse(raw);

    setName(user?.name || "");
    setProgram(user?.program || "");
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const raw = localStorage.getItem("user");
      const token = JSON.parse(raw)?.token;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("program", program);
      if (avatar) formData.append("avatar", avatar);

      await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      alert("Profile updated");
    } catch {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-semibold">Profile</h2>

      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarImage />
          <AvatarFallback>{name?.[0]}</AvatarFallback>
        </Avatar>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm">Program</label>
        <input
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <Button onClick={handleSave} disabled={loading}>
        Save Changes
      </Button>
    </section>
  );
}
