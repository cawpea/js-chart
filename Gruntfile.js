module.exports = function (grunt) {
	grunt.initConfig({
		connect: {
			local: {
				options: {
					keepalive: true,
					port: 9000
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.registerTask('default', ['connect']);
};
