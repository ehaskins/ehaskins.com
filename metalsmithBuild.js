module.exports = function(done){
	var Metalsmith  = require('metalsmith'),
		markdown    = require('metalsmith-markdown'),
		templates   = require('metalsmith-templates'),
		collections = require('metalsmith-collections'),
		permalinks  = require('metalsmith-permalinks'),
		Handlebars  = require('handlebars'),
		fs          = require('fs');
		findTemplate = function(config) {
		    var pattern = new RegExp(config.pattern);

		    return function(files, metalsmith, done) {

		        for (var file in files) {
		            if (pattern.test(file)) {
		                var _f = files[file];
		                if (!_f.template) {
		                    _f.template = config.templateName;
		                }
		            }
		        }
		        done();
		    };
		};

	Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.hbt').toString());
	Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.hbt').toString());
	Handlebars.registerPartial('nav', fs.readFileSync(__dirname + '/templates/partials/nav.hbt').toString());
	Handlebars.registerHelper('link', function(path) {
	    return '/' + path;
	});

	var metalsmith = new Metalsmith(__dirname);
	
	metalsmith
		.clean(false)
		.use(collections({
			pages: {
				pattern: 'pages/*.md'
			},
			posts: {
				pattern: 'posts/*.md',
				sortBy: 'date',
				reverse: true
			}
		}))
		.use(markdown())
		.use(findTemplate({
			pattern: 'posts',
			templateName: 'post.hbt'
		}))
		.use(permalinks('posts/:title'))
		.use(function(files, metalsmith, done){
			files['posts/index.html'] = {
				title: 'Archive',
				mode: '0666',
				contents: new Buffer(''),
				template: 'posts.hbt'
			};
			done();
		})
		.use(templates('handlebars'))
		.destination('dist')
		.build(function(err) {
			if (err) done(err);
			console.log('Built files in ' + metalsmith.source() + ' to ' + metalsmith.destination());
			done();
		});
};