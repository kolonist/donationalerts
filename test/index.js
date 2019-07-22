'use strict';

const path    = require('path');
const should  = require('should');
const Speaker = require('speaker');
const Stream  = require('stream');

// require lib
const donationalerts = require('../lib/donationalerts.js');


// object to work with
let alerts;


describe('constructor()', function() {
    it('should create and init donationalerts object', async function() {
        const token = require(path.join(__dirname, './token.json'));
        alerts = new donationalerts(token);
        alerts.should.be.Object;
    });
});


describe('get()', function() {
    this.timeout(30000);

    it('should get 25 last donations', async function() {
        const count = 25;
        const donations = await alerts.get(count);
        donations.should.be.Array;
        donations.length.should.be.belowOrEqual(count);

        //console.log(JSON.stringify(donations, null, 4));
    });

    it('should get 5 last donations', async function() {
        const count = 5;
        const donations = await alerts.get(count);
        donations.should.be.Array;
        donations.length.should.be.belowOrEqual(count);

        console.log(JSON.stringify(donations, null, 4));
    });

    it('should get 1 last donations', async function() {
        const count = 1;
        const donations = await alerts.get(count);
        donations.should.be.Array;
        donations.length.should.be.belowOrEqual(count);

        //console.log(JSON.stringify(donations, null, 4));
    });
});

/*
describe('speak()', function() {
    this.timeout(30000);

    it('should get 25 last donations and speak them', async function() {
        const count = 25;
        const donations = await alerts.speak(count);
        donations.should.be.Array;
        donations.length.should.be.belowOrEqual(count);

        // Create the Speaker instance
        const Player = new Speaker({
            channels  : 1,
            bitDepth  : 16,
            sampleRate: 16000
        });

        for (const message of donations) {
            const bufferStream = new Stream.PassThrough();
            bufferStream.end(message.audio);
            bufferStream.pipe(Player);
        }

        //console.log(JSON.stringify(donations, null, 4));
        //console.log(donations);
    });
});
*/
