import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Swipe from "./pages/Swipe";
import Profile from "./pages/Profile";
import Gamification from "./pages/Gamification";
import Matches from "./pages/Matches";
import Chat from "./pages/Chat";
import CompatibilityQuiz from "./pages/CompatibilityQuiz";
import Gifts from "./pages/Gifts";
import Shop from "./pages/Shop";
import ProductAdvisor from "./pages/ProductAdvisor";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/swipe"} component={Swipe} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/gamification"} component={Gamification} />
      <Route path={"/matches"} component={Matches} />
      <Route path={"/chat/:matchId"} component={Chat} />
      <Route path={"/quiz"} component={CompatibilityQuiz} />
      <Route path={"/gifts"} component={Gifts} />
      <Route path={"/shop"} component={Shop} />
      <Route path={"/products"} component={ProductAdvisor} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
