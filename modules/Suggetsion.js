const mongoose = require('mongoose')
const Schema = mongoose.Schema
const suggestion_message = new Schema({
    username:{
        type: String,
    },
    email:{
        type: String,
        required:[true]
    },
    message:{
        type: String
    }
})
module.exports = mongoose.model('Suggestion', suggestion_message)