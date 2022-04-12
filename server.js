const Eris = require('eris');
const fetch = require('cross-fetch');

//Create a client instance with our bot token
const bot = new Eris.Client('INSERT_TOKEN');

//When the bot is connected and ready, log to console
bot.on('ready', () => {
    console.log('Connected and ready.');
});

// Every time a message is sent anywhere the bot is present,
// this event will fire and we will check if the bot was mentioned.
// If it was, the bot will attempt to respond with "Present".
bot.on('messageCreate', async (msg) => {
    const botWasMentioned = msg.mentions.find(
        mentionedUser => mentionedUser.id  === bot.user.id,
    );

    if (botWasMentioned) {
        try {
            await msg.channel.createMessage('Present');
        } catch (err) {
            // There are various reasons why sending a message may fail.
            // The API might time out or choke and return a 5xx status,
            // or the bot may not have permission to send the
            // message (403 status).
            console.warn('Failed to respond to mention.');
            console.warn(err);
        }
    }
});

bot.on('error', err => {
    console.warn(err);
});

//Every time a user says wow, the bot responds
bot.on('messageCreate', async (msg) => {
    if (msg.content === '!wow') {
        let wowJsonObject = await getWowData('https://owen-wilson-wow-api.herokuapp.com/wows/random');
        let wowVideoArray = Object.values(wowJsonObject[0].video);
        bot.createMessage(msg.channel.id, wowVideoArray[1]);
    }
})

//Function for getting a random Owen Wilson 'Wow!'
//Using the 'Owen Wilson wow API'
//https://owen-wilson-wow-api.herokuapp.com/wows/random
async function getWowData(url){
    let response = await fetch(url);
    //let data = await response.json();
    //console.log(data);
    return await response.json()
}

bot.connect();
