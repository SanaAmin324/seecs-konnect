import { Sun, Moon, Bell, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-sidebar backdrop-blur-sm border-b-2 border-sidebar-border">
      {/* Left side: Search bar */}
      <div className="flex-1 min-w-0">
        <div className="flex w-full max-w-2xl bg-card rounded-xl shadow-sm overflow-hidden border border-border">
          

          {/* Search input */}
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 min-w-0 px-4 py-2 text-card-foreground placeholder:text-muted-foreground bg-card focus:outline-none border-0"
          />

          {/* Internal buttons */}
          <div className="flex">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-none px-3 hover:bg-primary/20 border-r border-border"
              title="Search Accounts"
            >
              Accounts
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-none px-3 hover:bg-primary/20 border-r border-border"
              title="Search Forum"
            >
              Forum
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-none px-3 hover:bg-primary/20"
              title="Search Documents"
            >
              Documents
            </Button>
          </div>

          {/* Search button attached */}
          <Button
            variant="default"
            size="sm"
            className="rounded-r-xl px-4 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            title="Execute Search"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Right side: Theme, notifications, account, logout */}
      <div className="flex items-center gap-2 ml-6">
        <Button
          variant="ghost"
          className="rounded-full p-2 hover:bg-primary/20"
          title="Toggle Theme"
        >
          <Sun className="w-5 h-5 text-foreground" />
        </Button>
        <Button
          variant="ghost"
          className="rounded-full p-2 hover:bg-primary/20"
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-foreground" />
        </Button>
        <Button
          variant="ghost"
          className="rounded-full p-2 hover:bg-primary/20"
          title="Account"
        >
          <Avatar className="w-8 h-8 border border-border">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
        <Button
          variant="destructive"
          className="px-3 py-2 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
          onClick={logout}
          title="Logout"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </Button>
      </div>
    </nav>
  );
}