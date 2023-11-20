var config = {};

config.chrome_filepath = '/usr/bin/google-chrome-stable';
config.chrome_launch_flags = [
    '--remote-debugging-port=9222',
    '--disable-ipc-flooding-protection',
    '--no-default-browser-check'
];
config.chrome_use_headless = false
config.to_reload_pages = true
config.page_reload_timeout = 1000 * 5  * 60 // in ms

module.exports = config

