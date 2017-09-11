var a = require('./A');
function avg() {
    //arguments ->[12,23,34,45,56]
    var total = a.sum.apply(null, arguments);
    return (total / arguments.length).toFixed(2);
}
module.exports = {
    avg: avg
};