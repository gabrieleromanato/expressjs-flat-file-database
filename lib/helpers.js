'use strict';

module.exports = {
    date: d => {
        let dt = Date.parse(d);
        let output = '';
        if(!isNaN(dt)) {
            let ds = new Date(dt);
            output = ds.toLocaleDateString();
        }
        return output;
    },
    totalscore: scores => {
        let total = 0;
        scores.forEach(s => {
            total += s.score;
        });
        return total;
    },
    the_image: restaurant => {
        return `/public/images/${restaurant.image}`;
    }
};