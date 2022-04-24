const express = require('express');
const router = express.Router();
router.use(express.json());
const cors = require('cors');
router.use(cors({
    origin: 'http://localhost:4201'
}));
const favoritesRepository = require("./favorites");
const URL = 'https://itunes.apple.com/lookup?id=94804&entity=album';

router.post("/v1/favorites/add", (request, response) => {
    favoritesRepository.addToFavorite(request.body)
        .then(result => {            
            request.body.id = result.id;
            response.status(200).json(request.body);
        })
        .catch(err => {
            response.status(404).json(err)
        })
});

router.post("/v1/favorites/update", (request, response) => {
    console.log('name', request.body.collectionName)
    favoritesRepository.getByName(request.body.collectionName).then(res => {
        if (!res) {
            console.log('not found');
            favoritesRepository.addToFavorite(request.body)
            .then(result => {
                request.body.id = result.id;
                request.body.isFavorite = 1;
                response.status(200).json(request.body);
            })
            .catch(err => {
                response.status(404).json(err)
            })
        } else {
            favoritesRepository.update(request.body)
                .then(result => {
                    request.body.id = result.id;
                    request.body.isFavorite = result.isFavorite;                    
                    response.status(200).json(request.body);
                })
                .catch(err => {
                    response.status(404).json(err)
                })
        }
    });
});

router.get("/v1/favorites/all", (request, response) => {
    favoritesRepository.getAll()
        .then(result => {
            response.status(200).json(result);
        })
        .catch(err => {
            response.status(404).json(err)
        })
})

router.get("/v1/isfavorite", (request, response) => {     
    favoritesRepository.isFavorite(request.query.name)
        .then(result => {
            response.status(200).json(result);
        })
        .catch(err => {
            response.status(404).json(err)
        })
});

router.get("/v1/collections", (req, res, next) => {
    const request = require('request');

    const options = {
        method: 'GET',
        url: URL,
        headers: {
            useQueryString: true
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        const collections = [];
        const data = JSON.parse(body)
        if (!data?.results) {
            var e = new Error('No collections found');
            res.status(404).json(e)
            return;
        }
        data.results.shift(1)
        data.results.forEach(collection => {
            collections.push({
                artistName: collection.artistName, 
                collectionName: collection.collectionName, 
                isFavorite: collection.isFavorite,
                albumArt: collection.artworkUrl60});
        });        
        res.status(200).json(collections);        
    });
});

module.exports = router;