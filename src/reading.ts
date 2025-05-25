import { rand } from "./util";

const tarotDeck = [
    {
        name: "The Fool",
        description: "Taking a risk, A new beginning. Folly, mania, extravagance, intoxication, delirium, frenzy. The fool’s journey.",
        image: "0-the-fool.jpg",
    },
    {
        name: "The Magician",
        description: "Skill, creation, diplomacy, confidence, will. Imagination.",
        image: "1-the-magician.jpg",
    },
    {
        name: "The High Priestess",
        description: "Secrets, mystery, the future as yet unrevealed, silence, wisdom. Divine feminine energy. Your subconscious mind is your best guide.",
        image: "2-the-high-priestess.jpg",
    },
    {
        name: "The Empress",
        description: "Fruitfulness, initiative. Mothering energy, embracing the qualities of nurturing and love. Connection to nature.",
        image: "3-the-empress.jpg",
    },
    {
        name: "The Emperor",
        description: "Power and Authority. Stability and security in life. Protection, aid, a great person, conviction, reason.",
        image: "4-the-emperor.jpg",
    },
    {
        name: "The Hierophant",
        description: "Sprituality and higher education. Marriage alliance, captivity, servitude, mercy and goodness, inspiration.",
        image: "5-the-hierophant.jpg",
    },
    {
        name: "The Lovers",
        description: "Attraction, love, beauty, choices, trials overcome.",
        image: "6-the-lovers.jpg",
    },
    {
        name: "The Chariot",
        description: "Progression, forward motion, vengeance.",
        image: "7-the-chariot.jpg",
    },
    {
        name: "Strength",
        description: "Power, energy, action, courage, magnanimity.",
        image: "8-strength.jpg",
    },
    {
        name: "The Hermit",
        description: "Looking Within. Introspection, soul searching, solitude.",
        image: "9-the-hermit.jpg",
    },
    {
        name: "Wheel of Fortune",
        description: "Destiny, fortune, success, luck, felicity. You must go with the flow of life.",
        image: "10-wheel-of-fortune.jpg",
    },
    {
        name: "Justice",
        description: "Equity, rightness, probity, executive, fairness, cause and effect.",
        image: "11-justice.jpg",
    },
    {
        name: "The Hanged Man",
        description: "Wisdom, trials, circumspection, discernment, sacrifice, intuition, divination, prophecy.",
        image: "12-the-hanged-man.jpg",
    },
    {
        name: "Death",
        description: "Endings, beginnings, change, mortality, destruction, corruption.",
        image: "13-death.jpg",
    },
    {
        name: "Temperance",
        description: "Economy, moderation, frugality, management, accommodation.",
        image: "14-temperance.jpg",
    },
    {
        name: "The Devil",
        description: "Obsession, Materialism, Addiction.",
        image: "15-the-devil.jpg",
    },
    {
        name: "The Tower",
        description: "Sudden Change, misery, distress, ruin, indigence, adversity, calamity, disgrace, deception.",
        image: "16-the-tower.jpg",
    },
    {
        name: "The Star",
        description: "Suggests hope and bright prospects in the future. Spiritual Guidance.",
        image: "17-the-star.jpg",
    },
    {
        name: "The Moon",
        description: "Illusion, mystery, dreams. Hidden enemies, danger, calumny, darkness, terror, deception, error.",
        image: "18-the-moon.jpg",
    },
    {
        name: "The Sun",
        description: "Success, vitality, youth. Material happiness, fortunate marriage and contentment.",
        image: "19-the-sun.jpg",
    },
    {
        name: "Judgement",
        description: "Change of position, renewal, outcome.",
        image: "20-judgement.jpg",
    },
    {
        name: "The World",
        description: "Completion, accomplishment, assured success, route, voyage, emigration, flight, change of place.",
        image: "21-the-world.jpg",
    },
    {
        name: "Ace of Wands",
        description: "New ideas, creativity, potential, success. Inspiration.",
        image: "Ace-of-wands.jpg",
    },
    {
        name: "Two of Wands",
        description: "Planning for the future. Making progress. Discovery.",
        image: "2-of-wands.jpg",
    },
    {
        name: "Three of Wands",
        description: "Progress, expansion, new opportunities. From this vantage point you can see all that lies ahead.",
        image: "3-of-wands.jpg",
    },
    {
        name: "Four of Wands",
        description: "Celebration, harmony, attainment. Peace; Prosperity; Rest after labor.",
        image: "4-of-wands.jpg",
    },
    {
        name: "Five of Wands",
        description: "A posse of youths are brandishing staves, as if in sport or strife. It is mimic warfare.",
        image: "5-of-wands.jpg",
    },
    {
        name: "Six of Wands",
        description: "Victory, success, reward, achievement.",
        image: "6-of-wands.jpg",
    },
    {
        name: "Seven of Wands",
        description: "Competition, challenges, strength.",
        image: "7-of-wands.jpg",
    },
    {
        name: "Eight of Wands",
        description: "Travel, swift movement, changes, quick decision making.",
        image: "8-of-wands.jpg",
    },
    {
        name: "Nine of Wands",
        description: "The figure leans upon his staff and has an expectant look, as if awaiting an enemy.",
        image: "9-of-wands.jpg",
    },
    {
        name: "Ten of Wands",
        description: "A man oppressed by the weight of the ten staves which he is carrying.",
        image: "10-of-wands.jpg",
    },
    {
        name: "Page of Wands",
        description: "Explosive creativity, optimism, curiosity, youthful inspiration.",
        image: "Page-of-wands.jpg",
    },
    {
        name: "Knight of Wands",
        description: "He is on a journey, armed with a short wand. Enthusiasm, energy, adventure. Forward movement.",
        image: "Knight-of-wands.jpg",
    },
    {
        name: "Queen of Wands",
        description: "Inspiration, accomplishment, vibrance and optimism.",
        image: "Queen-of-wands.jpg",
    },
    {
        name: "King of Wands",
        description: "Leadership, vision and inspiration.",
        image: "King-of-wands.jpg",
    },
    {
        name: "Ace of Cups",
        description: "Love, new relationship, friendship, joy, creativity. Awakening.",
        image: "Ace-of-cups.jpg",
    },
    {
        name: "Two of Cups",
        description: "Partnership, harmony, exchange of energy.",
        image: "2-of-cups.jpg",
    },
    {
        name: "Three of Cups",
        description: "Celebration, friendships, family cooperation.",
        image: "3-of-cups.jpg",
    },
    {
        name: "Four of Cups",
        description: "Contemplation, reevaluation, missed opportunities, not appreciating what you have, love after loss.",
        image: "4-of-cups.jpg",
    },
    {
        name: "Five of Cups",
        description: "Grief, mourning, sadness, loss, disappointment, regret, self-pity.",
        image: "5-of-cups.jpg",
    },
    {
        name: "Six of Cups",
        description: "The past, reunions, nostalgia, childlike energy. Old memories.",
        image: "6-of-cups.jpg",
    },
    {
        name: "Seven of Cups",
        description: "Choices, opportunities, daydreaming, wishful thinking.",
        image: "7-of-cups.jpg",
    },
    {
        name: "Eight of Cups",
        description: "Letting go, moving on. A change or turning point.",
        image: "8-of-cups.jpg",
    },
    {
        name: "Nine of Cups",
        description: "Joy, manifesting dreams, abundance, wishes fullfilled.",
        image: "9-of-cups.jpg",
    },
    {
        name: "Ten of Cups",
        description: "Joy, love, happiness, family, contentment.",
        image: "10-of-cups.jpg",
    },
    {
        name: "Page of Cups",
        description: "Creativity, magic, romance.",
        image: "Page-of-cups.jpg",
    },
    {
        name: "Knight of Cups",
        description: "Romance, passion, love, chivalry.",
        image: "Knight-of-cups.jpg",
    },
    {
        name: "Queen of Cups",
        description: "Divine feminine energy. Emotions, love, compassion, healing.",
        image: "Queen-of-cups.jpg",
    },
    {
        name: "King of Cups",
        description: "Love, nurturing, wisdom.",
        image: "King-of-cups.jpg",
    },
    {
        name: "Ace of Swords",
        description: "Victory, progress, mental clarity, truth revealed.",
        image: "Ace-of-swords.jpg",
    },
    {
        name: "Two of Swords",
        description: "A stalemate or crossroads, choices, making a decision.",
        image: "2-of-swords.jpg",
    },
    {
        name: "Three of Swords",
        description: "Pain, sorrow, heartbreak, disappointment.",
        image: "3-of-swords.jpg",
    },
    {
        name: "Four of Swords",
        description: "Deep rest, vacation, contemplation, healing, recovery.",
        image: "4-of-swords.jpg",
    },
    {
        name: "Five of Swords",
        description: "Conflict, tension, loss, change in perspective.",
        image: "5-of-swords.jpg",
    },
    {
        name: "Six of Swords",
        description: "Improvement, end of difficult times, healing, moving on. Transition.",
        image: "6-of-swords.jpg",
    },
    {
        name: "Seven of Swords",
        description: "Self-confidence, being grateful, strength, cunning, strategy, utilizing the resources you have.",
        image: "7-of-swords.jpg",
    },
    {
        name: "Eight of Swords",
        description: "Blind trust, constraint, feeling stuck.",
        image: "8-of-swords.jpg",
    },
    {
        name: "Nine of Swords",
        description: "Nightmares, fear, anxiety, worry, stress.",
        image: "9-of-swords.jpg",
    },
    {
        name: "Ten of Swords",
        description: "End of the situation, peace, finality, moving on.",
        image: "10-of-swords.jpg",
    },
    {
        name: "Page of Swords",
        description: "Intelligence, curiosity, thirst for knowledge, truth.",
        image: "Page-of-swords.jpg",
    },
    {
        name: "Knight of Swords",
        description: "Haste, streamlined decision making, determination, ambition, success.",
        image: "Knight-of-swords.jpg",
    },
    {
        name: "Queen of Swords",
        description: "Truth and Justice.",
        image: "Queen-of-swords.jpg",
    },
    {
        name: "King of Swords",
        description: "Intelligence, knowledge, clear thinking, truth.",
        image: "King-of-swords.jpg",
    },
    {
        name: "Ace of Pentacles",
        description: "Success, manifestation, security, prosperity.",
        image: "Ace-of-pentacles.jpg",
    },
    {
        name: "Two of Pentacles",
        description: "Balance, resourcefulness, good management.",
        image: "2-of-pentacles.jpg",
    },
    {
        name: "Three of Pentacles",
        description: "Success, skill, recognition.",
        image: "3-of-pentacles.jpg",
    },
    {
        name: "Four of Pentacles",
        description: "Security, savings, protecting resources.",
        image: "4-of-pentacles.jpg",
    },
    {
        name: "Five of Pentacles",
        description: "Poverty, insecurity, lack, financial loss.",
        image: "5-of-pentacles.jpg",
    },
    {
        name: "Six of Pentacles",
        description: "Charity, generosity, exchange of energy, giving and receiving.",
        image: "6-of-pentacles.jpg",
    },
    {
        name: "Seven of Pentacles",
        description: "Perseverance, results, effort and reward.",
        image: "7-of-pentacles.jpg",
    },
    {
        name: "Eight of Pentacles",
        description: "Apprenticeship, teaching, mastering skills.",
        image: "8-of-pentacles.jpg",
    },
    {
        name: "Nine of Pentacles",
        description: "Luxury, independence, success, prosperity, good luck.",
        image: "9-of-pentacles.jpg",
    },
    {
        name: "Ten of Pentacles",
        description: "Financial blessings, generational wealth, confidence, reward.",
        image: "10-of-pentacles.jpg",
    },
    {
        name: "Page of Pentacles",
        description: "Financial opportunities, good news, beginnings.",
        image: "Page-of-pentacles.jpg",
    },
    {
        name: "Knight of Pentacles",
        description: "Stability, progress, determination, diligence, expansion."
    },
    {
        name: "Queen of Pentacles",
        description: "Generosity, security, providing for your family.",
        image: "Queen-of-pentacles.jpg",
    },
    {
        name: "King of Pentacles",
        description: "Economic Power. Reaping a big harvest. Having it all.",
        image: "King-of-pentacles.jpg"
    }
];

