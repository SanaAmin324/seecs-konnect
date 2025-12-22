import { MapPin, Globe, Linkedin, Github, Twitter, Mail, BookOpen, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const ProfileOverview = ({ user }) => {
  return (
    <div className="space-y-4">
      {/* About Section */}
      {user?.bio && (
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line">{user.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Info Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user?.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}

            {user?.location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{user.location}</p>
                </div>
              </div>
            )}

            {user?.program && (
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Program</p>
                  <p className="text-sm text-muted-foreground">
                    {user.program}
                    {user.batch && ` - Batch ${user.batch}`}
                  </p>
                </div>
              </div>
            )}

            {user?.connections && (
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Connections</p>
                  <p className="text-sm text-muted-foreground">
                    {user.connections.length} connection{user.connections.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      {(user?.website || user?.socialLinks?.linkedin || user?.socialLinks?.github || user?.socialLinks?.twitter) && (
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-primary transition"
                >
                  <Globe className="w-5 h-5" />
                  <span>{user.website}</span>
                </a>
              )}
              {user.socialLinks?.linkedin && (
                <a
                  href={user.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-primary transition"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </a>
              )}
              {user.socialLinks?.github && (
                <a
                  href={user.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-primary transition"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
              )}
              {user.socialLinks?.twitter && (
                <a
                  href={user.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-primary transition"
                >
                  <Twitter className="w-5 h-5" />
                  <span>Twitter</span>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!user?.bio && !user?.location && !user?.website && !user?.socialLinks?.linkedin && !user?.socialLinks?.github && !user?.socialLinks?.twitter && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No additional information available. Complete your profile to let others know more about you!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileOverview;
