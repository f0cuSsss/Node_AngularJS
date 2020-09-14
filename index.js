const fs = require('fs');
const http = require('http');
const mysql2 = require('mysql2');

fs.readFile('db_config.json', (err, data) => {
    if(err){
        console.log(err);
        return;
    }
    try{
        db_conf = JSON.parse(data);
        con_p = mysql2.createPool(db_conf).promise();
    } catch (ex) {
        console.error(err);
        return;
    }
    http.createServer(httpContext).listen(80);
    console.log("Server is working...");
});


const httpContext = (request, response) => {
        const fname = decodeURI(request.url.substr(1));
        console.log(fname);
        if(fs.existsSync(fname)){

            fs.readFile(fname, (err, data) => {
                if(err){
                    console.error(err);
                    response.writeHead(404);
                    response.end();
                    return;
                }
                response.writeHead(200);
                response.end(data);

            });
            return;
        }

/*
    if(request.url.toLowerCase() == "/api/books"){
        //const con_p = mysql2.createConnection(db_conf).promise();
        con_p.query("SELECT * FROM Books b JOIN Author a on b.id_author = a.id")
            .then(([data, columns]) => {
                //console.log(data);
                var str = JSON.stringify(data);
                response.writeHead(200);
                response.end(str);
            })
            .catch((err) => { console.log(err) });
        return;
    }
    else
        */
        if(request.url.indexOf("/api/books") == 0){

            var booksPart = 2;
            var partNumber = parseInt(request.url.substr(11));
            if(isNaN(partNumber)) return;

            var offset = booksPart * (partNumber - 1);

        console.log(offset);


        con_p.query(`
            SELECT * 
            FROM 
            Books b 
            JOIN 
            Author a on b.id_author = a.id
            LIMIT ${offset}, ${booksPart}
        `)
            .then(([data, columns]) => {
                //console.log(data);
                var str = JSON.stringify(data);
                response.writeHead(200);
                response.end(str);
                //con_p.end();
            })
            .catch((err) => { console.log(err) });


        return;
    }
    else{
        response.writeHead(404);
        response.end();
    }

}


