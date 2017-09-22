class appStore{
  constructor(opts = { poinject: [], content: {} }){
    riot.observable(this);
    this.content = opts.content;
    this.poinject = opts.poinject;
    this.route = null;
  }

  setOpts(opts){
    this.content = opts.content;
    this.poinject = opts.poinject;
    this.trigger && this.trigger('storeUpdated');
  }

  getOpts(){
    return this.content;
  }

  /** ROUTE DATA */
  getAllRoutes(){ return this.content.routes }
  setActiveRoute(routeName){ this.route = this.content.routes[routeName] }
  getActiveRoute(key){ return key ? this.route[key] : this.route }

  /** CONTENT DATA */
  getValue(path, field='value'){
    const self = this;
    let leaf = self.poinject && self.poinject.filter(leaf => leaf.path === path || leaf.id === path);

    if(!leaf || leaf && !leaf.length)
      return `${path}`;
    if(leaf.length === 1)
      return leaf.shift()[field];

    return leaf.map(obj => obj.value);
    //return JSON.stringify(leaf.map(obj => obj.value), 0, 2);
  }

  getLeaf(id){
    let self = this;
    let leaf = self.poinject && self.poinject.filter(leaf => leaf.id === id);
    if(!leaf || leaf && !leaf.length)
      return `${id}`;
    if(leaf.length === 1)
      return leaf.shift();
  }

  handleEdit(value, id, cb){
    const self = this;
    id = id && id.split('-').length !== 5 ? this.getValue(id, 'id') : id;
    console.log(value, id);
    window.fetch('/poinject/'+id, {
      headers: { 'Content-Type': 'application/json'},
      method: 'PATCH',
      body: JSON.stringify({ value })
    }).then(res => res.json())
      .then(json => {
        self.setOpts(json.opts);
        cb && cb();
        console.log(json);
      });
  }

  handleMove(leaf, sibling, onlyClient){
    const self = this;
    if(onlyClient){
      let leafIndex = self.poinject.findIndex(obj => obj.id === leaf.id);
      let siblingIndex = self.poinject.findIndex(obj => obj.id === sibling.id);
      let poinject = self.poinject;

      poinject[leafIndex] = Object.assign(leaf, { parent: sibling.parent });
      poinject.splice(siblingIndex, 0, poinject.splice(leafIndex, 1)[0]);

      return self.setOpts({ content: self.content , poinject });

    } else {
      window.fetch('/poinject/'+leaf.id, {
        headers: { 'Content-Type': 'application/json'},
        method: 'PUT',
        body: JSON.stringify({ siblingId: sibling.id })
      }).then(res => res.json())
        .then(json => {
          self.setOpts(json.opts);
          //cb && cb();
          console.log(json);
        });
    }
  }

  handleCreate(value, leaf, cb){
    const self = this;
    window.fetch('/poinject/', {
      headers: { 'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({ value, parent: leaf.parent, type: leaf.type })
    }).then(res => res.json())
      .then(json => {
        self.setOpts(json.opts);
        cb && cb();
        console.log(json);
      });
  }

  handleDuplicate(id, cb){
    const self = this;
    window.fetch('/poinject/'+id, {
      headers: { 'Content-Type': 'application/json'},
      method: 'POST'
    }).then(res => res.json())
      .then(json => {
        self.setOpts(json.opts);
        console.log(json);
      });
  }

  handleUpload(id, e, cb){

    const file = e.target && e.target.files && e.target.files.item(0);
    e.target.value = '';

    if(!file)
      return;

    const self = this;

    upload(file, (err, json) => {
      self.getLeaf(id).type === 'field'
        ? this.handleCreate(json.src, { parent: id, type: 'value' }, cb)
        : this.handleEdit(json.src, id, cb);
    });

    function upload(fileItem, cb){
      var data = new FormData();
      data.append('file', fileItem);

      fetch('/upload', {
        method: 'POST',
        body: data
      })
      .then(res     => res.json())
      .then(json    => cb(null, json))
      .catch(err    => cb(err));
    }
  }

  handleDelete(id, cb){
    const self = this;
    window.fetch('/poinject/'+id, {
      headers: { 'Content-Type': 'application/json'},
      method: 'DELETE'
    }).then(res => res.json())
      .then(json => {
        self.setOpts(json.opts);
        console.log(json);
      });
  }
}
