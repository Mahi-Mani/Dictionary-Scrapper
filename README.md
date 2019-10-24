# NewScrapper

## Summary
NewScrapper is all about scrapping a website. This application works on scrapping `https://www.dictionaryofobscuresorrows.com/` website in the background. Using that, this application creates a public API in the backend and makes manipulations on those objects and provides an useful product to have a well use of this dictionary. User can delete words at any point of time. They could even save their favorite words so that they can revisit later. They can even delete words that are no longer needed.

## Installation Guide
* User has to download all files from GitHub repository
* User can either clone the repository or can download all files manually unzipping might take a while though
* Package.json file has required depencies to be installed. So, user can type `npm install` to install all needed packages
* User can type `node server.js` to run the file from command line
* Collections used in this application are created using mongoose

## Technologies Used
- HTML : Basic skeleton of application and forms
- Bootstrap : For application styling
- Javascript : used to provide interactive effects
- Handlebars : To dynamically generate HTML page
- Mongoose :
- Node : used to run javascript file outside the browser. Supports command line user input. Node is useful is different ways. As
far as this code is concerned, utilised cheerio, axios to scrap website

## Application Functioning
Type `node server.js` from command line. Funtioning of the application is shown below

![Site](gif/VocabularyBuilder1.gif)

On run, this application provides you with two options either to view all scraped data or to scrap data. If you want to see latest available from website then go ahead to click on scrap. This will scrap all latest updates from website. Then user can view all scrapped data by clicking on view button. Upon viewing all words, user can customize their words by adding notes to specific words. Also, they can either delete or save a particular word. At any point of time, user can edit their notes and can view all saved words.

## Code Snippet
*index.handlebars*

```Handlebars
        {{#each result}}
        <div class="card d-inline-flex flex-row bd-highlight mb-3 text-wrap" id="allCard">
            <div class="card-body">
                <h5 class="card-title text-wrap">{{title}}</h5>
                <p class="card-text text-wrap" style="word-wrap: break-word">{{link}}</p>
                <p class="card-text text-wrap">{{content}}</p>
                <button type="button" class="btn btn-success" id="addNote-btn" data-id={{_id}}>Click to add a
                    Note</button>
                <button type="button" class="btn btn-primary" id="viewNote-btn" data-id={{_id}}>View note</button>
                <button type="button" class="btn btn-warning" id="saveNote-btn" data-id={{_id}}>Save</button>
                <button type="button" class="btn btn-danger" id="del-btn" data-id={{_id}}>Delete</button>
            </div>
        </div>
        {{/each}}
```

> Using handlebars, the above code snippet dynamically generates card for each value retrived from collections

*Client side Javascript*

```Javascript
    // Route to get notes commented by user
    function viewNote(id) {

        $.ajax("/dictionary/" + id, {
            type: "GET"
        }).then(function (data) {
            console.log(data);
            $("#" + id).modal("toggle");
            $("input[data-value=" + id + "]").val(data.note.name);
            $("textarea[data-text=" + id + "]").val(data.note.body);
            $("h5[data-note=" + id + "]").text("Edit note");
            $("button[data-note=" + id + "]").text("Edit note");
        })

    }
```

> Since handlebars was used to dynamically toggle modal, the above code snippet updates the modal elements whenever new note was added by user

*Server side Javascript*

```Javascript
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
```

> Server side javascript to create note collection and update Dictionary collection whenever a new note was added

## Learning Points
On developing this application, gained knowledge on mongoose and had a chance to have a deep learning into handlebars

## Author Links
[LinkedIn](https://www.linkedin.com/in/mahisha-gunasekaran-0a780a88/)

[GitHub](https://github.com/Mahi-Mani)