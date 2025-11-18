import { useAuth } from "@/_core/hooks/useAuth";
import FlyingHearts from "@/components/FlyingHearts";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Send, Heart, Gift, MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocation, useRoute } from "wouter";

export default function Chat() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/chat/:matchId");
  const matchId = params?.matchId ? parseInt(params.matchId) : null;
  
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // TODO: Implement real chat query with tRPC
  const match = {
    id: matchId,
    name: "Sarah",
    age: 28,
    photo: "https://i.pravatar.cc/300?img=5",
    isOnline: true,
  };

  const messages = [
    {
      id: 1,
      senderId: matchId,
      text: "Hey! Wie geht's dir? 😊",
      timestamp: "10:30",
      isOwn: false,
    },
    {
      id: 2,
      senderId: user?.id,
      text: "Mir geht's super! Und dir?",
      timestamp: "10:32",
      isOwn: true,
    },
    {
      id: 3,
      senderId: matchId,
      text: "Auch gut! Was machst du heute so?",
      timestamp: "10:33",
      isOwn: false,
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    // TODO: Implement real send message mutation
    console.log("Sending message:", message);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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

  if (!matchId) {
    setLocation("/matches");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-pink-purple relative flex flex-col pb-20">
      <FlyingHearts />
      
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-pink-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/matches")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <img
                  src={match.photo}
                  alt={match.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-pink-300"
                />
                {match.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h2 className="font-bold text-lg">{match.name}, {match.age}</h2>
                <p className="text-sm text-gray-500">
                  {match.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Match Notification */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <Heart className="w-5 h-5 text-pink-500 fill-current" />
            <span className="text-sm font-medium">
              Ihr habt ein Match! 💕
            </span>
          </div>
        </div>

        {/* Messages List */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] ${
                msg.isOwn
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  : "bg-white/95 backdrop-blur-sm text-gray-800"
              } rounded-2xl px-4 py-3 shadow-lg`}
            >
              <p className="text-sm">{msg.text}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.isOwn ? "text-white/70" : "text-gray-500"
                }`}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white/95 backdrop-blur-md border-t border-pink-200 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-pink-500 hover:text-pink-600"
              onClick={() => setLocation(`/gifts?to=${matchId}`)}
            >
              <Gift className="w-5 h-5" />
            </Button>
            
            <Input
              type="text"
              placeholder="Nachricht schreiben..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border-2 border-pink-200 focus:border-pink-400"
            />
            
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!message.trim()}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
