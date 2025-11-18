import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FlyingHearts from "@/components/FlyingHearts";
import { getLoginUrl } from "@/const";
import { Gift, Heart, Sparkles, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

const GIFT_CATEGORIES = [
  {
    id: "flowers",
    name: "Blumen",
    emoji: "💐",
    description: "Frische Blumen direkt geliefert",
    items: [
      {
        id: "roses",
        name: "Rote Rosen (12 Stück)",
        price: 2999,
        coins: 500,
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
        affiliate: "https://www.fleurop.de",
      },
      {
        id: "mixed_bouquet",
        name: "Gemischter Strauß",
        price: 3999,
        coins: 700,
        image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400",
        affiliate: "https://www.fleurop.de",
      },
    ],
  },
  {
    id: "chocolate",
    name: "Pralinen & Schokolade",
    emoji: "🍫",
    description: "Süße Versuchungen",
    items: [
      {
        id: "ferrero",
        name: "Ferrero Rocher (200g)",
        price: 1299,
        coins: 200,
        image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400",
        affiliate: "https://www.amazon.de",
      },
      {
        id: "lindt",
        name: "Lindt Lindor Herz",
        price: 1999,
        coins: 350,
        image: "https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=400",
        affiliate: "https://www.amazon.de",
      },
    ],
  },
  {
    id: "jewelry",
    name: "Schmuck",
    emoji: "💎",
    description: "Funkelnde Geschenke",
    items: [
      {
        id: "necklace",
        name: "Herz-Halskette",
        price: 4999,
        coins: 1000,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
        affiliate: "https://www.pandora.net",
      },
      {
        id: "bracelet",
        name: "Charm-Armband",
        price: 5999,
        coins: 1200,
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
        affiliate: "https://www.pandora.net",
      },
    ],
  },
  {
    id: "perfume",
    name: "Parfüm",
    emoji: "🌸",
    description: "Verführerische Düfte",
    items: [
      {
        id: "chanel",
        name: "Chanel No. 5",
        price: 8999,
        coins: 1500,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
        affiliate: "https://www.douglas.de",
      },
      {
        id: "dior",
        name: "Dior J'adore",
        price: 7999,
        coins: 1300,
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400",
        affiliate: "https://www.douglas.de",
      },
    ],
  },
  {
    id: "vouchers",
    name: "Gutscheine",
    emoji: "🎁",
    description: "Digitale Geschenke",
    items: [
      {
        id: "amazon",
        name: "Amazon Gutschein 25€",
        price: 2500,
        coins: 400,
        image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400",
        affiliate: "https://www.amazon.de",
      },
      {
        id: "netflix",
        name: "Netflix 3 Monate",
        price: 3999,
        coins: 700,
        image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400",
        affiliate: "https://www.netflix.com",
      },
    ],
  },
];

export default function Gifts() {
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

  const handleSendGift = (gift: any) => {
    // TODO: Implement gift sending
    console.log("Sending gift:", gift);
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
            <Gift className="w-6 h-6" />
            Geschenke-Shop
          </h1>
          <div className="text-white font-semibold">
            💰 {user.coins || 0} Coins
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Verschicke echte Geschenke! 🎁
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Überrasche dein Match mit echten Geschenken wie Blumen, Pralinen oder Schmuck. 
            Wir kümmern uns um die Lieferung!
          </p>
        </div>

        {/* Gift Categories */}
        {GIFT_CATEGORIES.map((category) => (
          <div key={category.id} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-5xl">{category.emoji}</span>
              <div>
                <h3 className="text-3xl font-bold text-white">{category.name}</h3>
                <p className="text-white/80">{category.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item) => (
                <Card key={item.id} className="overflow-hidden card-hover">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>
                      {(item.price / 100).toFixed(2)}€ • {item.coins} Coins
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      className="w-full bg-gradient-pink-purple text-white"
                      onClick={() => handleSendGift(item)}
                    >
                      <Heart className="mr-2 w-4 h-4" />
                      Verschicken
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Coins Info */}
        <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center">
          <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            Nicht genug Coins?
          </h3>
          <p className="text-white/80 mb-6">
            Kaufe Coins oder verdiene sie durch Daily Login Rewards!
          </p>
          <Button 
            size="lg"
            className="bg-white text-pink-600 hover:bg-white/90"
            onClick={() => setLocation("/shop")}
          >
            Coins kaufen
          </Button>
        </div>
      </div>
    </div>
  );
}
