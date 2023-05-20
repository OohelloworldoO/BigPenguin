const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const session = require("express-session");
const flash = require('express-flash');
const app = express();
const User = require('./modules/User')
const userData = require('./modules/userData')
const suggestion_message = require('./modules/Suggetsion')
const MongoDBSession = require('connect-mongodb-session')(session)
const MONGODB_URI = 'mongodb+srv://project_admin:a123456789@project1.8ishzzb.mongodb.net/?retryWrites=true&w=majority'
const path = require("path");
const { Server } = require("http");
const { use } = require("passport");
const { MongoDBStore } = require("connect-mongodb-session");
const { emitWarning } = require("process");
const publicPath = path.join(__dirname, 'public')
const {MongoClient, ObjectID} = require('mongodb').MongoClient;
const store = new MongoDBSession({
    uri: MONGODB_URI,
    collection: "mySessions"
})
const isAuth = (req, res, next) => {
    if(req.session.isAuth){ next() }
    else{

        res.redirect('loggin3/loggin3.html')
    }
}
const isLogging = (req, res, next) => {
    if(req.session.isAuth){
        res.sendFile(`${publicPath}/loggin_sucess_main.html`)
    }
    else{  next() }
}




app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: "key that will sign cookie",
    resave: false,
    saveUninitialized: false,
    store: store
}))
//when use back button web will reload and can't cache
app.use(function(req, res, next){
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next()
})
app.set('view engine', 'ejs'); // 設定模板引擎為 EJS


async function connectToDatabase() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Mongoose connected");
    } catch (error) {
        console.log("Mongoose error:", error);
    }
}
connectToDatabase();


const db = mongoose.connection;
db.on('error', () => console.log("Mongoose error"));
db.once('open', () => console.log("Mongoose connected"));







app.get("/" , isLogging, async (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.sendFile(`${publicPath}/main.html`)
}).listen(3000);




app.get("/loggin", isLogging, (req, res) =>{
    res.sendFile(`${publicPath}/loggin3.html`)
})

app.post("/loggin", async (req, res) => {
    const password = req.body.password
    const email = req.body.email
    const user = await User.findOne({email})

    if(!user){
        return res.sendFile(`${publicPath}/register.html`)
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        console.log(`User: ${email}'s accout is tried to login`);
        return res.sendFile(`${publicPath}/loggin3.html`)
    }
    req.session.isAuth = true
    console.log(`User: ${email} login sucessfully `);
    return res.sendFile(`${publicPath}/loggin_sucess_main.html`)
});



app.post("/loggin_page", (req, res) => {
    res.sendFile(`${publicPath}/loggin3.html`)
})







app.get("/home", (req, res) => {
    res.sendFile(`${publicPath}/main.html`)
})

app.post("/home", (req, res) => {
    res.sendFile(`${publicPath}/main.html`)
})





app.get('/sign_up', (req, res) => {
    res.sendFile(`${publicPath}/register.html`)
})

app.post("/sign_up", async (req, res) => {
    const username = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    let user = await User.findOne({email})
    if(user){

        return res.sendFile(`${publicPath}/register.html`)
    }
    const hashedPsw = await bcrypt.hash(password, 12)
    user = new User({
        username,
        email,
        password:hashedPsw,
        phone
    })

    await user.save()
    res.sendFile(`${publicPath}/loggin3.html`)
});





app.get('/loggin_sucess', isAuth, (req, res) => {
    res.sendFile(`${publicPath}/main.html`)
})
// app.post('/loggin_sucess', isAuth, (req, res) => {
//     res.sendFile(`${publicPath}/main.html`)
// })







// app.get('/register', (req, res) => {
//     res.sendFile(`${publicPath}/register.html`)
// })

app.post('/register', (req, res) => {
    res.sendFile(`${publicPath}/register.html`)
})


app.get("/loggout", isLogging, (req, res) => {
    res.sendFile(`${publicPath}/main.html`)
})

app.post("/loggout", (req, res) => {

    req.session.destroy((err) => {
        if(err) throw err
        res.sendFile(`${publicPath}/main.html`)
    })
})


