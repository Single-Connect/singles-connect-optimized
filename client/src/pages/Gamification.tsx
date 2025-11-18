import { useAuth } from "@/_core/hooks/useAuth";
import FlyingHearts from "@/components/FlyingHearts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Award, Calendar, Flame, Gift, Star, TrendingUp, Trophy, Zap } from "lucide-react";
import { toast } from "sonner";

const ACHIEVEMENTS = [
  { id: "first_match", title: "Erstes Match", description: "Dein erstes Match!", icon: "💕", xp: 100 },
  { id: "profile_complete", title: "Profil-Profi", description: "Profil zu 100% ausgefüllt", icon: "✨", xp: 50 },
  { id: "swipe_10", title: "Swipe-Starter", description: "10 Profile geswiped", icon: "👆", xp: 25 },
  { id: "swipe_100", title: "Swipe-Master", description: "100 Profile geswiped", icon: "🔥", xp: 100 },
  { id: "message_10", title: "Plaudertasche", description: "10 Nachrichten gesendet", icon: "💬", xp: 50 },
  { id: "login_7", title: "Woche dabei", description: "7 Tage in Folge eingeloggt", icon: "📅", xp: 150 },
  { id: "login_30", title: "Monat dabei", description: "30 Tage in Folge eingeloggt", icon: "🎉", xp: 500 },
  { id: "gift_sent", title: "Großzügig", description: "Erstes Geschenk verschickt", icon: "🎁", xp: 75 },
  { id: "super_like", title: "Super-Liker", description: "Ersten Super-Like vergeben", icon: "⭐", xp: 30 },
  { id: "match_10", title: "Beliebt", description: "10 Matches gesammelt", icon: "💖", xp: 200 },
];

const LEVELS = [
  { level: 1, xpRequired: 0, title: "Neuling", icon: "🌱", reward: "10 Coins" },
  { level: 2, xpRequired: 100, title: "Anfänger", icon: "🌿", reward: "20 Coins" },
  { level: 3, xpRequired: 300, title: "Fortgeschritten", icon: "🌳", reward: "50 Coins + 1 Boost" },
  { level: 4, xpRequired: 600, title: "Erfahren", icon: "🌟", reward: "100 Coins" },
  { level: 5, xpRequired: 1000, title: "Profi", icon: "💎", reward: "200 Coins + 3 Super-Likes" },
  { level: 6, xpRequired: 1500, title: "Experte", icon: "👑", reward: "500 Coins + 1 Woche Premium" },
  { level: 7, xpRequired: 2500, title: "Meister", icon: "🏆", reward: "1000 Coins + 1 Monat Premium" },
  { level: 8, xpRequired: 5000, title: "Legende", icon: "🔥", reward: "2000 Coins + Premium Plus" },
];

export default function Gamification() {
  const { user, loading } = useAuth();

  const { data: stats } = trpc.gamification.getStats.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: dailyReward } = trpc.gamification.getDailyReward.useQuery(undefined, {
    enabled: !!user,
  });

  const claimRewardMutation = trpc.gamification.claimDailyReward.useMutation({
    onSuccess: (data) => {
      toast.success(`🎁 ${data.coins} Coins erhalten! Streak: ${data.streak} Tage`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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

  const currentLevel = LEVELS.find((l) => l.level === (stats?.level || 1)) || LEVELS[0];
  const nextLevel = LEVELS.find((l) => l.level === (stats?.level || 1) + 1);
  const xpProgress = nextLevel
    ? ((stats?.xp || 0) - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired) * 100
    : 100;

  const canClaimReward = dailyReward && !dailyReward.claimed;

  return (
    <div className="min-h-screen bg-gradient-pink-purple relative pb-20">
      <FlyingHearts />
      
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8" />
            Erfolge & Belohnungen
          </h1>
          <p className="text-white/80 mt-2">Sammle XP, schalte Achievements frei und erhalte Belohnungen!</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Level Progress */}
        <Card className="bg-white/95 backdrop-blur-sm border-2 border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <span className="text-4xl">{currentLevel.icon}</span>
              Level {stats?.level || 1} - {currentLevel.title}
            </CardTitle>
            <CardDescription>
              {stats?.xp || 0} XP {nextLevel && `/ ${nextLevel.xpRequired} XP bis Level ${nextLevel.level}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={xpProgress} className="h-4" />
            {nextLevel && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Nächstes Level:</span>
                <span className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">{nextLevel.icon}</span>
                  {nextLevel.title} - {nextLevel.reward}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Reward */}
        <Card className="bg-gradient-to-br from-pink-500 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Gift className="w-8 h-8" />
              Tägliche Belohnung
            </CardTitle>
            <CardDescription className="text-white/90">
              Logge dich jeden Tag ein und erhalte Coins!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8 text-orange-300" />
                <div>
                  <div className="text-2xl font-bold">{dailyReward?.streak || 0} Tage</div>
                  <div className="text-sm text-white/80">Streak</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-yellow-300" />
                <div>
                  <div className="text-2xl font-bold">{dailyReward?.coins || 10} Coins</div>
                  <div className="text-sm text-white/80">Heute</div>
                </div>
              </div>
            </div>
            <Button
              className="w-full bg-white text-pink-600 hover:bg-white/90 font-bold text-lg py-6"
              onClick={() => claimRewardMutation.mutate()}
              disabled={!canClaimReward || claimRewardMutation.isPending}
            >
              {canClaimReward ? (
                <>
                  <Gift className="w-5 h-5 mr-2" />
                  Belohnung abholen!
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5 mr-2" />
                  Komm morgen wieder!
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Award className="w-7 h-7" />
            Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ACHIEVEMENTS.map((achievement) => {
              const unlocked = stats?.achievements?.includes(achievement.id);
              return (
                <Card
                  key={achievement.id}
                  className={`${
                    unlocked
                      ? "bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-400"
                      : "bg-white/80 border-gray-200"
                  } transition-all hover:scale-105`}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`text-4xl ${!unlocked && "grayscale opacity-50"}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg flex items-center gap-2">
                        {achievement.title}
                        {unlocked && <Trophy className="w-5 h-5 text-yellow-600" />}
                      </div>
                      <div className="text-sm text-gray-600">{achievement.description}</div>
                      <div className="text-xs text-pink-600 font-semibold mt-1 flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        +{achievement.xp} XP
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6" />
              Deine Statistiken
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="text-3xl font-bold text-pink-600">{stats?.totalSwipes || 0}</div>
                <div className="text-sm text-gray-600">Swipes</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{stats?.totalMatches || 0}</div>
                <div className="text-sm text-gray-600">Matches</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{stats?.totalMessages || 0}</div>
                <div className="text-sm text-gray-600">Nachrichten</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">{stats?.achievements?.length || 0}/{ACHIEVEMENTS.length}</div>
                <div className="text-sm text-gray-600">Achievements</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
