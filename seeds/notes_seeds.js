const Note = require('../models/notes');
const connectToMongo = require('../db');
connectToMongo();

const seedDB = async () => {
    for (let index = 1; index <= 20; index++) {
        let title = `Title #${index}`;
        let description = `Description of ${index}`;
        let tag = `TAG-${index}`;
        let newNote = new Note({ title, description, tag, owner: '65842f35f9bc8b144ceeacca' });
        await newNote.save();
    }
}

seedDB();