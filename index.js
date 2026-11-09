require("dotenv").config();
const express = require("express");
const app = express();

const morgan = require("morgan");
const Person = require("./person");
const cors = require("cors");

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.get("/api/persons", (req, res) => {
	Person.find({}).then((result) => {
		res.json(result);
	});
});

app.get("/api/persons/:id", (req, res) => {
	Person.findById(req.params.id).then((person) => {
		res.json(person);
	});
});

app.post("/api/persons", (req, res, next) => {
	const body = req.body;

	if (!body.name || !body.number) {
		return res.status(400).json({ error: "content missing" });
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((saved) => {
			res.json(saved);
		})
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
	const body = req.body;

	const person = {
		name: body.name,
		number: body.number,
	};

	Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
		.then((updated) => {
			res.json(updated);
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
	Person.findByIdAndDelete(req.params.id)
		.then(() => {
			res.status(204).end();
		})
		.catch((error) => next(error));
});

app.get("/api/info", (req, res) => {
	Person.countDocuments({}).then((count) => {
		const date = new Date().toString();
		res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`);
	});
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
