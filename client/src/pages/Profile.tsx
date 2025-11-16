import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FlyingHearts from "@/components/FlyingHearts";
import { getLoginUrl, calculateAge, getZodiacSign } from "@/const";
import { trpc } from "@/lib/trpc";
import { Camera, Save, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Profile() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch profile data
  const { data: profile, refetch } = trpc.profile.get.useQuery(undefined, {
    enabled: !!user,
  });
  
  // Form state
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("1988-07-20");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  
  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      if (profile.birthDate) {
        setBirthDate(new Date(profile.birthDate).toISOString().split('T')[0]);
      }
      setBio(profile.bio || "");
      setInterests(profile.interests || "");
    }
  }, [profile]);
  
  // Update profile mutation
  const updateProfile = trpc.profile.update.useMutation({
    onSuccess: () => {
      toast.success("Profil erfolgreich aktualisiert!");
      refetch();
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error("Fehler beim Speichern: " + error.message);
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

  const birthDateObj = new Date(birthDate);
  const age = calculateAge(birthDateObj);
  const zodiacSign = getZodiacSign(birthDateObj);

  const handleSave = () => {
    updateProfile.mutate({
      name,
      birthDate: new Date(birthDate),
      bio,
      interests,
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
          <h1 className="text-2xl font-bold text-white">Mein Profil</h1>
          <Button 
            variant="ghost" 
            className="text-white"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Abbrechen" : "Bearbeiten"}
          </Button>
        </div>
      </header>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Profile Header */}
            <div className="relative h-48 bg-gradient-purple-pink">
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center text-6xl">
                    👤
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-pink-500 hover:bg-pink-600"
                    >
                      <Camera className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-20 px-8 pb-8">
              {!isEditing ? (
                // View Mode
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">{name || user.name}</h2>
                  <p className="text-xl text-gray-600 mb-4">
                    {age} Jahre • {zodiacSign} ♋
                  </p>
                  <div className="flex justify-center gap-2 mb-6">
                    {user.role === "admin" && (
                      <span className="badge-vip">👑 Admin</span>
                    )}
                    <span className="badge-premium">💎 VIP</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {bio || "Noch keine Bio hinzugefügt..."}
                  </p>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {(interests || "Reisen,Kochen,Sport").split(",").map((interest, i) => (
                      <span key={i} className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">
                        {interest.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dein Name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="birthDate">Geburtsdatum</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Alter: {age} Jahre • Sternzeichen: {zodiacSign}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="bio">Über mich</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Erzähle etwas über dich..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="interests">Interessen (kommagetrennt)</Label>
                    <Input
                      id="interests"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      placeholder="z.B. Reisen, Kochen, Sport"
                    />
                  </div>

                  <Button
                    className="w-full bg-gradient-pink-purple text-white"
                    onClick={handleSave}
                  >
                    <Save className="mr-2" />
                    Änderungen speichern
                  </Button>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">0</div>
                  <div className="text-sm text-gray-600">Matches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">999999</div>
                  <div className="text-sm text-gray-600">Coins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">1</div>
                  <div className="text-sm text-gray-600">Level</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
