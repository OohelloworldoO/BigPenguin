const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search_box"),
    modeSwitch = body.querySelector(".toggle_switch"),
    modeText = body.querySelector(".mode_text"),
    loggin = body.querySelector(".loggin"),
    page_top = body.querySelector(".page_top")
    feed_back = body.querySelector(".feed_back")


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

loggin.addEventListener("click", () =>{
    document.location.href = "../loggin3/loggin3.html";
});

page_top.addEventListener("click", () => {
    document.body.scrollIntoView({
        behavior: "smooth"
    })
})

feed_back.addEventListener("click" , () => {
    document.location.href = "../userfeed_back/user_feedback.html"
})


    

