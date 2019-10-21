const {
    getAttachment,
    askName
} = require("./Common")
const OpportunityModel = require("../models/OpportunityModel")

const askJobTitle = (convo, id) => {
    convo.ask(`What is the Job Title?`, async (payload, convo, data) => {
        await OpportunityModel.updateOne({ _id: id }, { $set: { title: payload.message.text } })
        convo.sendTypingIndicator(1000).then(() =>
            convo.say("Got it, Please answer the next question").then(
                () => askCompanyName(convo, id)
            ))
    })
}

const askCompanyName = (convo, id) => {
    convo.ask(`What is the company name?`, async (payload, convo, data) => {
        await OpportunityModel.updateOne({ _id: id }, { $set: { companyName: payload.message.text } })
        convo.sendTypingIndicator(1000).then(() =>
            convo.say("Got it, Please answer the next question").then(
                () => askLocation(convo, id)
            ))
    })
}

const askLocation = (convo, id) => {
    convo.ask(`Where is the company located?`, async (payload, convo, data) => {
        await OpportunityModel.updateOne({ _id: id }, { $set: { companyLocation: payload.message.text } })
        convo.sendTypingIndicator(1000).then(() =>
            convo.say("Got it, Please answer the next question").then(
                () => getJobDescription(convo, id)
            ))
    })
}

const getJobDescription = (convo, id) => {
    convo.ask(`Please attach the job description file`, async (payload, convo, data) => {
        if (data.type !== "attachment") {
            await OpportunityModel.updateOne({ _id: id }, { $set: { attachment: payload.message.text } })
        } else {
            getAttachment(payload, id)
        }
        convo.sendTypingIndicator(1000).then(() =>
            convo.say("Got it, Please answer the next question").then(
                () => askSalaryBudget(convo, id)
            ))
    })
}

const askSalaryBudget = (convo, id) => {
    convo.ask(`How much is your salary budget?`, async (payload, convo, data) => {
        await OpportunityModel.updateOne({ _id: id }, { $set: { budget: payload.message.text } })
        convo.sendTypingIndicator(1000).then(() =>
            askName(convo, id))
    })
}


module.exports = askJobTitle
