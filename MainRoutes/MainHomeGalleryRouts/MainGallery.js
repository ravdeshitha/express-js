const express = require('express');
const router = express.Router();
const db = require('../../Connection');

router.get('/albums', (req, res) => {
    db.query(
      "SELECT gi.imgURL, gi.albumId, a.albumName, a.category, a.albumType, a.dateTime FROM galleryimages gi INNER JOIN album a ON a.albumId = gi.albumId WHERE a.albumType = ? GROUP BY gi.albumId ORDER BY gi.albumId ASC",
      ['Photo'],
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
          db.query(
            "SELECT g.albumId, COUNT(g.imgId) AS numImg FROM galleryimages AS g JOIN album AS a ON g.albumId = a.albumId WHERE a.albumType = ? GROUP BY g.albumId ASC",
            ['Photo'],
            (err2, result2) => {
              if (err2) {
                res.send({ error: err2 });
              } else {
                // Merge the results into one array
                const mergedResult = result.map(item => {
                  const matchingResult2Item = result2.find(result2Item => result2Item.albumId === item.albumId);
                  if (matchingResult2Item) {
                    return {
                      ...item,
                      numImg: matchingResult2Item.numImg
                    };
                  }
                  return item;
                });
                res.send({ message: "Merged result", result: mergedResult });
              }
            }
          );
        }
      }
    );
});

router.get('/posters', (req, res) => {
    db.query(
        "SELECT gi.imgURL, gi.albumId, a.category, a.albumType, a.dateTime FROM galleryimages gi INNER JOIN album a ON a.albumId = gi.albumId WHERE a.albumType = ?",
        ['Event'],
        (err, result) => {
            if(err){
                res.send({message: "err" , error: err});
            }
            else{
                res.send({message: "success", result: result});
            }
        }
    )
})

///////////////////////////////////////////
//get all photos of a album

router.get('/photos/:id' , (req, res) => {
    const albumId = req.params.id;

    db.query(
        "SELECT g.imgId, g.imgURL, g.albumId, g.dateTime, a.albumName, a.category FROM galleryimages g JOIN album a ON g.albumId=a.albumId WHERE g.albumId = ?",
        albumId,
        (err, result) => {
            if(err){
                res.send({message: "err" , error: err});
            }
            else{
                res.send({message: "success", result: result});
            }
        }
    )
})


module.exports = router;