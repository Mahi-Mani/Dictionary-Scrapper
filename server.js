// Require dependencies
var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

var app = express();
app.use(express.static("public"));

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
// app.get("/scrape", function(req, res){
  
//     axios.get("https://www.dictionaryofobscuresorrows.com/").then(function(response){
//       var $ = cheerio.load(response.data);
      
//       $("div.story-card-news").each(function(i, element){
//         var header = $(element).find("a.section-name").text();
//         var link = $(element).find("a.section-name").attr("href");
//         var content = $(element).find("h2").find("a").attr("href");
  
//         db.scrapedData.insert(
            
//             {
//                 header: header,
//                 link: link  ,
//                 content: content  
//             }, 
//         function(err, data){
//           if(err) throw err;
//           else{
//             console.log(data);
//           }
//         })
//     })
//         res.send("Scraped!");
//     })
// })

app.get("/scrape", function(req, res){
    var num = 1;

    for(var i=1; i<=117; i++){
    createRequest(i);
    }

    function createRequest(num){
        var url;
        if(num > 1)
        url = "https://www.dictionaryofobscuresorrows.com/page/" + num; 
        else
        url = "https://www.dictionaryofobscuresorrows.com/";
        
        // createRequest(num);
    
    
    axios.get(url).then(function(response){
      var $ = cheerio.load(response.data);
      
      $("div.post.text").each(function(i, element){
          var title = $(element).find("h2.title").find("a").text();
          var link = $(element).find("h2.title").find("a").attr("href");
          var content = $(element).find("div.content").find("p").text();
  
        db.scrapedData.insert(
            
            {
                title: title,
                link: link,
                content: content
            }, 
        function(err, data){
          if(err) throw err;
          else{
            console.log(data);
          }
        })
    })
        res.send("Scraped!");
    })
}
})


//   Server listening on port 8080
app.listen(8080, function(){
    console.log("Server is listening to PORT 8080");
})