import { useAuth } from "@/_core/hooks/useAuth";
import FlyingHearts from "@/components/FlyingHearts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Heart, MessageCircle, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Matches() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Implement real matches query
  const matches = [
    {
      id: 1,
      name: "Sarah",
      age: 28,
      photo: "https://i.pravatar.cc/300?img=5",
      matchDate: "Vor 2 Stunden",
      lastMessage: "Hey! Wie geht's dir? 😊",
      unreadCount: 2,
    },
    {
      id: 2,
      name: "Julia",
      age: 26,
      photo: "https://i.pravatar.cc/300?img=9",
      matchDate: "Gestern",
      lastMessage: "Das klingt super!",
      unreadCount: 0,
    },
    {
      id: 3,
      name: "Anna",
      age: 30,
      photo: "https://i.pravatar.cc/300?img=10",
      matchDate: "Vor 3 Tagen",
      lastMessage: "Wann hast du Zeit?",
      unreadCount: 1,
    },
  ];

  const filteredMatches = matches.filter((match) =>
    match.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="min-h-screen bg-gradient-pink-purple relative pb-20">
      <FlyingHearts />
      
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Heart className="w-8 h-8 fill-current" />
            Deine Matches
          </h1>
          <p className="text-white/80 mt-2">{matches.length} Matches gefunden</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Matches durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/95 backdrop-blur-sm border-2 border-pink-200 focus:border-pink-400"
            />
          </div>
        </div>

        {/* Matches List */}
        {filteredMatches.length === 0 ? (
          <Card className="bg-white/95 backdrop-blur-sm text-center py-12">
            <CardContent>
              <Sparkles className="w-16 h-16 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Noch keine Matches</h3>
              <p className="text-gray-600 mb-4">
                Swipe weiter, um dein erstes Match zu finden!
              </p>
              <Button
                onClick={() => setLocation("/swipe")}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Jetzt swipen
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <Card
                key={match.id}
                className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-pink-300"
                onClick={() => setLocation(`/chat/${match.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Photo */}
                    <div className="relative">
                      <img
                        src={match.photo}
                        alt={match.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-pink-200"
                      />
                      {match.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {match.unreadCount}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">
                          {match.name}, {match.age}
                        </h3>
                        <Heart className="w-4 h-4 text-pink-500 fill-current" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{match.lastMessage}</p>
                      <p className="text-xs text-gray-400">{match.matchDate}</p>
                    </div>

                    {/* Chat Button */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocation(`/chat/${match.id}`);
                      }}
                    >
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
