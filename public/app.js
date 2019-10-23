// To ensure that our document is ready
$(document).ready(function(){
    // To scrape
    $("#scrape-btn").on("click", function(event){
        event.preventDefault();
        console.log("Inside scrape button");
        // Calling scrape api when scrape button is clicked
        $.ajax("/scrape", {
            type: "GET"
        }).then(function(data){
            console.log(data);
        })
    })

    // Add a note
    // $("#addNote-btn").on("click", function(event){
        $(document).on("click", "#addNote-btn", function(event){
        // event.preventDefault();
        console.log("Inside add a note button");
        $(".modal").modal("toggle");
    })

    // To view all scraped values
    // $("#view-btn").on("click", function(event){
    //     event.preventDefault();
    //     console.log("Inside view button");

    //     // API call to view all scraped details
    //     $.ajax("/dictionary", {
    //         type: "GET"
    //     }).then(function(data){
    //         console.log(data);
    //     })
    // })
})