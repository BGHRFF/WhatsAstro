/*# Copyright (C) 2021 The WhatsAstro Company LLC.
#
# Licensed under the WhatsAstro Public License, Version 1.c (the "License");
# you may not use this file except in compliance with the License.
#
# Thanks github.com/spechide for creating inline bot support.
# WhatsAstro - BGHRFF*/


const chalk = require('chalk');
const {WAConnection, MessageOptions, MessageType, Mimetype} = require('@adiwajshing/baileys');
const {StringSession} = require('./whatsastro/');
const fs = require('fs');

async function whatsAstro () {
    const conn = new WAConnection();
    const Session = new StringSession();  
    conn.version = [3, 3234, 9]
    conn.logger.level = 'warn';
    conn.regenerateQRIntervalMs = 50000;

    conn.on('connecting', async () => {
        console.log(`${chalk.green.bold('Whats')}${chalk.blue.bold('Astro')}
${chalk.white.italic('WhatsAstro QR Kodu Alıcı')}
${chalk.blue.italic('ℹ️  Connecting to Whatsapp... Please Wait.')}`);
    });
    conn.on('open', async () => {
        var st = Session.createStringSession(conn.base64EncodedAuthInfo());
        console.log(
            chalk.green.bold(conn.user.jid.startsWith('90') || conn.user.jid.startsWith('994') ? 'WhatsAstro String Kodunuz: ' : 'WhatsAstro String Code: '), st
        );

        if (!fs.existsSync('config.env')) {
            fs.writeFileSync('config.env', `ASTRO_SESSION="${st}"`);
        }
        console.log(conn.user.jid.startsWith('90') || conn.user.jid.startsWith('994') ? 'Bu Kodu Heçkəslə Paylaşma ' + conn.user.name : 'Dont Share This Code to Anyone ' + conn.user.name)
        process.exit(0);
    });
    await conn.connect();
}
whatsAstro()
