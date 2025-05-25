import { Client, IntentsBitField, Events, REST, Routes, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder } from "discord.js";
import Canvas from "@napi-rs/canvas";
import path from "path";
import { parseJson, rand, readFile } from "./util";
import { AuthJson } from "./types";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const commands = require("../config/commands");

const authPath = path.join(__dirname, "../config/auth.json");
const { TOKEN, CLIENT_ID } = parseJson(readFile(authPath)) as AuthJson;

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

// Initialize Discord REST client
const rest = new REST().setToken(TOKEN);

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds
    ]
});

client.on(Events.ClientReady, async () => {
    try {
        if (client.user) {
            console.info("Logged in as", client.user.tag);
        }
        if (client.application) {
            await rest.put(
                Routes.applicationCommands(CLIENT_ID),
                { body: commands }
            );
        }
    } catch (err) {
        console.error(err);
    }
});

const readings: Record<string, number[]> = {};

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        try {
            if (interaction.commandName === "ping") {
                await interaction.reply("Pong!");
            }
            if (interaction.commandName === "reading") {
                const user = interaction.options.getUser("user", true);
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`:sparkles: Reading for ${user.username} :star_and_crescent:`)
                    .setDescription("Today is a new day, full of endless possibilities. Let the Tarot guide you, " +
                        `so you might pass on its wisdom to **${user.username}**.\nShuffle the deck to begin...`)
                    .setThumbnail(user.displayAvatarURL());
                const shuffleDeckButton = new ButtonBuilder()
                    .setCustomId(`${user.id}-shuffle`)
                    .setLabel("Shuffle the Deck")
                    .setStyle(ButtonStyle.Primary);
                const row = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        shuffleDeckButton
                    );
                await interaction.reply({
                    embeds: [embed],
                    components: [row],
                    ephemeral: true
                });

                readings[user.id] = [];
            }
        } catch (err) {
            console.error("Error handling interaction:", err);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: "An error occurred while processing your request.", ephemeral: true });
            } else {
                await interaction.reply({ content: "An error occurred while processing your request.", ephemeral: true });
            }
        }
    }
    if (interaction.isButton()) {
        const [userId, action] = interaction.customId.split("-");
        if (action === "shuffle") {
            const user = client.users.cache.get(userId);
            if (user) {
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`:sparkles: Reading for ${user.username} :star_and_crescent:`)
                    .setDescription("The deck has been shuffled. You can now draw a card.")
                    .setThumbnail(user.displayAvatarURL());
                const drawCardButton = new ButtonBuilder()
                    .setCustomId(`${user.id}-drawing`)
                    .setLabel("Draw a Card")
                    .setStyle(ButtonStyle.Primary);
                const row = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        drawCardButton
                    );
                await interaction.update({
                    embeds: [embed],
                    components: [row]
                });
            } else {
                await interaction.reply({ content: "User not found.", ephemeral: true });
            }
        }
        if (action === "drawing") {
            const user = client.users.cache.get(userId);
            if (user) {
                const randomIndex = rand(tarotDeck.length - 1);
                const card = tarotDeck[randomIndex];
                const reading = readings[user.id];
                reading.push(randomIndex);

                const file = new AttachmentBuilder(`./assets/${card.image}`);
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`:sparkles: Your Card for ${user.username} :star_and_crescent:`)
                    .setDescription(`You drew **${card.name}**!\n${card.description}`)
                    .setThumbnail(user.displayAvatarURL())
                    .setImage(`attachment://${card.image}`);
                const buttons = [];
                if (reading.length < 7) {
                    buttons.push(new ButtonBuilder()
                        .setCustomId(`${user.id}-drawing`)
                        .setLabel("Draw Another Card")
                        .setStyle(ButtonStyle.Primary));
                }
                if (reading.length > 2) {
                    buttons.push(new ButtonBuilder()
                        .setCustomId(`${user.id}-finished`)
                        .setLabel("End Reading")
                        .setStyle(ButtonStyle.Success));
                }
                const row = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(...buttons);
                await interaction.update({
                    embeds: [embed],
                    components: [row],
                    files: [file]
                });
            } else {
                await interaction.reply({ content: "User not found.", ephemeral: true });
            }
        }
        if (action === "finished") {
            const user = client.users.cache.get(userId);
            if (user) {
                const reading = readings[user.id];
                let spreadDescription = "Here are your cards:";
                const cardMeanings: string[] = [];
                if (reading.length === 3) {
                    spreadDescription = "You've completed a **past-present-future spread**.";
                    cardMeanings.push("Past", "Present", "Future");
                } else if (reading.length === 5) {
                    spreadDescription = "You've completed a **five-card spread**, ideal for checking in with one's emotional and mental clarity.";
                } else if (reading.length === 7) {
                    cardMeanings.push("Past Influences", "Present Circumstances", "Upcoming Influences",
                        "Best Course of Action", "The Attitude of Others", "Possible Obstacles", "Final Outcome");
                    spreadDescription = "You've completed a **horseshoe spread**, providing much insight into one's life.";
                }
                const fields = reading.map((index, idx) => {
                    const card = tarotDeck[index];
                    return { name: `${cardMeanings[idx] || `Card ${idx + 1}`}`, value: `${card.name}: *${card.description}*` };
                });
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`:sparkles: Reading for ${user.username} :star_and_crescent:`)
                    .setDescription(`Your reading is complete. ${spreadDescription}`)
                    .addFields(fields)
                    .setThumbnail(user.displayAvatarURL());
                const shareButton = new ButtonBuilder()
                    .setCustomId(`${user.id}-share`)
                    .setLabel("Share Reading")
                    .setStyle(ButtonStyle.Success);
                const row = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(shareButton);
                await interaction.update({
                    embeds: [embed],
                    components: [row],
                    files: [],
                });
            } else {
                await interaction.reply({ content: "User not found.", ephemeral: true });
            }
        }
        if (action === "share") {
            const user = client.users.cache.get(userId);
            if (user) {
                const reading = readings[user.id];
                if (reading) {
                    const embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle(`:sparkles: Reading for ${user.username} :star_and_crescent:`)
                        .setDescription("Your reading has been shared with the server.")
                        .setThumbnail(user.displayAvatarURL());
                    await interaction.update({
                        embeds: [embed],
                        components: [],
                    });
                    
                    if (interaction.channel?.isSendable()) {
                        const fields = reading.map((index, idx) => {
                            const card = tarotDeck[index];
                            return { name: `Card ${idx + 1}`, value: `${card.name}: *${card.description}*` };
                        });
                        const canvasWidth = 700;
                        const canvas = Canvas.createCanvas(canvasWidth, 500);
                        const context = canvas.getContext("2d");

                        let count = 0;
                        for (const index of reading) {
                            const card = tarotDeck[index];
                            const avatarWidth = 278;
                            const avatar = await Canvas.loadImage(`./assets/${card.image}`);
                            const x = 25 + (count * ((canvasWidth - avatarWidth) / reading.length));
                            const y = 25;
                            context.drawImage(avatar, x, y, avatarWidth, 450);
                            count += 1;
                        }
                        const attachment = new AttachmentBuilder(await canvas.encode("png"), { name: "tarot-reading.png" });
                        const embed = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle(`:sparkles: Reading for ${user.username} :star_and_crescent:`)
                            .setDescription("Time swirls around you, and the cards lay bare your fate.")
                            .addFields(fields)
                            .setThumbnail(user.displayAvatarURL());
                        await interaction.channel.send({
                            content: `${user} *${interaction.user.username} has shared a reading with you...*`,
                            embeds: [embed],
                            files: [attachment]
                        });
                    }
                    delete readings[user.id]; // Clear the reading for the user
                } else {
                    await interaction.reply({ content: "No reading found for this user.", ephemeral: true });
                }
            } else {
                await interaction.reply({ content: "User not found.", ephemeral: true });
            }
        }
    }
});

client.login(TOKEN);
