import { Client, IntentsBitField, Events, REST, Routes, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder } from "discord.js";
import Canvas from "@napi-rs/canvas";
import path from "path";
import { parseJson, readFile } from "./util";
import { AuthJson } from "./types";
import Reading from "./reading";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const commands = require("../config/commands");

const authPath = path.join(__dirname, "../config/auth.json");
const { TOKEN, CLIENT_ID } = parseJson(readFile(authPath)) as AuthJson;

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

const readings: Record<string, Reading> = {};

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        try {
            if (interaction.commandName === "ping") {
                await interaction.reply("Pong!");
            }
            if (interaction.commandName === "reading") {
                const user = interaction.options.getUser("user", true);

                const reading = new Reading(user.id);
                readings[reading.id] = reading;

                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`:sparkles: Reading for ${user.username} :star_and_crescent:`)
                    .setDescription("Today is a new day, full of endless possibilities. Let the Tarot guide you, " +
                        `so you might pass on its wisdom to **${user.username}**.\nShuffle the deck to begin...`)
                    .setThumbnail(user.displayAvatarURL());
                const shuffleDeckButton = new ButtonBuilder()
                    .setCustomId(`${reading.id}-shuffle`)
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
        const [readingId, action] = interaction.customId.split("-");
        if (action === "shuffle") {
            const reading = readings[readingId];
            const user = client.users.cache.get(reading.userId);
            if (user) {
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`:sparkles: Reading for ${user.username} :star_and_crescent:`)
                    .setDescription("The deck has been shuffled. You can now draw a card.")
                    .setThumbnail(user.displayAvatarURL());
                const drawCardButton = new ButtonBuilder()
                    .setCustomId(`${reading.id}-drawing`)
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
            const reading = readings[readingId];
            const user = client.users.cache.get(reading.userId);
            if (user) {
                const card = reading.draw();

                const file = new AttachmentBuilder(`./assets/${card.image}`);
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`:sparkles: Your Card for ${user.username} :star_and_crescent:`)
                    .setDescription(`You drew **${card.name}**!\n${card.description}`)
                    .setThumbnail(user.displayAvatarURL())
                    .setImage(`attachment://${card.image}`);
                const buttons = [];
                if (reading.drawn.length < 7) {
                    buttons.push(new ButtonBuilder()
                        .setCustomId(`${reading.id}-drawing`)
                        .setLabel("Draw Another Card")
                        .setStyle(ButtonStyle.Primary));
                }
                if (reading.drawn.length > 2) {
                    buttons.push(new ButtonBuilder()
                        .setCustomId(`${reading.id}-finished`)
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
            const reading = readings[readingId];
            const user = client.users.cache.get(reading.userId);
            if (user) {
                const cardMeanings = reading.getSpreadMeanings();
                const fields = reading.drawn.map((card, idx) => {
                    return { name: `${cardMeanings[idx] || `Card ${idx + 1}`}`, value: `${card.name}: *${card.description}*` };
                });
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`:sparkles: Reading for ${user.username} :star_and_crescent:`)
                    .setDescription(`Your reading is complete. ${reading.getSpreadDescription()}`)
                    .addFields(fields)
                    .setThumbnail(user.displayAvatarURL());
                const shareButton = new ButtonBuilder()
                    .setCustomId(`${reading.id}-share`)
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
            const reading = readings[readingId];
            const user = client.users.cache.get(reading.userId);
            if (user) {
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
                        const canvasWidth = 700;
                        const canvas = Canvas.createCanvas(canvasWidth, 500);
                        const context = canvas.getContext("2d");

                        let count = 0;
                        for (const card of reading.drawn) {
                            const avatarWidth = 278;
                            const avatar = await Canvas.loadImage(`./assets/${card.image}`);
                            const x = 25 + (count * ((canvasWidth - avatarWidth) / reading.drawn.length));
                            const y = 25;
                            context.drawImage(avatar, x, y, avatarWidth, 450);
                            count += 1;
                        }
                        const attachment = new AttachmentBuilder(await canvas.encode("png"), { name: "tarot-reading.png" });
                        const cardMeanings = reading.getSpreadMeanings();
                        const fields = reading.drawn.map((card, idx) => {
                            return { name: `${cardMeanings[idx] || `Card ${idx + 1}`}`, value: `${card.name}: *${card.description}*` };
                        });
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
                    delete readings[reading.id];
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
