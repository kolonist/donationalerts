'use strict';

const https     = require('https');
const { parse } = require('node-html-parser');
const sanitize  = require('sanitize-html');
const AWS       = require('aws-sdk');


const polly = new AWS.Polly({
    accessKeyId    : 'AKIAJ4FKRS5Q7ZTYFUJA',
    secretAccessKey: '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',
    region: 'eu-west-1'
});

const params = {
    OutputFormat: 'ogg_vorbis',
    Text        : '',
    VoiceId     : 'Maxim',
    LanguageCode: 'ru-RU',
    TextType    : 'text'
};


class alerts {
    /**
     * Create and init object.
     * @param {string} token Token from DonationAlerts.com
     */
    constructor(token) {
        this.token = token;
    }


    /**
     * Get last `count` donation messages from DonationAlerts.com
     * @param {number} count Will be fetched `count` donations or less if there
     *                       are not enought donations.
     * @return {array} Array of last `count` donated messages.
     */
    async get(count = 10) {
        const widget = await this._download(count);
        return this._parse(widget);
    }


    /**
     * Get last `count` donation messages from DonationAlerts.com including
     * audio buffers with messages
     * @param {number} count Will be fetched `count` donations or less if there
     *                       are not enought donations.
     * @return {array} Array of last `count` donated messages.
     */
    async speak(count = 10) {
        const messages = await this.get(count);

        const messages_speak = [];
        for (const message of messages) {
            let  audio_data = {};
            if (message.message) {
                audio_data = await this._speak(message.message);
            }
            messages_speak.push({...message, ...audio_data});
        }

        return messages_speak;
    }


    _download(count) {
        return new Promise((resolve, reject) => {
            const url = 'https://www.donationalerts.com/widget/lastdonations?' +
                        `alert_type=1&limit=${count}&token=${this.token}`;

            https.get(url, res => {
                res.setEncoding('utf8');

                let data = '';
                res.on('data', buf => {
                    data += buf;
                });

                res.on('end', () => {
                    resolve(data);
                })
            }).on('error', reject);
        });
    }


    _parse(html) {
        const root = parse(html);
        const html_messages = root.querySelectorAll('.b-last-events-widget__item');

        const messages = html_messages.map(elem => {
            const message = {
                time   : elem.querySelector('#date_created'),
                name   : elem.querySelector('._name'),
                amount : elem.querySelector('._sum'),
                message: elem.querySelector('.message-container')
            };

            if (message.time) {
                message.time = message.time.attributes.value.trim();
            }

            if (message.name) {
                message.name = message.name.text.trim();
                message.name = sanitize(message.name);
            }

            if (message.amount) {
                message.amount = message.amount.text.trim();
            }

            if (message.message) {
                message.message = message.message.text.trim();
                message.message = sanitize(message.message);
            }

            return message;
        });

        return messages;
    }


    _speak(text) {
        return new Promise((resolve, reject) => {
            params.Text = text;
            polly.synthesizeSpeech(params, function(err, data) {
                if (err) {
                    return void reject(err);
                }

                const result = {
                    'audio'       : data.AudioStream,
                    'Content-Type': data.ContentType
                };

                return void resolve(result);
            });
        });
    }
}


module.exports = alerts;
