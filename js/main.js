 alert("aaa");
var city = "philadelphia";
var key = "7e821b3220bf8808a333170a6ef0bce4";

$.ajax({

    url: 'api.openweathermap.org/data/2.5/weather',
    dataType: 'json',
    type: 'GET',
    data: {q:city,appid: key, units: 'metric'},
    
    success: function(data)
    {
         
        var html_data = '';
        
        $.each(data.weather,function(index,val){
            
            
            html_data+='<p><b>'+data.name+ "</b><img src="+val.icon +".png></p>"+data.main.temp + '&deg;C' + ' | ' + val.main + ", "+val.description
            
        });
        
        
        $(".result").html(html_data);
        
    }
    else
    {
  
}


});