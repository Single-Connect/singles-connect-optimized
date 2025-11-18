import { useAuth } from "@/_core/hooks/useAuth";
import FlyingHearts from "@/components/FlyingHearts";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Heart } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const questions = [
  {
    id: 1,
    question: "Was ist dir in einer Beziehung am wichtigsten?",
    options: [
      "Vertrauen und Ehrlichkeit",
      "Gemeinsame Interessen",
      "Körperliche Anziehung",
      "Humor und Spaß",
    ],
  },
  {
    id: 2,
    question: "Wie verbringst du am liebsten deinen Freitagabend?",
    options: [
      "Gemütlich zu Hause mit Netflix",
      "Ausgehen und Feiern",
      "Sport oder Outdoor-Aktivitäten",
      "Kulturelle Events (Kino, Theater, Museum)",
    ],
  },
  {
    id: 3,
    question: "Was ist dein ideales Reiseziel?",
    options: [
      "Strandurlaub in der Karibik",
      "Städtetrip in Europa",
      "Abenteuerreise in Asien",
      "Entspannung in den Bergen",
    ],
  },
  {
    id: 4,
    question: "Wie gehst du mit Konflikten um?",
    options: [
      "Ich spreche Probleme direkt an",
      "Ich brauche erstmal Zeit zum Nachdenken",
      "Ich versuche Kompromisse zu finden",
      "Ich vermeide Konflikte wenn möglich",
    ],
  },
  {
    id: 5,
    question: "Was ist deine Einstellung zu Kindern?",
    options: [
      "Ich möchte definitiv Kinder",
      "Vielleicht in der Zukunft",
      "Ich bin mir noch unsicher",
      "Ich möchte keine Kinder",
    ],
  },
  {
    id: 6,
    question: "Wie wichtig ist dir Karriere?",
    options: [
      "Sehr wichtig, ich bin ehrgeizig",
      "Wichtig, aber Work-Life-Balance ist wichtiger",
      "Mittel, ich arbeite um zu leben",
      "Nicht so wichtig, Familie geht vor",
    ],
  },
  {
    id: 7,
    question: "Wie zeigst du Zuneigung?",
    options: [
      "Durch körperliche Nähe",
      "Durch Worte und Komplimente",
      "Durch Geschenke",
      "Durch gemeinsame Zeit",
    ],
  },
  {
    id: 8,
    question: "Was ist dein Kommunikationsstil?",
    options: [
      "Ich rede viel und gerne",
      "Ich höre lieber zu",
      "Ich bin ausgeglichen",
      "Ich brauche auch Zeit für mich",
    ],
  },
  {
    id: 9,
    question: "Wie spontan bist du?",
    options: [
      "Sehr spontan, ich liebe Überraschungen",
      "Ziemlich spontan, aber ich plane auch gerne",
      "Ich plane lieber im Voraus",
      "Ich brauche Struktur und Routine",
    ],
  },
  {
    id: 10,
    question: "Was ist deine Einstellung zu Geld?",
    options: [
      "Ich spare für die Zukunft",
      "Ich gebe gerne aus und genieße",
      "Ich bin sparsam",
      "Geld ist mir nicht so wichtig",
    ],
  },
];

export default function CompatibilityQuiz() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const progress = (Object.keys(answers).length / questions.length) * 100;

  const handleAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: optionIndex });
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      // Quiz completed
      setTimeout(() => {
        setIsCompleted(true);
        toast.success("Quiz abgeschlossen! 🎉");
      }, 300);
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

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-pink-purple relative pb-20">
        <FlyingHearts />
        
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm text-center">
            <CardContent className="p-12">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Quiz abgeschlossen! 🎉</h1>
              <p className="text-gray-600 mb-8">
                Deine Antworten wurden gespeichert und werden verwendet, um deine
                Kompatibilität mit anderen Nutzern zu berechnen.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => setLocation("/swipe")}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  Jetzt swipen
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCompleted(false);
                    setCurrentQuestion(0);
                    setAnswers({});
                  }}
                >
                  Quiz wiederholen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Navigation />
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-pink-purple relative pb-20">
      <FlyingHearts />
      
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Heart className="w-8 h-8 fill-current" />
            Kompatibilitäts-Quiz
          </h1>
          <p className="text-white/80 mt-2">
            Frage {currentQuestion + 1} von {questions.length}
          </p>
          <Progress value={progress} className="mt-4 h-2" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-8">{question.question}</h2>
            
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full text-left justify-start h-auto py-4 px-6 text-base ${
                    answers[question.id] === index
                      ? "border-pink-500 bg-pink-50"
                      : "hover:border-pink-300 hover:bg-pink-50"
                  }`}
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </Button>
              ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Zurück
              </Button>
              <Button
                variant="ghost"
                onClick={() => setLocation("/profile")}
              >
                Später fortsetzen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
}
