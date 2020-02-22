
var myHub = $.connection.myHub;

$.connection.hub.start()
   .done(function (d) {
       console.error('Connected')
       console.error(d.id)

       myHub.server.register($('#userID').val());
   })
   .fail(function (d) {
       console.error('Failed to connect to server!')
   });
