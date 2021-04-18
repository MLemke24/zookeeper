const { animals } = require('./data/animals')
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

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
        filteredResults = filteredResult.filter(animal => animal.diet === query.diet);
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

// Listen Port

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });

