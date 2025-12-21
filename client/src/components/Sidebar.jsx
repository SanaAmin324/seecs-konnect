import {
  Home,
  MessageSquare,
  Settings,
  LogOut,
  FolderOpen,
  Flag,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "Resources", icon: FolderOpen, url: "/documents" },
  { title: "Forums", icon: MessageSquare, url: "/forums" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [userName, setUserName] = useState("Student Name");
  const [userProgram, setUserProgram] = useState("Computer Science 🎓");
  const [userRole, setUserRole] = useState("user");
  const [username, setUsername] = useState(null);

  // Fetch user info from localStorage and optionally backend
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return;
      const parsed = JSON.parse(raw);

      const name = parsed?.name || parsed?.user?.name || parsed?.data?.name;
      const program =
        parsed?.program || parsed?.user?.program || parsed?.data?.program;
      const role = parsed?.role || parsed?.user?.role || parsed?.data?.role || "user";
      const uname = parsed?.username || parsed?._id || parsed?.user?.username || parsed?.data?.username || null;

      if (name) setUserName(name);
      if (program) setUserProgram(program);
      if (role) setUserRole(role);
      if (uname) setUsername(uname);

      const token = parsed?.token || parsed?.user?.token || parsed?.data?.token;
      if (!program && token) {
        (async () => {
          try {
            const res = await fetch("http://localhost:5000/api/users/profile", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return;
            const profile = await res.json();
            if (profile?.name) setUserName(profile.name);
            if (profile?.program) setUserProgram(profile.program);
            if (profile?.role) setUserRole(profile.role);
            if (profile?.username) setUsername(profile.username);
          } catch (e) {}
        })();
      }
    } catch (e) {
      // ignore errors
    }
  }, []);

  // ✅ Profile URL fallback to username or name
  const profileUrl = username
    ? `/u/${username}`
    : userName
    ? `/u/${userName.replace(/\s+/g, "-").toLowerCase()}`
    : "/dashboard";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-2 border-border/50 bg-sidebar/50 backdrop-blur-sm"
    >
      <SidebarHeader className="border-b-2 border-border/50 p-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="hover:bg-primary/10 rounded-xl transition-colors" />
          {!isCollapsed && (
            <h2 className="font-bold text-lg bg-linear-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              SEECS Hub ✨
            </h2>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Profile Section */}
        <SidebarGroup>
          <Link to={profileUrl} className="block">
            <div
              className={`p-4 transition-all duration-300 hover:bg-primary/10 rounded-2xl cursor-pointer ${
                isCollapsed ? "flex justify-center" : ""
              }`}
            >
              <div
                className={`flex ${
                  isCollapsed ? "flex-col" : "items-center gap-3"
                }`}
              >
                <Avatar
                  className={`transition-all duration-300 border-2 border-primary/30 ${
                    isCollapsed ? "w-10 h-10" : "w-12 h-12"
                  }`}
                >
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-linear-to-br from-primary to-accent text-white">
                    SC
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 animate-fade-in">
                    <p className="font-semibold text-foreground truncate">{userName}</p>
                    {userRole !== "admin" && (
                      <p className="text-sm text-muted-foreground truncate">{userProgram}</p>
                    )}
                    {userRole === "admin" && (
                      <p className="text-sm text-muted-foreground truncate">Admin</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Link>
          <Separator className="bg-border/50" />
        </SidebarGroup>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link
                      to={item.url}
                      className="flex items-center gap-3 transition-all duration-200 hover:translate-x-1 hover:bg-primary/10 rounded-xl px-3 py-2"
                    >
                      <item.icon className="w-4 h-4 text-primary" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 transition-all duration-200 hover:translate-x-1 hover:bg-primary/10 rounded-xl px-3 py-2"
                  >
                    <Settings className="w-4 h-4 text-primary" />
                    <span className="font-medium">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        {userRole === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Reports">
                    <Link
                      to="/admin/reports"
                      className="flex items-center gap-3 transition-all duration-200 hover:translate-x-1 hover:bg-destructive/10 rounded-xl px-3 py-2"
                    >
                      <Flag className="w-4 h-4 text-destructive" />
                      <span className="font-medium">Reports</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t-2 border-border/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <button className="flex items-center gap-3 w-full text-destructive hover:bg-destructive/10 rounded-xl px-3 py-2 transition-all duration-200 hover:translate-x-1">
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
