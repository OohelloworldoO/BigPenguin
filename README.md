# 紀錄一下遇到的問題跟解決方法:
(我感覺才剛做完一個禮拜就快忘了當初怎麼做的了，所以記錄一下怎麼思考、解決的) 

網頁前端製作、後端nodejs串接mongoDB進行使用者登入、認證(未來還想再加po文、查詢資料等等)    
用於醫療紀錄以及使用者feedback(不知為啥css無法在github上連結到 但可在vs code運行成功)  
遇到的問題:session無法rwd、isAuth無法正常運行、還有res.direct的問題(後來改用res.readfile直接傳就解決了)，但還是要設定最初讀取路徑等等  
<br>
<br>  
-----
需要裝的套件:  
<br>  
bcrypt  
express  
expressflash  
express-session  
mongoose  
passport  
passport-local  
chatjs-plugin-datalabels  
<br>  
------
<br>
## 主要的參考資料如下:  
做完後才發現用react、vue做前端好像更好，因為很多範例都不是用.html靜態網頁，導致前端跨到後端遇到很多問題，所以下次試著用這些寫網頁(如果還有下次的話
像是前後端要互傳資料就讓我很頭大，早知道就用.ejs了  
 參考資料:https://webninjadeveloper.com/nodejs/node-js-express-session-based-authentication-system-using-express-session-cookie-parser-in-mongodb/  <br>
 參考資料:https://andyyou.github.io/2017/04/11/express-passport/  <br>
 參考資料:https://www.makeuseof.com/user-authentication-in-nodejs/  <br>
 參考資料:https://medium.com/web-design-zone/node-js-%E8%AE%93%E6%82%A8%E5%9C%A8server%E7%92%B0%E5%A2%83%E4%B8%8B%E7%94%A8javascript%E9%80%B2%E8%A1%8C%E6%93%8D%E4%BD%9C-6021a8af89e6  <br>
 參考資料:https://ithelp.ithome.com.tw/users/20107420/ironman/1381  <br>
 參考資料:https://ithelp.ithome.com.tw/articles/10271865  <br>
 參考資料:https://ithelp.ithome.com.tw/articles/10243819  <br>
 參考資料:https://ithelp.ithome.com.tw/articles/10228464  <br>
 參考資料:https://saasbase.dev/blog/building-an-authentication-system-using-passport-js-node-js-and-mongodb-part-1-google-login  <br>
 參考資料:https://www.youtube.com/watch?v=RGJ8Geq3tGU&list=PL2EvjydS1n0t2vvfrOJJ6OxN7HqWNqC5p&index=2&ab_channel=Inform%C3%A1ticaDP  <br>
 參考資料:https://www.youtube.com/watch?v=-RCnNyD0L-s&list=PL2EvjydS1n0t2vvfrOJJ6OxN7HqWNqC5p&index=4&t=1331s&ab_channel=WebDevSimplified  <br>
 參考資料:https://www.youtube.com/watch?v=iVt1ElToqHo&list=PL2EvjydS1n0t2vvfrOJJ6OxN7HqWNqC5p&index=10&t=88s&ab_channel=OnlineTutorials  <br>
 參考資料:https://www.youtube.com/watch?v=344Zv2m9TYI&list=PL2EvjydS1n0t2vvfrOJJ6OxN7HqWNqC5p&index=15&t=166s&ab_channel=TheFullStackJunkie  <br>
 參考資料:https://www.youtube.com/watch?v=nu_pCVPKzTk&list=PL2EvjydS1n0t2vvfrOJJ6OxN7HqWNqC5p&index=17&t=21883s&ab_channel=freeCodeCamp.org  <br>
 參考資料:https://www.youtube.com/watch?v=S1Wq_XHw6Qo&list=PL2EvjydS1n0t2vvfrOJJ6OxN7HqWNqC5p&index=18&t=738s&ab_channel=HarunurRoshid  <br>  
 參考資料:[https://www.youtube.com/watch?v=S1Wq_XHw6Qo&list=PL2EvjydS1n0t2vvfrOJJ6OxN7HqWNqC5p&index=18&t=738s&ab_channel=HarunurRoshid](https://www.youtube.com/watch?v=9YxgKmO-Rlw&list=PL2EvjydS1n0t2vvfrOJJ6OxN7HqWNqC5p&index=35&ab_channel=CalebCurry)  <br>  
 參考資料:[[https://www.youtube.com/watch?v=S1Wq_XHw6Qo&list=PL2EvjydS1n0t2vvfrOJJ6OxN7HqWNqC5p&index=18&t=738s&ab_channel=HarunurRoshid](https://www.youtube.com/watch?v=9YxgKmO-Rlw&list=PL2EvjydS1n0t2vvfrOJJ6OxN7HqWNqC5p&index=35&ab_channel=CalebCurry) ](https://www.youtube.com/watch?v=5TxF9PQaq4U&list=PL2EvjydS1n0t2vvfrOJJ6OxN7HqWNqC5p&index=34&t=658s&ab_channel=Smoljames) <br>  
 參考資料:[https://www.youtube.com/watch?v=S1Wq_XHw6Qo&list=PL2EvjydS1n0t2vvfrOJJ6OxN7HqWNqC5p&index=18&t=738s&ab_channel=HarunurRoshid](https://www.youtube.com/watch?v=W1Kttu53qTg&list=PL2EvjydS1n0t2vvfrOJJ6OxN7HqWNqC5p&index=31&t=6667s&ab_channel=DailyTuition)  <br> 
