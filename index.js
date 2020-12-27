const { response, request } = require("express");
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
morgan.token("req-body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body",
  ),
);
// morgan.token("req-body", (req, res) => {
//   if (req.get === "POST") {
//     return "test";
//     return JSON.stringify(req.body);
//   } else {
//     return "";
//   }
// });
// app.use(
//   morgan(
//     ":method :url :status :res[content-length] - :response-time ms :req-body",
//   ),
// );
let persons = [
  {
    "name": "Arto Hellas",
    "number": "1",
    "id": 1,
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2,
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3,
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4,
  },
];
const generateID = () =>
  Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER));
app.get("/api/persons", (request, response) => {
  response.send(persons);
});
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  //   console.log(id);
  const person = persons.find((tmp) => tmp.id === id);
  //   console.log(person);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});
app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for 4 people</p>
        <p>${new Date()}</p>`,
  );
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((tmp) => tmp.id !== id);
  response.status(204).end();
});
app.post("/api/persons", (request, response) => {
  const body = request.body;
  //   console.log(body);

  if (!body.name && !body.number) {
    return response.status(400).json({
      error: "no data",
    });
  }
  if (persons.find((tmp) => tmp.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateID(),
  };
  persons = persons.concat(newPerson);
  response.json(newPerson);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("running");
});
