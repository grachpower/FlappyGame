var http = require('http');
var url = require('url');
var static = require('node-static');
var file = new static.Server('.', {
    cache: 1
});

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: 'root',
    database: 'chickengame'
});
connection.connect();

function accept(req, res) {
    // console.log(req.url);

    var urlParsed = url.parse(req.url, true)
    // console.log(urlParsed);

    //get from client scores & username
    if (urlParsed.pathname == '/setUser'){
        res.end(" ");
        insertUser(urlParsed.query.name, urlParsed.query.score);
    }

    //send to client top 10 players
    if (urlParsed.pathname == '/getUsers'){
        selectUsers();
        setTimeout(function () {
            var topten = selectUsers.items;
            // console.log(topten);
            for (var i = 0; i < 1; i++){
                res.write(JSON.stringify(topten));
            }
            res.end();
        }, 350);
    }

    // if (req.url == '/CHICKEN/index.html') {
    //     selectUsers();
    //     file.serve(req, res);
    // }
    if (req.url == '/' || req.url == '/favicon.png') {
        selectUsers();
        if (req.url == '/'){
            req.url = "/CHICKEN/index.html";
            file.serve(req, res);
        };
        if (req.url == '/favicon.png'){
            req.url = "/CHICKEN/favicon.png";
            file.serve(req, res);
        };
    }
    if(req.url == "/assets/riders.mp3"){
        req.url = "/CHICKEN/assets/riders.mp3";
        file.serve(req, res);
    };
    if(req.url == '/phaser.js') {
        req.url = "/CHICKEN/phaser.js";
        file.serve(req, res);
    }
    if(req.url == '/assets/loader.png') {
        req.url = "/CHICKEN/assets/loader.png";
        file.serve(req, res);
    }
    if(req.url == '/newchicken.js') {
        req.url = "/CHICKEN/newchicken.js";
        file.serve(req, res);
    }
    if(req.url == "/assets/narutomini.png" || req.url == "/assets/ground.png" || req.url == "/assets/cloudnew.png" || req.url == "/assets/pipe2.png" || req.url == "/assets/button.png" || req.url == "/assets/scoreBack.png") {
        if (req.url == "/assets/narutomini.png"){
            req.url = "/CHICKEN/assets/narutomini.png";
            file.serve(req, res);
        }
        if (req.url == "/assets/ground.png"){
            req.url = "/CHICKEN/assets/ground.png";
            file.serve(req, res);
        }
        if (req.url == "/assets/cloudnew.png"){
            req.url = "/CHICKEN/assets/cloudnew.png";
            file.serve(req, res);
        }
        if (req.url == "/assets/pipe2.png"){
            req.url = "/CHICKEN/assets/pipe2.png";
            file.serve(req, res);
        }
        if (req.url == "/assets/button.png"){
            req.url = "/CHICKEN/assets/button.png";
            file.serve(req, res);
        }
        if (req.url == "/assets/scoreBack.png"){
            req.url = "/CHICKEN/assets/scoreBack.png";
            file.serve(req, res);
        }

    }

}
// ------ start server -------

if (!module.parent) {
    http.createServer(accept).listen(8080);
} else {
    exports.accept = accept;
}


function insertUser(name, score){
    var post = {user: '', score: ''};
    post.user = name;
    post.score = score;
    // console.log(post.user+"  "+post.score)
    // var allUsers = JSON.parse(selectUsers());
    var allUsers = selectUsers.items;
    // console.log(allUsers);

    if (!checkUserInDB(name, score, allUsers)){
        var query = connection.query('INSERT INTO userscores SET ?', post ,function (err, result) {});
        // console.log(query.sql);
    }
}

function updateUser(name, score){
    var query = connection.query('UPDATE `chickengame`.`userscores` SET `score`=? WHERE `user`=?', [score, name], function(err, result){});
    // console.log(query.sql);
}

function selectUsers(){
    var resulting;
    connection.query('SELECT * FROM userscores ORDER BY score DESC', function (err, result) {
        resulting = result;
    });
    setTimeout(function () {
        // console.log(resulting);
        selectUsers.items = resulting;
    }, 50);
}
selectUsers.items;

function checkUserInDB(name, score, allUsers){
    // console.log(allUsers);
    //  console.log(name);
    var user;
    for (var i = 0;i < allUsers.length; i++){
        user = allUsers[i];
        // console.log(user.user);
        if (user.user == name && user.score < score){
            updateUser(name, score);
            // console.log("true");
            return true;
        } else if(user.user == name && user.score >= score){
            // console.log("true");
            return true;
        } else{
            // console.log("false");
            // return false;
        }
    }
}