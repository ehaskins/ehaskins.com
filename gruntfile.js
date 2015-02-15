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
		clean: ['build'],
		bower: {
            install: {
                options: {
                    targetDir: "build/lib",
                    layout: "byComponent",
                    cleanTargetDir: false
                }
            }
        },
		metalsmith: {
			staticSiteExample: {
				options: {
					clean: false,
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
			},
			bower:{
				files:[
					'bower.json'
				],
				tasks:[
					'bower'
				]
			}
		},
		connect: {
			server: {
				options: {
					port: 9001,
					base: 'build',
					open: true,
					hostname: "localhost"
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-metalsmith');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Default task(s).
	grunt.registerTask('default', ['clean', 'bower', 'metalsmith']);
	grunt.registerTask('dev', ['default', 'connect', 'watch'])
};