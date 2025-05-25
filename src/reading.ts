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
    }
];

export default class Reading {
    id: string;

    userId: string;

    deck: typeof tarotDeck;

    drawn: typeof tarotDeck = [];

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
}
