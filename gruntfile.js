module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		clean: ['dist'],
		bower: {
            install: {
                options: {
                    targetDir: "dist/lib",
                    layout: "byComponent",
                    cleanTargetDir: false
                }
            }
        },
        buildMetalsmith: {
        	site: {

        	}
        },
		watch:{
			src:{
				files:[
					'src/**/*',
					'templates/**/*'
				],
				tasks:[
					'buildMetalsmith'
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
					base: 'dist',
					open: true,
					hostname: "localhost"
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['clean', 'bower', 'buildMetalsmith']);
	grunt.registerTask('dev', ['default', 'connect', 'watch'])

	grunt.registerMultiTask('buildMetalsmith', 'Runs metalsmith', function() {		
		var done = this.async(),
			metalsmithBuild;

		try{
			metalsmithBuild = require('./metalsmithBuild.js');
			metalsmithBuild(done);
		}
		catch (err){
			done(err);
		}
	});
};