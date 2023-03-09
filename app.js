var express = require("express")
var bodyParse = require("body-parser")
var mongoose = require("mongoose")
const { response } = require("express")
const app = express()


app.use(bodyParse.json())
app.use(express.static('public/webfront'))
app.use(bodyParse.urlencoded({
    extended: true
}))


mongoose.connect('mongodb://0.0.0.0:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

var db = mongoose.connection;
db.on('error', () => console.log("error"))
db.once('open', () => console.log("connected"))


app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin":'*'
    })

    return res.redirect('main/main.html')
}).listen(3100)


app.post("/process-loggin", (req, response) => {
    try{
        const username = req.body.username;
        const password = req.body.password;

        // console.log(`username:${username}  password: ${password}`)


        const usermail = db.collection('users').findOne({name: username}, (err, res) => {
            if(res === null){
                return response.redirect('register/register.html')
            }
            else if(err) throw err;

            if(res.password === password){
                console.log(`${username} login sucessfully `)
                return response.redirect('loggin_sucess/loggin_sucess_main.html')
            }
            else{
                console.log(`${username}'s accout is tried to login`)
                return response.redirect('loggin3/loggin3.html')
            }
        })
    }
    catch(error){
        console.log("invaild information")
    }
})


app.post("/sign_up", (req, res) =>{
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var password = req.body.password;


    var data = {
        "name":name,
        "email":email,
        "phone":phone,
        "password":password,
    }

    db.collection('users').insertOne(data, (err, collection) => {
        if(err) throw err;
        console.log(`username :${name}'s account create sucessfully` )
    })

    return res.redirect('loggin3/loggin3.html')

})

