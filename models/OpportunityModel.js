const mongoose = require('mongoose')

const Schema = mongoose.Schema

const opportunitySchema = new Schema({
    id: String,
    name: String,
    title: String,
    companyName: String,
    companyLocation: String,
    budget: String,
    email: String,
    attachment: String,
    type: String,
    expectedDeadline: String
})

const Opportunity = mongoose.model("opportunity", opportunitySchema)
module.exports = Opportunity