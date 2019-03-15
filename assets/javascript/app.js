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
    




/************* modal alerts *********************/
// Get the modal
var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

/*********NAV BAR **************************************/
var txtEmail = document.getElementById("txtEmail");
var txtPassword = document.getElementById("txtPassword");
var btnLogin = document.getElementById("btnLogin");
var btnSignUp = document.getElementById("btnSignUp");
var btnLogout = document.getElementById("btnLogout");
var loginName = document.getElementById("loginName");

//grab current user's ID 
var userId = "Anon";

function reloadpage() {
    window.location.reload()
}

//Add login event
btnLogin.addEventListener("click", e => {

    //Get email and password
    var email = txtEmail.value;
    var pass = txtPassword.value;
    var auth = firebase.auth();

    //Sign in
    var promise = auth.signInWithEmailAndPassword(email, pass);
    //promise.catch(e => alert(e.message));
    promise.catch(e => modal.style.display = "block");
});

//Add signup
btnSignUp.addEventListener("click", e => {

    //Get email and password
    // TODO: check for real email
    var email = txtEmail.value;
    var pass = txtPassword.value;
    var auth = firebase.auth();

    //Sign in
    var promise = auth.createUserWithEmailAndPassword(email, pass);
    //promise.catch(e => alert(e.message));
    promise.catch(e => modal.style.display = "block");
})

//event listener for logout
btnLogout.addEventListener("click", e => {
    firebase.auth().signOut();
});

//realtime listener as authentication changes. show or hide buttons 
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        console.log(firebaseUser);
        btnLogout.classList.remove("d-none");
        loginName.classList.remove("d-none");
        btnLogin.classList.add("d-none");
        btnSignUp.classList.add("d-none");
        txtEmail.classList.add("d-none");
        txtPassword.classList.add("d-none");
        document.getElementById("loginName").innerHTML = firebaseUser.email;
        userId = firebaseUser.uid;
        console.log(userId);
    } else {
        console.log("not logged in");
        btnLogout.classList.add("d-none");
        loginName.classList.add("d-none");
        btnLogin.classList.remove("d-none");
        btnSignUp.classList.remove("d-none");
        txtEmail.classList.remove("d-none");
        txtPassword.classList.remove("d-none");   
    }
});







/********************* CALENDAR CODE *****************************/

var url = 'http://api.openweathermap.org/data/2.5/forecast?q=philadelphia,us&appid=7e821b3220bf8808a333170a6ef0bce4';
var firebase_ref = firebase.database().ref();
$.getJSON(url,prepareCalendarData);
//Will store all the icon provided by API.
var weather_icons = new Array();
var weather_conditions = new Array();
//Will store all the date which have weather report.
var weather_dates = new Array();
//Will store the json info sent by API.
var weather_json;
var my_counter = 0;
//Will store all the event stored in the database.
var events = new Array();
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//Will put the calender title month year - i.e Mar 2019
let title = document.getElementById("title");

var add_weather_data = false;
/*
 * This function will reset all the necessary variable
 */
function resetVariable(){
    my_counter = 0;
    add_weather_data = false;
    weather_dates.length = 0;
    weather_conditions.length = 0;
    weather_icons.length = 0;
    events.length = 0;
    get_data_from_json();
}
/*
 * This function will trigger after data provided by API
 * It will also fetch all the events and listed in an array
 * */
function prepareCalendarData(data){
    weather_json = data;
    get_data_from_json();
    showCalendar(currentMonth, currentYear);
   
    resetVariable();
    get_data_from_json();
    showCalendar(currentMonth, currentYear);
}
/*
* This function will trigger is clicked on next button
* */

$("#next").on("click", function() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    resetVariable();
    showCalendar(currentMonth, currentYear);
});
/*
 * This function will trigger is clicked on previous button
 * */
$("#previous").on("click", function() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    resetVariable();
    showCalendar(currentMonth, currentYear);
});
/*
 * This function prepare date using the provided year month and date
 * */
