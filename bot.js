'use strict';

// Weather Example
// See https://wit.ai/sungkim/weather/stories and https://wit.ai/docs/quickstart
const request = require('request')
const Wit = require('node-wit').Wit;
const FB = require('./facebook.js');
const Config = require('./const.js');

const firstEntityValue = (entities, entity) => {
    const val = entities && entities[entity] &&
        Array.isArray(entities[entity]) &&
        entities[entity].length > 0 &&
        entities[entity][0].value;
    if (!val) {
        return null;
    }
    return typeof val === 'object' ? val.value : val;
};
// Bot actions


// var apirl = 'http://www.omdbapi.com/?t=' + context

const actions = {
    // var apirl = 'http://www.omdbapi.com/?t=' + context

    say(sessionId, context, message, cb) {
        console.log(message);

        // Bot testing mode, run cb() and return
        if (require.main === module) {
            cb();
            return;
        }

        // Our bot has something to say!
        // Let's retrieve the Facebook user whose session belongs to from context
        // TODO: need to get Facebook user name
        const recipientId = context._fbid_;
        if (recipientId) {
            // Yay, we found our recipient!
            // Let's forward our bot response to her.
            FB.fbMessage(recipientId, message, (err, data) => {
                if (err) {
                    console.log(
                        'Oops! An error occurred while forwarding the response to',
                        recipientId,
                        ':',

                        err
                    );
                }

                // Let's give the wheel back to our bot
                cb();
            });
        } else {
            console.log('Oops! Couldn\'t find user in context:', context);
            // Giving the wheel back to our bot
            cb();
        }
    },






    merge(sessionId, context, entities, message, cb) {
        // Retrieve the location entity and store it into a context field

        //         const title = firstEntityValue(entities, 'title');
        const title = firstEntityValue(entities, 'movie_title');
        if (title) {
            context.title = title; // store it in context
        }

        cb(context);
    },
    error(sessionId, context, error) {
        console.log(error.message);
    },


    // fetch-weather bot executes
    ['fetch-genre'](sessionId, context, cb) {
        var e = context.title
        console.log(e)
        var url = 'http://www.omdbapi.com/?t=' + context.title
        request({
                url: url,
                method: 'GET'
            },
            function(error, response, body) {
                if (error) {
                    console.log('Error sending messages: ', error)
                } else if (response.body.error) {
                    console.log('Error: ', response.body.error)
                }

                var result = JSON.parse(response.body, (key, value) => {
                    if (key === 'Genre') {
                        console.log(value)
                        context.genre = value;
                        return value;
                    }
                })


                // console.log('hi')
                cb(context);
            })

    },

    ['fetch-plot'](sessionId, context, cb) {
        var e = context.title
        console.log(e)
        var url = 'http://www.omdbapi.com/?t=' + context.title
        request({
                url: url,
                method: 'GET'
            },
            function(error, response, body) {
                if (error) {
                    console.log('Error sending messages: ', error)
                } else if (response.body.error) {
                    console.log('Error: ', response.body.error)
                }

                var result = JSON.parse(response.body, (key, value) => {
                    if (key === 'Plot') {
                        console.log(value)
                        context.plot = value;
                        return value;
                    }
                })


                // console.log('hi')
                cb(context);
            })

    }

};







const getWit = () => {
    return new Wit(Config.WIT_TOKEN, actions);
};

exports.getWit = getWit;

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
    console.log("Bot testing mode.");
    const client = getWit();
    client.interactive();
}