import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/layouts/MainLayout";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">
        Dashboard — Welcome {user.name} 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm bg-card text-card-foreground">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Welcome</h2>
            <p className="mt-2 text-muted-foreground">
              You are logged in as <strong>{user.role}</strong>.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-card text-card-foreground">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Students</h2>
            <p className="mt-2 text-muted-foreground">Manage or view students.</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-card text-card-foreground">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Resources</h2>
            <p className="mt-2 text-muted-foreground">Access shared materials.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
