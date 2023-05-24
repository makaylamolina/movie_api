const express = require('express'),
  morgan = require('morgan'), // import morgan
  fs = require('fs'), // import built in node modules fs and path 
  path = require('path'),
  bodyParser = require('body-parser'), // import body-parser
  uuid = require('uuid'); // import uuid

const app = express();
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join('log.txt'), {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));
// set up body-parser
app.use(bodyParser.json());

let users = [
    {
        id: 1,
        name: "Kim",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "Joe",
        favoriteMovies: ["The Shining"]
    }
]

let movies = [
    {
        "Title":"The Exorcist",
        "Description":"When a teenage girl is possessed by a mysterious entity, her mother seeks the help of two priests to save her daughter.",
        "Genre": {
            "Name":"Horror",
            "Description":"Meant to scare, startle, shock, and even repluse audiences."
        },
        "Director": {
            "Name":"William Friedkin",
            "Bio":"William 'Billy' Friedkin (born August 29, 1935) is an American film and television director, producer and screenwriter closely identified with the 'New Hollywood' movement of the 1970s. Beginning his career in documentaries in the early 1960s, he directed the crime thriller film The French Connection (1971), which won five Academy Awards, including Best Picture, Best Adapted Screenplay and Best Director, and the supernatural horror film The Exorcist (1973), which earned him a nomination for the Academy Award for Best Director.",
            "Birth":1935
        },
        "ImageURL":"https://m.media-amazon.com/images/I/81+hQdlnKWL._AC_UY327_FMwebp_QL65_.jpg",
        "Featured":false
    },
    {
        "Title":"The Silence of the Lambs",
        "Description":"A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.",
        "Genre": {
            "Name":"Crime",
            "Description":"A story that is centered around the solving of a crime."
        },
        "Director": {
            "Name":"Jonathan Demme",
            "Bio":"Robert Jonathan Demme (February 22, 1944 to April 26, 2017) was an American filmmaker. Beginning his career under B-movie producer Roger Corman, Demme made his directorial debut with the 1974 women-in-prison film Caged Heat, before becoming known for his casually humanist films such as Melvin and Howard (1980), Swing Shift (1984), Something Wild (1986), and Married to the Mob (1988). His direction of the 1991 psychological horror film The Silence of the Lambs (1991) won him the Academy Award for Best Director. His subsequent films earned similar acclaim, notably Philadelphia (1993) and Rachel Getting Married (2008).",
            "Birth":1944
        },
        "ImageURL":"https://m.media-amazon.com/images/I/A16clOJZvOL._AC_UY327_FMwebp_QL65_.jpg",
        "Featured":false
    },
    {
        "Title":"The Sixth Sense",
        "Description":"Malcom Crowe, a child psychologist, starts treating a young boy, Cole, who encounters dead people and convinces him to help them. In turn, Cole helps Malcolm reconcile with his estranged wife.",
        "Genre": {
            "Name":"Thriller",
            "Description":"Thrillers tend to be action-packed and fast-paced with moments full of tension, anxiety, and fear."
        },
        "Director": {
            "Name":"M. night Shyamalan",
            "Bio":"Manoj Nelliyattu 'M. Night' Shyamalan (born August 6, 1970) is an Indian-born American filmmaker and actor. He is best known for making original films with contemporary supernatural plots and twist endings. He was born in Mahé, India, and raised in Penn Valley, Pennsylvania. The cumulative gross of his films exceeds $3.4 billion globally. His early films include Praying with Anger (1992) and Wide Awake (1998) before his breakthrough film The Sixth Sense (1999), which earned him Academy Award nominations for Best Director and Best Original Screenplay. He then released Unbreakable (2000), Signs (2002) and The Village (2004). Following a period of setbacks which include several poorly received films like The Happening (2008), The Last Airbender (2010), and After Earth (2013), he found a career resurgence with the films The Visit (2015), Split (2016), Glass (2019), Old (2021), and Knock at the Cabin (2023).",
            "Birth":1970
        },
        "ImageURL":"https://m.media-amazon.com/images/I/711uZBBjIeL._AC_UY327_FMwebp_QL65_.jpg",
        "Featured":false
    },
    {
        "Title":"Saw",
        "Description":"Two strangers awaken in a room with no recollection of how they got there, and soon discover they're pawns in a deadly game perpetrated by a notorious serial killer.",
        "Genre": {
            "Name":"Horror",
            "Description":"Meant to scare, startle, shock, and even repluse audiences."
        },
        "Director": {
            "Name":"James Wan",
            "Bio":"James Wan (born 26 February 1977) is an Australian filmmaker. He has primarily worked in the horror genre as the co-creator of the Saw and Insidious franchises and the creator of The Conjuring Universe. The lattermost is the highest-grossing horror franchise, at over $2 billion. Wan is also the founder of film and television production company Atomic Monster Productions.",
            "Birth":1977
        },
        "ImageURL":"https://m.media-amazon.com/images/I/41UHy1yVLqL.jpg",
        "Featured":false
    },
    {
        "Title":"The Shining",
        "Description":"A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.",
        "Genre": {
            "Name":"Drama",
            "Description":"Strongly based in a character, or characters, that are in conflict at a crucial moment in their lives."
        },
        "Director": {
            "Name":"Stanley Kubrick",
            "Bio":"Stanley Kubrick (July 26, 1928 to March 7, 1999) was an American film director, producer and screenwriter. Widely considered one of the greatest filmmakers of all time, his films—almost all of which are adaptations of novels or short stories—cover a wide range of genres and feature innovative cinematography, dark humor, realistic attention to detail and extensive set designs.",
            "Birth":1928
        },
        "ImageURL":"https://m.media-amazon.com/images/I/81eaI8wVexL._AC_UY327_FMwebp_QL65_.jpg",
        "Featured":false
    },
    {
        "Title":"The Conjuring",
        "Description":"Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.",
        "Genre": {
            "Name":"Horror",
            "Description":"Meant to scare, startle, shock, and even repluse audiences."
        },
        "Director": {
            "Name":"James Wan",
            "Bio":"James Wan (born 26 February 1977) is an Australian filmmaker. He has primarily worked in the horror genre as the co-creator of the Saw and Insidious franchises and the creator of The Conjuring Universe. The lattermost is the highest-grossing horror franchise, at over $2 billion. Wan is also the founder of film and television production company Atomic Monster Productions.",
            "Birth":1977
        },
        "ImageURL":"https://m.media-amazon.com/images/I/91hNvYUosLL._AC_UY327_FMwebp_QL65_.jpg",
        "Featured":false
    },
    {
        "Title":"Poltergeist",
        "Description":"A family's home is haunter by a host of demonic ghosts.",
        "Genre": {
            "Name":"Horror",
            "Description":"Meant to scare, startle, shock, and even repluse audiences."
        },
        "Director": {
            "Name":"Tobe Hooper",
            "Bio":"Willard Tobe Hooper (January 25, 1943 to August 26, 2017) was an American director, screenwriter, and producer best known for his work in the horror genre. The British Film Institute cited Hooper as one of the most influential horror filmmakers of all time.",
            "Birth":1943
        },
        "ImageURL":"https://m.media-amazon.com/images/I/71q-yLlVevL._AC_UY327_FMwebp_QL65_.jpg",
        "Featured":false
    }
];

// CREATE
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }
})

// UPDATE
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id );

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }
})

// CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array.`);
    } else {
        res.status(400).send('no such user')
    }
})

// DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }
})

// DELETE
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`user ${id} has been deleted.`);
    } else {
        res.status(400).send('no such user')
    }
})

// READ
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// READ
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.Title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
  });

// READ
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre')
    }
  });

// READ
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    }
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