var Discord = require('discord.js');
var logger = require('winston');
const ytdl = require('ytdl-core');
//var auth = require('./auth.json');

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});

var bot = new Discord.Client();

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
});

bot.on('message', function (message) {
    var userName = message.author.username + '#' + message.author.discriminator;

    if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
        var param = "";

        if (args.length > 1)
            param = args[1];

        args = args.splice(1);

        if (cmd == "play") {
            const streamOptions = { seek: 0, volume: 1 };

            var voiceChannel = message.member.voiceChannel;

            voiceChannel.join().then(connection => {
                console.log("joined channel");
                const stream = ytdl(param, { filter: 'audioonly' });
                const dispatcher = connection.playStream(stream, streamOptions);
                dispatcher.on("end", end => {
                    console.log("left channel");
                    voiceChannel.leave();
                });
            }).catch(err => console.log(err));
        }
    }
});

bot.login('NTcwOTAwNjAzNDQyNTYxMDI0.XMRUmg.y3GKY3EEvFiqdsxiKXuCAkLYSSk');