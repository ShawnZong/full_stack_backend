require("dotenv").config();
const { response, request } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const PersonInDB = require("./models/model");

const app = express();
app.use(cors());
app.use(express.static("build"));
app.use(express.json());

morgan.token("req-body", function (req, res) {
  // console.log(req);
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body",
  ),
);
// let persons = [
//   {
//     "name": "Arto Hellas",
//     "number": "1",
//     "id": 1,
//   },
//   {
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523",
//     "id": 2,
//   },
//   {
//     "name": "Dan Abramov",
//     "number": "12-43-234345",
//     "id": 3,
//   },
//   {
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122",
//     "id": 4,
//   },
// ];
const generateID = () =>
  Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER));
app.get("/api/persons", (request, response, next) => {
  PersonInDB.find({}).then((persons) => {
    response.send(persons);
    // response.json(persons.map((person) => person.toJSON()));
  })
    .catch((erro) => next(error));
});
app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
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
app.get("/info", (request, response, next) => {
  PersonInDB.count({})
    .then((count) => {
      response.send(
        `<p>Phonebook has info for ${count} people</p>
          <p>${new Date()}</p>`,
      );
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  PersonInDB.findByIdAndRemove(id)
    .then((result) => {
      // console.log("deleted", result);
      response.status(204).end();
    })
    .catch((error) => next(error));
  // persons = persons.filter((tmp) => tmp.id !== id);
  // response.status(204).end();
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const newObj = {
    name: body.name,
    number: body.number,
  };
  PersonInDB.findByIdAndUpdate(request.params.id, newObj, { new: true })
    .then((updatedPerson) => {
      response.send(updatedPerson);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  //   console.log(body);

  if (!body.name && !body.number) {
    return response.status(400).json({
      error: "no data",
    });
  }

  const newPerson = new PersonInDB({
    name: body.name,
    number: body.number,
    // id: generateID(),
  });
  newPerson.save().then((savedPerson) => {
    response.send(savedPerson);
    // response.json(savedPerson.toJSON());
  })
    .catch((error) => next(error));
  // persons = persons.concat(newPerson);
  // response.json(newPerson);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`running on PORT ${PORT}`);
});
