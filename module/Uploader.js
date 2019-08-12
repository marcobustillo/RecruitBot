const fs = require("fs")
const path = require("path")
const request = require("request")
const dropboxV2Api = require("dropbox-v2-api")
const OpportunityModel = require("../models/OpportunityModel")

const download = async (link, id) => {
    try {
        const r = request(link).on('response', function (res) {
            const type = res.headers["content-type"]
            let filename = `${Math.random().toString(36).slice(2)}.${type.split("/")[1]}`
            const filePath = path.join(__dirname, "../", "uploads", filename)
            const resolver = r.pipe(fs.createWriteStream(filePath))
            resolver.on("finish", () => {
                upload(filePath, filename, id)
            })
        });
    } catch (err) {
        throw err
    }
}

const upload = (filePath, filename, id) => {
    const dropbox = dropboxV2Api.authenticate({
        token: process.env.DROPBOX_TOKEN
    });
    dropbox({
        resource: 'files/upload',
        parameters: {
            path: `/uploads/${filename}`
        },
        readStream: fs.createReadStream(filePath)
    }, async (err, result) => {
        await OpportunityModel.updateOne({ _id: id }, { $set: { attachment: `${process.env.DROPBOX_URL}${result.name}` } })
        fs.unlinkSync(filePath)
    })
}

module.exports = download