// Entry file
require('dotenv').config()
const BootBot = require("bootbot")
const mongoose = require("mongoose");
const request = require("request")
const askJobTitle = require("./module/JobOpportunityConversation")
const askProjectTitle = require("./module/FreelanceOpportunityConversation")
const askBusiness = require("./module/BusinessOpportunityConversation")
const OpportunityModel = require("./models/OpportunityModel")

const bot = new BootBot({
    accessToken: process.env.accessToken,
    verifyToken: process.env.verifyToken,
    appSecret: process.env.appSecret
});

bot.setGreetingText([
    {
        "locale": "default",
        "text": "Hello {{user_first_name}} {{user_last_name}}!"
    }
])

bot.setGetStartedButton((payload, chat) => {
    chat.getUserProfile().then((user) => {
        chat.say({
            text: `Welcome! What do you want to do? To open this menu again say hello`,
            buttons: [
                { type: 'postback', title: 'Learn more about me!', payload: 'LEARN_MORE' },
                { type: 'postback', title: 'Opportunities?', payload: 'OPPORTUNITIES' },
                { type: 'postback', title: "Random trivia", payload: "TRIVIA" }
            ]
        });
    });
});

bot.on('message', (payload, chat) => {
    const text = payload.message.text;
    console.log(`The user said: ${text}`);
});

bot.hear('hello', (payload, chat) => {
    chat.getUserProfile().then((user) => {
        chat.say({
            text: `Hello! What do you want to do? To open this menu again say hello`,
            buttons: [
                { type: 'postback', title: 'Opportunities?', payload: 'OPPORTUNITIES' },
                { type: 'postback', title: 'Learn more about me!', payload: 'LEARN_MORE' }
            ]
        });
    });
});

bot.on('postback:OPPORTUNITIES', (payload, chat) => {
    chat.say({
        text: `What opportunity do you have for me?`,
        buttons: [
            { type: 'postback', title: 'Job Opportunity?', payload: 'JOB' },
            { type: 'postback', title: 'Business Opportunity?', payload: 'BUSINESS' },
            { type: 'postback', title: 'Freelance Opportunity?', payload: 'FREELANCE' }
        ]
    });
});

bot.on("postback:JOB", (payload, chat) => {
    chat.getUserProfile().then(async (user) => {
        const result = await OpportunityModel.create({ type: "job" })
        chat.conversation((convo) => {
            convo.sendTypingIndicator(1000).then(() => askJobTitle(convo, result._id));
        })
    });
})

bot.on("postback:BUSINESS", (payload, chat) => {
    chat.getUserProfile().then(async (user) => {
        const result = await OpportunityModel.create({ type: "business" })
        chat.conversation((convo) => {
            convo.sendTypingIndicator(1000).then(() => askBusiness(convo, result._id));
        })
    });
})

bot.on("postback:FREELANCE", (payload, chat) => {
    chat.getUserProfile().then(async (user) => {
        const result = await OpportunityModel.create({ type: "freelance" })
        chat.conversation((convo) => {
            convo.sendTypingIndicator(1000).then(() => askProjectTitle(convo, result._i));
        })
    });
})

bot.on('postback:LEARN_MORE', (payload, chat) => {
    chat.say(`Click the link https://marcobustillo.ml`);
});

bot.on('postback:TRIVIA', (payload, chat) => {
    request.get({ url: "https://opentdb.com/api.php?amount=1" }, (response) => {
        const { results } = response
        chat.say(`${results[0].question} ${results[0].correct_answer}`)
    })
});

const dbUrl = process.env.DB_HOST;
mongoose.connect(dbUrl, { useNewUrlParser: true })
    .then(() => {
        console.log("CONNECTED TO DATABASE")
    })
    .catch(err => console.log(err));

bot.start(process.env.PORT || 3000);
