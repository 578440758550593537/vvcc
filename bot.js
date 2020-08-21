const Discord = require('discord.js');
const bot = new Discord.Client();
const settings = require("./botconfig.json")
const Giveaway = require("mrleo-giveaway")
bot.commands = new Discord.Collection();
const fs = require('fs');
const canvas = require('canvas');
const YT = require("ytdl-core")
bot.mutes = require('./mutes.json');


 const ytdl = require("ytdl-core")
const { Util } = require('discord.js');
const mysql = require('mysql');
const queue = new Map();
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.GOOGLE_API_KEY);
let config = require('./botconfig.json');
let token = config.token;
let prefix = config.prefix;
let profile = require('./profile.json');
//const emoji = require('./eeeee.js')


//const Giveaway = require("./giveaway.js")
 
//const giveaway = Giveaway(bot, {
//botPrefix: "!",
//startCmd:'giveaway'
//})
bot.bal = config.currency;
bot.dbal = config.defaultBal;
bot.timely = config.timely;
bot.cd = config.cooldown;
bot.cname = config.cName
bot.color = config.embedColor;
bot.shop = config.shop;
bot.prices = config.prices;
bot.vSec = config.voiceSec;
bot.vBonus = config.voiceBonus;



fs.readdir('./cmds/',(err,files)=>{
    if(err) console.log(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <=0) console.log("Нет комманд для загрузки!!");
    console.log(`Загружено ${jsfiles.length} комманд`);
    jsfiles.forEach((f,i) =>{
        let props = require(`./cmds/${f}`);
        console.log(`${i+1}.${f} Загружен!`);
        bot.commands.set(props.help.name,props);
    });
});


bot.on('ready', () => {
  
    console.log(`Запустился бот ${bot.user.username}`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link =>{
        console.log(link);
    });


});

bot.on('message', async message => {
    if(message.author.client) return;
    if(message.channel.type == "dm") return;
    let uid = message.author.id;
    bot.send = function (msg){
        message.channel.send(msg);
    };
    if(!profile[uid]){
        profile[uid] ={
            coins:10,
            warns:0,
            xp:0,
            lvl:1,
        };
    };
    let u = profile[uid];

    u.coins++;
    u.xp++;

    if(u.xp>= (u.lvl * 5)){
        u.xp = 0;
        u.lvl += 1;
    };


    fs.writeFile('./profile.json',JSON.stringify(profile),(err)=>{
        if(err) console.log(err);
    });

    let messageArray = message.content.split(" ");
    let command = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
    if(!message.content.startsWith(prefix)) return;
    let cmd = bot.commands.get(command.slice(prefix.length));
    if(cmd) cmd.run(bot,message,args);
    bot.rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    bot.uId = message.author.id;
});
  bot.on("message", async (message) => {

});

bot.on('ready', () => {   
  
    });

    bot.setInterval(()=>{
        for(let i in bot.mutes){
            let time = bot.mutes[i].time;
            let guildid = bot.mutes[i].guild;
            let guild = bot.guilds.get(guildid);
            let member = guild.members.get(i);
            let muteRole = member.guild.roles.find(r => r.name === "Muted"); 
            if(!muteRole) continue;

            if(Date.now()>= time){
                member.removeRole(muteRole);
                delete bot.mutes[i];
                fs.writeFile('./mutes.json',JSON.stringify(bot.mutes),(err)=>{
                    if(err) console.log(err);
                });
            }
        }

    },5000)

 

var guilds = '594785003838111749'
bot.on('guildMemberAdd',(member)=>{
    let role = member.guild.roles.find(r => r.name === "[I]Незнакомчик");
    member.addRole(role).catch(console.log)
});


bot.on('guildDelete', (guild, msg) => {

    bot.channels.get(guilds).send(`

Я **покинул** :outbox_tray: сервер **${guild.name}**. Информация о нем:

Акроним и ID: **${guild.nameAcronym} | ${guild.id}**

Количество участников: **${guild.memberCount}**

Роли: **${guild.roles.size}**

Каналы: **${guild.channels.size}**

Создана: **${guild.createdAt.toString().slice(4, -32)}**

Иконка: ${guild.iconURL}`, bot);

  setTimeout(() => {

    console.log(`Joined a new guild: ${guild.name} | ${guild.id}`);

  }, 1000)

});



bot.on('guildCreate', (guild, msg) => {

    bot.channels.get(guilds).send(`

Я **пришел** :inbox_tray: на сервер **${guild.name}**. Информация о нем:

Акроним и ID: **${guild.nameAcronym} | ${guild.id}**

Основатель: **${guild.owner} (\`${guild.owner.user.tag}\`)**

Количество участников: **${guild.memberCount}**

Роли: **${guild.roles.size}**

Каналы: **${guild.channels.size}**

Создана: **${guild.createdAt.toString().slice(4, -32)}**

Иконка: ${guild.iconURL}

**Это наш ${bot.guilds.size}-ый сервер!**`, bot);

});

