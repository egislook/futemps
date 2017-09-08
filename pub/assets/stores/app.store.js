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
    let leaf = self.poinject && self.poinject.filter(leaf => leaf.path === path);

    if(!leaf || leaf && !leaf.length)
      return `${path}`;
    if(leaf.length === 1)
      return leaf.shift()[field];

    return JSON.stringify(leaf.map(obj => obj.value), 0, 2);
  }

  handleEdit(value, id, cb){
    const self = this;
    window.fetch('/poinject/'+id, {
      headers: { 'Content-Type': 'application/json'},
      method: 'PATCH',
      body: JSON.stringify({ value })
    }).then(res => res.json())
      .then(json => {
        self.setOpts(json.opts);
        console.log(json);
      });
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
        console.log(json);
      });
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
