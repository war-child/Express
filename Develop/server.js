const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/api/notes', (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    console.log(JSON.parse(data));
    res.json(JSON.parse(data));
  })
});

app.post('/api/notes', (req, res) => {
  // uuidv4();
  console.log(req.body);
  const notes = {
    ...req.body, 
    id: uuidv4(),
  }
  console.log(notes);
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    const newNotes = JSON.parse(data);
    newNotes.push(notes);
    fs.writeFile("./db/db.json", JSON.stringify(newNotes), (err) => {
      if (err) throw err;
      res.json(newNotes);
    })
  })
});

app.delete('/api/notes/:id', (req, res) => {
  console.log(req.params.id);
  fs.readFile(
    "./db/db.json",
    "utf8",
    (err, data) => {
      if (err) throw err;
      let newNotes = JSON.parse(data);
      newNotes = newNotes.filter((note) => note.id!== req.params.id);
      fs.writeFile("./db/db.json", JSON.stringify(newNotes), (err) => {
        if (err) throw err;
        res.json(newNotes);
      })
    }
  )
})

//homepage 
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
//notes 
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

