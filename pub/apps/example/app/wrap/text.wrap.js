riot.tag('wrap-text', false, (opts) => {
  const test = null;
  test && console.time('text-wrap execute');

  // opts = Object.assign({
  //   _textIsTruncated  : null,
  //   text              : '',
  //   truncate          : 5,
  // }, opts);

  opts._textIsTruncated = null;
  opts._editing         = null;
  opts.path             = opts.path         || null;
  opts.text             = opts.text         || opts.path && opts.getValue && opts.getValue(opts.path) || '';
  //opts.getValue         = opts.getValue     || (path) => { return path };
  //opts.onSave
  opts.class            = opts.class        || 'ws:pl ww:nm bd-r-w:1px bd-c:ts fc-bd-c:prim fc-bg:white fc-c:black fux-trans';
  opts.activeClass      = opts.activeClass  || 'fux-boxsh';
  opts.truncate         = opts.truncate     || 200;
  opts.placeholder      = opts.placeholder  || 'enter text';

  //console.log(opts);

  opts.truncateText = (text, truncate) => {
    text      = text     || opts.text;
    truncate  = truncate || opts.truncate;

    opts._textIsTruncated = !!truncate && text.length > truncate;
    return opts._textIsTruncated ? `${text.substring(0, truncate)} ...` : text;
  }

  opts.handleClick = (e) => {
    e.target.contentEditable = 'plaintext-only';
    e.target.focus();
  }

  opts.handleFocus = (e) => {
    opts._editing = true;
    e.target.innerText = opts.text;
    e.target.onblur = opts.handleBlur;
  }

  opts.handleBlur = (e) => {
    opts._editing = null;

    if(opts.text !== e.target.innerText)
      opts.onSave(e.target.innerText, opts.path);

    e.target.innerText = opts.truncateText();
  }

  test && console.timeEnd('text-wrap execute');

  //Object.assign(this, opts);

  // opts.handleBlur = (e) => {
  //   e.target.contentEditable = false;
  // }

  //console.log(this);

  // this.onFocus = (e) => {
  //   console.log(e.target);
  // }

  // this.onClick = (e) => {
  //   console.log('click');
  // }
});
