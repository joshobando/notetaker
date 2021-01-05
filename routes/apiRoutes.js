const path = require("path");
const router = require("express").Router();
const { v4: uuidv4 } = require('uuid');
const util = require("util");
const fs = require("fs");

const promisifiedWrite = util.promisify(fs.writeFile); //.then()
const promisifiedRead = util.promisify(fs.readFile); //.then()

const getNotes = () => {
    return promisifiedRead(path.join(__dirname,"../db/db.json"),"utf8").then((notes) => {
        return JSON.parse(notes);
    });
}

router.get("/api/notes", (req, res) => {
    getNotes()
    .then((notes) => {
        res.json(notes);
    })
    .catch((err => {
        res.status(500).json(err);
    }));
});

const addNote = (note) => {
    //prepare note
    const newNote = note;
    newNote.id = uuidv4();

    //update the db
    return getNotes().then((notes) => {
        const newNotes = notes;
        newNotes.push(newNote);
        promisifiedWrite(path.join(__dirname,"../db/db.json"),JSON.stringify(newNotes));
        return newNote;
    });
}

router.post("/api/notes", (req, res) => {
    addNote(req.body)
    .then((note) => {
        res.json(note);
    })
    .catch((err => {
        res.status(500).json(err);
    }));
});

const destoryNotes = (id) => {
    return getNotes().then((notes) => {
        const oldNotes = notes;
        const filteredNotes = oldNotes.filter((notes) => notes.id !== id);
        promisifiedWrite(path.join(__dirname,"../db/db.json"),JSON.stringify(filteredNotes));
        return filteredNotes;
    });
}

router.delete("/api/notes/:id", (req, res) => {
    destoryNotes(req.params.id)
    .then((notes) => {
        res.json(notes);
    })
    .catch((err => {
        res.status(500).json(err);
    }));
});

module.exports = router;