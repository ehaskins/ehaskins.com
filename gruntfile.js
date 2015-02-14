module.exports = function(grunt) {
    var Handlebars  = require('handlebars'),
    	fs = require('fs'),
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

	// Project configuration.
	grunt.initConfig({
		metalsmith: {
			staticSiteExample: {
				options: {
					metadata: {
						title: 'My Blog',
						description: 'My second, super-cool blog.'
					},
					plugins: {
						'metalsmith-collections': {
							pages: {
								pattern: 'pages/*.md'
							},
							posts: {
								pattern: 'posts/*.md',
								sortBy: 'date',
								reverse: true
							}
						},
						'metalsmith-proxy': findTemplate({
					        pattern: 'posts',
					        templateName: 'post.hbt'
					    }),
						'metalsmith-markdown': {},
						'metalsmith-permalinks': {
							pattern: 'posts/:title'
						},
						'metalsmith-templates': {
							engine: 'handlebars'
						}
					}
				},
				src: 'src',
				dest: 'build'
			}
		},
		watch:{
			src:{
				files:[
					'src/*',
					'templates/*'
				],
				tasks:[
					'metalsmith'
				]
			}
		},
		serve:{
			options:{
				port: 3000,
				path: '/build'
			}
		}
	});

	grunt.loadNpmTasks('grunt-serve');
	grunt.loadNpmTasks('grunt-metalsmith');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', ['metalsmith']);
	grunt.registerTask('dev', ['default', 'watch'])
};