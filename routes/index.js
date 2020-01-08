'use strict';

const express = require('express');
const db = require('../db');
const validator = require('validator');
const breadcrumb = require('express-url-breadcrumb');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('home', {
        pageTitle: 'Restaurants App',
        restaurants: db.slice(0, 9)
    });
});

router.get('/restaurants', (req, res, next) => {
    const { page } = req.query;
    const total = db.length;
    const perPage = 9;
    
    let startIndex = 0;
    let endIndex = 9;
    let pagination = {};
    let p = 2;

    pagination.previous = '';
    pagination.next = `<a id="next" href="/restaurants/?page=${p}">Next</a>`;

    if(page) {
        p = parseInt(page, 10);
        startIndex = (p-1) * 9;
        endIndex = p * 9;

        startIndex = startIndex < total ? startIndex : total;
        endIndex = endIndex < total ? endIndex : total;

        let prev = p - 1;
        let next = p + 1;

        pagination.previous = prev > 1 ? `<a id="prev" href="/restaurants/?page=${prev}">Previous</a>` : `<a id="prev" href="/restaurants/">Previous</a>`;
        pagination.next = p < total ? `<a id="next" href="/restaurants/?page=${next}">Next</a>` : '';
    }

    res.render('restaurants', {
        pageTitle: 'Restaurants',
        restaurants: db.slice(startIndex, endIndex),
        pagination: pagination
    });
});

router.get('/restaurants/:id', breadcrumb(), (req, res, next) => {
    const { id } = req.params;
    if(validator.isNumeric(id)) {
        const restaurant = db.find(r => { return r.restaurant_id === id });
        if(restaurant) {
            res.render('single', {
                pageTitle: restaurant.name,
                restaurant: restaurant,
                isSingle: true
            });
        } else {
            res.sendStatus(404); 
        }
    } else {
        res.sendStatus(404);
    }
}); 

router.post('/search', (req, res, next) => {
    const { q } = req.body;
    const regex = new RegExp(q, 'gi');
    let restaurants = [];

    for(let i = 0; i < db.length; i++) {
        let restaurant = db[i];
        if(regex.test(restaurant.name)) {
            restaurants.push(restaurant);
        }
    }

    if(restaurants.length > 0) {
        res.render('search-results', {
            pageTitle: 'Search results',
            restaurants: restaurants.slice(0, 9)
        });
    } else {
        res.render('search-results', {
            pageTitle: 'Search results',
            restaurants: false
        });
    }
});

module.exports = router;