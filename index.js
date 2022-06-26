const express = require("express")
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(express.static('build'))
app.use(express.json())

morgan.token("info", (request, response) => JSON.stringify(request.body))

app.use(morgan(":method :url :status :response-time :info"))
app.use(cors())

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieckdfsfdsf",
        "number": "39-23-6423122"
    }
]

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get("/info", (request, response) => {
    response.send(`<p>The phonebook has info for ${persons.length} people</p><p>${new Date().toISOString()}</p>`)
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body) {
        return response.status(400).json({
            "error": "content is empty"
        })
    }

    if (!body.name) {
        return response.status(400).json({
            "error": "name is empty"
        })
    }

    if (!body.number) {
        return response.status(400).json({
            "error": "number is empty"
        })
    }

    const name = body.name
    if (persons.find(person => person.name === name)) {
        return response.status(400).json({
            "error": "name must be unique"
        })
    }

    const newPerson = {
        id: generateId(),
        name: name,
        number: body.number
    }

    persons = persons.concat(newPerson)
    response.json(newPerson)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})