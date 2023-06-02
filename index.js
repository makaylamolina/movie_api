const express = require('express'),
  morgan = require('morgan'), // import morgan
  fs = require('fs'), // import built in node modules fs and path 
  path = require('path'),
  bodyParser = require('body-parser'), // import body-parser
  uuid = require('uuid'), // import uuid
  mongoose = require('mongoose'), // import mongoose
  Models = require('./models.js'); //imports models from models.js

const Movies = Models.Movie;
const Users = Models.User

mongoose.connect('mongodb://127.0.0.1:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join('log.txt'), {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));
// set up body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth')(app); // app argument ensures Express is available in auth.js file

const passport = require('passport');
require('./passport');

// CREATE add a user
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

// UPDATE change username
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
        {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
        }
    },
    { new: true }, //This line makes sure the updated document is returned
    )
    .then((updatedUser) => {
        if (!updatedUser) {
            return res.status(404).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

// CREATE add movies to favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
            $addToSet: { FavoriteMovies: req.params.MovieID }
        },
        { new: true } // This line makes sure the updated document is returned
    )
    .then((updatedUser) => {
        if (!updatedUser) {
            return res.status(404).send('Error: User doesn\'t exist');
        } else {
            res.json(updatedUser);
        }
    });
  });

// DELETE remove movie from favorites
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
            $pull: { FavoriteMovies: req.params.MovieID }
        },
        { new: true } // This line makes sure the updated document is returned
    )
    .then((updatedUser) => {
        if (!updatedUser) {
            return res.status(404).send('Error: User doesn\'t exist.');
        } else {
            res.json(updatedUser);
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
  });

// DELETE a user by username
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found.');
        } else {
            res.status(200).send(req.params.Username + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// READ Get all users
app.get('/users', (req, res) => {
    Users.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
    });
});

// READ Get a user by username
app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username})
    .then((user) => {
        res.json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// READ Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// READ Get a movie by title
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title})
    .then((movie) => {
        res.json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
  });

// READ
app.get('/movies/genre/:genreName', (req, res) => {
    Movies.find({ 'Genre.Name': req.params.genreName})
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        res.status(500).send('Error: ' + err);
    });
  });

// READ
app.get('/movies/directors/:directorName', (req, res) => {
    Movies.find({ 'Director.Name': req.params.directorName})
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        res.status(500).send('Error: ' + err);
    });
  });

app.get('/', (req, res) => {
    res.send('But you cannot hide.');
});

app.use("/", express.static(__dirname + "/public"));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});