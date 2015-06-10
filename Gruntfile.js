module.exports = function(grunt) {

    // 0. Speed up the grunt
    require('jit-grunt')(grunt);

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        concat: {
            main: {
                src: ['src/js/main.js'],
                dest: 'build/assets/js/global.js'
            },
            plugins:{
                src: ['src/js/tree.jquery.js'],
                dest: 'build/assets/js/plugins.js'
            }
        },

        uglify: {
            my_target: {
                options: {
                    sourceMap: true
                },
                files: {
                    'build/assets/js/plugins.min.js': ['build/assets/js/plugins.js'],
                    'build/assets/js/global.min.js': ['build/assets/js/global.js']
                }
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'build/assets/img/'
                }],
                options: {
                    cache: false
                }
            }
        },

        concurrent: {
            first: {
              tasks: ['css', 'js', 'jade']
            }
        },

        watch: {
            options: {
                livereload: true,
            },
            scripts: {
                files: ['src/js/*.js'],
                tasks: ['concat', 'uglify', 'notify:js'],
                options: {
                    spawn: false,
                },
            },
            css: {
                files: ['src/**/*.scss'],
                tasks: ['sass:dist', 'notify:css'],
                options: {
                    spawn: false,
                }
            },
            html: {
                options: {
                    livereload: true
                },
                files: ['**/*.jade']
            },
        },

        jade: {
            compile: {
                options: {
                	pretty: true,
                    data: {
                        debug: false
                    }
                },
                files: {
                    "build/index.html": ["src/jade/index.jade"]
                }
            }
        },

        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    compass: true
                },
                files: {
                    'build/assets/css/main.css': 'src/scss/main.scss'
                }
            }
        },

        notify: {
            css: {
                options: {
                    enabled: true,
                    title: 'Grunt Complete', // optional
                    message: '[sass:dist] finished', //required
                }
            },
            js: {
                options: {
                    enabled: true,
                    title: 'Grunt Complete', // optional
                    message: '[scripts] finished', //required
                }
            }
        },

        serve: {
            'path': './build',
            options: {
                port: 9000
            }
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('css', ['sass:dist']);
    grunt.registerTask('js', ['concat', 'uglify']);
    grunt.registerTask('img', ['imagemin']);
    grunt.registerTask('default', ['concat', 'uglify', 'imagemin', 'jade', 'sass:dist', 'watch']);
    grunt.registerTask('me', 'concurrent:first');
};
