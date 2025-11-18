import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import FlyingHearts from "@/components/FlyingHearts";
import Navigation from "@/components/Navigation";
import { getLoginUrl } from "@/const";
import { Heart, X, Star } from "lucide-react";
import { useLocation } from "wouter";

export default function Swipe() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-pink-purple">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    window.location.href = getLoginUrl();
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-pink-purple relative">
      <FlyingHearts />
      
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">💖 Single-Connect</h1>
          <Button 
            variant="ghost" 
            className="text-white"
            onClick={() => setLocation("/profile")}
          >
            Profil
          </Button>
        </div>
      </header>

      {/* Swipe Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden swipe-card-enter">
            <div className="h-96 bg-gradient-purple-pink flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">👤</div>
                <h2 className="text-3xl font-bold mb-2">Demo Profile</h2>
                <p className="text-xl">25 Jahre • Berlin</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">Über mich</h3>
              <p className="text-gray-600 mb-4">
                Hey! Ich liebe Reisen, gutes Essen und lange Spaziergänge am Strand. 
                Auf der Suche nach jemandem, der das Leben mit mir teilt! 🌟
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="badge-premium">Premium</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">Reisen</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">Kochen</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">Sport</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 mt-8">
            <Button
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full bg-white border-2 border-red-500 text-red-500 hover:bg-red-50"
            >
              <X className="w-8 h-8" />
            </Button>
            <Button
              size="lg"
              className="w-20 h-20 rounded-full bg-gradient-pink-purple text-white shadow-2xl"
            >
              <Heart className="w-10 h-10" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <Star className="w-8 h-8" />
            </Button>
          </div>

          <p className="text-center text-white mt-6">
            ← Nein • 💖 Like • ⭐ Super-Like →
          </p>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
