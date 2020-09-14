const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Movie = require('./models/Movie');

const authRoutes = require('./routes/auth');
const { db } = require('./models/User');

mongoose.connect('mongodb://localhost:27017/movies', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
  console.log('Mongodb connection established successfully');
});

const PORT = 4000;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  Movie.find((err, movies) => {
    if (err) {
      console.error(err);
    } else {
      res.json(movies);
    }
  });
});

app.post('/create', (req, res) => {
  const movie = new Movie(req.body);
  movie.save().then((movie) => {
    res.json(movie)
  }).catch(err => {
    res.status(500).send(err.message);
  })
});

app.get('/:id', (req, res) => {
  const id = req.params.id;
  Movie.findById(id, (err, movie) => {
    res.json(movie);
  })
})

app.delete('/:id', (req, res) => {
  const id = req.params.id;
  Movie.findByIdAndRemove(id, (err, movie) => {
    if (err) return res.status(500).send(err.message);
    return res.status(200).send();
  })
})

app.post('/:id', (req, res) => {
  const id = req.params.id;
  Movie.findByIdAndUpdate(id, (err, movie) => {
    if (!movie) return res.status(404).send("Movie not found");
    if (err) return res.status(500).send(err.message);
    movie.name = req.body.name;
    movie.watched = req.body.watched;
    movie.save().then(movie => {
      res.json(movie)
    }).catch(err => res.status(500).send(err.message));
  })
})

app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});