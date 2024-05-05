const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Minecraftサーバーを登録します。')
        .addStringOption(option =>
            option
                .setName('server_name')
                .setDescription('Minecraftサーバーの名前を指定します。')
                .setRequired(true)
        ),
};
