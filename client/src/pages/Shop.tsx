import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FlyingHearts from "@/components/FlyingHearts";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Coins, ArrowLeft, Sparkles, Zap, Crown } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const COIN_PACKAGES = [
  {
    id: "starter",
    name: "Starter Pack",
    coins: 500,
    price: 499,
    bonus: 0,
    icon: Coins,
    popular: false,
  },
  {
    id: "popular",
    name: "Beliebtes Paket",
    coins: 1000,
    price: 999,
    bonus: 100,
    icon: Sparkles,
    popular: true,
  },
  {
    id: "best_value",
    name: "Bestes Angebot",
    coins: 2500,
    price: 1999,
    bonus: 500,
    icon: Zap,
    popular: false,
  },
  {
    id: "premium",
    name: "Premium Pack",
    coins: 5000,
    price: 3999,
    bonus: 1500,
    icon: Crown,
    popular: false,
  },
];

export default function Shop() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: balance } = trpc.coins.getBalance.useQuery(undefined, {
    enabled: !!user,
  });

  const createCheckoutMutation = trpc.payment.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.info("💳 Weiterleitung zur Zahlung...");
        window.open(data.url, "_blank");
      }
    },
    onError: (error) => {
      toast.error("Fehler beim Checkout: " + error.message);
    },
  });

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

  const handlePurchase = (pkg: typeof COIN_PACKAGES[0]) => {
    createCheckoutMutation.mutate({
      packageId: pkg.id,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-pink-purple relative">
      <FlyingHearts />
      
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button 
            variant="ghost" 
            className="text-white"
            onClick={() => setLocation("/swipe")}
          >
            <ArrowLeft className="mr-2" />
            Zurück
          </Button>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Coins className="w-6 h-6" />
            Coins Shop
          </h1>
          <div className="text-white font-semibold">
            💰 {balance?.coins || 0} Coins
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Kaufe Coins & schalte Features frei! 💎
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Mit Coins kannst du Geschenke verschicken, Profile boosten und Premium-Features nutzen.
          </p>
        </div>

        {/* Coin Packages */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {COIN_PACKAGES.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <Card 
                key={pkg.id} 
                className={`relative overflow-hidden card-hover ${pkg.popular ? 'border-2 border-pink-500' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-pink-purple text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                    BELIEBT
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-gradient-pink-purple rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription className="text-lg">
                    {pkg.coins} Coins
                    {pkg.bonus > 0 && (
                      <span className="text-green-600 font-semibold block">
                        +{pkg.bonus} Bonus!
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-pink-600 mb-2">
                    {(pkg.price / 100).toFixed(2)}€
                  </div>
                  {pkg.bonus > 0 && (
                    <div className="text-sm text-gray-600">
                      Gesamt: {pkg.coins + pkg.bonus} Coins
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${pkg.popular ? 'bg-gradient-pink-purple text-white' : ''}`}
                    onClick={() => handlePurchase(pkg)}
                    disabled={createCheckoutMutation.isPending}
                  >
                    {createCheckoutMutation.isPending ? "Wird geladen..." : "Jetzt kaufen"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Features Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">🎁</div>
            <h3 className="text-xl font-bold text-white mb-2">Geschenke</h3>
            <p className="text-white/80">
              Verschicke echte Geschenke an deine Matches
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-xl font-bold text-white mb-2">Boost</h3>
            <p className="text-white/80">
              Erhöhe deine Sichtbarkeit für 30 Minuten
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="text-xl font-bold text-white mb-2">Super-Likes</h3>
            <p className="text-white/80">
              Zeige besonderes Interesse
            </p>
          </div>
        </div>

        {/* Daily Rewards Info */}
        <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center max-w-2xl mx-auto">
          <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            Verdiene kostenlose Coins!
          </h3>
          <p className="text-white/80 mb-6">
            Logge dich täglich ein und erhalte Bonus-Coins. Je länger deine Streak, desto mehr Coins!
          </p>
          <div className="flex justify-center gap-4">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold text-white">+10</div>
              <div className="text-xs text-white/80">Tag 1</div>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold text-white">+20</div>
              <div className="text-xs text-white/80">Tag 3</div>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold text-white">+50</div>
              <div className="text-xs text-white/80">Tag 7</div>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold text-white">+100</div>
              <div className="text-xs text-white/80">Tag 30</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
