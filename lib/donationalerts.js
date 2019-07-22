'use strict';

const https     = require('https');
const { parse } = require('node-html-parser');
const sanitize  = require('sanitize-html');


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
                message.name = sanitize(message.name, {
                    allowedTags      : [],
                    allowedAttributes: {}
                });
            }

            if (message.amount) {
                message.amount = message.amount.text.trim();
            }

            if (message.message) {
                message.message = message.message.text.trim();
                message.message = sanitize(message.message, {
                    allowedTags      : [],
                    allowedAttributes: {}
                });
            }

            return message;
        });

        return messages;
    }
}


module.exports = alerts;