app.post("/message", async(req, res) => {
    const message = req.body.message
    const username = req.body.name
    const email = req.body.email

    suggest = new suggestion_message({
        username,
        email,
        message
    })

    await suggest.save()
    res.sendFile(`${publicPath}/loggin_sucess_main.html`)
})


app.get("/personal", isAuth,async(req, res) => {
    User.find({}, { username:1, email:1, phone:1}).then((result) =>{
        const htmlTable = `
        <style>


        *{
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root{
            /* Colors*/
            --body-color: #e4e9f7;
            --sidebar-color: #fff;
            --primary-color: #493cdb;
            --primary-color-light: #ddd;
            --toggle-color: rgb(77, 72, 72);
            --text-color: #222020;
        
            /*Transition*/
            --tran-02: all 0.2s ease;
            --tran-03: all 0.3s ease;
            --tran-04: all 0.4s ease;
            --tran-05: all 0.5s ease;
            
        }
        
        body{
            height: 100vh;
            background: var(--body-color);
            transition: var(--tran-05);
        }
        
        /*animation of page changing*/
        @keyframes transitionPage{
            from{
                opacity: 0;
                transform: rotateX(-10deg);
            }
            to{
                opacity: 1;
                transform: rotateX(0deg);
            }
        }
        
        /*reusebal css*/
        
        .sidebar .text{
            font-size: 16px;
            font-weight: 500;
            color: var(--text-color);
            transition: var(--tran-05);
            white-space: nowrap;
        }
        
        .sidebar .image{
            min-width: 40px;
            display: flex;
            align-items:center;
        }
        
        body.dark{
            --body-color: #18191a;
            --sidebar-color: #242526;
            --primary-color: #3a3b3c;
            --primary-color-light: #3a3b3c;
            --toggle-color: #fff;
            --text-color: rgb(245, 241, 241);
            --dragon_ball-color:#e20a0a;
        }
        
        
        
        
        
        
        
        /*sidebar*/
        .sidebar{
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 250px;
            padding: 10px 14px;
            background: var(--sidebar-color);
            transition: var(--tran-05);
            z-index: 100;
        }
        
        .sidebar.close{
            width: 78px;
        }
        
        .sidebar .loggout{
            transition: var(--tran-05);
            border: none;
            font-size: 16px;
            font-weight: 500;
            background-color: #fff;
            height: 100%;
            width: 250px;
            text-align: left;
        }
        
        .loggout:hover{
            cursor: pointer;
            background: var(--primary-color);
            color: #fff;
        }
        
        
        /*reusebal css*/
        .sidebar.close .text{
            font-size: 16px;
            font-weight: 500;
            color: var(--text-color);
            transition: var(--tran-05);
            white-space: nowrap;
            opacity: 1;
        }
        
        .sidebar.sidebar.close .text{
            opacity: 0;
        }
        
        .sidebar.close .loggout{
            transition: var(--tran-05);
            white-space: nowrap;
            opacity: 0;
        }
        
        .sidebar .image{
            min-width: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .sidebar li{
            height: 50px;
            margin-top: 10px;
            list-style: none;
            display: flex;
            align-items: center;
        }
        
        .sidebar li .icons{
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 50px;
            font-size: 20px;
        }
        
        .sidebar li .icons,
        .sidebar li .text{
            color: var(--text-color);
            transition:var(--tran-05);
        }
        
        .sidebar header{
            position: relative;
        
        }
        
        .sidebar .image-text img{
            width: 50px;
            border-radius: 30px;
        }
        
        .sidebar header .image-text{
            display: flex;
            align-items: center;
        }
        
        header .image-text .text_header{
            display: flex;
            flex-direction: column;
        
        }
        
        .text_header .name{
            font-weight: 600;
        }
        
        .text_header .profession{
            margin-top: -2px;
        }
        
        .sidebar header .toggle{
            position: absolute;
            top: 50%;
            right: -25px;
            transform: translateY(-50%);
            height: 25px;
            width: 25px;
            background:#e20a0a;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            color: var(--sidebar-color);
            font-size: 30px;
        }
        
        .toggle:hover{
            cursor: pointer;
        }
        
        
        body.dark .sidebar header .toggle{
            color: var(--text-color);
        }
        
        .sidebar .menu{
            margin-top: 35px;
        }
        
        .sidebar .search_box{
            background:var(--primary-color-light);
            border-radius: 6px;
            transition: var(--tran-05);
        }
        
        .search_box input{
            height: 100%;
            width: 100%;
            outline: none;
            border: none;
            border-radius: 6px;
            background: var(--primary-color-light);
            font-size: 16px;
            font-weight: 500;
        }
        
        .sidebar li a{
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            text-decoration: none;
            border-radius: 6px;
            transition:var(--tran-05);
        }
        
        .sidebar li a:hover{
            background: var(--primary-color);
            cursor: pointer;
        }
        
        .sidebar  li a:hover .icons,
        .sidebar li a:hover .text{
            color: var(--sidebar-color);
            cursor: pointer;
        }
        
        body.dark .sidebar  li a:hover .icons,
        body.dark .sidebar li a:hover .text{
            color: var(--text-color);
            cursor: pointer;
        }
        
        body.dark .loggout{
            background-color: var(--sidebar-color);
            color: var(--text-color);
        }
        
        body.dark .loggout:hover{
            background-color: var(--primary-color);
            color: var(--text-color);
        }
        
        
        .sidebar .menu_bar{
            height: calc(100% - 100px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-radius: 6px;
        }
        
        /*日間夜間模式*/
        
        .menu_bar .mode{
            border-radius: 6px;
            position: relative;
            background: var(--primary-color-light);
            transition: var(--tran-05);
        }
        
        .menu_bar .mode .moon_sun{
            height: 50px;
            width: 60px;
            display: flex;
            align-items: center;
        }
        
        
        .menu_bar .mode i{
            position: absolute;
            transition: var(--tran-05);
        }
        
        .menu_bar .mode i.sun{
            opacity: 0;
        }
        
        body.dark .menu_bar .mode i.sun{
            opacity: 1;
        }
        
        body.dark .menu_bar .mode i.moon{
            opacity: 0;
        }
        
        .menu_bar .mode .toggle_switch{
            position: absolute;
            right: 0;
            display: flex;
            align-items: center;
            height: 100%;
            min-width: 52px;
            cursor: pointer;
            background: var(--primary-color-light);
            transition: var(--tran-05);
            border-radius: 6px;
        }
        
        .toggle_switch .switch{
            position: relative;
            height: 22px;
            width: 40px;
            left: 5px;
            border-radius: 25px;
            background: var(--toggle-color);
        }
        
        .switch::before{
            content: '';
            position: absolute;
            height: 15px;
            width: 15px;
            border-radius: 50%;
            top: 50%;
            left: 3px;
            transform: translateY(-50%);
            background: var(--sidebar-color);
            transition: var(--tran-05);
        }
        
        body.dark .switch::before{
            left: 22px;
        }
        
        
        /*主頁面*/
        .home{
            position: relative;
            left: 250px;
            height: 100vh;
            width: calc(100% - 250px);
            background: var(--body-color);
            transition: var(--tran-05);
            animation: transitionPage 1s;
        }
        
        .home .h1_text{
            font-size: 30px;
            font-weight: 500;
            color: var(--text-color);
            padding: 8px 40px;
        }
        
        
        
        .sidebar.close ~ .home{
            left: 78px;
            width: calc(100% - 78px);
        }
        
        
        /*main_content img setting*/
        .h1_text .main_content img{
            width: auto;
            display: flex;
        }
        
        .wrap{
            overflow:hidden;
            border-radius:10px 10px 0px 0px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.35);
          }
          
          table{
            font-family: 'Oswald', sans-serif;
            border-collapse:collapse;
          
          }
          
          th{
            background-color:#009879;
            color:#ffffff;
            width:25vw;
            height:75px;
          }
          
          td{
            background-color:#ffffff;
            width:25vw;
            height:50px;
            text-align:center;
          }
          
          tr{
            border-bottom: 1px solid #dddddd;
          }
          
          tr:last-of-type{
            border-bottom: 2px solid #009879;
          }
          
          tr:nth-of-type(even) td{
            background-color:#f3f3f3;
          }
        
        
        
        </style>
        
        </head>
        
        <!--icons的部分去  https://boxicons.com/ -->
        <body>
            <nav class="sidebar close">
                <header>
                    <div class="image-text">
                        <span class="image">
                            <img src="/assets/images/dragon_ball.png" alt="dragon_ball"  >
                        </span>
        
                        <div class="text text_header">
        
                            <span class="text name">岐黃妙訣</span>
                            <span class="text profession">企鵝呱呱</span>
                        </div>
        
                    </div>
        
                    <i class='bx bx-chevron-right toggle' ></i>
                </header>
        
                <div class="menu_bar">
                    <div class="menu">
        
        
                        <ul class="menu_links">
                            <li class="search_box">
                                <a>
                                    <i class='bx bx-search icons' ></i>
                                    <input type="text" placeholder="搜尋 search">
                                </a>
                            </li>
        
                            <form action="/loggin_sucess_main" method="get">
                                <li class="home_Button" >
                                    <a class="page_top">
                                        <i class='bx bx-home-circle icons'></i>
                                        <button class="loggout">返回主頁</button>
                                    </a>
                                </li>
                            </form>

                            <form action="/suggestion" method="get">
                            <li class="nav_link">
                                <a>
                                    <i class='bx bx-book-content icons'></i>
                                    <button class="loggout">查詢資料</button>
                                </a>
                            </li>
                        </form>
                            
                            <form action="/loggout" method="post">
                                <li class="nav_link">
                                    <a >
                                        <i class='bx bx-log-out icons'></i>
                                        <button class="loggout">登出</button>
                                    </a>
                                </li>
                            </form>
        
                        </ul>
        
                    </div>
        
                    <div class="bottom_content">
        
        
                            <li class="mode">
                                <div class="moon_sun">
                                    <i class="bx bx-moon icons moon"></i>
                                    <i class="bx bx-sun icons sun"></i>
                                </div>
        
                                <span class="text mode_text">Dark Mode</span>
        
                                <div class="toggle_switch">
                                    <span class="switch"></span>
                                </div>
        
                            </li>
        
        
        
                    </div>
                </div>
            </nav>
        
            <section class="home">
        
                <div class="h1_text">
                    <h1 >國立金門大學</h1>
        
                    <div class="main_content">
                        <div class="wrap">
                        <table>
                        <thead>
                          <tr>
                            <th>使用者名稱</th>
                            <th>信箱</th>
                            <th>手機號碼</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          ${result.map(item => `
                            <tr>
                              <td>${item.username}</td>
                              <td>${item.email}</td>
                              <td>${item.phone}</td>
                              <td></td>
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                        </div>
        
                </div>
        
        
            </section>
            <script>
    const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search_box"),
    modeSwitch = body.querySelector(".toggle_switch"),
    modeText = body.querySelector(".mode_text");
    page_top = body.querySelector(".page_top");

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});

searchBtn.addEventListener("click", () => {
    sidebar.classList.remove("close");
});

modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");

    if(body.classList.contains("dark")){
        modeText.innerText = "Light Mode"
    }
    else{
        modeText.innerText = "Dark Mode"
    }
});



