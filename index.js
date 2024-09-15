var express = require('express');
var path = require('path'); 
var app = express();

app.listen(8080, function(){
    console.log('server start on port 8080');
})




app.get('/', function(request, response){
    console.log(request.url);
    response.sendFile(path.join(__dirname, 'html/home.html'));
});

app.get('/news', function(request, response){
    console.log(request.url);
    response.sendFile(path.join(__dirname, 'html/news.html'));
});

app.get('/about', function(request, response){
    console.log(request.url);
    response.sendFile(path.join(__dirname, 'html/about.html'));
});


app.get('/login', function(request, response){
    console.log(request.url);
    response.sendFile(path.join(__dirname, 'html/login.html'));
});

app.get('/register', function(request, response){
    console.log(request.url);
    response.sendFile(path.join(__dirname, 'html/register.html'));
});