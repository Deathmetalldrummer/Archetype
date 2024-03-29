var fs = require('fs');
var source = './source/devel/_layout/'

function generate() {
	var args = arguments[0];
	for (var i = 2; i < args.length; i++) {
		var arg = '_' + args[i];
		var _dir = source+arg;
		var _file = _dir+"/"+arg;

		fs.appendFile(source+'_mounting.js','\n//#include("./'+arg+'/'+arg+'.js");',cb)
		fs.appendFile(source+'_mounting.pug','\ninclude ./'+arg+'/'+arg,cb)
		fs.appendFile(source+'_mounting.sass','\n@import "./'+arg+'/'+arg+'"',cb)

		fs.mkdir(_dir, { recursive: true }, cb);
		fs.mkdir(_dir + '/_images/', { recursive: true }, cb);

		fs.writeFile(_dir + '/_images/.gitkeep','',cb);
		fs.writeFile(_file + '.pug','',cb);
		fs.writeFile(_file + '.sass','',cb);
		fs.writeFile(_file + '.js','',cb);
	}
}
function cb(err){
	// console.log(err);
};
generate(process.argv);
