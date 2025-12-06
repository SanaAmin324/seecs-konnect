import { Home, FileText, MessageSquare, Settings, Users, LogOut, FolderOpen } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "My Resources", icon: FolderOpen, url: "/Documents" },
  { title: "Forums", icon: MessageSquare, url: "/forums" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r-2 border-border/50 bg-sidebar/50 backdrop-blur-sm">
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
          <a href="/profile" className="block">
            <div className={`p-4 transition-all duration-300 hover:bg-primary/10 rounded-2xl cursor-pointer ${isCollapsed ? "flex justify-center" : ""}`}>
              <div className={`flex ${isCollapsed ? "flex-col" : "items-center gap-3"}`}>
                <Avatar className={`transition-all duration-300 border-2 border-primary/30 ${isCollapsed ? "w-10 h-10" : "w-12 h-12"}`}>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-linear-to-br from-primary to-accent text-white">SC</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 animate-fade-in">
                    <p className="font-semibold text-foreground truncate">Student Name</p>
                    <p className="text-sm text-muted-foreground truncate">Computer Science 🎓</p>
                  </div>
                )}
              </div>
            </div>
          </a>
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
                    <a href={item.url} className="flex items-center gap-3 transition-all duration-200 hover:translate-x-1 hover:bg-primary/10 rounded-xl px-3 py-2">
                      <item.icon className="w-4 h-4 text-primary" />
                      <span className="font-medium">{item.title}</span>
                    </a>
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
                  <a href="/settings" className="flex items-center gap-3 transition-all duration-200 hover:translate-x-1 hover:bg-primary/10 rounded-xl px-3 py-2">
                    <Settings className="w-4 h-4 text-primary" />
                    <span className="font-medium">Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
