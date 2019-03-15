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
document.getElementById("date").value = getToday(currentYear, currentMonth, today.getDate());
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
    firebase_ref.on('value', snap=>{
        snap.forEach(function(childSnapshot){
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            if(events[childData["date"]]){
                events[childData["date"]] = events[childData["date"]]+"<br><span class='glyphicon glyphicon-calendar'></span>"+childData["event"];
            }else{
                events[childData["date"]] = childData["event"];
            }
        });
        resetVariable();
        get_data_from_json();
        showCalendar(currentMonth, currentYear);
    });
}
/*
* This function will trigger is clicked on next button
* */
function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    resetVariable();
    showCalendar(currentMonth, currentYear);
}
/*
 * This function will trigger is clicked on previous button
 * */
function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    resetVariable();
    showCalendar(currentMonth, currentYear);
}
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
                img.setAttribute("src","./images/"+weather_json.list[my_counter].weather[0].icon+".png");
                img.setAttribute("width","50");
                img.setAttribute("height","50");
                let cell = document.createElement("td");
                let EventT = document.createElement("p");
                let cellText;
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
                            img.setAttribute("src","./images/"+weather_icons[my_counter]+".png");
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
$("#form").submit(function(e){
    e.preventDefault();
    var date = $("#date").val();
    var event = $("#event").val();
    var firebase_ref = firebase.database().ref();
    firebase_ref.push ({
        date:date,
        event:event
    });
    $("#success").slideDown(function() {
        setTimeout(function() {
            $("#success").slideUp();
        }, 2000);
    });
    resetVariable();
    showCalendar(currentMonth, currentYear);
});