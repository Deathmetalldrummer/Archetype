import { series, parallel, src, dest, watch } from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import autoprefixer from 'gulp-autoprefixer';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import rename from 'gulp-rename';
import mini from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import fs from 'fs';
import {deleteAsync as del} from 'del';
import browserSync from 'browser-sync';

const devel = 'source/devel/',
		build = 'source/build/';

const paths = {
	pug: {
		src: [devel + '**/*.{pug,jade}', '!**/_*/**', '!**/_*'],
		dest: build
	},
	sass: {
		src: [devel + '**/*.{sass,scss}', '!**/_*/**', '!**/_*'],
		dest: build,
		min: {
			src: [build + '**/*.css', '!**/*.min.css'],
			dest: build
		},
	},
	js: {
		src: [devel + '**/*.js', '!**/_*/**', '!**/_*'],
		dest: build,
		min: {
			src: [build + '**/*.js', '!**/*.min.js'],
			dest: build
		},
		libs: {
			src: [
				// './node_modules/jquery/dist/jquery.js',
				// './node_modules/slick-carousel/slick/slick.js',
				// './node_modules/jquery-validation/dist/jquery.validate.js',
			],
			dest: build + 'assets/libs/',
			min: true,
			single: true
		}
	},
	img: {
		src: devel + '**/_images/**/*.{png,jpg,svg}',
		dest: build + 'assets/images/'
	},
	font: {
		src: devel + '_common/_fonts/**/*.{woff,woff2,ttf}',
		dest: build + 'assets/fonts/'
	},
	other: {
		src: [devel + '**/*', '!**/_*/**', '!**/_*', '!**/*.{js,pug,jade,sass,scss}'],
		dest: build
	},
	watch: {
		pug: devel + '**/*.{pug,jade}',
		sass: devel + '**/*.{sass,scss}',
		js: devel + '**/*.js',
		font: devel + '**/*.{woff,woff2,ttf}',
		img: devel + '**/*.{png,jpg,svg}',
		other: [devel + '**/*', '!**/*.{pug,jade,sass,scss,js}', '!**/_*/**', '!**/_*'],
		build: build + '**/*.{html,css,js}'
	}

};

const prefix = {
	overrideBrowserslist: ['last 5 versions'],
	cascade: false
}


function includeJS(file) {
	const slash_path = file.path.replace(/\\/g, '/');
	const file_path = slash_path.slice(slash_path.indexOf(devel), slash_path.length);

	// const str_from = '//#include("';
	// const str_to = '");';

	file.contents = Buffer.from(result_string(absolute_file(file_path)));
}

function result_string(string) {
	const str_from = '//#include("';
	const str_to = '");';
	const arr = find_path(string);
	for (let i = 0; i < arr.length; i++) {
		string = string.replace(str_from + arr[i] + str_to, absolute_file(arr[i]));
	}

	if (string.indexOf(str_from) > -1) string = result_string(string);

	return string
}

function find_path(string) {
	const str_from = '//#include("';
	const str_to = '");';
	const arr = [];

	if (string.indexOf(str_from) !== -1) getPath(str_from, str_to, 0);

	function getPath(from, to, search) {
		const substr_from = string.indexOf(from, search) + from.length;
		const substr_to = string.indexOf(to, substr_from);
		const res = string.slice(substr_from, substr_to);
		arr.push(res);
		if (string.indexOf(from, substr_to) !== -1) {
			getPath(from, to, substr_to);
		}
	}
	return arr;
}

