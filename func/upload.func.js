const express   = require('express');
const router    = express.Router();
const multer    = require('multer');
//app.use(multer({dest:'./tmp',limits: {fileSize: 4*1024*1024}}).single('upload'));

const cfg = {
  storage: multer.diskStorage({
    destination:  (req, file, cb) => cb(null, './tmp'),
    filename:     (req, file, cb) => cb(null, file.fieldname + '-' + Date.now())
  }),
  limits: { fileSize: 4*1024*1024 }
}

let middle = multer(cfg).single('file');

router.post('/', (req, res, next) => { console.log('POSTing file'); next();}, middle, (req, res) => {
  console.log(req.file);
});

module.exports = router;
