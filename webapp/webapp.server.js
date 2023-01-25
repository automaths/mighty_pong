const express = require('express');
const port = 3000;
const path = require('path');
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, function(){
    console.log("Running on " + port);
});