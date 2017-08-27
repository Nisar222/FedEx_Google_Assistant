
const lookup = require('country-data').lookup;

var cntry = lookup.countries({alpha2: 'BE'});  
console.log( cntry[0].name); 