const mysql2 = require('mysql2');
const fs = require('fs');


fs.readFile('db_config.json', (err, content) => {
    if(err){
        console.error(err);
        return;
    }
    try {
        db_conf = JSON.parse(content);
    } catch (ex) {
        console.error(err);
        return;
    }

    const con_p = mysql2.createConnection(db_conf).promise();

    // CREATE TABLE Books | INSERT INTO Books
    con_p.query(`CREATE TABLE IF NOT EXISTS Books(
                id int primary key auto_increment,
                id_author int not null,
                title varchar(255) not null,
                annotation text,
                year int not null,
                pages int not null,
                price double not null,
                cover_file varchar(64)
                ) engine=InnoDB default charset=utf8`)
        .then(() => {
            con_p.query(`INSERT INTO Books (id_author, title, annotation, year, pages, price, cover_file)
                    VALUES 
                    (1, 'Элегантность ежика', '123', 2007, 121, 115.95, 'Элегантность ежика.jpg'),
                    (2, 'Пригоди Тома Сойєра', '123', 2017, 178, 225.15, 'Пригоди Тома Сойєра.jpg'),
                    (3, 'Пока течет река', '123', 2002, 165, 162.55, 'Пока течет река.jpg'),
                    (4, 'Гобіт, або Туди і звідти', '123', 2012, 518, 315.68, 'Гобіт, або Туди і звідти.jpg')`)
                .then(() => {
                    console.log("Books OK");
                }).catch((err) => {
                    console.log(err);
                });
}).catch((err) => { console.log(err); });

    // CREATE TABLE Author | INSERT INTO Author
    con_p.query(`CREATE TABLE IF NOT EXISTS Author(
                id int primary key auto_increment,
                name varchar(100) not null,
                pseudo varchar(100) default null
                ) engine=InnoDB default charset=utf8`)
        .then((res) => {
        con_p.query(`INSERT INTO Author (name) VALUES 
                    ('Мюриель Барбери'),
                    ('Марк Твен'),
                    ('Диана Сеттерфилд'),
                    ('Джон Рональд Руэл Толкин')`)
        .then(() => { console.log("Authors OK"); }).catch((err) => { console.log(err); });
    }).catch((err) => { console.log(err); });

});