page_top.addEventListener("click", () => {
    document.body.scrollIntoView({
        behavior: "smooth"
    })
})


    </script>
    <script src="/assets/js/jquery-2.1.0.min.js"></script>

    <script src="/assets/js/popper.js"></script>
    <script src="/assets/js/bootstrap.min.js"></script>
    

    <script src="/assets/js/scrollreveal.min.js"></script>
    <script src="/assets/js/waypoints.min.js"></script>
    <script src="/assets/js/jquery.counterup.min.js"></script>
    <script src="/assets/js/imgfix.min.js"></script> 



      <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.6.0/Chart.js"></script>
  <script>

  </script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/chart.js/dist/chart.umd.min.js"></script>
      `
        res.send(htmlTable)
    }).catch((err) =>{
        console.log(err)
    })

    
})


app.get("/suggestion", isAuth,async(req, res) => {
    suggestion_message.find({}, { username:1, message:1, email:1}).then((result) =>{
        const htmlTable = `
        <style>


        *{
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root{
            /* Colors*/
            --body-color: #e4e9f7;
            --sidebar-color: #fff;
            --primary-color: #493cdb;
            --primary-color-light: #ddd;
            --toggle-color: rgb(77, 72, 72);
            --text-color: #222020;
        
            /*Transition*/
            --tran-02: all 0.2s ease;
            --tran-03: all 0.3s ease;
            --tran-04: all 0.4s ease;
            --tran-05: all 0.5s ease;
            
        }
        
        body{
            height: 100vh;
            background: var(--body-color);
            transition: var(--tran-05);
        }
        
        /*animation of page changing*/
        @keyframes transitionPage{
            from{
                opacity: 0;
                transform: rotateX(-10deg);
            }
            to{
                opacity: 1;
                transform: rotateX(0deg);
            }
        }
        
        /*reusebal css*/
        
        .sidebar .text{
            font-size: 16px;
            font-weight: 500;
            color: var(--text-color);
            transition: var(--tran-05);
            white-space: nowrap;
        }
        
        .sidebar .image{
            min-width: 40px;
            display: flex;
            align-items:center;
        }
        
        body.dark{
            --body-color: #18191a;
            --sidebar-color: #242526;
            --primary-color: #3a3b3c;
            --primary-color-light: #3a3b3c;
            --toggle-color: #fff;
            --text-color: rgb(245, 241, 241);
            --dragon_ball-color:#e20a0a;
        }
        
        
        
        
        
        
        
        /*sidebar*/
        .sidebar{
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 250px;
            padding: 10px 14px;
            background: var(--sidebar-color);
            transition: var(--tran-05);
            z-index: 100;
        }
        
        .sidebar.close{
            width: 78px;
        }
        
        .sidebar .loggout{
            transition: var(--tran-05);
            border: none;
            font-size: 16px;
            font-weight: 500;
            background-color: #fff;
            height: 100%;
            width: 250px;
            text-align: left;
        }
        
        .loggout:hover{
            cursor: pointer;
            background: var(--primary-color);
            color: #fff;
        }
        
        
        /*reusebal css*/
        .sidebar.close .text{
            font-size: 16px;
            font-weight: 500;
            color: var(--text-color);
            transition: var(--tran-05);
            white-space: nowrap;
            opacity: 1;
        }
        
        .sidebar.sidebar.close .text{
            opacity: 0;
        }
        
        .sidebar.close .loggout{
            transition: var(--tran-05);
            white-space: nowrap;
            opacity: 0;
        }
        
        .sidebar .image{
            min-width: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .sidebar li{
            height: 50px;
            margin-top: 10px;
            list-style: none;
            display: flex;
            align-items: center;
        }
        
        .sidebar li .icons{
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 50px;
            font-size: 20px;
        }
        
        .sidebar li .icons,
        .sidebar li .text{
            color: var(--text-color);
            transition:var(--tran-05);
        }
        
        .sidebar header{
            position: relative;
        
        }
        
        .sidebar .image-text img{
            width: 50px;
            border-radius: 30px;
        }
        
        .sidebar header .image-text{
            display: flex;
            align-items: center;
        }
        
        header .image-text .text_header{
            display: flex;
            flex-direction: column;
        
        }
        
        .text_header .name{
            font-weight: 600;
        }
        
        .text_header .profession{
            margin-top: -2px;
        }
        
        .sidebar header .toggle{
            position: absolute;
            top: 50%;
            right: -25px;
            transform: translateY(-50%);
            height: 25px;
            width: 25px;
            background:#e20a0a;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            color: var(--sidebar-color);
            font-size: 30px;
        }
        
        .toggle:hover{
            cursor: pointer;
        }
        
        
        body.dark .sidebar header .toggle{
            color: var(--text-color);
        }
        
        .sidebar .menu{
            margin-top: 35px;
        }
        
        .sidebar .search_box{
            background:var(--primary-color-light);
            border-radius: 6px;
            transition: var(--tran-05);
        }
        
        .search_box input{
            height: 100%;
            width: 100%;
            outline: none;
            border: none;
            border-radius: 6px;
            background: var(--primary-color-light);
            font-size: 16px;
            font-weight: 500;
        }
        
        .sidebar li a{
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            text-decoration: none;
            border-radius: 6px;
            transition:var(--tran-05);
        }
        
        .sidebar li a:hover{
            background: var(--primary-color);
            cursor: pointer;
        }
        
        .sidebar  li a:hover .icons,
        .sidebar li a:hover .text{
            color: var(--sidebar-color);
            cursor: pointer;
        }
        
        body.dark .sidebar  li a:hover .icons,
        body.dark .sidebar li a:hover .text{
            color: var(--text-color);
            cursor: pointer;
        }
        
        body.dark .loggout{
            background-color: var(--sidebar-color);
            color: var(--text-color);
        }
        
        body.dark .loggout:hover{
            background-color: var(--primary-color);
            color: var(--text-color);
        }
        
        
        .sidebar .menu_bar{
            height: calc(100% - 100px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-radius: 6px;
        }
        
        /*日間夜間模式*/
        
        .menu_bar .mode{
            border-radius: 6px;
            position: relative;
            background: var(--primary-color-light);
            transition: var(--tran-05);
        }
        
        .menu_bar .mode .moon_sun{
            height: 50px;
            width: 60px;
            display: flex;
            align-items: center;
        }
        
        
        .menu_bar .mode i{
            position: absolute;
            transition: var(--tran-05);
        }
        
        .menu_bar .mode i.sun{
            opacity: 0;
        }
        
        body.dark .menu_bar .mode i.sun{
            opacity: 1;
        }
        
        body.dark .menu_bar .mode i.moon{
            opacity: 0;
        }
        
        .menu_bar .mode .toggle_switch{
            position: absolute;
            right: 0;
            display: flex;
            align-items: center;
            height: 100%;
            min-width: 52px;
            cursor: pointer;
            background: var(--primary-color-light);
            transition: var(--tran-05);
            border-radius: 6px;
        }
        
        .toggle_switch .switch{
            position: relative;
            height: 22px;
            width: 40px;
            left: 5px;
            border-radius: 25px;
            background: var(--toggle-color);
        }
        
        .switch::before{
            content: '';
            position: absolute;
            height: 15px;
            width: 15px;
            border-radius: 50%;
            top: 50%;
            left: 3px;
            transform: translateY(-50%);
            background: var(--sidebar-color);
            transition: var(--tran-05);
        }
        
        body.dark .switch::before{
            left: 22px;
        }
        
        
        /*主頁面*/
        .home{
            position: relative;
            left: 250px;
            height: 100vh;
            width: calc(100% - 250px);
            background: var(--body-color);
            transition: var(--tran-05);
            animation: transitionPage 1s;
        }
        
        .home .h1_text{
            font-size: 30px;
            font-weight: 500;
            color: var(--text-color);
            padding: 8px 40px;
        }
        
        
        
        .sidebar.close ~ .home{
            left: 78px;
            width: calc(100% - 78px);
        }
        
        
        /*main_content img setting*/
        .h1_text .main_content img{
            width: auto;
            display: flex;
        }
        
        .wrap{
            overflow:hidden;
            border-radius:10px 10px 0px 0px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.35);
          }
          
          table{
            font-family: 'Oswald', sans-serif;
            border-collapse:collapse;
          
          }
          
          th{
            background-color:#009879;
            color:#ffffff;
            width:25vw;
            height:75px;
          }
          
          td{
            background-color:#ffffff;
            width:25vw;
            height:50px;
            text-align:center;
          }
          
          tr{
            border-bottom: 1px solid #dddddd;
          }
          
          tr:last-of-type{
            border-bottom: 2px solid #009879;
          }
          
          tr:nth-of-type(even) td{
            background-color:#f3f3f3;
          }
        
        
        </style>
        
        </head>
        
        <!--icons的部分去  https://boxicons.com/ -->
        <body>
            <nav class="sidebar close">
                <header>
                    <div class="image-text">
                        <span class="image">
                            <img src="/assets/images/dragon_ball.png" alt="dragon_ball"  >
                        </span>
        
                        <div class="text text_header">
        
                            <span class="text name">岐黃妙訣</span>
                            <span class="text profession">企鵝呱呱</span>
                        </div>
        
                    </div>
        
                    <i class='bx bx-chevron-right toggle' ></i>
                </header>
        
                <div class="menu_bar">
                    <div class="menu">
        
        
                        <ul class="menu_links">
                            <li class="search_box">
                                <a>
                                    <i class='bx bx-search icons' ></i>
                                    <input type="text" placeholder="搜尋 search">
                                </a>
                            </li>
        
                            <form action="/loggin_sucess_main" method="get">
                                <li class="home_Button" >
                                    <a class="page_top">
                                        <i class='bx bx-home-circle icons'></i>
                                        <button class="loggout">返回主頁</button>
                                    </a>
                                </li>
                            </form>

                            <form action="/personal" method="get">
                            <li class="nav_link">
                                <a >
                                    <i class='bx bx-wink-smile icons'></i>
                                    <button class="loggout">個人資料</button>
                                </a>
                            </li>
                        </form>
          
                            <form action="/loggout" method="post">
                                <li class="nav_link">
                                    <a >
                                        <i class='bx bx-log-out icons'></i>
                                        <button class="loggout">登出</button>
                                    </a>
                                </li>
                            </form>
        
                        </ul>
        
                    </div>
        
                    <div class="bottom_content">
        
        
                            <li class="mode">
                                <div class="moon_sun">
                                    <i class="bx bx-moon icons moon"></i>
                                    <i class="bx bx-sun icons sun"></i>
                                </div>
        
                                <span class="text mode_text">Dark Mode</span>
        
                                <div class="toggle_switch">
                                    <span class="switch"></span>
                                </div>
        
                            </li>
        
        
        
                    </div>
                </div>
            </nav>
        
            <section class="home">
        
                <div class="h1_text">
                    <h1 >國立金門大學</h1>
        
                    <div class="main_content">
                        <div class="wrap">
                        <table>
                            <thead>
                              <tr>
                                <th>使用者名稱</th>
                                <th>信箱</th>
                                <th>內容</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              ${result.map(item => `
                                <tr>
                                  <td>${item.username}</td>
                                  <td>${item.email}</td>
                                  <td>${item.message}</td>
                                  <td></td>
                                </tr>
                              `).join('')}
                            </tbody>
                          </table>

                        </div>
        
                </div>
        
        
            </section>
            <script>
    const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search_box"),
    modeSwitch = body.querySelector(".toggle_switch"),
    modeText = body.querySelector(".mode_text");
    page_top = body.querySelector(".page_top");

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});

searchBtn.addEventListener("click", () => {
    sidebar.classList.remove("close");
});

modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");

    if(body.classList.contains("dark")){
        modeText.innerText = "Light Mode"
    }
    else{
        modeText.innerText = "Dark Mode"
    }
});



page_top.addEventListener("click", () => {
    document.body.scrollIntoView({
        behavior: "smooth"
    })
})


    </script>
    <script src="/assets/js/jquery-2.1.0.min.js"></script>

    <script src="/assets/js/popper.js"></script>
    <script src="/assets/js/bootstrap.min.js"></script>
    

    <script src="/assets/js/scrollreveal.min.js"></script>
    <script src="/assets/js/waypoints.min.js"></script>
    <script src="/assets/js/jquery.counterup.min.js"></script>
    <script src="/assets/js/imgfix.min.js"></script> 



      <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.6.0/Chart.js"></script>
  <script>

  </script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/chart.js/dist/chart.umd.min.js"></script>
      `
        res.send(htmlTable)
    }).catch((err) =>{
        console.log(err)
    })

    
})


app.get("/loggin_sucess_main", isAuth, async(req, res) => {
    res.sendFile(`${publicPath}/loggin_sucess_main.html`)
})

