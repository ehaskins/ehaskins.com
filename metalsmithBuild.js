module.exports = function(done){
	var Metalsmith  = require('metalsmith'),
		markdown    = require('metalsmith-markdown'),
		templates   = require('metalsmith-templates'),
		collections = require('metalsmith-collections'),
		permalinks  = require('metalsmith-permalinks'),
		excerpts	= require('metalsmith-excerpts'),
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

	function registerPartials(partials){
		var p;
		for (i = 0; i < partials.length; i++){
			p = partials[i];
			Handlebars.registerPartial(p, fs.readFileSync('./templates/' + p + '.hbt').toString());
		}
	}

	registerPartials([
		'_header',
		'_footer',
		'_nav',
		'_post'
		]);


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
		.use(excerpts())
		.use(findTemplate({
			pattern: 'posts',
			templateName: 'post.hbt'
		}))
		.use(permalinks('posts/:title'))
		.use(function(files, metalsmith, done){
			files['posts/index.html'] = {
				title: 'Archive',
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