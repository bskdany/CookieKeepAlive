module.exports = {
    apps: [
      {
        name: 'browser',
        script: 'src/server/start-persistent-browser.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
      },
      {
        name: 'page-reloader',
        script: 'src/server/page-reloader.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
      },
    ],
  };
  