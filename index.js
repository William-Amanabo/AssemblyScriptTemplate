var path = require('path')
const express = require('express');

var app = express();
const port =8000;

// const fs = require("fs");
// const loader = require("@assemblyscript/loader");
// const imports = { /* imports go here */ };
// const wasmModule = loader.instantiateSync(fs.readFileSync(__dirname + "/build/optimized.wasm"), imports);
// module.exports = wasmModule.exports;

app.use(express.static(path.join(__dirname,'/build')))

app.get('/',(req,res)=>res.sendFile(__dirname+'/index.html'))
app.get('/optimized.wasm',(req,res)=>{
    res.type('application/wasm')
    res.sendFile(__dirname+'/build/optimized.wasm')})
app.listen(port,(err)=>{
    if (err) console.log('Error reading from server')
    else console.log("server running on port 8000")
})

