const { response, request } = require("express");
const express = require("express");
const app = express();
app.use(express.json());
let persons = [
  {
    "name": "Arto Hellas",
    "phone": "1",
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
  console.log(id);
  const person = persons.find((tmp) => tmp.id === id);
  console.log(person);

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

  console.log(body.content);
  if (!body.name && !body.phone) {
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
const PORT = 3001;
app.listen(PORT, () => {
  console.log("running");
});
