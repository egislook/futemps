const router    = global.express.Router();
const multer    = require('multer');
const fs        = require('fs');
//app.use(multer({dest:'./tmp',limits: {fileSize: 4*1024*1024}}).single('upload'));

if(!fs.existsSync(global.cfg.filesPath))
  fs.mkdirSync(global.cfg.filesPath);

const cfg = {
  storage: multer.diskStorage({
    destination:  (req, file, cb) => cb(null, global.cfg.filesPath),
    filename:     (req, file, cb) => cb(null, `${file.fieldname}-${Date.now()}-${escape(file.originalname)}`)
  }),
  limits: { fileSize: 4*1024*1024 }
}

let middle = multer(cfg).single('file');

router.post('/', middle, (req, res) => {

  const data = {
    src: `${global.cfg.filesUrl}/${req.file.filename}`,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size,
    sizeMb: (req.file.size / (1024 * 1024)).toFixed(2),
    format: req.file.mimetype.split('/').pop(),
    type: req.file.mimetype.split('/').shift()
  }

  res.json(data);
});

router.delete('/all', (req, res) => {
  if(fs.existsSync(global.cfg.filesPath)) {
    fs.readdirSync(global.cfg.filesPath)
      .forEach((file) => fs.unlinkSync(`${global.cfg.filesPath}/${file}`));
    return res.json({ ok: true });
  }

  return res.json({ok: false, msg: `File directory does not exist` });
});

router.delete('/:filename', (req, res) => {
  if(req.params.filename && fs.existsSync(`${global.cfg.filesPath}/${req.params.filename}`)){
    fs.unlinkSync(`${global.cfg.filesPath}/${req.params.filename}`);
    return res.json({ ok: true });
  }
  return res.json({ok: false, msg: `"${req.params.filename}" Does not exist` });
});

module.exports = router;
