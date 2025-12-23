import { Sun, Moon, Bell, LogOut, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import UserProfile from "../pages/UserProfile";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [forumQuery, setForumQuery] = useState("");
  const [forumFilter, setForumFilter] = useState("relevance");

  const [userName, setUserName] = useState(null);
  const [username, setUsername] = useState(null); // ✅ FIX ADDED
  const [profilePicture, setProfilePicture] = useState(null);

  const location = useLocation();
  const pathname = location.pathname;

  // Page context
  const isDashboard = pathname === "/dashboard";
  const isDocuments = pathname.startsWith("/documents");
  const isForums = pathname.startsWith("/forums");
  const isForumPage = pathname.startsWith("/forums");


  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return;

      const parsed = JSON.parse(raw);

      const name = parsed?.name || parsed?.user?.name || parsed?.data?.name;

      const uname =
        parsed?.username ||
        parsed?.user?.username ||
        parsed?.data?.username ||
        null;

      const userId = parsed?._id || parsed?.user?._id || parsed?.data?._id;

      if (name) setUserName(name);
      if (uname) setUsername(uname);

      // Fetch full profile to get profile picture
      if (userId && parsed?.token) {
        fetch(`http://localhost:5000/api/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${parsed.token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.profilePicture) {
              setProfilePicture(data.profilePicture);
            }
          })
          .catch(() => {
            // ignore errors
          });
      }
    } catch {
      // ignore
    }
  }, []);

  const profileUrl = username
    ? `/u/${username}`
    : userName
    ? `/u/${userName.replace(/\s+/g, "-").toLowerCase()}`
    : "/dashboard";

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-sidebar backdrop-blur-sm border-b-2 border-sidebar-border">
      {/* Left side */}
      <div className="md:hidden">
        <SidebarTrigger className="p-2 rounded-full hover:bg-primary/10" />
      </div>

      <div className="flex-1 min-w-0">
        {/* DASHBOARD SEARCH */}
        {isDashboard && (
          <div className="flex w-full max-w-2xl bg-card rounded-xl shadow-sm overflow-hidden border border-border">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 px-4 py-2 bg-card focus:outline-none"
            />

            {/* Desktop: show quick filter buttons; Mobile: compact select */}
            <div className="hidden sm:flex">
              <Button variant="ghost" size="sm">
                Accounts
              </Button>
              <Button variant="ghost" size="sm">
                Forum
              </Button>
              <Button variant="ghost" size="sm">
                Documents
              </Button>
            </div>

            <div className="sm:hidden flex items-center px-2">
              <select
                aria-label="Quick filter"
                className="bg-transparent border-none text-sm focus:outline-none"
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "Accounts") navigate("/accounts");
                  if (v === "Forum") navigate("/forums");
                  if (v === "Documents") navigate("/documents");
                }}
              >
                <option>Accounts</option>
                <option>Forum</option>
                <option>Documents</option>
              </select>
            </div>

            <Button size="sm" className="rounded-r-xl">
              Search
            </Button>
          </div>
        )}

        {/* FORUM SEARCH (Reddit-style) */}
        {isForumPage && (
          <div className="flex w-full max-w-3xl gap-2">
            <input
              type="text"
              placeholder="Search posts"
              value={forumQuery}
              onChange={(e) => setForumQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border bg-card focus:outline-none"
            />

          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 ml-6">
        <Button
          variant="ghost"
          className="rounded-full p-2 hover:bg-primary/10"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-primary" />
          ) : (
            <Sun className="w-5 h-5 text-primary" />
          )}
        </Button>

        <Button
          variant="ghost"
          className="rounded-full p-2 hover:bg-primary/20"
        >
          <Bell className="w-5 h-5 text-foreground" />
        </Button>

        {isForums && (
          <Button
            asChild
            className="bg-primary text-primary-foreground rounded-xl px-4"
          >
            <Link to="/forums/create">Create Post</Link>
          </Button>
        )}

        {/* ✅ Profile redirect */}
        <Link to={profileUrl} title="My Profile">
          <Button
            variant="ghost"
            className="rounded-full p-2 hover:bg-primary/20"
          >
            <Avatar className="w-8 h-8 border border-border">
              {profilePicture ? (
                <AvatarImage src={`http://localhost:5000${profilePicture}`} alt={userName || "User"} />
              ) : null}
              <AvatarFallback>{userName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </Link>

        <Button
          variant="destructive"
          className="px-3 py-2 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </Button>
      </div>
    </nav>
  );
}
