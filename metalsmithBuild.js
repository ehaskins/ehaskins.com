module.exports = function(){
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

	Metalsmith(__dirname)
		.source('src')
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
		.use(findTemplate({
			pattern: 'posts',
			templateName: 'post.hbt'
		}))
		.use(permalinks('posts/:title'))
		.use(templates('handlebars'))
		.destination('build')
		.build(function(err) {
			if (err) throw err;
		});
};