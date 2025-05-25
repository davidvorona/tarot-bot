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
