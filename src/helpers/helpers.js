const { exec } = require('child_process');
const net = require('net');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isRunningInDocker() {
    return process.env.DOCKER_CONTAINER === 'true';
}

async function isPortInUse(port) {
	return new Promise((resolve, reject) => {
		const server = net.createServer();

		server.once('error', (err) => {
			if (err.code === 'EADDRINUSE') {
				resolve(true);
			} else {
				reject(err); // Handle unexpected errors
			}
		});

		server.once('listening', () => {
			server.close();
			resolve(false);
		});

		server.listen(port, '0.0.0.0');
		server.unref(); 
	});
}

module.exports = {
    sleep,
    isRunningInDocker,
    isPortInUse,
}