
var myHub = $.connection.myHub;

$.connection.hub.start()
   .done(function (d) {
       console.log(d)
       myHub.server.register($('#userID').val());
   })
   .fail(function (d) {
       console.error('Failed to connect to server!')
   });
