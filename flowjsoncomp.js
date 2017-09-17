var fs = require('fs');
var path = require("path");
var ncp = require("copy-paste");


var param1 = process.argv[2]; // `input dir`

function getfiles(p, f, nodes, attrs) {
    var files = fs.readdirSync(p);
    files.forEach(function (file) {
        var fp = path.join(p, file);
        if (fs.statSync(fp).isDirectory()) {
            getfiles(fp, f, nodes, attrs);
        } else {
            f.push(fp);
            if (path.basename(fp) == "_node.json") {
                nodes.push(JSON.parse(fs.readFileSync(fp, 'utf-8')));
            } else {
                attrs[path.basename(p) + "-" + path.basename(fp).replace(path.extname(fp), "")] = fs.readFileSync(fp, 'utf-8');
            }
        }
    });
}
var filelist = [];
var nodes = [];
var attrs = {};
var targetpath = param1;
getfiles(targetpath, filelist, nodes, attrs);

nodes.forEach(function (value) {
    for (var key in value) {
        var v = value[key];
        console.log(value.type + "-" + value.id + "-" + key);
        var nodekey = value.type + "-" + value.id + "-" + key;
        if (attrs.hasOwnProperty(nodekey)) {
            console.log(attrs[nodekey]);
            value[key] = attrs[nodekey];
        }
    }
});
console.log(JSON.stringify(nodes, null, "  "));

var flowjson = JSON.stringify(nodes, null, "  ");
var flowfile = path.join(path.dirname(targetpath), "flow.json");
console.log(flowfile);

fs.writeFile(flowfile, flowjson, function (err) {
    console.log(err);
});
