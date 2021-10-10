const Simulation = require('./SampleSimulation');

function simulate(obj) {
    console.info(obj);
    return true;
};

// let serializedFunction = ;
// let actualFunction = new Function('return ' + serializedFunction)();

const fs = require('fs');
const { stringify } = require('querystring');

fs.writeFile("Simulation.json", Simulation.simulate.toString(), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 
