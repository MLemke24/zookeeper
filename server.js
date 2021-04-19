const fs = require('fs');
const path = require('path');
const { animals } = require('./data/animals')
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// Get css and script for the index
app.use(express.static('public'));
  

// Query Filter

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // filtered by diet
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
    if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
    } else {
        personalityTraitsArray = query.personalityTraits;
    }

    personalityTraitsArray.forEach(trait => {
        filteredResults = filteredResults.filter(
            animal => animal.personalityTraits.indexOf(trait) !== -1
        )
    })

    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet)
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species)
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name)
    
    }
    return filteredResults;
}

// Single Animal Filter

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
  }

// Creat New Animal

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
    path.join(__dirname, './data/animals.json'),
    JSON.stringify({ animals: animalsArray }, null, 2)
    );

    return animal;
}

// validate info
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
  }

// Get Animals 

app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
})

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
  });

  // Get Index.html
  app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

  // Get Animals html
  app.get('/animals', (req,res) => {
    res.sendFile(path.join (__dirname, './public/animals.html'));
  })

  // Get Zookepers html
  app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
  });

// Wildcard
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

  // Data Stored In Server
  app.post('/api/animals', (req, res) => {

    // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

    // add animal to json file and animals array in this function
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
    }
  })

// Listen Port

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });

