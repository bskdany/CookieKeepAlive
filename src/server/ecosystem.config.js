module.exports = {
    apps: [
      {
        name: 'server',
        script: './server-start.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
      },
      {
        name: 'page-reloader',
        script: './page-reloader.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
      },
    ],
  };
  