


/*
playersRef.push ({

    Name:"Quetta Express",
    Destination:"Quetta",
    Frequency:25,
    "Firsttrain":"5:30",

});

playersRef.push ({

    Name:"Jafer Express",
    Destination:"Islamabad",
    Frequency:15,
    "Firsttrain":"6:30",

});
*/





$("#form").submit(function(e){

   
    e.preventDefault();

$(".schedules").html("");
    var date = $("#date").val();
    var event = $("#event").val();




    var firebase_ref = firebase.database().ref();

    firebase_ref.push ({

        date:date,
        event:event,

    });
    
   




});

