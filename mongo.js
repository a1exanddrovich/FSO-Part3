const mongoose = require("mongoose")


if (process.argv.length < 3) {
    console.log("Please provide us with a password")
    process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]
const url = `mongodb+srv://Alien322:${password}@cluster0.itraezx.mongodb.net/phoneDB?retryWrites=true&w=majority`

const phoneSchema = new mongoose.Schema({
    number: String,
    name: String
})

const Person = mongoose.model("Person", phoneSchema)

mongoose
    .connect(url)
    .catch((error) => {
        console.log("Error: ", error)
    })

if (newName != null && newNumber != null) {
    const newData = new Person({
        number: newNumber,
        name: newName
    })
    newData.save().then(result => {
        console.log("Person saved")
        mongoose.connection.close()
    })
} else {
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name + " " + person.number)
        })

        mongoose.connection.close()
    })
}

