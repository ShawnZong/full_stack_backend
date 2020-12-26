const { response } = require("express");
const express = require("express");
const app = express();
let persons = [{
  "persons": [
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
  ],
}];
app.get("/api/persons", (request, response) => {
  response.send(persons);
});
app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for 4 people</p>
        <p>${new Date()}</p>`,
  );
});
const PORT = 3001;
app.listen(PORT, () => {
  console.log("running");
});
