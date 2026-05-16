import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory "database" for the demo
  let userProfile = {
    id: "user_1",
    name: "RacingFan99",
    level: 4,
    points: 1250,
    streak: 5,
    nextRewardAt: 1500,
    badges: ["First Prediction", "3-Day Streak"],
    predictions: {} as Record<string, any> // raceId -> prediction
  };

  const drivers = [
    { id: "ver", name: "Max Verstappen", team: "Red Bull Racing", points: 350, wins: 12, podiums: 15, number: 1, image: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png" },
    { id: "nor", name: "Lando Norris", team: "McLaren", points: 285, wins: 3, podiums: 10, number: 4, image: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png" },
    { id: "lec", name: "Charles Leclerc", team: "Ferrari", points: 260, wins: 2, podiums: 8, number: 16, image: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png" },
    { id: "ham", name: "Lewis Hamilton", team: "Ferrari", points: 210, wins: 1, podiums: 5, number: 44, image: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png" },
    { id: "pia", name: "Oscar Piastri", team: "McLaren", points: 195, wins: 1, podiums: 4, number: 81, image: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png" },
  ];

  const calendar = [
    { id: "bhr", round: 1, name: "Bahrain Grand Prix", Date: "2026-03-02T15:00:00Z", status: "completed", circuit: "Bahrain International Circuit" },
    { id: "sau", round: 2, name: "Saudi Arabian Grand Prix", Date: "2026-03-09T17:00:00Z", status: "completed", circuit: "Jeddah Corniche Circuit" },
    { id: "aus", round: 3, name: "Australian Grand Prix", Date: "2026-03-24T04:00:00Z", status: "upcoming", circuit: "Albert Park Circuit" },
    { id: "jpn", round: 4, name: "Japanese Grand Prix", Date: "2026-04-07T05:00:00Z", status: "upcoming", circuit: "Suzuka International Racing Course" },
    { id: "chn", round: 5, name: "Chinese Grand Prix", Date: "2026-04-21T07:00:00Z", status: "upcoming", circuit: "Shanghai International Circuit" },
  ];

  const news = [
    { id: 1, title: "Hamilton's stunning debut for Ferrari in Bahrain", snippet: "The 7-time world champion shows he still has the pace, battling for the podium in his first race in red.", date: "2026-03-03T10:00:00Z" },
    { id: 2, title: "New aerodynamic regulations shake up the midfield", snippet: "Teams are struggling to adapt to the 2026 aero rules, leading to unpredictable results.", date: "2026-03-01T14:30:00Z" },
    { id: 3, title: "Verstappen dominates early, but McLaren closes the gap", snippet: "Red Bull's early advantage seems to be shrinking as McLaren brings a massive upgrade package to Australia.", date: "2026-03-12T09:15:00Z" }
  ];

  // API Routes
  app.get("/api/user", (req, res) => {
    res.json(userProfile);
  });

  app.post("/api/predict", (req, res) => {
    const { raceId, prediction } = req.body;
    
    // Simple logic: if prediction exists, don't re-reward instantly for this demo, 
    // but we'll grant +50 points for predicting early.
    const isNewPrediction = !userProfile.predictions[raceId];
    
    if (isNewPrediction) {
      userProfile.points += 50;
      // Check level up (every 500 points)
      const newLevel = Math.floor(userProfile.points / 500) + 1;
      if (newLevel > userProfile.level) {
        userProfile.level = newLevel;
        userProfile.badges.push(`Level ${newLevel} Strategist`);
      }
      userProfile.nextRewardAt = userProfile.level * 500 + 500;
    }

    userProfile.predictions[raceId] = prediction;

    res.json({
      success: true,
      message: isNewPrediction ? "+50 Points for submitting your prediction!" : "Prediction updated successfully.",
      user: userProfile
    });
  });

  app.get("/api/drivers", (req, res) => res.json(drivers));
  app.get("/api/calendar", (req, res) => res.json(calendar));
  app.get("/api/news", (req, res) => res.json(news));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
