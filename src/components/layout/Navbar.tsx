
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, User, Clock, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", icon: <Home className="h-5 w-5" />, label: "Home" },
    { path: "/calendar", icon: <Calendar className="h-5 w-5" />, label: "Calendar" },
    { path: "/consultations", icon: <Clock className="h-5 w-5" />, label: "Consultations" },
    { path: "/profile", icon: <User className="h-5 w-5" />, label: "Profile" },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background md:relative md:border-b md:border-t-0">
      {/* Mobile navigation */}
      <div className="flex items-center justify-around py-3 md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center space-y-1 px-3 py-2 text-xs ${
              isActive(item.path)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Desktop navigation */}
      <div className="hidden md:flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl text-primary">FoodPlannery</span>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-1 px-3 py-2 ${
                isActive(item.path)
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>FoodPlannery</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <div className="flex flex-col space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                        isActive(item.path)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-accent/10"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
