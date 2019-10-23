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

    // Add a note button triggering a modal
        $(document).on("click", "#addNote-btn", function(event){
        // event.preventDefault();
        var id = $(this).data("id");
        console.log("Inside add a note button");
        $("#" + id).modal("toggle");
        console.log("Add note button id : " + id);
        addNote(id);
    })

    // View note commented by user
    $(document).on("click", "#viewNote-btn", function(event){
        event.preventDefault();
        console.log("inside view note button");
        var id = $(this).data("id");
        viewNote(id);
    })

    // Function to add a note post notes to collections
    function addNote(id){
        $("#" + id).on("click", function(event){
            event.preventDefault();
            console.log("add note clicked with id : " + id);
            var name = $("input[data-value="+id+"]").val();
            var body = $("textarea[data-text="+id+"]").val();
            console.log(name);
            console.log(body);

            $.ajax("/dictionary/" + id,{
                type: "POST",
                data: {
                    name: name,
                    body: body
                }
            }).then(function(data){
                console.log(data);
            })
        })
    }

    // Route to get notes commented by user
    function viewNote(id){

    $.ajax("/dictionary/" + id, {
        type: "GET"
    }).then(function(data){
        console.log(data);
        $("#" + id).modal("toggle");
        $("#exampleModalLabel"+id).text(data.note.name);
        $("#exampleModalLabel1"+id).text(data.note.body);
    })

}


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