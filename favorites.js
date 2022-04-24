const dbFilePath = './database.sqlite3';
const { resolve } = require('bluebird');
const { urlencoded } = require('express');
const AppDAO = require('./dao')

class FavoritesRepository {

    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `
          CREATE TABLE IF NOT EXISTS favoritesCollections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            artistName TEXT,
            collectionName TEXT UNIQUE,
            albumArt TEXT,
            isFavorite INTEGER DEFAULT 0)`
        return this.dao.run(sql)
    }

    getById(id) {
        return this.dao.get(
            `SELECT * FROM favoritesCollections WHERE id = ?`,
            [id])
    }

    getByName(collectionName) {        
        return this.dao.get(
          `SELECT * FROM favoritesCollections WHERE collectionName = ?`,
          [collectionName])
      }

    getAll() {
        return this.dao.all(
            'SELECT * FROM favoritesCollections')
    }


    addToFavorite(collection) {
        try {
            return this.dao.run(
            'INSERT INTO favoritesCollections (artistName, isFavorite, collectionName, albumArt) VALUES (?, ?, ?, ?)',
            [collection.artistName, true, collection.collectionName, collection.albumArt])
            .then(() => {return collection})                    
        } catch (error) {
            console.log('error', error)
            return error;
        }

    }

    update(collection) {  
        return this.getByName(collection.collectionName).then(res => {
                return this.getById(res.id).then(collection => {                    
                    const isFavorite = !collection.isFavorite;
                    collection.isFavorite = isFavorite;
                    console.log('isfavorite', collection.isFavorite);
                    return this.dao.run(
                        `UPDATE favoritesCollections SET isFavorite = ? WHERE id = ?`,
                        [isFavorite, collection.id]
                    ).then(() => {
                        return collection
                    })
                })
        });
    }

    isFavorite(collectionName) {
        return this.getByName(collectionName).then(res => {
            console.log('album found',res, collectionName);
            return this.getById(res.id).then(collection => {                 
                return collection.isFavorite;
            })
            .error(err => {
                console.log('err', err);
            })
        });
    }
}

module.exports = new FavoritesRepository(new AppDAO(dbFilePath));
