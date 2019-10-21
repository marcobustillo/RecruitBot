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

const buttonList = [
    { type: 'postback', title: 'Learn more about me!', payload: 'LEARN_MORE' },
    { type: 'postback', title: 'Opportunities?', payload: 'OPPORTUNITIES' },
    { type: 'postback', title: "Random trivia", payload: "TRIVIA" }
]

bot.deletePersistentMenu()

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
            buttons: buttonList
        });
    });
});

bot.on('message', (payload, chat) => {
    const text = payload.message.text;
    console.log(`The user said: ${text}`);
});

bot.hear(['hello', 'hi', /hey( there)?/i], (payload, chat) => {
    chat.getUserProfile().then((user) => {
        chat.say({
            text: `Hello! What do you want to do? To open this menu again say hello`,
            buttons: buttonList
        });
    });
});

bot.hear("resume", (payload, chat) => {
    chat.say("Here's your request https://drive.google.com/file/d/16I-fV3lEferqtvWb0IHBfYHvfE11MsYy/view?usp=sharing")
})

bot.hear("halo", (payload, chat) => {
    chat.say("Halo-halo", { typing: true })
})

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
    request.get("https://opentdb.com/api.php?amount=1", (error, response, body) => {
        const { results } = JSON.parse(body)
        if (response.statusCode === 200) {
            chat.say(`${results[0].question} ${results[0].correct_answer}`)
        }
    })
});

const dbUrl = process.env.DB_HOST;
mongoose.connect(dbUrl, { useNewUrlParser: true })
    .then(() => {
        console.log("CONNECTED TO DATABASE")
    })
    .catch(err => console.log(err));

bot.start(process.env.PORT || 3000);
