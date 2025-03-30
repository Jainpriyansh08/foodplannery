
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, LogOut, Mail, Phone, ChevronRight } from "lucide-react";

const Profile: React.FC = () => {
  const { user, isAuthenticated, updateUserProfile, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleSaveProfile = () => {
    updateUserProfile({
      name,
      email,
    });
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="container max-w-md mx-auto p-4 pb-20 md:pb-4">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Account Information</CardTitle>
            {!isEditing && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
          </div>
          <CardDescription>
            Manage your personal information
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center">
                <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center">
                  <UserCircle className="w-14 h-14 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Name</span>
                  </div>
                  <span className="text-sm">
                    {user?.name || "Not set"}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <span className="text-sm">
                    {user?.email || "Not set"}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Phone</span>
                  </div>
                  <span className="text-sm">{user?.phone}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
        
        {isEditing && (
          <CardFooter className="flex justify-end space-x-2 pt-0">
            <Button 
              variant="outline" 
              onClick={() => {
                setName(user?.name || "");
                setEmail(user?.email || "");
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <button className="w-full flex items-center justify-between py-3 px-6 hover:bg-muted/50 transition-colors">
            <span>Dietary Requirements</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
          <Separator />
          <button className="w-full flex items-center justify-between py-3 px-6 hover:bg-muted/50 transition-colors">
            <span>Allergies & Restrictions</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
          <Separator />
          <button className="w-full flex items-center justify-between py-3 px-6 hover:bg-muted/50 transition-colors">
            <span>Meal Planning Preferences</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>

      <Button variant="destructive" className="w-full" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};

export default Profile;