export default class Reading {
    id: string;

    userId: string;

    deck: typeof tarotDeck;

    drawn: typeof tarotDeck = [];

    interpretations: Record<number, string> = {};

    constructor(userId: string) {
        this.id = `r_${Date.now().toString()}`;
        this.userId = userId;
        this.deck = [...tarotDeck];
    }

    draw() {
        const drawnIndex = rand(this.deck.length - 1);
        const card = this.deck[drawnIndex];
        this.drawn.push(card);
        this.deck.splice(drawnIndex, 1);
        return card;
    }

    interpret(drawnIndex: number, interpretation: string) {
        this.interpretations[drawnIndex] = interpretation;
    }

    getLastDrawn() {
        if (this.drawn.length === 0) {
            return null;
        }
        return this.drawn[this.drawn.length - 1];
    }

    getSpreadMeanings() {
        const cardMeanings: string[] = [];
        if (this.drawn.length === 3) {
            cardMeanings.push("Past", "Present", "Future");
        } else if (this.drawn.length === 7) {
            cardMeanings.push("Past Influences", "Present Circumstances", "Upcoming Influences",
                "Best Course of Action", "The Attitude of Others", "Possible Obstacles", "Final Outcome");
        }
        return cardMeanings;
    }

    getSpreadDescription() {
        let spreadDescription = "Here are your cards:";
        if (this.drawn.length === 3) {
            spreadDescription = "You've completed a **past-present-future spread**.";
        } else if (this.drawn.length === 5) {
            spreadDescription = "You've completed a **five-card spread**, ideal for checking in with one's emotional and mental clarity.";
        } else if (this.drawn.length === 7) {
            spreadDescription = "You've completed a **horseshoe spread**, providing much insight into one's life.";
        }
        return spreadDescription;
    }
}
