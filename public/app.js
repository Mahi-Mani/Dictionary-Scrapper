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
        // $("#exampleModalLabel"+id).text(data.note.name);
        $("input[data-value="+id+"]").val(data.note.name);
        $("textarea[data-text="+id+"]").val(data.note.body);
    })

}

// To delete from collection
$(document).on("click", "#del-btn", function(event){
    event.preventDefault();
    console.log("Inside delete button function");
    var id = $(this).data("id");
    $.ajax("/dictionary/del/" + id, {
        type: "PUT"
    }).then(function(data){
        // console.log(data);
        console.log("Delete");
        location.reload();
    })
})

// To delete all scraped details
$("#del-all-btn").on("click", function(event){
    event.preventDefault();
    console.log("Inside all delete button function");
    $.ajax("/dictionary/del/all", {
        type: "PUT"
    }).then(function(data){
        console.log(data);
        // console.log("Delete");
        // location.reload();
    })
})

    // Save
    $(document).on("click", "#saveNote-btn", function(event){
        event.preventDefault();
        console.log("inside save note button");
        var id = $(this).data("id");
        save(id);
    })

    function save(id){
        $.ajax("/dictionary/save/" + id, {
            type: "PUT"
        }).then(function(data){
            console.log(data);
            console.log("Saved");
            // location.reload();
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