function getToday(year, month, day){
    let Y = year, M = month+1, D = day;
    if(M < 10) {
        M = '0'+M;
    }
    if(D < 10) {
        D = '0'+D;
    }
    return Y+'-'+M+'-'+D;
}
/*
* This function will generate the calendar
* */
function showCalendar(month, year) {
    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();
    let tbl = document.getElementById("calendar-body"); // body of the calendar
    // clearing all previous cells
    tbl.innerHTML = "";
    // filing data about month and Year in the page via DOM.
    title.innerHTML = months[month] +"<br><span style='font-size:18px'>"+year+"</span>";
    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");
        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            let dateToday = getToday(year, month, date);
            if (i === 0 && j < firstDay) {
                //if this day is not for this month
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth) {
                //if the day is greater than this month
                break;
            }
            else {
                //if this day is within this month
                let img = document.createElement("IMG");
                img.setAttribute("src","assets/images/"+weather_json.list[my_counter].weather[0].icon+".png");
                img.setAttribute("width","50");
                img.setAttribute("height","50");
                let cell = document.createElement("td");
                let EventT = document.createElement("p");
                let cellText;

                // add ID tag to each day of format 2019-03-22
                // We have to add 1 to the month because selectMonth is [0-11]
               var attrID = year + "-" + (parseInt(month) + 1) + "-" + date;     //2019-03-22
               var newDate = moment(attrID, "YYYY-MM-DD").format("YYYY-MM-DD");

               console.log(newDate);
               cell.setAttribute("id", newDate);
           


                if(events[dateToday]){
                    EventT.innerHTML = "<br><span class='glyphicon glyphicon-calendar'></span>"+events[dateToday];
                    cell.classList.add("bg-event");
                }
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth())
                {
                    //if this day is today
                    cell.appendChild(img);
                    cellText = document.createTextNode(date+" "+weather_json.list[my_counter].weather[0].main);
                    my_counter++;
                    add_weather_data=true;
                    cell.classList.add("bg-info");
                }
                else
                {
                    if(add_weather_data)
                    {
                        if(weather_conditions[my_counter])
                        {
                            img.setAttribute("src","assets/images/"+weather_icons[my_counter]+".png");
                            img.setAttribute("width","20");
                            img.setAttribute("height","20");
                            cell.appendChild(img);
                            cellText = document.createTextNode(date+" "+weather_conditions[my_counter]);
                        }
                        else
                        {
                            cellText = document.createTextNode(date);
                        }
                        my_counter++;
                    }
                    else
                    {
                        cellText = document.createTextNode(date);
                    }
                }
                cell.appendChild(cellText);
                cell.appendChild(EventT);
                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row); // appending each row into calendar body.
    }
}
/*
* This function will prepare the data sent by the weather API
* */
function get_data_from_json() {
    //Loop through the list of data
    for(var r =0;r<weather_json.list.length;r++)
    {
        //Date in string
        var temp = weather_json.list[r].dt_txt;
        var date_array = temp.split(" ");
        var day = date_array[0].split("-");
        //if the day not listed
        if(day[2] != weather_dates[weather_dates.length-1])
        {
            var temp_condition = weather_json.list[r].weather[0].main;
            var temp_icon = weather_json.list[r].weather[0].icon;
            weather_dates.push(day[2]);
            weather_conditions.push(temp_condition);
            weather_icons.push(temp_icon);
        }
    }
}






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
                userId: userId,
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
    
        var userData = childSnapshot.val();
        /**
        //grab details
        var eventInputText = childSnapshot.val().event;
        var detailsInputText = childSnapshot.val().detail;
        var dateInputText = childSnapshot.val().date;
        **/

        if (userData.userId === userId) {
            //create new span variable
            var newList = $("<li>");
        
                newList.addClass("event-title");
                newList.append("<strong>" + userData.event + "</strong><br>");
                newList.attr("title", userData.detail);
        
            $("#" + userData.date).append(newList).addClass("bg-event");
        } else {
            return false;
        }
    });
    
    
        
