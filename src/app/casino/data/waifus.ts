export interface WaifuCharacter {
  id: string;
  name: string;
  title: string;
  game: string;
  emoji: string;
  color: string;
  accentColor: string;
  bgGradient: string;
  personality: string;
  greetings: string[];
  winLines: string[];
  loseLines: string[];
  idleLines: string[];
}

export const waifus: Record<string, WaifuCharacter> = {
  runa: {
    id: "runa",
    name: "Runa",
    title: "The Crimson Croupier",
    game: "Roulette",
    emoji: "🎰",
    color: "#ef4444",
    accentColor: "#fbbf24",
    bgGradient: "from-red-900 via-red-800 to-rose-900",
    personality: "Passionate and dramatic, Runa treats every spin like a grand performance.",
    greetings: [
      "Welcome, darling~ Ready to let fate decide?",
      "Ara ara~ Another brave soul at my table!",
      "The wheel of destiny awaits you, dear~",
      "My my~ You look like a lucky one tonight!",
    ],
    winLines: [
      "Kyaa~! What an incredible win! ✨",
      "Sugoi! The wheel smiles upon you tonight~",
      "Magnificent! You're making my heart race, darling!",
      "Oooh~ Lady luck herself must be jealous of you!",
    ],
    loseLines: [
      "Ara~ Better luck next time, dear...",
      "Don't pout, darling. The wheel is fickle~",
      "Aww~ Stay strong! Your luck will turn around!",
      "The wheel giveth and the wheel taketh away~",
    ],
    idleLines: [
      "Place your bets, darling~ The wheel grows impatient!",
      "Pick a number... any number~ I won't peek!",
      "Red or black? Such a simple choice, yet so thrilling~",
      "Don't keep me waiting too long, dear~",
    ],
  },
  sakura: {
    id: "sakura",
    name: "Sakura",
    title: "The Lucky Blossom",
    game: "Slots",
    emoji: "🌸",
    color: "#ec4899",
    accentColor: "#a855f7",
    bgGradient: "from-pink-900 via-fuchsia-900 to-purple-900",
    personality: "Bubbly and encouraging, Sakura cheers for every pull.",
    greetings: [
      "Yay~! Welcome welcome! Let's spin together! 🌸",
      "Hiii~! Ready for some sparkly fun?! ✨",
      "Ooh ooh! A new friend! Pull the lever, pull it~!",
      "Welcome to my garden of luck! 🎰🌸",
    ],
    winLines: [
      "KYAAA~!! YOU WON YOU WON YOU WON!! 🎉🌸",
      "SUGOOOI~! Look at all those coins!! ✨✨",
      "I KNEW you were lucky!! I just KNEW it!! 🌟",
      "Amazing amazing AMAZING~!! Sakura is so happy for you!!",
    ],
    loseLines: [
      "Awww~ Don't worry! Sakura believes in you! 🌸",
      "It's okay it's okay! Next spin will be THE one!",
      "Mou~ The reels are being mean! Try again~!",
      "Gambatte! Never give up, okay?! 💪🌸",
    ],
    idleLines: [
      "Nee nee~ Ready to spin? I'm so excited~!! 🌸",
      "The reels are calling your name~! Can you hear them?",
      "Spin spin spin~! Sakura wants to see fireworks! 🎆",
      "Come on come on~! Let's make some magic! ✨",
    ],
  },
  yuki: {
    id: "yuki",
    name: "Yuki",
    title: "The Frost Dealer",
    game: "Blackjack",
    emoji: "❄️",
    color: "#3b82f6",
    accentColor: "#06b6d4",
    bgGradient: "from-blue-950 via-indigo-900 to-slate-900",
    personality: "Cool and calculating. Yuki respects skilled players above all.",
    greetings: [
      "...Welcome. Sit down. Let's see what you've got.",
      "Another challenger? Interesting. Cards are shuffled.",
      "The table is cold tonight. Can you warm it up?",
      "Hmph. You look confident. Prove it.",
    ],
    winLines: [
      "...Impressive. You've earned my respect.",
      "Tch. Well played. I won't lose next time.",
      "...Not bad. Not bad at all.",
      "Hmm. You actually know what you're doing.",
    ],
    loseLines: [
      "As expected. The house always has the edge.",
      "...Don't feel bad. Few can beat me.",
      "Better luck next hand. Or better strategy.",
      "The cards don't lie. Try again if you dare.",
    ],
    idleLines: [
      "...Decide. Hit or stand. I don't have all night.",
      "The cards wait for no one. What's your move?",
      "Hesitation is a losing strategy.",
      "...Think carefully. Every choice matters here.",
    ],
  },
};

export function getRandomLine(lines: string[]): string {
  return lines[Math.floor(Math.random() * lines.length)];
}
