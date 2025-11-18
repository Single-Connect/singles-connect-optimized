import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FlyingHearts from "@/components/FlyingHearts";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Send, Bot, User, ArrowLeft, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Streamdown } from "streamdown";

export default function ProductAdvisor() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: "Hallo! 👋 Ich bin dein persönlicher Produkt-Berater. Ich helfe dir, die perfekten Produkte zu finden - egal ob Hautpflege, Kosmetik, Mode oder Geschenke! Was suchst du heute?"
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = trpc.productAdvisor.chat.useMutation({
    onSuccess: (data) => {
      setChatHistory(prev => [...prev, {
        role: "assistant",
        content: data.response
      }]);
    },
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

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

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage = message;
    setChatHistory(prev => [...prev, {
      role: "user",
      content: userMessage
    }]);
    setMessage("");

    sendMessageMutation.mutate({ message: userMessage });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-pink-purple relative flex flex-col">
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
            <Sparkles className="w-6 h-6" />
            Produkt-Berater
          </h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Chat Content */}
      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col max-w-4xl">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {chatHistory.map((msg, index) => (
            <div 
              key={index}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-10 h-10 rounded-full bg-gradient-pink-purple flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              )}
              <div 
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === "user" 
                    ? "bg-pink-500 text-white" 
                    : "bg-white/90 text-gray-900"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Streamdown>{msg.content}</Streamdown>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          ))}
          {sendMessageMutation.isPending && (
            <div className="flex gap-3 justify-start">
              <div className="w-10 h-10 rounded-full bg-gradient-pink-purple flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="bg-white/90 rounded-2xl p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Frage mich nach Produktempfehlungen..."
              className="flex-1 bg-white/90 border-0"
              disabled={sendMessageMutation.isPending}
            />
            <Button 
              onClick={handleSend}
              disabled={!message.trim() || sendMessageMutation.isPending}
              className="bg-gradient-pink-purple text-white"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setMessage("Ich suche eine Nachtcreme, ich bin 37 Jahre alt")}
              className="bg-white/50"
            >
              Nachtcreme für 37-Jährige
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setMessage("Was ist ein gutes Geschenk für ein erstes Date?")}
              className="bg-white/50"
            >
              Geschenk für erstes Date
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setMessage("Welches Parfüm passt zu mir?")}
              className="bg-white/50"
            >
              Parfüm-Empfehlung
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
