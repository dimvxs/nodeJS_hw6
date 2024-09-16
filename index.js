var express = require('express');
var path = require('path'); 
var fs = require('fs');
var querystring = require('querystring')
var app = express();



app.post('/submit', function(request, response){
    if (request.url == "/submit" && request.method == "POST") 
        {
            var filePath = './storage.txt';
            let storage = '';

            request.on('data', buffer =>{
                storage += buffer.toString();
            })

            request.on('end', () => {
                // Парсинг данных из запроса
                console.log('Data received:', storage);
                var query = querystring.parse(storage);
                var body = JSON.stringify(query); 

            fs.writeFile(filePath, body, (err) => {
                if(err) throw err;
            });
         

            fs.readFile(filePath, function (err, data) { 

                // обработка ошибок
                if (err) {
                    console.log(err);
                    response.writeHead(404, { 'Content-Type': 'text/plain' });
                    response.write('Not Found!');

                } else {
                    response.writeHead(200, { 'Content-Type': 'text/html' }); 
                    // записать в ответ содержимое читаемого файла 
                    response.write(data.toString());
                    response.write('success!');
                    
                    console.log(`success!`);

                }

                response.end();
            });

        });
    }

        else
            {
                var pathFile = path.join(__dirname, 'html', 'index.html');
        
                fs.readFile(pathFile, function(err, data){
                    if(err){
                        console.log(err);
                        responce.writeHead(404, { 'Content-Type' : 'text/html'});
                        responce.end('Not Found!');
                    }
                    else{
                        responce.writeHead(200, { 'Content-Type' : 'text/html'});
                        responce.write(data.toString());
                        responce.end();
                    }
                })
            }

})



app.listen(8080, function(){
    console.log('server start on port 8080');
});



app.get('/category/:categoryId/product/:productId', function(request, response) {
    var filePath = 'data.txt';
    
    fs.readFile(filePath, 'utf8', function (err, data) { 
        if (err) {
            console.log(err);
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.write('File not found!');
            response.end();
            return;
        }
        
        var buffer = JSON.parse(data);
        var productId = request.params['productId'];  
        var product = buffer.find(item => item.modelCode === productId);

        if (product) {
            console.log(`category: ${request.params['categoryId']}`);
            console.log(`product: ${request.params['productId']}`);

            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.send(`
                <p>Name: ${product.name}</p>
                <p>Price: ${product.price}</p>
                <p>Model code: ${product.modelCode}</p>
            `);
        } else {
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.write(JSON.stringify({ message: 'Product not found!' }));
        }

        response.end();
    });
});




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
