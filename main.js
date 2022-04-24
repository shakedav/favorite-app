const favoritesRepository = require("./favorites")
const Promise = require('bluebird')
var express = require("express");
const router = require("./app");

function main() {
    favoritesRepository.createTable()
        .then(() => {
            var app = express();
            app.use(express.json());
            app.use(router);

            app.listen(3000, () => {
                console.log("Server running on port 3000");
            });      
        })    
}

main(); 

