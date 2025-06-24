// Word Cards Database for Word Tinder Game
// Toastmasters-focused topics with engaging keywords

const wordCards = [
  {
    id: 1,
    topic: "Leadership Challenges",
    keywords: ["mentor", "delegate", "inspire", "conflict", "vision"]
  },
  {
    id: 2,
    topic: "Public Speaking Fears",
    keywords: ["confidence", "anxiety", "stage fright", "practice", "courage"]
  },
  {
    id: 3,
    topic: "Communication Skills",
    keywords: ["listen", "empathy", "clarity", "feedback", "nonverbal"]
  },
  {
    id: 4,
    topic: "Time Management",
    keywords: ["priority", "deadline", "procrastination", "balance", "efficiency"]
  },
  {
    id: 5,
    topic: "Career Development",
    keywords: ["networking", "skills", "promotion", "goals", "growth"]
  },
  {
    id: 6,
    topic: "Team Building",
    keywords: ["collaboration", "trust", "diversity", "synergy", "unity"]
  },
  {
    id: 7,
    topic: "Innovation at Work",
    keywords: ["creativity", "change", "technology", "disruption", "adaptation"]
  },
  {
    id: 8,
    topic: "Work-Life Balance",
    keywords: ["boundaries", "stress", "family", "wellness", "priority"]
  },
  {
    id: 9,
    topic: "Customer Service",
    keywords: ["satisfaction", "complaint", "loyalty", "experience", "solution"]
  },
  {
    id: 10,
    topic: "Presentation Skills",
    keywords: ["slides", "storytelling", "audience", "engagement", "visual"]
  },
  {
    id: 11,
    topic: "Networking Events",
    keywords: ["introduction", "conversation", "business card", "follow-up", "relationship"]
  },
  {
    id: 12,
    topic: "Feedback Culture",
    keywords: ["constructive", "criticism", "improvement", "praise", "growth"]
  },
  {
    id: 13,
    topic: "Meeting Management",
    keywords: ["agenda", "participation", "decision", "action items", "efficiency"]
  },
  {
    id: 14,
    topic: "Conflict Resolution",
    keywords: ["mediation", "compromise", "understanding", "perspective", "solution"]
  },
  {
    id: 15,
    topic: "Personal Branding",
    keywords: ["reputation", "expertise", "visibility", "authenticity", "value"]
  },
  {
    id: 16,
    topic: "Digital Communication",
    keywords: ["email", "video call", "social media", "etiquette", "presence"]
  },
  {
    id: 17,
    topic: "Learning & Development",
    keywords: ["education", "training", "curiosity", "skill building", "mentorship"]
  },
  {
    id: 18,
    topic: "Cultural Diversity",
    keywords: ["inclusion", "perspective", "tradition", "understanding", "respect"]
  },
  {
    id: 19,
    topic: "Goal Setting",
    keywords: ["objective", "milestone", "achievement", "planning", "motivation"]
  },
  {
    id: 20,
    topic: "Change Management",
    keywords: ["transition", "resistance", "adaptation", "communication", "support"]
  },
  {
    id: 21,
    topic: "Workplace Humor",
    keywords: ["laughter", "morale", "appropriate", "timing", "connection"]
  },
  {
    id: 22,
    topic: "Remote Work",
    keywords: ["virtual", "isolation", "productivity", "technology", "collaboration"]
  },
  {
    id: 23,
    topic: "Sales Techniques",
    keywords: ["persuasion", "objection", "closing", "rapport", "value proposition"]
  },
  {
    id: 24,
    topic: "Crisis Management",
    keywords: ["emergency", "decision", "communication", "leadership", "recovery"]
  },
  {
    id: 25,
    topic: "Interview Skills",
    keywords: ["preparation", "questions", "confidence", "first impression", "follow-up"]
  },
  {
    id: 26,
    topic: "Social Media Impact",
    keywords: ["influence", "privacy", "professional", "content", "networking"]
  },
  {
    id: 27,
    topic: "Environmental Responsibility",
    keywords: ["sustainability", "conservation", "impact", "green", "future"]
  },
  {
    id: 28,
    topic: "Health & Wellness",
    keywords: ["exercise", "nutrition", "mental health", "stress", "energy"]
  },
  {
    id: 29,
    topic: "Technology Trends",
    keywords: ["artificial intelligence", "automation", "innovation", "disruption", "future"]
  },
  {
    id: 30,
    topic: "Travel Experiences",
    keywords: ["culture", "adventure", "planning", "memories", "perspective"]
  }
];

// Utility functions for word card management
function getRandomCard() {
  const randomIndex = Math.floor(Math.random() * wordCards.length);
  return wordCards[randomIndex];
}

function getCardById(id) {
  return wordCards.find(card => card.id === id);
}

function getAllCards() {
  return [...wordCards];
}

function getRandomKeywordFromCard(card) {
  const randomIndex = Math.floor(Math.random() * card.keywords.length);
  return card.keywords[randomIndex];
}

module.exports = {
  wordCards,
  getRandomCard,
  getCardById,
  getAllCards,
  getRandomKeywordFromCard
};