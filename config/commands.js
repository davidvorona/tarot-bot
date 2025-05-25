/* eslint-disable @typescript-eslint/no-var-requires */
const { SlashCommandBuilder } = require("discord.js");

module.exports = [
    {
        name: "ping",
        description: "Replies with pong!"
    },
    new SlashCommandBuilder()
        .setName("reading")
        .setDescription("Initiate a reading session")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Who is the subject of the reading?")
                .setRequired(true)
        )
];
