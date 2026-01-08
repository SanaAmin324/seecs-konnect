import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfileSettings() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [program, setProgram] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [usernameError, setUsernameError] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;
    const user = JSON.parse(raw);

    setName(user?.name || "");
    setUsername(user?.username || "");
    setProgram(user?.program || "");
  }, []);

  // Check username availability with debounce
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;
    const currentUser = JSON.parse(raw);
    
    // Skip if username hasn't changed
    if (!username || username === currentUser?.username) {
      setUsernameAvailable(null);
      setUsernameError("");
      return;
    }

    // Validate format first
    const usernameRegex = /^[a-z0-9_.]+$/;
    if (!usernameRegex.test(username)) {
      setUsernameError("Only lowercase letters, numbers, underscores, and dots allowed");
      setUsernameAvailable(false);
      return;
    }
    
    if (username.length < 3 || username.length > 30) {
      setUsernameError("Username must be 3-30 characters");
      setUsernameAvailable(false);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingUsername(true);
      setUsernameError("");
      try {
        const response = await fetch(`http://localhost:5000/api/profile/check-username/${username}`);
        const data = await response.json();
        
        if (response.ok) {
          setUsernameAvailable(data.available);
          if (!data.available) {
            setUsernameError("Username is already taken");
          }
        } else {
          setUsernameError(data.message || "Invalid username");
          setUsernameAvailable(false);
        }
      } catch (error) {
        console.error("Error checking username:", error);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const raw = localStorage.getItem("user");
      const token = JSON.parse(raw)?.token;
      const currentUser = JSON.parse(raw);

      // Update profile via API
      const response = await fetch("http://localhost:5000/api/profile/update", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username !== currentUser?.username ? username : undefined,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update localStorage with new data
        localStorage.setItem("user", JSON.stringify({ ...currentUser, ...updatedUser }));
        alert("Profile updated successfully!");
      } else {
        const error = await response.json();
        alert(error.message || "Update failed");
      }
    } catch (error) {
      console.error("Error:", error);
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
        <label className="text-sm font-medium">Username</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="username"
            pattern="[a-z0-9_.]+"
            minLength={3}
            maxLength={30}
            className={`w-full border rounded-lg pl-8 pr-3 py-2 ${
              usernameError ? 'border-red-500' : usernameAvailable ? 'border-green-500' : ''
            }`}
          />
          {checkingUsername && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Checking...</span>
          )}
        </div>
        {usernameError && (
          <p className="text-xs text-red-600">{usernameError}</p>
        )}
        {usernameAvailable && !usernameError && (
          <p className="text-xs text-green-600">✓ Username is available</p>
        )}
        <p className="text-xs text-muted-foreground">3-30 characters. Only lowercase letters, numbers, _ and .</p>
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
