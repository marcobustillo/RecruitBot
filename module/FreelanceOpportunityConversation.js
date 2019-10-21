const {
    getAttachment,
    askName
} = require("./Common")
const OpportunityModel = require("../models/OpportunityModel")

const askProjectTitle = (convo, id) => {
    convo.ask(`What is the Project Title?`, async (payload, convo, data) => {
        await OpportunityModel.updateOne({ _id: id }, { $set: { title: payload.message.text } })
        convo.sendTypingIndicator(1000).then(() =>
            convo.say("Got it, Please answer the next question").then(
                () => askProjectBudget(convo, id)
            ))
    })
}

const askProjectBudget = (convo, id) => {
    convo.ask(`How much is your project budget?`, async (payload, convo, data) => {
        await OpportunityModel.updateOne({ _id: id }, { $set: { budget: payload.message.text } })
        convo.sendTypingIndicator(1000).then(() =>
            askDeadline(convo, id))
    })
}

const askDeadline = (convo, id) => {
    convo.ask(`Whats your expected deadline?`, async (payload, convo, data) => {
        await OpportunityModel.updateOne({ _id: id }, { $set: { expectedDeadline: payload.message.text } })
        convo.sendTypingIndicator(1000).then(() =>
            askAdditionalDetails(convo, id))
    })
}

const askAdditionalDetails = (convo, id) => {
    convo.ask(`Please attach additional details. Say n/a if there's none`, async (payload, convo, data) => {
        if (data.type !== "attachment") {
            await OpportunityModel.updateOne({ _id: id }, { $set: { attachment: payload.message.text } })
        } else {
            getAttachment(payload, id)
        }
        convo.sendTypingIndicator(1000).then(() =>
            askName(convo, id))
    })
}

module.exports = askProjectTitle