$(document).ready(function() {

    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyBFsFBm0U8d1mNzxs64khxCxGDWBbgQqPU",
    authDomain: "group-project-1-6f6fd.firebaseapp.com",
    databaseURL: "https://group-project-1-6f6fd.firebaseio.com",
    projectId: "group-project-1-6f6fd",
    storageBucket: "group-project-1-6f6fd.appspot.com",
    messagingSenderId: "110990570117"
    };
    firebase.initializeApp(config);
    
    var database = firebase.database();
    


/********************* CALENDAR CODE *****************************/













 /******************* INPUT COLUMN CODE **************************/   
    //pressing submit pushes event title, date, and details to firebase
    $("#submitbtn").on("click", function(event) {
    
        event.preventDefault();
    
        //grab user input name, details, date
        var inputEvent = $("#input-events").val().trim();
        var inputDetails = $("#textarea1").val().trim();
        var inputDate = $("#inputDate").val().trim();
    
    
        //if blank, don't push. else push to firebase
        if (inputEvent === "") {
            return false;
    
        } else {
    
            //upload input text to database
            database.ref().push({
                event: inputEvent,
                detail: inputDetails,
                date: inputDate
            });
    
            //clear information in text fields
            $("#input-events").val("");
            $("#textarea1").val("");
            $("#inputDate").val("");
        }
    
    });
    
    
    //display the data pushed to firebase to calendar
    database.ref().on("child_added", function(childSnapshot) {
    
        //grab details
        var eventInputText = childSnapshot.val().event;
        var detailsInputText = childSnapshot.val().detail;
        var dateInputText = childSnapshot.val().date;
    
        //create new span variable
        var newList = $("<li>");
    
            newList.addClass("event-title");
            newList.append("<strong>" + eventInputText + "</strong><br>");
            newList.attr("title", detailsInputText);
    
        $("#" + dateInputText).append(newList);
    
    });
    
    
        
/********************* EVENTS API CODE *****************************/

















//end of document ready
});
    