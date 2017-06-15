$('#submitScrape').on('click', function(){
  $.get("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + "<h2 data-id='" + data[i]._id + "'>" + data[i].title + "</h2>"  + "<h3>" + "<a href='" + data[i].link + "'>" + data[i].link + "</a>" +  "</p>");
    }
  });
});


$(document).on('click', 'h2', function(){

  // $('#comments').empty();

  var id = $(this).attr('data-id');
  console.log(id);
  $.ajax({
    method: 'GET',
    url: '/articles/' + id
  })

  .done(function(data){
    // console.log(data);


        $('#comments').append('<h2>' + data[0].title + "</h2>");

        $('#comments').append('<textarea id="bodyinput" name="body"></textarea>');

        $('#comments').append("<button data-id='" + data[0]._id + "' id='savecomment'>Save Comment</button>");
        $('#comments').append("<button data-id='" + data[0]._id + "'id='deletecomment'>Delete Comment</button>");

        if(data.comment){
          $('#bodyinput').val(data.comment.body);
        }
  });
});



$('#scrape').on('click', function(){
  $.get('/scrape', function(data){

  });
});
