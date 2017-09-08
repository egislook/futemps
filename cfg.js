module.exports = ((appName = 'example') => {
  cfg = {
    appPath:          `${__dirname}/pub/apps/${appName}`,
    viewPath:         `${__dirname}/pub/apps/${appName}/app`,
    pubPath:          `${__dirname}/pub/apps/${appName}`,
    assetsPath:       `${__dirname}/pub/assets`,
    storesPath:       `${__dirname}/pub/assets/stores`,
    mixinsPath:       `${__dirname}/pub/assets/mixins`,
    filesPath:        `${__dirname}/pub/assets/files`,

    rootFilename:     'index.html',
    contentFilename:  'content.json',

    filesUrl: '/assets/files',

  };
  cfg.rootFilePath =    (() => `${cfg.appPath}/${cfg.rootFilename}`)();
  cfg.contentFilePath = (() => `${cfg.appPath}/${cfg.contentFilename}`)();

  return cfg;
})();
