// Require dependencies
var express = require("express");
var app = express();
var exphbs = require("express-handlebars");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var PORT = process.env.PORT || 8080;

app.use(express.static("public"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
var db = require("./models");

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/dictionaryAPI";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// mongoose.connect("mongodb://localhost/dictionaryAPI", { useNewUrlParser: true });

// Main route to retrive all from Dictionary
app.get("/dictionary", function (req, res) {
  db.Dictionary.find({})
    .then(function (dbDictionary) {
      // res.render("index", dbDictionary);
      var obj = {
        result: dbDictionary
      }
      // res.json(obj);
      console.log(obj);
      res.render("index", obj);
    })
    .catch(function (err) {
      console.log(err);
    })
});

//   Post a new value to Dictionary along with it's associated note and note collections
app.post("/dictionary/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Dictionary.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbDictionary) {
      res.json(dbDictionary);
    }).catch(function (err) {
      res.json(err);
    })
})

// Get route to get notes commented by user
app.get("/dictionary/:id", function (req, res) {
  db.Dictionary.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbDictionary) {
      res.json(dbDictionary);
    })
})

// Main route (simple Hello World Message)
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

// To delete value from collection
app.put("/dictionary/del/:id", function (req, res) {
  db.Dictionary.findOne({
    _id: req.params.id
  }).remove().exec();
  res.send("Deleted");
})

// To remove values from saved table
app.put("/saved/del/:id", function (req, res) {
  db.Dictionary.findOneAndUpdate({ _id: req.params.id }, { saved: false }).then(function (data) {
    res.send("Removed");
  })
})

// To save
app.put("/dictionary/save/:id", function (req, res) {
  db.Dictionary.findOneAndUpdate({ _id: req.params.id }, { saved: true }).then(function (data) {
    res.send("Saved");
  })
})



// To delete all retrieved data
app.put("/dictionary/del/all", function (req, res) {
  db.Dictionary.deleteMany()
    .then(function () {
      return db.Note.deleteMany({});
    })
})

//   Get all scraped data
app.get("/all", function (req, res) {
  db.Dictionary.find({}, function (err, data) {
    if (err) throw err;
    else {
      res.json(data);
    }
  })
})

// To get all saved data
app.get("/saved", function (req, res) {
  db.Dictionary.find({ saved: true })
    .then(function (dbDictionary) {
      res.json(dbDictionary);
    })
})

//   To insert scrapped data to collection
app.get("/scrape", function (req, res) {

  // To call the function of all pages in website
  for (var i = 1; i <= 117; i++) {
    createRequest(i);
  }

  function createRequest(num) {
    var url;
    if (num > 1)
      url = "https://www.dictionaryofobscuresorrows.com/page/" + num;
    else
      url = "https://www.dictionaryofobscuresorrows.com/";
    console.log(url);

    axios.get(url).then(function (response) {
      var $ = cheerio.load(response.data);

      $("div.post.text").each(function (i, element) {
        var title = $(element).find("h2.title").find("a").text();
        var link = $(element).find("h2.title").find("a").attr("href");
        var content = $(element).find("div.content").find("p").text();

        var result = {
          title: title,
          link: link,
          content: content
        }

        //   Create a new dictionary collection using scrapped data
        db.Dictionary.findOne({
          title: title
        }, function (err, existingTitle) {
          if (!(existingTitle)) {
            db.Dictionary.create(result).then(function (dbDictionary) {
              console.log(dbDictionary);
            }).catch(function (err) {
              console.log(err);
            })
          }
          else {
            console.log("Already exists");
          }
        })


      })
      res.send("Scraped!");
    }).catch(err => {
      console.log(err);
    })
  }
})


//   Server listening on port 8080
app.listen(PORT, function () {
  console.log("Server is listening to PORT 8080");
})