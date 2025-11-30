import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function MainLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground overflow-hidden">
        
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <div className="flex flex-col flex-1 min-h-screen w-full">
          <Navbar />

          <main className="flex-1 p-6 md:p-8 w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
