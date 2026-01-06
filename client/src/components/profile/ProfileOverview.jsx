import { Globe, Linkedin, Github, Twitter, Mail, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const ProfileOverview = ({ user }) => {
  const hasSocialLinks = user?.website || user?.socialLinks?.linkedin || user?.socialLinks?.github || user?.socialLinks?.twitter;
  const hasContactInfo = user?.email || user?.location || user?.website;

  return (
    <div className="space-y-4">
      {/* Contact Information - Unique to Overview */}
      {hasContactInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user?.email && (
              <a
                href={`mailto:${user.email}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition group"
              >
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary transition truncate">
                    {user.email}
                  </p>
                </div>
              </a>
            )}

            {user?.location && (
              <div className="flex items-center gap-4 p-3 rounded-lg">
                <div className="p-2 rounded-lg bg-accent/10">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{user.location}</p>
                </div>
              </div>
            )}

            {user?.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition group"
              >
                <div className="p-2 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition">
                  <Globe className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary transition truncate">
                    {user.website.replace(/^https?:\/\//, '')}
                  </p>
                </div>
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {/* Social Links */}
      {hasSocialLinks && (user?.socialLinks?.linkedin || user?.socialLinks?.github || user?.socialLinks?.twitter) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Social Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {user.socialLinks?.linkedin && (
                <a
                  href={user.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition group"
                >
                  <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-primary transition" />
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
              )}
              {user.socialLinks?.github && (
                <a
                  href={user.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition group"
                >
                  <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary transition" />
                  <span className="text-sm font-medium">GitHub</span>
                </a>
              )}
              {user.socialLinks?.twitter && (
                <a
                  href={user.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition group"
                >
                  <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-primary transition" />
                  <span className="text-sm font-medium">Twitter</span>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!hasContactInfo && !hasSocialLinks && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground text-sm">
              No contact information or social links added yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileOverview;
