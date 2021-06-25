var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var montest = require('./routes/mongotest');
var jobs = require('./models/Jobs');
var chrome=require('./routes/pup');
const bodyParser = require("body-parser");
//var puppeteer = require('puppeteer');
var montest = require('./routes/mongotest');

var app = express()
const puppeteer = require('puppeteer-extra')
// parse application/x-www-form-urlencodedjjj
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

///////////////////////////////
const db = require('./config/key').mongoURI;
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
  mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


// parse application/json
function delay(time) {
   return new Promise(function(resolve) {
       setTimeout(resolve, time)
   });
}

 app.get("/",async(req,res,next)=>
 {
   try{

           console.log(`open`);
        const browser=await puppeteer.launch( {headless: false, defaultViewport: null ,userDataDir: "./mydatadir", args: [
      '--no-sandbox',
       '--start-maximized'
         ]})
        const page = await browser.newPage()
        page.setViewport({ width: 0, height: 0 });

        await page.goto('https://www.alljobs.co.il/SearchResultsGuest.aspx?page=1&position=1712&type=&city=&region=')
        await page.waitForNavigation();
       // show jobs details
         let adid = await page.evaluate(() => Array.from(document.querySelectorAll("[id*=job-content-top-acord]  "), e => e.id))
         adid=adid.map(t=>t.replace("job-content-top-acord",""))
         console.log(adid);
         // for(i=0 ;i<adid.length;i++){

             //console.log(bla);
          for( i=0;i<adid.length;i++){
            let id=adid[i];
            console.log(id);
           let text = await page.evaluate((id) => Array.from(document.querySelectorAll("[id*=job-content-top-acord"+id+"] > div > [class*=job-content-top-desc] > div > div.PT15"), e => e.innerText),id)
            text=text[0];
              //show jobs details
           let details= await page.evaluate((id)=>   Array.from(document.querySelectorAll(" [id*=job-content-top-acord"+id+"] > div > [class*=job-content-top-desc] > div"), e => e.innerText),id)
           details=details[0]
            //סוג משרה
           let type=  await page.evaluate((id)=>Array.from(document.querySelectorAll("[id*=job-body-content"+id+"] > [class*=job-content-top-type]"), e => e.innerText),id)
             type=type[0]
            //lovation
           let location=await page.evaluate((id)=>Array.from(document.querySelectorAll("[id*=job-body-content"+id+"] >  [class*=job-content-top-location] > a"), e => e.innerText),id)
          location=location[0]
           //company name
           let company=await page.evaluate((id)=>Array.from(document.querySelectorAll("[id*=job-box"+id+"] >  [class*=job-content-top] >[class*=job-content-top]>  div.T14 > a"), e => e.innerText),id)
           company=company[0]
            //title
           let title=await page.evaluate((id)=>Array.from(document.querySelectorAll("[id*=job-box"+id+"] >  [class*=job-content-top] >[class*=job-content-top-title]>  div:nth-child(1) > a  >h3"), e => e.innerText),id)
            title=title[0]
           let title2=await page.evaluate((id)=>Array.from(document.querySelectorAll("[id*=job-box"+id+"] >  [class*=job-content-top] >[class*=job-content-top-title-highlight]>  div:nth-child(1) > a  >h3"), e => e.innerText),id)
            title2=title2[0]
             //-pic
           let pic=await page.evaluate((id)=>Array.from(document.querySelectorAll("[id*=job-box"+id+"] >  [class*=job-content-top] >[class*=job-content-top-img]> a > img"), e => e.src),id)
            pic=pic[0]
           console.log("--------------------");
             console.log(id);
           console.log(text);
           console.log(details);
           console.log(type);
           console.log(location);
           console.log(company);
           if(title===undefined){
             title=title2;
           console.log(title);
         }
        let jobid=id
         if(id===undefined)
         {  id="-" }
         if(location===undefined)
         {location="-"}
         if(company===undefined)
         {company="-"}
         if(type===undefined)
         {type="-"}
         if(text===undefined)
         {text="-"}
         if(pic===undefined)
         {pic="-"}
         if(title===undefined)
         {title="-"}
         if(jobid===undefined)
         {jobid="-"}
      
         else {
              console.log(title);
         }
           console.log(pic);

            montest.job({company,jobid,text,details,location,title,pic,type});

           console.log("--------------------");
           title=[]
           pic=[]
           location=[]
           type=[]
           company=[]
           text=[]
           type=[]
           details=[]

         }




        console.log(adid);
        console.log("------------------------------")



           // browser.close()

           // await browser.close();


   }
   catch(err)
   {
     console.log(err)
   }
 });

 app.use(expressLayouts);
 app.set('view engine', 'ejs');



// catch 404 and forward to error handler-
app.use(function(req, res, next) {
  next(createError(404));
});
app.listen(4000, console.log(`Server running on  4000`));
// error handler-----
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
