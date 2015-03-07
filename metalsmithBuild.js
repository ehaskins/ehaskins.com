(function(){
	'use strict';

	module.exports = function(includeDrafts, done){
		var Metalsmith  = require('metalsmith'),
			markdown    = require('metalsmith-markdown'),
			templates   = require('metalsmith-templates'),
			collections = require('metalsmith-collections'),
			permalinks  = require('metalsmith-permalinks'),
			excerpts		= require('metalsmith-excerpts'),
			drafts			= require('metalsmith-drafts'),
			Handlebars  = require('handlebars'),
			fs          = require('fs'),
    		moment      = require('moment'),
    		metadata	= {
				sitename: "Eric Haskins",
				description: "A blog of things and stuff",
				baseUrl: "http://ehaskins.com/",
				feedUrl: "http://ehaskins.com/feed.xml"
			},
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
			var p, i;
			for (i = 0; i < partials.length; i++){
				p = partials[i];
				Handlebars.unregisterPartial(p);
				Handlebars.registerPartial(p, fs.readFileSync('./templates/' + p + '.hbt').toString());
			}
		}

		registerPartials([
			'_header',
			'_footer',
			'_nav',
			'_post'
			]);

		Handlebars.registerHelper('xmldate', function(date) {
		    return moment(date).format('ddd, DD MMM YYYY HH:mm:ss ZZ');
		});

		Handlebars.registerHelper('sitemapdate', function(date) {
		    return moment(date).format('YYYY-MM-DD');
		});

		Handlebars.registerHelper('date', function(date) {
		    return moment(date).format('MMMM Do, YYYY');
		});

		Handlebars.registerHelper('postInfo', function() {
			var out = "";
			if (this.date){
				out += moment(this.date).format('MMMM Do, YYYY');
			} else {
				out += "sometime"
			}

			if (this.author){
				out += " by " + this.author;
			} else {
				out += " by someone"
			}
		    return out;
		});

		Handlebars.registerHelper('link', function(path) {
		    return '/' + path;
		});
		
		Handlebars.registerHelper('abslink', function(path) {
		    return metadata.baseUrl + path;
		});

		var metalsmith = new Metalsmith(__dirname);
		if (!includeDrafts){
			metalsmith
				.use(drafts());
		}
		metalsmith
			.source('src')
			.clean(false)
			.metadata(metadata)
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
			.use(function(files, metalsmith, done){
				Object.keys(files).forEach(function(key){
					var file = files[key];
					file.original = file.contents.toString();
				});
				done();
			})
			.use(templates('handlebars'))
			.destination('dist')
			.build(function(err) {
				if (err)
					done(err);
				console.log('Built files in ' + metalsmith.source() + ' to ' + metalsmith.destination());
				done();
			});
	};
}());
