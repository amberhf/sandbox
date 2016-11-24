var express = require('express');
var compress = require('compression');
var app = express();

// Use heroku configured port, or 5000 locally.
// You can change the local port if you wish
app.set('port', (process.env.PORT || 5000));

// gzip static content
app.use(compress());
app.set('view engine', 'ejs');
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


// Serve static content from the /public directory
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/stylesheets', express.static(__dirname + '/stylesheets'));

app.listen(app.get('port'), function() {
  console.log('Static HTTP app is running on port', app.get('port'));
});


