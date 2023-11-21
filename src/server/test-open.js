const {getContext} = require('./start-persistent-context.js');

(async() =>{
    const port = await getContext("testId")
    console.log(port)

    const port1 = await getContext("testId2")
    process.exit(0)
})()
