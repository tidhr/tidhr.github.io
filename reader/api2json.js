var fs = require('fs');
var mddata = fs.readFileSync('api.md', {encoding:'utf8'});
fs.writeFileSync('api.json', JSON.stringify({"content": mddata}), {encoding:'utf8'});
