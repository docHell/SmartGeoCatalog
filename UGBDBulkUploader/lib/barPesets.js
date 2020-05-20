const _colors = require('colors');
 
module.exports = {
    format: _colors.red(' {bar}') + ' {percentage}% | Time passed: {eta}s | {value}/{total} | File: {file} ',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591'
};