import { useAuth } from "@/_core/hooks/useAuth";
import FlyingHearts from "@/components/FlyingHearts";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Check, Crown, Sparkles, Zap, Heart, Eye, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Premium() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  const premiumTiers = [
    {
      name: "Premium",
      price: "9,99€",
      period: "/Monat",
      icon: Crown,
      color: "from-purple-500 to-pink-500",
      features: [
        "Unbegrenzte Swipes",
        "Sehe wer dich geliked hat",
        "5 Super-Likes pro Tag",
        "Erweiterte Filter",
        "Keine Werbung",
        "Profil-Boost 1x pro Woche",
      ],
    },
    {
      name: "Premium Plus",
      price: "19,99€",
      period: "/Monat",
      icon: Sparkles,
      color: "from-pink-500 to-orange-500",
      popular: true,
      features: [
        "Alle Premium-Features",
        "Unbegrenzte Super-Likes",
        "AI Wingman (Gesprächs-Starter)",
        "Profil-Boost 3x pro Woche",
        "Exklusive Events",
        "Prioritäts-Support",
        "Lese-Bestätigungen",
        "Rückgängig-Funktion",
      ],
    },
    {
      name: "VIP",
      price: "49,99€",
      period: "/Monat",
      icon: Zap,
      color: "from-orange-500 to-red-500",
      features: [
        "Alle Premium Plus-Features",
        "Persönlicher Dating-Coach",
        "VIP-Badge auf Profil",
        "Täglicher Profil-Boost",
        "Unbegrenzte Rückgängig",
        "Exklusive VIP-Events",
        "Profil-Verifizierung",
        "Vorrang im Support",
      ],
    },
  ];

  const singleFeatures = [
    {
      name: "Wer hat mich geliked?",
      description: "Sehe alle Profile, die dich geliked haben",
      price: "4,99€",
      icon: Eye,
      color: "text-pink-500",
    },
    {
      name: "Profil-Boost",
      description: "Sei 30 Minuten lang das Top-Profil in deiner Region",
      price: "2,99€",
      icon: TrendingUp,
      color: "text-purple-500",
    },
    {
      name: "5 Super-Likes",
      description: "Zeige besonderes Interesse mit Super-Likes",
      price: "3,99€",
      icon: Heart,
      color: "text-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-pink-purple">
        <FlyingHearts />
        <div className="text-white text-xl">Lädt...</div>
      </div>
    );
  }

  if (!user) {
    window.location.href = getLoginUrl();
    return null;
  }

  const handleSubscribe = (tier: string) => {
    toast.info(`${tier} wird bald verfügbar sein!`);
    // TODO: Implement Stripe subscription
  };

  const handleBuySingle = (feature: string) => {
    toast.info(`${feature} wird bald verfügbar sein!`);
    // TODO: Implement single purchase
  };

  return (
    <div className="min-h-screen bg-gradient-pink-purple relative pb-20">
      <FlyingHearts />
      
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Crown className="w-8 h-8" />
            Premium werden
          </h1>
          <p className="text-white/80 mt-2">
            Finde schneller dein Match mit Premium-Features
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Current Status */}
        {user.isPremium ? (
          <Card className="mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Crown className="w-12 h-12" />
                <div>
                  <h3 className="text-xl font-bold">Du bist Premium!</h3>
                  <p className="text-white/90">
                    Gültig bis: {user.premiumExpiresAt ? new Date(user.premiumExpiresAt).toLocaleDateString() : "Unbegrenzt"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Premium Tiers */}
        <h2 className="text-2xl font-bold text-white mb-6">Abo-Modelle</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {premiumTiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <Card
                key={tier.name}
                className={`relative ${
                  tier.popular
                    ? "border-4 border-pink-400 shadow-2xl scale-105"
                    : "border-2 border-white/20"
                } bg-white/95 backdrop-blur-sm`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      ⭐ Beliebteste
                    </span>
                  </div>
                )}
                <CardHeader>
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-gray-500">{tier.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleSubscribe(tier.name)}
                    className={`w-full bg-gradient-to-r ${tier.color} hover:opacity-90 text-white`}
                  >
                    Jetzt abonnieren
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Single Features */}
        <h2 className="text-2xl font-bold text-white mb-6">Einzelne Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {singleFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.name} className="bg-white/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <Icon className={`w-12 h-12 ${feature.color} mb-4`} />
                  <h3 className="text-xl font-bold mb-2">{feature.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{feature.price}</span>
                    <Button
                      onClick={() => handleBuySingle(feature.name)}
                      variant="outline"
                      className="border-pink-500 text-pink-500 hover:bg-pink-50"
                    >
                      Kaufen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Navigation />
    </div>
  );
}
