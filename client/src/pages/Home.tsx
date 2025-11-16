import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import FlyingHearts from "@/components/FlyingHearts";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Heart, Sparkles, Users, Gift, Calendar, Star } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-pink-purple">
        <div className="spinner"></div>
      </div>
    );
  }

  if (user) {
    setLocation("/swipe");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-pink-purple relative overflow-hidden">
      <FlyingHearts />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <img 
            src={APP_LOGO} 
            alt={APP_TITLE} 
            className="w-24 h-24 mx-auto mb-6 animate-pulse"
          />
          <h1 className="text-6xl font-bold text-white mb-4">
            {APP_TITLE}
          </h1>
          <p className="text-2xl text-white/90 mb-8">
            Deine Dating-Plattform mit Herz 💕
          </p>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Finde deine große Liebe, erlebe unvergessliche Dates und werde Teil einer Community, 
            die echte Verbindungen schätzt.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-pink-600 hover:bg-white/90 text-xl px-8 py-6 rounded-full shadow-2xl"
              onClick={() => window.location.href = getLoginUrl()}
            >
              <Heart className="mr-2" />
              Jetzt kostenlos starten
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <FeatureCard
            icon={<Heart className="w-12 h-12 text-pink-500" />}
            title="Intelligentes Matching"
            description="Unser KI-Algorithmus findet die perfekten Matches für dich basierend auf deinen Interessen und Vorlieben."
          />
          <FeatureCard
            icon={<Gift className="w-12 h-12 text-purple-500" />}
            title="Echte Geschenke"
            description="Verschicke echte Geschenke wie Blumen, Pralinen oder Schmuck direkt an dein Match."
          />
          <FeatureCard
            icon={<Calendar className="w-12 h-12 text-orange-500" />}
            title="Dating Events"
            description="Nimm an exklusiven Speed-Dating Events, Workshops und Partys teil."
          />
          <FeatureCard
            icon={<Sparkles className="w-12 h-12 text-pink-500" />}
            title="Persönlicher Berater"
            description="Lass dich von unserem KI-Berater zu Produkten, Dating-Tipps und mehr beraten."
          />
          <FeatureCard
            icon={<Users className="w-12 h-12 text-purple-500" />}
            title="Aktive Community"
            description="Über 10.000 aktive Singles warten darauf, dich kennenzulernen."
          />
          <FeatureCard
            icon={<Star className="w-12 h-12 text-orange-500" />}
            title="Gamification"
            description="Sammle Coins, schalte Achievements frei und steige im Level auf."
          />
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mt-20 text-center">
          <StatCard number="10.000+" label="Aktive Singles" />
          <StatCard number="50.000+" label="Erfolgreiche Matches" />
          <StatCard number="1.000+" label="Dating Events" />
          <StatCard number="98%" label="Zufriedenheit" />
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-white/10 backdrop-blur-lg rounded-3xl p-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Bereit für die große Liebe?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Melde dich jetzt kostenlos an und finde noch heute dein perfektes Match!
          </p>
          <Button 
            size="lg" 
            className="bg-white text-pink-600 hover:bg-white/90 text-xl px-8 py-6 rounded-full shadow-2xl"
            onClick={() => window.location.href = getLoginUrl()}
          >
            <Heart className="mr-2" />
            Kostenlos anmelden
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-white/70">
        <p>© 2025 {APP_TITLE}. Alle Rechte vorbehalten.</p>
        <p className="mt-2">Made with 💖 for Singles</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 card-hover">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-white/80">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
      <div className="text-4xl font-bold text-white mb-2">{number}</div>
      <div className="text-white/80">{label}</div>
    </div>
  );
}
