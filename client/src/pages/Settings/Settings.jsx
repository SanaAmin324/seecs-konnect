import ProfileSettings from "./ProfileSettings";
import AccountSettings from "./AccountSettings";
import DangerZone from "./DangerZone";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <ProfileSettings />
      <AccountSettings />
      <DangerZone />
    </div>
  );
}
