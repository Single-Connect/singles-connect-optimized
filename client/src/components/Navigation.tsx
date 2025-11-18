import { Button } from "@/components/ui/button";
import { 
  Heart, 
  MessageCircle, 
  User, 
  Trophy, 
  Gift, 
  ShoppingCart, 
  Sparkles,
  Home,
  LogOut
} from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/swipe", icon: Heart, label: "Swipe" },
    { path: "/matches", icon: MessageCircle, label: "Matches" },
    { path: "/gamification", icon: Trophy, label: "Erfolge" },
    { path: "/gifts", icon: Gift, label: "Geschenke" },
    { path: "/shop", icon: ShoppingCart, label: "Shop" },
    { path: "/products", icon: Sparkles, label: "Berater" },
    { path: "/profile", icon: User, label: "Profil" },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
    toast.success("Erfolgreich ausgeloggt!");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-pink-200 shadow-lg z-50">
      <div className="container mx-auto px-2">
        <div className="flex items-center justify-between py-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => setLocation(item.path)}
                className={`flex flex-col items-center gap-1 min-w-[60px] ${
                  isActive
                    ? "text-pink-600 bg-pink-50"
                    : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 min-w-[60px] text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-xs">Logout</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
