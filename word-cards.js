// Word Cards Database for Word Tinder Game
// Toastmasters-focused topics with engaging keywords

const wordCards = [
  {
    topic: "Belt Road Impact",
    keywords: [
      "infrastructure",
      "debt trap",
      "globalization",
      "developing nations",
      "trade",
    ],
  },
  {
    topic: "Is TikTok spyware?",
    keywords: ["data security", "US-China", "algorithm", "ban", "influence"],
  },
  {
    topic: "Traditional Medicine Revival",
    keywords: [
      "WHO recognition",
      "acupuncture",
      "cultural heritage",
      "modern integration",
      "controversy",
    ],
  },
  {
    topic: "Housing Bubble?",
    keywords: [
      "Evergrande",
      "ghost cities",
      "mortgage",
      "speculation",
      "crisis",
    ],
  },
  {
    topic: "AI Censorship Necessary",
    keywords: [
      "social stability",
      "Great Firewall",
      "misinformation",
      "control",
      "privacy",
    ],
  },

  {
    topic: "Single's Day Boom",
    keywords: ["Alibaba", "consumption", "e-commerce", "records", "marketing"],
  },
  {
    topic: "Panda Diplomacy Works",
    keywords: [
      "soft power",
      "conservation",
      "diplomatic tool",
      "rentals",
      "symbolism",
    ],
  },
  {
    topic: "Gaokao Fair?",
    keywords: [
      "education equity",
      "pressure",
      "rural vs urban",
      "reform",
      "future",
    ],
  },
  {
    topic: "Tech Self-Reliance",
    keywords: ["semiconductors", "Huawei", "sanctions", "innovation", "SMIC"],
  },
  {
    topic: "Three-Child Policy Effective?",
    keywords: [
      "aging population",
      "incentives",
      "women",
      "demographics",
      "resistance",
    ],
  },

  {
    topic: "ESports Dominance",
    keywords: ["Honor of Kings", "streamers", "billions", "youth", "olympics"],
  },
  {
    topic: "Renewables Leader",
    keywords: ["solar panels", "EVs", "carbon goals", "BYD", "transition"],
  },
  {
    topic: "Food Security",
    keywords: [
      "pork reserves",
      "GMO",
      "farmland",
      "imports",
      "self-sufficiency",
    ],
  },
  {
    topic: "Travel Rebound",
    keywords: ["revenge spending", "ASEAN", "visa-free", "tourism", "economy"],
  },
  {
    topic: "K-pop vs C-pop",
    keywords: [
      "cultural export",
      "idols",
      "soft power",
      "global reach",
      "competition",
    ],
  },

  {
    topic: "AI Job Threat",
    keywords: [
      "manufacturing",
      "white-collar",
      "retraining",
      "efficiency",
      "inequality",
    ],
  },
  {
    topic: "Moon Base Possible",
    keywords: [
      "Chang'e program",
      "helium-3",
      "space race",
      "technology",
      "collaboration",
    ],
  },
  {
    topic: "Aging Crisis",
    keywords: [
      "pension",
      "4-2-1 families",
      "healthcare",
      "loneliness",
      "robots",
    ],
  },
  {
    topic: "Gen Z Values",
    keywords: [
      "tang ping",
      "patriotism",
      "digital natives",
      "consumption",
      "pressure",
    ],
  },
  {
    topic: "Pollution Progress?",
    keywords: ["blue skies", "EV adoption", "coal", "monitoring", "health"],
  },

  {
    topic: "Digital Yuan Advantage",
    keywords: ["cashless", "surveillance", "global", "adoption", "privacy"],
  },
  {
    topic: "Manga Influence",
    keywords: [
      "anime",
      "comics",
      "youth culture",
      "localization",
      "competition",
    ],
  },
  {
    topic: "Stocks Attractive?",
    keywords: [
      "retail investors",
      "volatility",
      "regulations",
      "IPOs",
      "confidence",
    ],
  },
  {
    topic: "English Education Obsession",
    keywords: ["tutoring", "IELTS", "opportunity", "inequality", "reform"],
  },
  {
    topic: "Innovation vs Imitation",
    keywords: ["patents", "copycats", "startups", "ecosystem", "originality"],
  },

  {
    topic: "Work-Life Balance Possible?",
    keywords: [
      "996 culture",
      "burnout",
      "gig economy",
      "expectations",
      "reform",
    ],
  },
  {
    topic: "Should Universities Expand?",
    keywords: [
      "employment",
      "quality",
      "vocational",
      "overeducation",
      "investment",
    ],
  },
  {
    topic: "Social Credit Benefits",
    keywords: [
      "behavior",
      "convenience",
      "blacklist",
      "western fear",
      "experiment",
    ],
  },
  {
    topic: "Rural Revitalization",
    keywords: ["poverty", "e-commerce", "migration", "subsidies", "challenges"],
  },
  {
    topic: "Luxury Demand",
    keywords: [
      "status",
      "young buyers",
      "economic indicator",
      "imports",
      "tourism",
    ],
  },

  {
    topic: "Metaverse Hype Real?",
    keywords: [
      "virtual reality",
      "investment",
      "gaming",
      "social interaction",
      "speculation",
    ],
  },
  {
    topic: "Inflation Solutions",
    keywords: ["stimulus", "supply chains", "consumers", "policy", "global"],
  },
  {
    topic: "Remote Work Future",
    keywords: [
      "productivity",
      "isolation",
      "technology",
      "culture",
      "flexibility",
    ],
  },
  {
    topic: "NFTs Dead?",
    keywords: ["crypto crash", "art", "scams", "utility", "bubble"],
  },
  {
    topic: "Universal Basic Income",
    keywords: ["automation", "poverty", "trials", "cost", "work ethic"],
  },

  {
    topic: "Space Tourism Wasteful",
    keywords: [
      "billionaires",
      "environment",
      "research",
      "inequality",
      "colonization",
    ],
  },
  {
    topic: "Fast Fashion Costs",
    keywords: [
      "exploitation",
      "waste",
      "consumption",
      "alternatives",
      "awareness",
    ],
  },
  {
    topic: "Veganism Trend",
    keywords: ["health", "environment", "culture", "restaurants", "resistance"],
  },
  {
    topic: "Cryptocurrency Future",
    keywords: ["regulation", "adoption", "volatility", "blockchain", "banks"],
  },
  {
    topic: "Mental Health Crisis",
    keywords: ["loneliness", "therapy", "stigma", "social media", "resources"],
  },

  {
    topic: "Cancel Culture Harmful?",
    keywords: [
      "accountability",
      "extremism",
      "free speech",
      "social media",
      "consequences",
    ],
  },
  {
    topic: "Climate Action Delay",
    keywords: ["politics", "denial", "cost", "protests", "urgency"],
  },
  {
    topic: "Gaming Addiction Real",
    keywords: ["health", "regulation", "industry", "parents", "esports"],
  },
  {
    topic: "Deepfake Dangers",
    keywords: [
      "misinformation",
      "pornography",
      "politics",
      "detection",
      "ethics",
    ],
  },
  {
    topic: "Four-Day Week",
    keywords: [
      "productivity",
      "wellbeing",
      "trials",
      "resistance",
      "revolution",
    ],
  },

  {
    topic: "Microplastics Everywhere",
    keywords: ["health", "water", "food chain", "solutions", "awareness"],
  },
  {
    topic: "TikTok Influence",
    keywords: ["publishing", "genres", "community", "algorithms", "sales"],
  },
  {
    topic: "Sports Gambling Normalization",
    keywords: ["addiction", "revenue", "ads", "regulation", "youth"],
  },
  {
    topic: "Minimalism Movement",
    keywords: [
      "consumption",
      "wellbeing",
      "sustainability",
      "aesthetics",
      "capitalism",
    ],
  },
  {
    topic: "K-Pop Factory",
    keywords: ["training", "mental health", "fandom", "global", "exploitation"],
  },
];

// Add IDs to cards and create indexed version
const wordCardsWithIds = wordCards.map((card, index) => ({
  id: index + 1,
  ...card,
}));

// Utility functions for word card management
function getRandomCard() {
  const randomIndex = Math.floor(Math.random() * wordCardsWithIds.length);
  return wordCardsWithIds[randomIndex];
}

function getCardById(id) {
  return wordCardsWithIds.find((card) => card.id === id);
}

function getAllCards() {
  return [...wordCardsWithIds];
}

function getRandomUnusedCard(usedCardIds = []) {
  const unusedCards = wordCardsWithIds.filter(
    (card) => !usedCardIds.includes(card.id)
  );
  if (unusedCards.length === 0) {
    // If all cards have been used, reset and start over
    return getRandomCard();
  }
  const randomIndex = Math.floor(Math.random() * unusedCards.length);
  return unusedCards[randomIndex];
}

function getRandomKeywordFromCard(card) {
  const randomIndex = Math.floor(Math.random() * card.keywords.length);
  return card.keywords[randomIndex];
}

module.exports = {
  wordCards: wordCardsWithIds,
  getRandomCard,
  getCardById,
  getAllCards,
  getRandomUnusedCard,
  getRandomKeywordFromCard,
};
