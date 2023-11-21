var config = {};

config.chrome_filepath = '/usr/bin/google-chrome-stable';
config.chrome_launch_flags = [
    '--disable-ipc-flooding-protection',
    '--no-default-browser-check'
];
config.chrome_use_headless = false
config.to_reload_pages = true
config.page_reload_timeout = 1000 * 5  // in ms

module.exports = config

