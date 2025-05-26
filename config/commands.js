/* eslint-disable @typescript-eslint/no-var-requires */
const { SlashCommandBuilder } = require("discord.js");

module.exports = [
    {
        name: "ping",
        description: "Replies with pong!"
    },
    new SlashCommandBuilder()
        .setName("reading")
        .setDescription("Start a reading")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Who is the subject of the reading?")
                .setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName("request")
        .setDescription("Request a reading")
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("What answer(s) do you seek?")
                .setRequired(true)
        )
];
