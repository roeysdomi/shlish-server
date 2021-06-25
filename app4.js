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
var app = express()
const puppeteer = require('puppeteer-extra')
// parse application/x-www-form-urlencodedjjj
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

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
        const browser=await puppeteer.launch( {headless: true, defaultViewport: null ,userDataDir: "./mydatadir", args: [
      '--no-sandbox',
       '--start-maximized'
         ]})
        const page = await browser.newPage()
        page.setViewport({ width: 0, height: 0 });

        await page.goto('https://www.alljobs.co.il/')

       await page.waitForSelector('a.acu')
       await page.hover('a.acu');
        await delay(2000)
       await page.click('a.acu');
       await delay(2000)
       await page.waitForSelector('input[name=TopBarEmail]')
         await page.type('input[name=TopBarEmail]', "roeysdomi@gmail.com")
         await delay(2000)
         await page.click('input[type=password]');
           await page.type('input[type=password]', "roeysdomi11")

             page.keyboard.press('Enter')
             await delay(5000)

            await page.screenshot().then(function(buffer) {
               res.setHeader('Content-Disposition', 'attachment;filename="' +"teseeet" + '.png"');
               res.setHeader('Content-Type', 'image/png');
               res.send(buffer);
             })
           // browser.close()

           await browser.close();


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
