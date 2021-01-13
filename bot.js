const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');
const ytdl = require('ytdl-core');

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});

var playlist = [];

var bot = new Discord.Client();

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
});

bot.on('message', function (message) {
    console.log("message received");
    console.log(message.content);

    var userName = message.author.username + '#' + message.author.discriminator;

    if (message.content.substring(0, 1) == '!') {
        let args = message.content.substring(1).split(' ');
        let cmd = args[0];
        let param = "";

        if (args.length > 1)
            param = args[1];

        args = args.splice(1);

        if (cmd == "play") {
            playlist = [];
            playlist.push(param);
        play();
        }
        else if(cmd== "add"){
            playlist.push(param); 
            console.log("Link "+ param + " adicionado à playlist")

        }else if(cmd == "playlist"){
            var textoPlaylist = "Veja aqui suas musicas: \n";

            for(var i =0; i<playlist.length;i++){
                textoPlaylist = textoPlaylist + playlist[i]+ "\n";
            }
            
            message.reply(textoPlaylist);
        }
    }
    function play(){
        console.log("play");
    
        const streamOptions = { seek: 0, volume: 1 };
    
      bot.channels.fetch(message.member.voice.channelID).then(voiceChannel => {
            voiceChannel.join().then(connection => {
                console.log("joined channel");
    
                console.log("param: " + playlist[0]);
    
                const stream = ytdl(playlist[0], { filter: 'audioonly' })
    
                const dispatcher = connection.play(stream, streamOptions).on("finish", ()=>{
                    if(playlist.length==1){
                        console.log('ending music');
                }else{
                    console.log("Next music");
                  playlist.shift();
                  play();
                  };
                });

            }).catch(err => console.log(err));
        });
    };

});



//bot.login(auth.TOKEN || process.env.TOKEN);
bot.login(process.env.TOKEN);