/*# Copyright (C) 2021 The WhatsAstro Company LLC.
#
# Licensed under the WhatsAstro Public License, Version 1.c (the "License");
# you may not use this file except in compliance with the License.
#
# Thanks github.com/spechide for creating inline bot support.
# WhatsAstro - BGHRFF*/

const Astro = require('../events');
const {MessageType, MessageOptions, Mimetype, Presence} = require('@adiwajshing/baileys');
const WhatsAstroStack = require('whatsastro-npm');
const Language = require('../language');
const Lang = Language.getString('scam');
var data = {
  action: true
}
Astro.addCommand({pattern: 'scam ?(.*)', fromMe: true, desc: Lang.SCAM_DESC}, (async (message, match) => {
    if (match[1] === '') {
        return await message.sendMessage(Lang.SCAM_NOTFOUND);
    } else if (match[1] === 'typing') {
        if (data.action) {
            setInterval(async () => {
                await message.client.updatePresence(message.jid,Presence.composing)
            }, 10000)
        }
    } else if (match[1] === 'online') {
        if (data.action) {
            setInterval(async () => {
                await message.client.updatePresence(message.jid,Presence.available)
            }, 10000)
        }
    } else if (match[1] === 'recording') {
        if (data.action) {
            setInterval(async () => {
                await message.client.updatePresence(message.jid,Presence.recording)
            }, 10000)
        }
    } else if (match[1] === 'stop') {
        data.action = false
        await message.client.updatePresence(message.jid,Presence.paused)
        await new Promise(r => setTimeout(r, 500));
        data.action = true
    } else {
        await message.client.sendMessage(message.jid, Lang.SCAM_NULL, MessageType.text);
    }
}));