function absolute_file(some_path) {
	const str_from = '//#include("';
	const parent_folder = some_path.replace(some_path.slice(some_path.lastIndexOf('/') + 1, some_path.length), '').replace(devel, '');
	let file_content = fs.readFileSync(some_path, 'utf8');
	file_content = file_content.replace(/\/\/#include\("/g, str_from + devel + parent_folder);
	return file_content;
}


///////////////////////////////////////////////////////////////////////////////////////
//                                                              PUG
///////////////////////////////////////////////////////////////////////////////////////
function pugToHtml() {
	return src(paths.pug.src)
		.pipe(plumber())
		.pipe(pug())
		.pipe(dest(paths.pug.dest))
}


///////////////////////////////////////////////////////////////////////////////////////
//                                                              SASS
///////////////////////////////////////////////////////////////////////////////////////
//sass - задача для главного файла стилей
function sassToCss() {
	return src(paths.sass.src)
		.pipe(plumber())
		.pipe(sass({}, true).on('error', sass.logError))
		.pipe(autoprefixer(prefix))
		.pipe(dest(paths.sass.dest))
}

function css_min() {
	return src(paths.sass.min.src)
		.pipe(mini())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(dest(paths.sass.min.dest))
}


///////////////////////////////////////////////////////////////////////////////////////
//                                                              JAVASCRIPT
///////////////////////////////////////////////////////////////////////////////////////
function js() {
	return src(paths.js.src)
		.pipe(plumber())
		.on('data',function(file){includeJS(file)})
		.pipe(dest(paths.js.dest))
}

function js_min() {
	return src(paths.js.min.src)
		.pipe(plumber())
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(dest(paths.js.min.dest))
}

function js_libs() {
	const libsSrc = (!paths.js.libs.src || !paths.js.libs.src.length) ? '.' : paths.js.libs.src;
	let stream = src(libsSrc)
		.pipe(plumber());

	if (paths.js.libs.single) {
		stream = stream
			.pipe(concat('libs.js'))
	}

	if (paths.js.libs.min) {
		stream = stream
			.pipe(uglify())
			.pipe(rename({
				suffix: '.min'
			}))
	}

	return stream
		.pipe(dest(paths.js.libs.dest));
}


///////////////////////////////////////////////////////////////////////////////////////
//                                                              COPY
///////////////////////////////////////////////////////////////////////////////////////
function copy_font() {
	return src(paths.font.src)
		.pipe(dest(paths.font.dest))
}

function copy_img() {
	return src(paths.img.src)
		.on('data', function(file) {
			replaceImagePath(file,'_images/','');
		})
		.pipe(dest(paths.img.dest))
}

function copy_other() {
	return src(paths.other.src)
		.pipe(dest(paths.other.dest))
}

function replaceImagePath(file,str,strTo) {
	const filePath = file.path.replace(/\\/g,'/');
	const picIndex = filePath.indexOf(str);
	const develIndex = filePath.indexOf(devel);
	const fromTo = filePath.slice(develIndex+devel.length,picIndex+str.length);

	const parent = fromTo.replace(str, '');
	const parentToIndex = parent.lastIndexOf('/');
	const parentFromIndex = parent.lastIndexOf('/', parentToIndex - 1) + 1;
	let getParent = parent.slice(parentFromIndex, parentToIndex) + '/';
	getParent = getParent[0] === '_' ? getParent.slice(1) : getParent;

	file.path = filePath.replace(fromTo,strTo + getParent);
}


///////////////////////////////////////////////////////////////////////////////////////
//                                                              CLEAN
///////////////////////////////////////////////////////////////////////////////////////
async function cleanBuild() {
	await del(build);
}


///////////////////////////////////////////////////////////////////////////////////////
//                                                              SERVER
///////////////////////////////////////////////////////////////////////////////////////
function server() {
	browserSync.init({
		port: 9000,
		server: {
			baseDir: './'
		}
	});
}



///////////////////////////////////////////////////////////////////////////////////////
//                                                              WATCHING
///////////////////////////////////////////////////////////////////////////////////////
function watching() {
	watch(paths.watch.pug, pugToHtml);
	watch(paths.watch.sass, sassToCss);
	watch(paths.watch.js, js);
	watch(paths.watch.font, copy_font);
	watch(paths.watch.img, copy_img);
	watch(paths.watch.other, copy_other);
	watch(paths.watch.build).on('change', browserSync.reload);
}


///////////////////////////////////////////////////////////////////////////////////////
//                                                              RUN
///////////////////////////////////////////////////////////////////////////////////////

export const _pug = pugToHtml;
export const _sass = series(sassToCss, css_min);
export const _js = series(js, js_min, js_libs);
export const _copy = parallel(copy_font, copy_img, copy_other);
export const _clean = cleanBuild;

export const dev = series(_pug, _sass, _js, _copy);
export const bobydilder = series(_clean, dev);

export default series(dev, parallel(watching, server));