/********************* EVENTS API CODE *****************************/
      // this javascript will read city, startdate, enddate from the user input
      // it will make a call to the Ticketmaster API and display a group of events
      // each event will have a event name, event date, event time, event venue, link to ticket information, and an event image

      var apiTwoKey = "Rr353U4OsbhsMLwSJCn4VqwWk1kAimY4";
      // This .on("click") function will trigger the AJAX Call to the TicketMaster API
      $("#find-event").on("click", function(event) {

        // event.preventDefault() can be used to prevent an event's default behavior.
        // Here, it prevents the submit button from trying to submit a form when clicked
        event.preventDefault();

        // Empty any past searches
        $("#image-view").empty();
        // Empty any past error messages
        $("#errorMsg").empty();


        var cityName = $("#event-input").val().trim();
        // Here we validate the city from the input box
        if (( cityName === "") || ( cityName === undefined)){
            $("#errorMsg").text("Please enter a city.")
            return false;
          } // check the city is not numeric
           else if ( $.isNumeric( cityName ) ){
            $("#errorMsg").text("Please enter a valid city.")
            return false;
          }
        

        // Here we grab the start date
        var userSearchStart = $("#event-start").val().trim();
        // need to change to the format for the api
        var apiFormat = "YYYY-MM-DD";
        var searchStart = moment(userSearchStart, "ll").format(apiFormat);
        console.log("the search start is " + searchStart);

        // Here we grab the end date
        var userSearchEnd = $("#event-end").val().trim();
        // need to change to the format for the api
        var searchEnd =  moment(userSearchEnd, "ll").format(apiFormat);
        console.log("the search end is " + searchEnd);

        // hardcode the time to midnight
        var timeFormat = "T00:00:00Z";
        var startDate = "&startDateTime=" + searchStart + timeFormat;
        var endDate = "&endDateTime=" + searchEnd + timeFormat;

        // Here we construct our URL
        var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + apiTwoKey + startDate+ endDate + "&city=" + cityName + "&countryCode=US";

        console.log(queryURL);

        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {

          // Need to check for a valid response here
          if (response.page.totalElements === 0)
          {
            $("#errorMsg").text("This search did not find any results.")
            return false;
          }

          // Cycle throgh all the events that are returned from the query
          var numEvents = response._embedded.events.length;
          for ( var i = 0;  i < numEvents; i++)
          {

            // get the name of the event
            var eventName = response._embedded.events[i].name;

            // get the date and time of the event
            var eventDate = response._embedded.events[i].dates.start.localDate;
            var eventTime = response._embedded.events[i].dates.start.localTime;

            // Get a nicer format for the date and time
            var dateFormat = "YYYY-MM-DD";
            // var prettyDate = moment(eventDate, dateFormat, true).format('MMMM Do YYYY');
            var prettyDate = moment(eventDate, dateFormat, true).format('ll');

            console.log("The date is [" +  eventDate + "]"   );
            console.log("The pretty date is [" + prettyDate + "]");
            var timeFormat = "hh:mm:ss";
            var prettyTime = moment(eventTime, timeFormat).format('h:mm a');

            // the venue of the event
            var venueName = response._embedded.events[i]._embedded.venues[0].name;

            // get the url of the event
            var eventURL = response._embedded.events[i].url;

            // get the url of the image
            // we need to find the image with the 4-3 ratio
            var eventRatio = "";
            var eventImage = "";
            var conditionNotMet = true;
            var j = 0;
            var imagesLength = response._embedded.events[i].images.length;
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
                //   eventImage = "https://lorempixel.com/250/250/nature/1";
                  eventImage = "assets/images/the-road-815297_640.jpg";
                }
            }

            // Now build the carousel

            // build the <a class="carousel-item" href="#one!">
            var aImage = $("<a>");
            aImage.attr("class", "carousel-item");
            aImage.attr("href", eventURL);
            aImage.attr("target", "_blank");
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

            // build the <button class="btn-small waves-effect waves-light blue lighten-2" type="submit" name="action"><i class="material-icons right">add</i>Add to cal</button>
            var addButton = $("<button>");
            addButton.addClass("btn-small waves-effect waves-light blue lighten-2 card-button");
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
            imageSpan.attr("id", "iCard");
            imageSpan.text("add");
            addButton.append(imageSpan);

            // build the <button class="btn-small waves-effect waves-light blue lighten-2" type="submit" name="action">More Info</button>                        
            var addButton = $("<button>");
            addButton.addClass("btn-small waves-effect waves-light blue lighten-2 card-button");
            addButton.attr("type", "submit");
            addButton.attr("name", "action");
            addButton.text("MORE INFO")
            ccDiv.append(addButton);

          } //end of for loop
          // Now that carousel is populated call this function to display
          $('.carousel').carousel();

        });// end of AJAX then call
    
      }); //end of on click call
      
      // HLS want to display the caurousel that I am testing with, this is temporary
      //   $('.carousel').carousel();

      $('.datepicker').datepicker();
        // val dpicker = $('.datepicker');
        // dpicker.datepicker();
        // this.instanceDatepicker = new M.Datepicker(this.elDatepicker.nativeElement, {
        //     defaultDate: new Date(),
        //     setDefaultDate: true,
        //     selectMonths: true,
        //     selectYears: 200, 
        //     format: "dd/mm/yyyy"
        // });

        $(document).on("click.", "#addToCal", function(event){

            event.preventDefault();

       
            // get the meta data from the button's attributes
            var thisName = $(this).attr("data-name");
            var thisURL = $(this).attr("data-url");
            var thisDate = $(this).attr("data-date");

            console.log( "the name is " + thisName);
            console.log( "the url is " + thisURL);
            console.log( "the date is " + thisDate);

            //upload event data to database
            database.ref().push({
                userId: userId,
                event: thisName,
                detail: thisURL,
                date: thisDate
            });
        
        });






//for jump to selecting a month and year
$('select').formSelect();





//end of document ready
});