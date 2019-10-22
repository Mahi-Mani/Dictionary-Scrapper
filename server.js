// Require dependencies
var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var PORT = 8080;
var db = require("./models");

db.on("error", function(error) {
  console.log("Database Error:", error);
});

var app = express();
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/dictionaryAPI", { useNewUrlParser: true });

// app.get("/", function(req, res) {
//     res.render("index", obj);
//   });

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
    res.send("Hello world");
  });

//   Get all scraped data
  app.get("/all", function(req, res){
    db.scrapedData.find({}, function(err, data){
      if(err) throw err;
      else{
        res.json(data);
      }
    })
  })

//   To insert scrapped data to collection
app.get("/scrape", function(req, res){

    // To call the function of all pages in website
    for(var i=1; i<=117; i++){
    createRequest(i);
    }

    function createRequest(num){
        var url;
        if(num > 1)
        url = "https://www.dictionaryofobscuresorrows.com/page/" + num; 
        else
        url = "https://www.dictionaryofobscuresorrows.com/";

    axios.get(url).then(function(response){
      var $ = cheerio.load(response.data);
      
      $("div.post.text").each(function(i, element){
          var title = $(element).find("h2.title").find("a").text();
          var link = $(element).find("h2.title").find("a").attr("href");
          var content = $(element).find("div.content").find("p").text();

          var result = {
              title: title,
              link: link,
              content: content
          }

        //   Create a new dictionary collection using scrapped data
        db.Dictionary.create(result).then(function(dbDictionary){
            console.log(dbDictionary);
        }).catch(function(err){
            console.log(err);
        })
  
    })
        res.send("Scraped!");
    })
}
})


//   Server listening on port 8080
app.listen(PORT, function(){
    console.log("Server is listening to PORT 8080");
})