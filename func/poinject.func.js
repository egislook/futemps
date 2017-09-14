const express   = require('express');
const router    = express.Router();
const poinject = require('../../_packs/poinject');

router.get('/all', getAll);
router.get('/:path?', get);
router.patch('/:id', patch);
router.post('/:id', clone);
router.post('/', post);
router.delete('/:id', deleteFn);

module.exports = router;
exports.get = get;
exports.patch = patch;
exports.post = post;
exports.clone = clone;
exports.delete = deleteFn;

function get(req, res){
  res.json(poinject.poinject(req.params.path));
}

function getAll(req, res){
  res.json(poinject.poinjectAll());
}


function patch(req, res){
  if(!req.params.id)
    return res.status(400)
      .json({ ok: false, msg: 'id is not specified' });

  if(!req.body || req.body && !req.body.value)
    return res.status(400)
      .json({ ok: false, msg: 'value is not specified' });

  let opts = poinject.editPoinjectValueById(req.params.id, req.body.value);

  if(!opts)
    return res.status(400)
      .json({ ok: false, msg: `Id: ${req.params.id} is not valid` });

  return res.status(200)
    .json({ ok: true, msg: `value of the ${req.params.id} has been changed`, opts});
}

function clone(req, res){
  if(!req.params.id)
    return res.status(400)
      .json({ ok: false, msg: '"id" is not specified' });

  let opts = poinject.clonePoinjectById(req.params.id);

  if(!opts)
    return res.status(400)
      .json({ ok: false, msg: `Id: ${req.params.id} is not valid or opts are incorrect` });

  return res.status(200)
    .json({ ok: true, msg: `Id: ${req.params.id} leaf has been cloned`, opts});


}

function post(req, res){
  if(!req.body || req.body && !req.body.value)
    return res.status(400)
      .json({ ok: false, msg: 'value is not specified' });

  let opts = poinject.createPoinjectValueByParent(req.body.value, req.body.parent, req.body.type);

  if(!opts)
    return res.status(400)
      .json({ ok: false, msg: `Value: ${req.body.value} is not valid or opts are incorrect` });

  return res.status(200)
    .json({ ok: true, msg: `new ${opts.leaf.type} "${opts.leaf.id}" has been created`, opts});
}


function deleteFn(req, res){
  if(!req.params.id)
    return res.status(400)
      .json({ ok: false, msg: 'id is not specified' });

  let opts = poinject.deletePoinjectValueById(req.params.id);

  if(!opts)
    return res.status(400)
      .json({ ok: false, msg: `ID: ${req.params.id} is not valid` });

  return res.status(200)
    .json({ ok: true, msg: `field & value of the ${req.params.id} has been deleted`, opts});
}
