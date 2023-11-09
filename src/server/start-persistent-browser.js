const spawn = require('child_process').exec;
const net = require('net');
const {sleep, isRunningInDocker} = require('../helpers/helpers.js')
var config = require('../config.js');
var runHeadless = config.chrome_use_headless
var launch_flags = config.chrome_launch_flags

async function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    server.once('listening', () => {
      server.close();
      resolve(false);
    });

    server.listen(port, '127.0.0.1');
  });
}

function execute(command){
	const chromeProcess = spawn(command, { detached: true, stdio: ['ignore','ignore','ignore']});
	chromeProcess.unref();
}

async function runBrowser(){
	if(runHeadless || isRunningInDocker()){
		console.log("Running headless browser")
		runHeadless = true;
		launch_flags = ' -headless=new ' + launch_flags
	}
	else{
		console.log("Running headed browser")
	}

	const command = 'nohup ' + config.chrome_filepath + ' ' + launch_flags;
	console.log("Opening browser")
	execute(command)
	// waiting for the browser to open
	await sleep(1000)
}

async function runPersistentBrowser(){
	if(!await isPortInUse(9222)){
		await runBrowser();
	}
}

(async () => {
	setInterval(async () => {
		await runPersistentBrowser()
	}, 1000);
})();