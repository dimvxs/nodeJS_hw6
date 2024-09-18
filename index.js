var express = require('express');
var path = require('path'); 
var fs = require('fs');
var querystring = require('querystring')
var app = express();
var router = express.Router();
var router1 = express.Router();



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

                } else {
                    response.writeHead(200, { 'Content-Type': 'text/html' }); 
                    // записать в ответ содержимое читаемого файла 
                    response.write(data.toString());
                    
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
                    }
                    else{
                        responce.writeHead(200, { 'Content-Type' : 'text/html'});
                        responce.write(data.toString());
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
            return;
        }
        
        var buffer = JSON.parse(data);
        var productId = request.params['productId'];  
        var product = buffer.find(item => item.id === productId);

        if (product) {
            console.log(`category: ${request.params['categoryId']}`);
            console.log(`product: ${request.params['productId']}`);

            response.send(`
                <p>Name: ${product.name}</p>
                <p>Price: ${product.price}</p>
                <p>Model code: ${product.modelCode}</p>
                 <p>ID: ${product.id}</p>
            `);
        } else {
            response.writeHead(404, { 'Content-Type': 'text/html' });
        }

    
    });
});

app.use(function(request, responce, next){
var loggerPath = 'logger.txt';
var data = `Adress: ${request.ip}; Time: ${new Date().toDateString()}; URL: ${request.url} \n`;
fs.appendFile(loggerPath, data, function(err){
    console.log('data wrote');
    next();
})

});

router.route("/")
            .get(function(request, response){     
                var filePath = 'data.txt';
                fs.readFile(filePath, 'utf8', function(err, data) { 
                    if (err) {
                        console.log(err);
                        response.writeHead(404, { 'Content-Type': 'text/plain' });
                        return;
                    }
                
                    
                    var products = JSON.parse(data);
                

                    response.send(`
                           
                           ${products.map(product => `
                        <p>Name: ${product.name}</p>
                        <p>Price: ${product.price}</p>
                        <p>Model code: ${product.modelCode}</p>
                         <p>ID: ${product.id}</p> <hr>`)}
                        
                    `);
                 
            });
        })
            .post(function(request, response){
                response.send("Product created. POST method.");
            });



            router.route("/:id")
            .get(function(request, response){
                var filePath = 'data.txt';

                fs.readFile(filePath, 'utf8', function(err, data) { 
                    if (err) {
                        console.log(err);
                        response.writeHead(404, { 'Content-Type': 'text/plain' });
                        return;
                    }
                
                    
                    var products = JSON.parse(data);
                    var productId = request.params.id; // переменной productId присваивается значение параметра маршрута id, который передается в URL запроса
                    var product = products.find(p => p.id === productId);

                    if(product){
                        response.send(`
                           
                           
                         <p>Name: ${product.name}</p>
                         <p>Price: ${product.price}</p>
                         <p>Model code: ${product.modelCode}</p>
                          <p>ID: ${product.id}</p> <hr>`)
                         
             
                    }
                    else {
                        // Если продукт не найден, отправляем ошибку 404
                        response.writeHead(404, { 'Content-Type': 'text/html' });
                        response.end(`<h1>Product with ID ${productId} not found</h1>`);
                    }
                })
               
                
            });

app.use("/products", router);



router1.route('/')
.get(function(request, response){
    var filePath = 'categories.txt';
    fs.readFile(filePath, 'utf8', function(err, data) { 
        if (err) {
            console.log(err);
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            return;
        }
    
        
        var categories = JSON.parse(data);
    

        response.send(`
               
               ${categories.map(category => `
            <p>Name: ${category.name}</p>
           <hr>`)}
            
        `);
    });
     
});




router1.route('/:id')
.get(function(request, response){
    var filePath = 'categories.txt';

    fs.readFile(filePath, 'utf8', function(err, data) { 
        if (err) {
            console.log(err);
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            return;
        }
    
        
        var categories = JSON.parse(data);
        var categoryId = request.params.id; // переменной productId присваивается значение параметра маршрута id, который передается в URL запроса
        var category = categories.find(c => c.id === categoryId);

        if(category){
            response.send(`
               
               
             <p>Name: ${category.name}</p> <hr>`)
             
 
        }
        else {
            // Если продукт не найден, отправляем ошибку 404
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end(`<h1>Category with ID ${categoryId} not found</h1>`);
        }
    })
   
    
});

app.use('/category', router1);

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
