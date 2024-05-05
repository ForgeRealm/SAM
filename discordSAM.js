const { ActivityType, Client, Collection, EmbedBuilder, Events, GatewayIntentBits, DiscordjsError, Attachment } = require('discord.js');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const DataManager = require('./modules/dataManager');
const dataManager = new DataManager();
const config = require('./config.json');

class discordSAM {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.MessageContent
            ]
        });
        this.client.once('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}`);
            this.client.user.setActivity('Minecraft', { type: ActivityType.Playing });
            this.client.guilds.cache.forEach((guild) => {
                console.log(`Loaded ${guild.name}`);
                if (dataManager.discordServerData[guild.id] === undefined) {
                    dataManager.discordServerData[guild.id] = {
                        role: undefined,
                        adminChannel: undefined,
                        chattingChannel: undefined,
                        suffix: undefined,
                        serverTokens: []
                    };
                }
            });
        });
        this.client.on('guildCreate', (guild) => {
            console.log(`Joined ${guild.name}`);
            dataManager.discordServerData[guild.id] = {
                role: undefined,
                adminChannel: undefined,
                chattingChannel: undefined,
                suffix: undefined,
                serverTokens: []
            };
        });
        this.client.on('messageCreate', (message) => {
            if (message.author.bot) return;
            if (message.channelId === dataManager.discordServerData[message.guildId].chattingChannel) {
                // Send Chat to Minecraft Server
                // Add Chat to Minecraft Server Log
            }
            if (message.author.id === "704668240030466088") {
                // developer message
                if (message.content.startsWith('!admin')) {
                    const args = message.content.slice(7).trim().split(/ +/);
                    const command = args.shift().toLowerCase();
                    if (command === 'delete') {
                        this.deleteCommands();
                        console.log('Deleted Commands');
                    }
                    else if (command === 'set') {
                        this.setCommands();
                        console.log('Set Commands');
                    }
                }
            }
        });
        this.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isCommand()) return;
            const command = this.client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                if (interaction.commandName === 'setup') {
                    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                        return await interaction.reply('このコマンドを実行する権限がありません。');
                    }
                    interaction.reply('セットアップを開始します。');
                    if (dataManager.discordServerData[interaction.guildId]['role'] !== undefined) {
                        return await interaction.editReply('既にセットアップが完了しています。\n設定を変更する場合は、`/option`コマンドを使用してください。');
                    }
                    const role = interaction.options.getRole('role');
                    const adminChannel = interaction.options.getChannel('admin_channel');
                    const chattingChannel = interaction.options.getChannel('chatting_channel');
                    const suffix = interaction.options.getString('suffix');
                    dataManager.discordServerData[interaction.guildId] = {
                        role: role.id,
                        adminChannel: adminChannel.id,
                        chattingChannel: chattingChannel.id,
                        suffix: suffix,
                        serverTokens: []
                    };
                    await interaction.editReply(`セットアップが完了しました。`);
                }
                else if (interaction.commandName === 'register') {
                    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                        return await interaction.reply('このコマンドを実行する権限がありません。');
                    }
                    else if (interaction.channelId !== dataManager.discordServerData[interaction.guildId].adminChannel) {
                        // ephemeral: trueでエラーメッセージを表示しない
                        return await interaction.reply(
                            { content: 'このチャンネルではこのコマンドを実行できません。\n管理チャンネルで実行してください。', ephemeral: true }
                        );
                    }
                    interaction.reply('サーバーを登録します。');
                    // サーバートークンの発行
                    const serverName = interaction.options.getString('server_name');
                    const serverToken = Math.random().toString(36).substring(2, 12);// 10文字のランダムな英数字
                    dataManager.discordServerData[interaction.guildId].serverTokens.push({
                        serverName: serverName,
                        serverToken: serverToken
                    });
                    dataManager.minecraftServerData[serverToken] = {
                        serverName: serverName,
                        guildId: interaction.guildId
                    };
                    await interaction.editReply(`サーバーを登録しました。\nサーバー名: ${serverName}\nサーバートークン: ${serverToken}\nこのトークンをMinecraftサーバーのConfigに追加してください。`);
                }
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        });
        this.client.login(config.token);
    }
    setCommands() {
        const commands = [];
        const commandFiles = fs.readdirSync(path.join(__dirname, './discordCommands')).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./discordCommands/${file}`);
            commands.push(command.data.toJSON());
        }
        this.client.commands = new Collection();
        let guildId = "977760171168251945";
        for (const command of commands) {
            // this.client.commands.set(command.name, command);
            this.client.guilds.cache.get(guildId).commands.create(command);
        }
    }
    deleteCommands() {
        let guildId = "977760171168251945";
        this.client.commands = new Collection();
        this.client.guilds.cache.get(guildId).commands.set([])
            .then(() => console.log('Deleted Commands'))
            .catch(console.error);
    }
}

module.exports = discordSAM;
