var url = 'http://api.openweathermap.org/data/2.5/forecast?q=philadelphia,us&appid=7e821b3220bf8808a333170a6ef0bce4';
var firebase_ref = firebase.database().ref();

$.getJSON(url,put_data_to_calendar);

var weather_icons = new Array();
var weather_conditions = new Array();
var weather_dates = new Array();

var weather_json;
var my_counter=0;

var add_weather_data = false;




function put_data_to_calendar(data)
{
    weather_json = data;
    var cur_date = data.list[0].dt_txt;
    var cur_date_array = cur_date.split(" ");
    cur_day_my = cur_date_array[0].split("-");
    weather_condition = data.list[0].weather[0].main;
    weather_icon = data.list[0].weather[0].icon;





    firebase_ref.on('value', snap=>{


        snap.forEach(function(childSnapshot){


            var key = childSnapshot.key;

            var childData = childSnapshot.val();
            
            

            $(".schedules").append("DATE = "+childData["date"]+" ");
            $(".schedules").append("EVENT = "+childData["event"]);

            $(".schedules").append("<br>");
        });




    });


    get_data_from_json();
    showCalendar(currentMonth, currentYear);
}


let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");



let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let monthAndYear = document.getElementById("monthAndYear");



function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {



            if (i === 0 && j < firstDay) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth) {
                break;
            }

            else {



                let img = document.createElement("IMG");

                img.setAttribute("src","./images/"+weather_json.list[my_counter].weather[0].icon+".png");
                img.setAttribute("width","20");
                img.setAttribute("height","20");


                let cell = document.createElement("td");
                let cellText;

                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth())
                {
                    cell.appendChild(img);
                    cellText = document.createTextNode(date+" "+weather_json.list[my_counter].weather[0].main);
                    my_counter++;
                    add_weather_data=true;
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




                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth())
                {
                    cell.classList.add("bg-info");

                } // color today's date

                cell.appendChild(cellText);
                row.appendChild(cell);

                date++;

            }


        }

        tbl.appendChild(row); // appending each row into calendar body.
    }

}


function get_data_from_json()
{
    for(var r =0;r<weather_json.list.length;r++)
    {
        var temp = weather_json.list[r].dt_txt;
        var date_array = temp.split(" ");
        var day = date_array[0].split("-");


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



