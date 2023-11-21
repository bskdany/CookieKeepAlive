const {getContext} = require('./start-persistent-context.js');

(async() =>{
    const port = await getContext("test")
    console.log(port)

    const port1 = await getContext("testId2")
    console.log(port1)

    const port2 = await getContext("test")
    console.log(port2)

    // process.exit(0)
})()
