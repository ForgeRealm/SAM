const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Discordサーバーのセットアップを実行します。')
        .addRoleOption(option =>
            option
                .setName('role')
                .setRequired(true)
                .setDescriptionLocalizations({
                    'en-US': 'Specify the administrator role.',
                    ja: '管理者ロールを指定します。'
                })
        )
        .addChannelOption(option =>
            option
                .setName('admin_channel')
                .setRequired(true)
                .setDescriptionLocalizations({
                    'en-US': 'Specify the administrator channel.',
                    ja: '管理チャンネルを指定します。'
                })
        )
        .addChannelOption(option =>
            option
                .setName('chatting_channel')
                .setRequired(true)
                .setDescriptionLocalizations({
                    'en-US': 'Specify the chatting channel.',
                    ja: 'チャットチャンネルを指定します。'
                })
        )
        .addStringOption(option =>
            option
                .setName('suffix')
                .setDescriptionLocalizations({
                    'en-US': 'Specify the suffix for the shared chat',
                    ja: '共有されたチャットの語尾を指定します。'
                })
        ),
};
