var express = require('express');
var app = express();

// Use heroku configured port, or 5000 locally.
// You can change the local port if you wish
app.set('port', (process.env.PORT || 5000));

/*****************************\
| DO NOT REMOVE THIS FUNCTION |
\*****************************/
app.use(function(request, response, next) {
  var ipAddr = request.headers["x-forwarded-for"];
  if (ipAddr){
    var list = ipAddr.split(",");
    ipAddr = list[list.length-1];
  } else {
    ipAddr = request.connection.remoteAddress;
  }
  // Allow access to labs 
  if (ipAddr === process.env.LABS_IP || ipAddr === '::1') {
    next();
  } else {
    response.status(403);
    response.send('Direct access forbidden');
    response.end();
  }
})
/*****************\
| OK, CARRY ON... |
\*****************/

// Serve static content from the /public directory
app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'), function() {
  console.log('Static HTTP app is running on port', app.get('port'));
});


