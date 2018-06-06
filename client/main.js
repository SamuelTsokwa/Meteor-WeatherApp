import { Template } from 'meteor/templating';

import './main.html';



var test;


Session.setDefault('page', 'process');

Template.body.helpers({
        currentPage: function(page){
            return Session.get('page');
        }
    })
Template.process.helpers({
            currentPage: function(page){
                return Session.get('page');
            }
        })

Template.body.events({
/*
        'click #submit': function(event, template){
              Session.set('page', event.currentTarget.getAttribute('data-page'))
              },
*/
        'click #return': function(event, template){
              Session.set('page', event.currentTarget.getAttribute('data-page'))
            }
        })


Template.process.onRendered(function(){
  $(document).ready(function(){

    var options = {
    types: ['(cities)'],
    //componentRestrictions: {country: "us"}
    };
    var input = document.getElementById('city');
    var autocomplete = new google.maps.places.Autocomplete(input,options);

    });
});

   //google.maps.event.addDomListener(window, 'load', initialize);

//})




Template.process.events({

      'click #submit': function (event, template){

        //get city value and check its not empty
        var input = document.querySelector('#city').value;

        var country = input.substring(input.indexOf(",")+2,input.length);



        if(input !== "" )
        {
        event.preventDefault();
        document.querySelector('#error').style.visibility = "hidden" ;
        photologic(input);
        weatherlogic(input);
        document.querySelector('#city').value = "";
        Session.set('page', event.currentTarget.getAttribute('data-page'))
        }

        else{
          console.log("input needed");
          document.querySelector('#error').style.visibility = "visible" ;
        }

      },


});




function weatherlogic(city){
  //logic for Weather, including api call
  var searchtext = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + city + "') and u='c'"
  $.ajax({

    url: 'https://query.yahooapis.com/v1/public/yql?q=' + searchtext + "&format=json",
    type: "GET",
    dataType: "jsonp",
    success: function(data){
      console.log(data);
      var widget = display(data);
      $("#display").html(widget);

    }
});
}



function photologic(city){
  var apiKey = 'fcp86x7kdcubumpz6c8mx79m';

$.ajax({
url: 'https://api.gettyimages.com/v3/search/images?fields=display_set&file_types=jpg&minimum_size=x_large&phrase=' + city,
type: "GET",
beforeSend: function (request) {
        request.setRequestHeader('Api-Key', apiKey);
      },
success: function(data)
{
  var url = data.images[0].display_sizes[0].uri;
  console.log(url);
  $(".container").css("background-image" , "url(" + url + ")");
}
});
}

function display(data){

  return  "<h1 id = temp >" + data.query.results.channel.item.condition.temp +"&deg;c</h1 <br/>"+
          "<h1 id = name >" + data.query.results.channel.location.city +","+ data.query.results.channel.location.country +"</h1 <br/>"+
          "<h1 id = hum >" + data.query.results.channel.item.condition.text +"</h1 <br/>"+
          "<h1 >" + data.query.results.channel.item.condition.temp +"&deg;c</h1 <br/>"

  ;


}
