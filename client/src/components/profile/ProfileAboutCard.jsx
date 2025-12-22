const ProfileAboutCard = ({ user }) => {
  const joinDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : 'Unknown';

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-4 sticky top-6">
      <h3 className="font-bold text-lg text-foreground">About</h3>
      
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide font-semibold mb-1">Name</p>
          <p className="text-foreground font-medium">{user?.name || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide font-semibold mb-1">Email</p>
          <p className="text-foreground font-medium break-all">{user?.email || 'N/A'}</p>
        </div>

        {user?.cms && (
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide font-semibold mb-1">CMS ID</p>
            <p className="text-foreground font-medium">{user.cms}</p>
          </div>
        )}
        
        {user?.program && (
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide font-semibold mb-1">Program</p>
            <p className="text-foreground font-medium">{user.program}</p>
          </div>
        )}

        {user?.batch && (
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide font-semibold mb-1">Batch</p>
            <p className="text-foreground font-medium">{user.batch}</p>
          </div>
        )}

        {user?.section && (
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide font-semibold mb-1">Section</p>
            <p className="text-foreground font-medium">{user.section}</p>
          </div>
        )}
        
        <div className="pt-2 border-t border-border">
          <p className="text-muted-foreground text-xs uppercase tracking-wide font-semibold mb-1">Member Since</p>
          <p className="text-foreground font-medium">{joinDate}</p>
        </div>

        {user?.role === 'admin' && (
          <div className="pt-2 border-t border-border">
            <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full">Administrator</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileAboutCard;
