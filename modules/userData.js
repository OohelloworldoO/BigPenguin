const mongoose = require('mongoose')
const Schema = mongoose.Schema
const user_Data = new Schema({
    heatstroke:{
        type: String,
    },
    Headache:{
        type: String,
    },
    Mouthpain:{
        type: String,

    },
    influenza:{
        type: String,

    },
    stuffynose:{
        type: String,

    },
    dizziness:{
        type: String,

    },
    cold:{
        type: String,

    },
    fingernumbness:{
        type: String,

    },
    Insomnia:{
        type: String,

    },
    Fatigue:{
        type: String,

    },
    lossofappetite:{
        type: String,

    },
    Fever:{
        type: String,

    }

})
module.exports = mongoose.model('userData', user_Data)