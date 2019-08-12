const {
    getAttachment,
    askEmail
} = require("./Common")

const askBusinessType = (convo, id) => {
    convo.ask(`What type of business do you have for me?`, async (payload, convo, data) => {
        await OpportunityModel.updateOne({ _id: id }, { $set: { title: payload.message.text } })
        convo.sendTypingIndicator(1000).then(() =>
            convo.say("Got it, Please answer the next question").then(
                () => askCompanyName(convo, id)
            ))
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
            askEmail(convo, id))
    })
}

module.exports = askBusinessType
