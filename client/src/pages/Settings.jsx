import React, { useState, useEffect } from "react";
import { Camera, Save, Loader2, Globe, Linkedin, Github, Twitter } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [userRole, setUserRole] = useState("student");
  const [profileData, setProfileData] = useState({
    bio: "",
    headline: "",
    location: "",
    website: "",
    socialLinks: {
      linkedin: "",
      github: "",
      twitter: "",
    },
  });
  const [profilePicture, setProfilePicture] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [shouldRemovePicture, setShouldRemovePicture] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setUserRole(user?.role || "student");
      const response = await fetch(`http://localhost:5000/api/profile/${user._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData({
          bio: data.bio || "",
          headline: data.headline || "",
          location: data.location || "",
          website: data.website || "",
          socialLinks: {
            linkedin: data.socialLinks?.linkedin || "",
            github: data.socialLinks?.github || "",
            twitter: data.socialLinks?.twitter || "",
          },
        });
        setProfilePicture(data.profilePicture || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("social-")) {
      const socialPlatform = name.replace("social-", "");
      setProfileData({
        ...profileData,
        socialLinks: {
          ...profileData.socialLinks,
          [socialPlatform]: value,
        },
      });
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage("Please select a valid image file (JPG, PNG, GIF, or WEBP)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5MB");
      return;
    }

    // Store file for later upload
    setSelectedFile(file);

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
    
    setMessage("");
  };

  const handleRemoveProfilePicture = () => {
    // Mark for removal and clear previews
    setShouldRemovePicture(true);
    setPreviewImage("");
    setSelectedFile(null);
    setMessage("Profile picture will be removed when you save changes");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      
      // Handle profile picture removal first if requested
      if (shouldRemovePicture) {
        const removeResponse = await fetch("http://localhost:5000/api/profile/remove-picture", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (removeResponse.ok) {
          setProfilePicture("");
          setShouldRemovePicture(false);
          
          // Update localStorage
          const updatedUser = { ...user, profilePicture: "" };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          const error = await removeResponse.json();
          setMessage(error.message || "Failed to remove profile picture");
          setLoading(false);
          return;
        }
      }
      // Upload profile picture if a new one was selected
      else if (selectedFile) {
        const formData = new FormData();
        formData.append("profilePicture", selectedFile);

        const uploadResponse = await fetch("http://localhost:5000/api/profile/upload-picture", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          setProfilePicture(uploadData.profilePicture);
          
          // Update localStorage with new profile picture
          const updatedUser = { ...user, profilePicture: uploadData.profilePicture };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          
          // Clear selected file and preview
          setSelectedFile(null);
          setPreviewImage("");
        } else {
          const error = await uploadResponse.json();
          setMessage(error.message || "Failed to upload profile picture");
          setLoading(false);
          return;
        }
      }

      // Update profile data
      const response = await fetch("http://localhost:5000/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        setMessage("Profile updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await response.json();
        setMessage(error.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {userRole === "admin" ? "Admin Settings" : "Profile Settings"}
      </h1>

      {userRole === "admin" && (
        <div className="mb-4 p-4 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
          <p className="font-semibold">Administrator Account</p>
          <p className="text-sm">You are editing administrative profile settings. Student-specific fields are not available.</p>
        </div>
      )}

      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      {/* Profile Picture Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload a profile picture to personalize your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {!shouldRemovePicture && (previewImage || profilePicture) ? (
                  <img
                    src={
                      previewImage || `http://localhost:5000${profilePicture}`
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-muted-foreground">
                    {JSON.parse(localStorage.getItem("user"))?.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
              </label>
              <input
                id="profile-picture"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
                disabled={uploading}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Accepted formats: JPG, PNG, GIF, WEBP</p>
              <p className="text-sm text-muted-foreground mb-4">Maximum size: 5MB</p>
              {(profilePicture || previewImage) && !shouldRemovePicture && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveProfilePicture}
                  disabled={uploading}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove Photo
                </Button>
              )}
              {shouldRemovePicture && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShouldRemovePicture(false)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Undo Remove
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information Form */}
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              {userRole === "admin" 
                ? "Update your administrative profile details" 
                : "Update your bio and professional details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="headline">
                {userRole === "admin" ? "Job Title" : "Headline"}
              </Label>
              <Input
                id="headline"
                name="headline"
                placeholder={
                  userRole === "admin" 
                    ? "e.g., System Administrator | IT Manager" 
                    : "e.g., Computer Science Student | AI Enthusiast"
                }
                value={profileData.headline}
                onChange={handleInputChange}
                maxLength={120}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {profileData.headline.length}/120 characters
              </p>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                name="bio"
                placeholder={
                  userRole === "admin"
                    ? "Describe your role and responsibilities..."
                    : "Tell us about yourself..."
                }
                value={profileData.bio}
                onChange={handleInputChange}
                maxLength={500}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {profileData.bio.length}/500 characters
              </p>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Islamabad, Pakistan"
                value={profileData.location}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="website">
                <Globe className="w-4 h-4 inline mr-1" />
                Website
              </Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://yourwebsite.com"
                value={profileData.website}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links - Optional for students, recommended for admins */}
        {(userRole !== "admin" || true) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                {userRole === "admin" 
                  ? "Connect your professional social media profiles (optional)" 
                  : "Connect your social media profiles"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="social-linkedin">
                  <Linkedin className="w-4 h-4 inline mr-1" />
                  LinkedIn
                </Label>
                <Input
                  id="social-linkedin"
                  name="social-linkedin"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={profileData.socialLinks.linkedin}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="social-github">
                  <Github className="w-4 h-4 inline mr-1" />
                  GitHub
                </Label>
                <Input
                  id="social-github"
                  name="social-github"
                  placeholder="https://github.com/yourusername"
                  value={profileData.socialLinks.github}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="social-twitter">
                  <Twitter className="w-4 h-4 inline mr-1" />
                  Twitter
                </Label>
                <Input
                  id="social-twitter"
                  name="social-twitter"
                  placeholder="https://twitter.com/yourusername"
                  value={profileData.socialLinks.twitter}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="flex items-center gap-2">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
