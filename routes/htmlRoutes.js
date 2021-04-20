const path = require('path');
const router = require('express').Router();

 // Get Index.html
 router.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

// Get Animals html
 router.get('/animals', (req,res) => {
    res.sendFile(path.join (__dirname, '../public/animals.html'));
      })
    
  // Get Zookepers html
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
  });

// Wildcard
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

module.exports = router;
  