import { CommandInteraction } from "discord.js";

export class CommandError extends Error {
    constructor(message: string, interaction: CommandInteraction) {
        super(message);
        this.name = 'CommandError';
        interaction.reply({ content: message, ephemeral: true });
    }
}