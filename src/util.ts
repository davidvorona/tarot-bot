import * as fs from "fs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEmpty = (thing: any) =>
    thing === null || thing === undefined
    || (typeof thing === "string" && !thing)
    || (Array.isArray(thing) && !thing.length)
    || typeof thing === "object" && !Object.keys(thing).length;

/**
 * Reads the file at the provided file path and returns stringified data.
 */
export const readFile = (filePath: string): string => fs.readFileSync(filePath, "utf-8");

export const readDir = (filePath: string): string[] => fs.readdirSync(filePath);

/**
 * Parses the stringified data to a JSON object and logs any exceptions.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseJson = (dataJson: string): any => {
    try {
        return JSON.parse(dataJson);
    } catch (err) {
        console.error(`Failed to read JSON ${dataJson}`);
        throw err;
    }
};

/**
 * Finds a random number between 0 and the provided max, exclusive.
 * Example: rand(3) => 0 or 1 or 2
 * 
 * @param {number} max 
 * @returns 
 */
export const rand = (max: number) => Math.floor(Math.random() * Math.floor(max));

export const getCrypticReadingPhrase = () => {
    const phrases = [
        "Time swirls around you, and for the cards are a reflection of your past, present, and future.",
        "The cards are a mirror, reflecting your innermost thoughts and feelings.",
        "The cards are a window into your soul, revealing the hidden truths that lie within.",
        "The Tarot brings forth an arcane wisdom, a glimpse into the mysteries of the universe.",
        "The universe whispers its secrets, and the cards are the key to unlocking them.",
        "Listen closely...are the cards whispering advice, a warning, or perhaps a gentle nudge towards a new path?",
        "Open your heart and mind. Trust your instincts, for the cards are a reflection of your own intuition.",
        "Time swirls around you, and the cards lay your fate bare.",
        "In the unceasing dance of destiny, the cards reveal the steps you must take.",
        "The cards are a compass, guiding you through the labyrinth of life."
    ];
    return phrases[rand(phrases.length)];
};
