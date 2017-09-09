const express   = require('express');
const router    = express.Router();
const poinouter = require('../../poinouter');

router.get('/:path?', get);
router.patch('/:id', patch);
router.post('/', post);
router.delete('/:id', deleteFn);

module.exports = router;
exports.get = get;
exports.patch = patch;
exports.post = post;
exports.delete = deleteFn;

function get(req, res){
  res.send(poinouter.poinject(req.params.path));
}


function patch(req, res){
  if(!req.params.id)
    return res.status(400)
      .json({ ok: false, msg: 'id is not specified' });

  if(!req.body || req.body && !req.body.value)
    return res.status(400)
      .json({ ok: false, msg: 'value is not specified' });

  let opts = poinouter.editPoinjectValueById(req.params.id, req.body.value);

  if(!opts)
    return res.status(400)
      .json({ ok: false, msg: `ID: ${req.params.id} is not valid` });

  return res.status(200)
    .json({ ok: true, msg: `value of the ${req.params.id} has been changed`, opts});
}


function post(req, res){
  if(!req.body || req.body && !req.body.value)
    return res.status(400)
      .json({ ok: false, msg: 'value is not specified' });

  let opts = poinouter.createPoinjectValueByParent(req.body.value, req.body.parent, req.body.type);

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

  let opts = poinouter.deletePoinjectValueById(req.params.id);

  if(!opts)
    return res.status(400)
      .json({ ok: false, msg: `ID: ${req.params.id} is not valid` });

  return res.status(200)
    .json({ ok: true, msg: `field & value of the ${req.params.id} has been deleted`, opts});
}