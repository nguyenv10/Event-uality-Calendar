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
      // this javascript will read city, startdate, enddate from the user input
      // it will make a call to the Ticketmaster API and display a group of events
      // each event will have a event name, event date, event time, event venue, link to ticket information,
      // and an event image

      var apiKey = "Rr353U4OsbhsMLwSJCn4VqwWk1kAimY4";
      // This .on("click") function will trigger the AJAX Call to the TicketMaster API
      $("#find-event").on("click", function(event) {

        // event.preventDefault() can be used to prevent an event's default behavior.
        // Here, it prevents the submit button from trying to submit a form when clicked
        event.preventDefault();

        // Here we grab the city from the input box
        var cityName = $("#event-input").val().trim();
        // Here we grab the start date
        var searchStart = $("#event-start").val().trim();
        // Here we grab the end date
        var searchEnd = $("#event-end").val().trim();

        // hardcode the time to midnight
        var timeFormat = "T00:00:00Z";
        var startDate = "&startDateTime=" + searchStart + timeFormat;
        var endDate = "&endDateTime=" + searchEnd + timeFormat;

        // Here we construct our URL
        var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + apiKey + startDate+ endDate + "&city=" + cityName + "&countryCode=US";

        console.log(queryURL);

        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {


          // Cycle throgh all the events that are returned from the query
          var numEvents = response._embedded.events.length;
          for ( var i = 0;  i < numEvents; i++)
          {

            // get the name of the event
            var eventName = response._embedded.events[i].name;
            // var pName = $("<p>").text(eventName);
            // $("#event-view").append(pName);

            // get the date and time of the event
            var eventDate = response._embedded.events[i].dates.start.localDate;
            // var pDate = $("<p>").text(eventDate);
            // $("#event-view").append(pDate);

            var eventTime = response._embedded.events[i].dates.start.localTime;
            // var pTime = $("<p>").text(eventTime);
            // $("#event-view").append(pTime);

            // Get a nicer view of the date
            var dateFormat = "yyyy-mm-dd";
            var prettyDate = moment(eventDate, dateFormat).format('MMMM Do YYYY');
            console.log("The date is " +  eventDate    );
            console.log("The pretty date is " + prettyDate);
            var timeFormat = "hh:mm:ss";
            var prettyTime = moment(eventTime, timeFormat).format('h:mm a');

            // the venue of the event
            var venueName = response._embedded.events[i]._embedded.venues[0].name;
            // var pVenue = $("<p>").text(venueName);
            // $("#event-view").append(pVenue);

            // get the url of the event
            var eventURL = response._embedded.events[i].url;
            // var aEvent = $("<a>").text(eventURL);
            // aEvent.attr("href", eventURL);
            // aEvent.attr("target", "_blank")
            // $("#event-view").append(aEvent);

            // get the url of the image
            // we need to find the image with the 4-3 ratio
            var eventRatio = "";
            var eventImage = "";
            var conditionNotMet = true;
            var j = 0;
            var imagesLength = response._embedded.events[i].images.length;
//               for (var j= 0; j < imagesLength; j++)
            // cycle through all the images for this event until you find the image with a 4-3 ratio
            while (conditionNotMet)
            {
                eventRatio = response._embedded.events[i].images[j].ratio.trim();
                if (eventRatio === "4_3"){
                   eventImage = response._embedded.events[i].images[j].url;
                   conditionNotMet = false;
                }
                j++;
                if (j===imagesLength) {
                  // you've cycled through all the images and didn't find what you need
                  // set the image to a default url
                  eventImage = "https://lorempixel.com/250/250/nature/1";
                }
            }

            // Now build the carousel
  //           <a class="carousel-item" href="#one!">      
  //   <div class="card">
  //     <div class="card-image">
  //       <img src="https://lorempixel.com/250/250/nature/2">
  //       <span class="card-title">Card Title</span>
  //     </div>
  //     <div class="card-content">
  //         <p> Lincoln Financial Field </p> <p>10-31-2019 7:00</p>
  //         <button class="btn-small waves-effect waves-light blue lighten-2" type="submit" name="action"><i class="material-icons right">add</i>Add to cal</button>
  //       <button class="btn-small waves-effect waves-light blue lighten-2" type="submit" name="action">More Info</button>                        
  //     </div>
  //   </div>
  // </a>


            // Now place the image in the carousel

            // build the <a class="carousel-item" href="#one!">
            //HLS note you could hook this up to the url using href
            var aImage = $("<a>");
            aImage.attr("class", "carousel-item");
            aImage.attr("href", eventURL);
            aImage.attr("target", "_blank");
            // aImage.attr("href", "#one");
            $("#image-view").append(aImage);
            // build the <div class="card">
            var cDiv = $("<div>");
            cDiv.addClass("card");
            aImage.append(cDiv);
            //build the <div class="card-image">
            var ciDiv = $("<div>");
            ciDiv.addClass("card-image");
            cDiv.append(ciDiv);
            // build the <img src="https://lorempixel.com/250/250/nature/2">
            var hImage = $("<img>");
            hImage.attr("src", eventImage);
            ciDiv.append(hImage);
            // build the <span class="card-title">Card Title</span>
            var cTitle = $("<span>");
            cTitle.addClass("card-title");
            cTitle.text(eventName);
            ciDiv.append(cTitle);
            // build the <div class="card-content">
            var ccDiv = $("<div>");
            ccDiv.addClass("card-content");
            cDiv.append(ccDiv);
            // build the <p> Lincoln Financial Field </p> <p>10-31-2019 7:00</p>
            var pVenue = $("<p>");
            pVenue.text(venueName);
            var pDate = $("<p>");

            pDate.text(prettyDate + ",  " + prettyTime);
            ccDiv.append(pVenue, pDate);

            //<button class="btn-small waves-effect waves-light blue lighten-2" type="submit" name="action"><i class="material-icons right">add</i>Add to cal</button>
            var addButton = $("<button>");
            addButton.addClass("btn-small waves-effect waves-light blue lighten-2");
            addButton.attr("type", "submit");
            addButton.attr("name", "action");
            addButton.attr("id", "addToCal");

            // add meta data to the button
            addButton.attr("data-name", eventName);
            addButton.attr("data-url", eventURL);
            addButton.attr("data-date", eventDate);
            addButton.text("ADD TO CAL")
            ccDiv.append(addButton);

            var imageSpan = $("<i>");
            imageSpan.addClass("material-icons right");
            imageSpan.text("add");
            addButton.append(imageSpan);

            //<button class="btn-small waves-effect waves-light blue lighten-2" type="submit" name="action">More Info</button>                        
            var addButton = $("<button>");
            addButton.addClass("btn-small waves-effect waves-light blue lighten-2");
            addButton.attr("type", "submit");
            addButton.attr("name", "action");
            addButton.text("MORE INFO")
            ccDiv.append(addButton);




            // aImage.append(hImage);
            // $("#image-view").append(aImage);

            // var hImage = $("<img>");
            // hImage.attr("src", eventImage);
            // $("#event-view").append(hImage);
          } //end of for loop
          // Now that carousel is populated call this function to display
          $('.carousel').carousel();

        //   // append the full json reponse
        //   var pJSON = $("<p>");
        //   pJSON.text(JSON.stringify(response));
        // //   $("#event-view").text(JSON.stringify(response));
        // $("#event-view").append(pJSON);


        });// end of AJAX then call
    
      }); //end of on click call
      
      // HLS want to display the caurousel that I am testing with, this is temporary
      $('.carousel').carousel();

        $(document).on("click.", "#addToCal", function(event){
            // date in unix
            //write to database
            event.preventDefault();

            var thisName = $(this).attr("data-name");
            var thisURL = $(this).attr("data-url");
            var thisDate = $(this).attr("data-date");

            console.log( "the name is " + thisName);
            console.log( "the url is " + thisURL);
            console.log( "the date is " + thisDate);

            //upload input text to database
            database.ref().push({
                event: thisName,
                detail: thisURL,
                date: thisDate
            });


        
        });













//end of document ready
});
    