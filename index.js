const express = require("express");
const app = express();

const morgan = require("morgan");

const cors = require('cors')

app.use(cors())

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.use(express.static('dist'))
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));


app.post("/api/persons", (req, res) => {
	const body = req.body;

	if (!body.name || !body.number) {
		return res.status(400).json({ error: "content missing" });
	}
	const exist = persons.find((p) => p.name.toLowerCase() === body.name.toLowerCase());
	if (exist) {
		return res.status(400).json({ error: "name must be unique" });
	}

	const person = {
		name: body.name,
		number: body.number,
		id: Math.floor(Math.random() * 1000000),
	};

	persons.push(person);

	res.json(person);
});

app.get("/api/persons", (req, res) => {
	res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	const exist = persons.find((p) => p.id === id);

	if (exist) {
		res.json(exist);
	} else {
		res.status(404).end();
	}
});

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	const exist = persons.find((p) => p.id === id);

	if (exist) {
		persons = persons.filter((p) => p.id !== id);
		res.status(204).end();
	} else {
		res.status(404).end();
	}
});

app.put("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	const body = req.body;
	const exist = persons.find((p) => p.id === id);

	if (!exist) {
		return res.status(404).end();
	}
	if (!body.name || !body.number) {
		return res.status(400).json({ error: "content missing" });
	}

	const updated = { ...exist, name: body.name, number: body.number };
	persons = persons.map((p) => (p.id !== id ? p : updated));

	res.json(updated);
});

app.get("/api/info", (req, res) => {
	const date = new Date().toString();
	const message = `<p>Phonebook has info for 2 people</p><p>${date}</p>`;
	res.send(message);
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
