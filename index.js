const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'), // import built in node modules fs and path 
  path = require('path');

const app = express();
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join('log.txt'), {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

let topMovies = [
    {
        title: 'The Exorcist',
        year: 1973,
        genre: 'Horror/Thriller',
    },
    {
        title: 'The Silence of the Lambs',
        year: 1991,
        genre: 'Horror/Thriller',
    },
    {
        title: 'The Sixth Sense',
        year: 1999,
        genre: 'Horror/Thriller',
    },
    {
        title: 'Psycho',
        year: 1960,
        genre: 'Horror/Mystery',
    },
    {
        title: 'Saw',
        year: 2004,
        genre: 'Horror/Mystery',
    },
    {
        title: 'The Shining',
        year: 1980,
        genre: 'Drama/Horror',
    },
    {
        title: 'The Cabin in the Woods',
        year: 2011,
        genre: 'Horror/Mystery',
    },
    {
        title: 'The Conjuring',
        year: 2013,
        genre: 'Horror/Mystery',
    },
    {
        title: 'Poltergeist',
        year: 1982,
        genre: 'Horror/Thriller',
    },
    {
        title: 'I Know What You Did Last Summer',
        year: 1997,
        genre: 'Horror/Mystery',
    }
];

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('But you cannot hide.');
});

app.use('/documentation', express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});