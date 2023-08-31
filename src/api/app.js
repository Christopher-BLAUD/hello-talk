const express = require('express');
const app = express();
const path = require('path');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
require('dotenv').config();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/sentences', (req, res) => {
    const client = new textToSpeech.TextToSpeechClient();
    const createAudioFile = async () => {
        const request = {
            input: { text: req.body.text },
            voice: { languageCode: 'fr-FR', ssmlGender: 'fr-FR-Wavenet-B' },
            audioConfig: { audioEncoding: 'MP3' }
        };

        const fileName = req.body.text.replace(' ', '-');
        const [response] = await client.synthesizeSpeech(request);
        // const writeFile = util.promisify(fs.writeFile);
        // await writeFile(`${fileName}.mp3`, response.audioContent, 'binary');
        // console.log('Audio content written to file: output.mp3');

        if (response.audioContent) return res.status(200).json({ sentence: response.audioContent });
    };
    createAudioFile();
});

module.exports = app;
