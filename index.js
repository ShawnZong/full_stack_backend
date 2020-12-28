/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const PersonInDB = require('./models/model');

const app = express();
app.use(cors());
app.use(express.static('build'));
app.use(express.json());

morgan.token('req-body', (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :req-body',
  ),
);

app.get('/api/persons', (request, response, next) => {
  PersonInDB.find({})
    .then((persons) => {
      response.send(persons);
    })
    .catch((error) => next(error));
});
app.get('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;
  //   console.log(id);
  PersonInDB.findById(id)
    .then((person) => {
      if (person) {
        response.send(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
  // const person = persons.find((tmp) => tmp.id === id);
  // //   console.log(person);

  // if (person) {
  //   response.json(person);
  // } else {
  //   response.status(404).end();
  // }
});
app.get('/info', (request, response, next) => {
  PersonInDB.count({})
    .then((count) => {
      response.send(
        `<p>Phonebook has info for ${count} people</p>
          <p>${new Date()}</p>`,
      );
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;
  PersonInDB.findByIdAndRemove(id)
    .then(() => {
      // console.log("deleted", result);
      response.status(204).end();
    })
    .catch((error) => next(error));
  // persons = persons.filter((tmp) => tmp.id !== id);
  // response.status(204).end();
});

app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request;
  const newObj = {
    name: body.name,
    number: body.number,
  };
  // console.log("new obj in update backend ", newObj, " id: ", request.params.id);
  PersonInDB.findByIdAndUpdate(request.params.id, newObj, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      response.send(updatedPerson);
    })
    .catch((error) => next(error));
});

// eslint-disable-next-line consistent-return
app.post('/api/persons', (request, response, next) => {
  const { body } = request;
  if (!body.name && !body.number) {
    return response.status(400).json({
      error: 'no data',
    });
  }

  const newPerson = new PersonInDB({
    name: body.name,
    number: body.number,
  });
  newPerson
    .save()
    .then((savedPerson) => {
      response.send(savedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

// eslint-disable-next-line consistent-return
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    console.log('backend validator', error);
    return response.status(400).send({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`running on PORT ${PORT}`);
});
