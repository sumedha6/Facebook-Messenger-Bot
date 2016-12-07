jest
    .dontMock('../bot.js');

process.env.WIT_TOKEN = 'BY72P3HH2UKGI6GIUJ5RALBEWX63M2A5';
const bot = require('../bot.js');

describe('Bot tests', () => {

    it('Bot creation', () => {
        const client = bot.getWit(); // Just testing the creation  
        expect(client).not.toBeNull();
    });
});