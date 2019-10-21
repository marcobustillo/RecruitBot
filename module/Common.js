const download = require("./Uploader")
const OpportunityModel = require("../models/OpportunityModel")

const getAttachment = (value, id) => {
    download(value.message.attachments[0].payload.url, id)
}

const askName = (convo, id) => {
    convo.ask(`Got it, What is your name?`, async (payload, convo, data) => {
        await OpportunityModel.updateOne({ _id: id }, { $set: { name: payload.message.text } })
        convo.sendTypingIndicator(1000).then(() => askEmail(convo, id))
    })
}

const askEmail = (convo, id) => {
    convo.ask(`Got it, What is your email address so I can contact you? If you dont want to share just send n/a`, async (payload, convo, data) => {
        await OpportunityModel.updateOne({ _id: id }, { $set: { email: payload.message.text } })
        convo.sendTypingIndicator(1000).then(() => askContactNumber(convo, id))
    })
}

const askContactNumber = (convo, id) => {
    convo.ask(`Got it, What is your mobile number? If you dont want to share just send n/a`, async (payload, convo, data) => {
        await OpportunityModel.updateOne({ _id: id }, { $set: { email: payload.message.text } })
        convo.sendTypingIndicator(1000).then(() => convo.say("Got it, Thank you for your time, Say hello if you want to start again"))
    })
}

module.exports = {
    getAttachment,
    askEmail,
    askContactNumber,
    askName
}