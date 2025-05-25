import { Client, IntentsBitField, Events, REST, Routes, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder, TextInputStyle, ModalActionRowComponentBuilder, TextInputBuilder, ModalBuilder, TextChannel, Guild } from "discord.js";
import Canvas from "@napi-rs/canvas";
import path from "path";
import { getCrypticReadingPhrase, parseJson, readFile } from "./util";
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

let mcmpGuild: Guild;
const MCMP_GUILD_ID = "403100419250978817";
const ASTRONOMY_CHANNEL_ID = "1356449314544816148";

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
        mcmpGuild = await client.guilds.fetch(MCMP_GUILD_ID);
    } catch (err) {
        console.error(err);
    }
});

const readings: Record<string, Reading> = {};

client.on(Events.InteractionCreate, async (interaction) => {
    try {
        if (interaction.isChatInputCommand()) {
            if (interaction.commandName === "ping") {
                await interaction.reply("Pong!");
            }
            if (interaction.commandName === "reading") {
                const user = interaction.options.getUser("user", true);

                if (user.id === interaction.user.id) {
                    await interaction.reply({
                        content: "You cannot do a Tarot reading for yourself.",
                        ephemeral: true
                    });
                    return;
                }

                if (mcmpGuild) {
                    try {
                        const astronomyChannel = await mcmpGuild.channels.fetch(ASTRONOMY_CHANNEL_ID) as TextChannel;
                        if (astronomyChannel && astronomyChannel.members
                            .find(m => m.user.id === interaction.user.id || m.user.id === user.id)) {
                            await interaction.reply({
                                content: `The cold, lifeless stars of ${astronomyChannel} prevent the Tarot from reaching out to you or the subject.`,
                                ephemeral: true
                            });
                            return;
                        }
                    } catch (err) {
                        console.error("Error fetching astronomy channel:", err);
                    }
                }

                const reading = new Reading(user.id);
                readings[reading.id] = reading;

                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`:sparkles: Reading for ${user.displayName} :star_and_crescent:`)
                    .setDescription("Today is a new day, full of endless possibilities. Let the Tarot guide you, " +
                        `so you might pass on its wisdom to **${user.displayName}**.\nShuffle the deck to begin...`)
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
        }
        if (interaction.isButton()) {
            const [readingId, action] = interaction.customId.split("-");
            if (action === "shuffle") {
                const reading = readings[readingId];
                const user = client.users.cache.get(reading.userId);
                if (user) {
                    const embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle(`:sparkles: Reading for ${user.displayName} :star_and_crescent:`)
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
                        .setTitle(`:sparkles: Your Card for ${user.displayName} :star_and_crescent:`)
                        .setDescription(`You drew **${card.name}**!\n${card.description}`)
                        .setThumbnail(user.displayAvatarURL())
                        .setImage(`attachment://${card.image}`);
                    const buttons = [
                        new ButtonBuilder()
                            .setCustomId(`${reading.id}-interpret`)
                            .setLabel("Interpret")
                            .setStyle(ButtonStyle.Secondary),
                    ];
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
            if (action === "interpret") {
                const reading = readings[readingId];
                const user = client.users.cache.get(reading.userId);
                if (user) {
                    const card = reading.getLastDrawn()!;

                    const modal = new ModalBuilder()
                        .setCustomId(`${reading.id}-interpretation-${reading.drawn.length - 1}`)
                        .setTitle(`Interpretation of ${card.name}`);
                    const interpretationInput = new TextInputBuilder()
                        .setCustomId(`${reading.id}-interpretation`)
                        .setLabel("What is your interpretation of this card?")
                        .setStyle(TextInputStyle.Paragraph);
                    const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
                        .addComponents(interpretationInput);
                    modal.addComponents(firstActionRow);

                    await interaction.showModal(modal);
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
                        return { name: `${cardMeanings[idx]} - **${card.name}**`, value: `*${card.description}*` };
                    });
                    const embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle(`:sparkles: Reading for ${user.displayName} :star_and_crescent:`)
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
                    const embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle(`:sparkles: Reading for ${user.displayName} :star_and_crescent:`)
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
                            let interpretation = card.description;
                            if (reading.interpretations[idx]) {
                                interpretation += ` ${reading.interpretations[idx]}`;
                            }
                            return {
                                name: `${cardMeanings[idx]} - **${card.name}**`,
                                value: `*${interpretation}*`
                            };
                        });
                        const description = getCrypticReadingPhrase();
                        const embed = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle(`:sparkles: Reading for ${user.displayName} :star_and_crescent:`)
                            .setDescription(`*${description}*`)
                            .addFields(fields)
                            .setThumbnail(user.displayAvatarURL())
                            .setFooter({ text: `Reading by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });
                        await interaction.channel.send({
                            content: `${user} *${interaction.user.displayName} has shared a reading with you...*`,
                            embeds: [embed],
                            files: [attachment]
                        });
                    }
                    delete readings[reading.id];
                } else {
                    await interaction.reply({ content: "User not found.", ephemeral: true });
                }
            }
        }
        if (interaction.isModalSubmit()) {
            const [readingId, action] = interaction.customId.split("-");
            const reading = readings[readingId];
            if (action === "interpretation") {
                const drawnIndex = interaction.customId.split("-")[2];
                const interpretation = interaction.fields.getTextInputValue(`${reading.id}-interpretation`);
                reading.interpret(parseInt(drawnIndex), interpretation);
                await interaction.reply({ content: "*The card speaks to you, and you listen...*", ephemeral: true });
            } else {
                await interaction.reply({ content: "User not found.", ephemeral: true });
            }
        }
    } catch (err) {
        console.error("Error handling interaction:", err);
        if (interaction.isAutocomplete()) {
            await interaction.respond([]);
        } else if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: "An error occurred while processing your request.", ephemeral: true });
        } else {
            await interaction.reply({ content: "An error occurred while processing your request.", ephemeral: true });
        }
    }
});

client.login(TOKEN);
