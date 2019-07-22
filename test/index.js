'use strict';

const path    = require('path');
const should  = require('should');


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