bot.on('message', async message => {
      

    if (message.channel.type === "dm"){
        bot.channels.get('644221566946639874').send(
        new Discord.RichEmbed()
        .setTitle('Сообщение от' + message.author.tag + ` [${message.author.id}]`)
        .setDescription(message.content)
        .setTimestamp()
        .setColor('ff6600')
        )
    }
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    bot.send = function (msg) {
        message.channel.send(msg);
    };

    let messageArray = message.content.split(" ");
    let command = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
    let cmd = bot.commands.get(command.slice(prefix.length));
    if (cmd) cmd.run(bot, message, args);

});


bot.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.voiceChannel
    let oldUserChannel = oldMember.voiceChannel

    let voice = db.fetch(`voice_${newMember.id}`);
    if (voice === null) voice = Date.now();
    let cvoice = db.fetch(`cvoice_${newMember.id}`);
    if (cvoice === null) cvoice = true;
    if (newUserChannel){db.set(`cvoice_${newMember.id}`,true);db.set(`voice_${newMember.id}`,Date.now());}
    if (!newUserChannel) db.set(`cvoice_${newMember.id}`,false);
});
      bot.on('ready', () => {

    const activities_list = [
      `.`,
      `${bot.users.size} users`,
      `SUNSHINE`


      ];
          bot.user.setStatus('available')
          setInterval(() => {
              const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
              bot.user.setActivity(activities_list[index], { type: 'STREAMING',url:"https://twitch.tv/nexusbottwetch" });
          }, 10000);
      
        bot.on('message', async msg => {
          var message = msg
if(message.content.startsWith(prefix + '1')){
    message.channel.send(`
\`>emojis wumpus_color_gif\` <a:wumpus_color_gif:603269653631991820>
\`>emojis dpartnerneon\` <a:dpartnerneon:603269679028502529>
\`>emojis PurpleShinnyOkHand\` <a:PurpleShinnyOkHand:603269704869740544>
\`>emojis No\` <a:No:603269745789239297>
\`>emojis thisr\` <a:thisr:603269775682043944>
\`>emojis thisl\` <a:thisl:603269786759069726>
\`>emojis intsFrogeBoost\` <a:intslFrogeBoost:603269856657145887>
\`>emojis Siren\` <a:Siren:603269868770426882>
\`>emojis Gagagg\` <a:Gagagg:603467818377412608>
\`>emojis yyyyy\` <a:yyyyy:603467914615717892>
\`>emojis yxy\` <a:yxy:603468017380098068>
\`>emojis Mainckraft\` <a:Mainckraft:603468045872267265>
\`>emojis daunloding\` <a:daunloding:603468230513786890>
\`>emojis flaks\` <a:flaks:603534368052477954>
\`>emojis cynduk\` <a:cynduk:603534476559122453>
\`>emojis turim\` <a:turim:603535379416743946>
\`>emojis tuhhh\` <a:tuhhh:603535502565703680>
\`>emojis who\` <a:who:603535601232248842>
\`>emojis vii\` <a:vii:603632888021254195>
\`>emojis rainbow_python\` <a:rainbow_python:604555470404976660>
\`>emojis Rainbow_Weeb\` <a:Rainbow_Weeb:604555513132220436>
`)
}
   

                              if(msg.content === "нексус") {
    msg.channel.send(`Ping **${bot.ping}** ms`)
                    }
           let PREFIX = '234242*';
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(PREFIX)) return undefined;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(PREFIX.length)

	if (command === 'play') {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					msg.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-10.
					`);
					// eslint-disable-next-line max-depth
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('No or invalid value entered, cancelling video selection.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('🆘 I could not obtain any search results.');
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === 'skip') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return undefined;
	} else if (command === 'stop') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return undefined;
	} else if (command === 'volume') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return msg.channel.send(`I set the volume to: **${args[1]}**`);
	} else if (command === 'np') {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		return msg.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
	} else if (command === 'queue') {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		return msg.channel.send(`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
		`);
	} else if (command === 'pause') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('⏸ Paused the music for you!');
		}
		return msg.channel.send('There is nothing playing.');
	} else if (command === 'resume') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('▶ Resumed the music for you!');
		}
		return msg.channel.send('There is nothing playing.');
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(`✅ **${song.title}** has been added to the queue!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`<a:543059387330330625:594760894450368512> Start playing: **${song.title}**`);
}

   
})
bot.login(token)
const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://s-u-nshine.glitch.me/`);
}, 280000);
    