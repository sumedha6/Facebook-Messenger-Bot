'use strict';

// Weather Example
// See https://wit.ai/sungkim/weather/stories and https://wit.ai/docs/quickstart
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
const actions = {

    // getForecast(context, entities, callback) {
    //     var location = firstEntityValue(entities, 'location');
    //     if (location) {
    //         context.forecast = 'sunny in ' //+ location; // we should call a weather API here
    //         delete context.missingLocation;
    //     } else {
    //         context.missingLocation = true;
    //         delete context.forecast;
    //     }

    //     return context;

    // },};
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
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

    ['getGenre'](sessionId, context, cb) {
        //  var genre = firstEntityValue(entities, 'genre');
        context.genre = 'comedy';
        cb(context);


    },


    merge(sessionId, context, entities, message, cb) {
        // Retrieve the location entity and store it into a context field
        const title = firstEntityValue(entities, message);                    //changed
        if (title) {                                                   //changed
            context.title = title; // store it in context                  changed  
        }

        cb(context);
    },

    error(sessionId, context, error) {
        console.log(error.message);
    },

    // fetch-weather bot executes
    ['fetch-genre'](sessionId, context, cb) {
        // Here should go the api call, e.g.:
        // context.forecast = apiCall(context.loc)

//////////New Code//////////////////////////

var apiUrl = 'http://www.omdbapi.com/?t=' + context
request({

        url: apiUrl,

        method: 'GET',
    },

    function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }



        var e = JSON.parse(response.body, (key, value) => {

            if (key === 'Genre') {
                // sendFBMessage(sender, value)
                console.log(value)
                context.genre =value;

            }

        })
    })
              cb(context);

};
////////////New Code ends//////////////

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
