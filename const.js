'use strict';

// Wit.ai parameters
const WIT_TOKEN = 'BY72P3HH2UKGI6GIUJ5RALBEWX63M2A5'; //process.env.WIT_TOKEN;
if (!WIT_TOKEN) {
    throw new Error('missing WIT_TOKEN');
}

// Messenger API parameters
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
if (!FB_VERIFY_TOKEN) {
    FB_VERIFY_TOKEN = "just_do_it";
}

module.exports = {
    WIT_TOKEN: WIT_TOKEN,
    FB_PAGE_TOKEN: FB_PAGE_TOKEN,
    FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
};