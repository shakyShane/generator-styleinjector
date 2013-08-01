'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var exec = require('child_process').exec;
//var grunt = require('grunt-cli');

var FrontendappGenerator = module.exports = function FrontendappGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(FrontendappGenerator, yeoman.generators.Base);

FrontendappGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [
    {
      type: 'input',
      name: 'name',
      default: 'Front End App',
      message: 'What\'s the name of this project?'
    },
    {
      type: 'input',
      name: 'port',
      default: '8090',
      message: 'Which port can SOCKET.IO run on?'
    },
    {
      type: 'confirm',
      name: 'grunt',
      default: true,
      message: 'Do you want a Grunt setup that includes SASS (with compass) & RequireJS'
    },
    {
      type: 'confirm',
      name: 'styleInject',
      default: true,
      message: 'Do you want the Style Injector Scripts?'
    },
    {
      type: 'input',
      name: 'fileType',
      default: 'php',
      message: 'What type of file do you want the script-loader to be? (PHP or HTML)'
    },
    {
      type: 'input',
      name: 'assetPath',
      default: 'skin/frontend/boilerplate/default',
      message: 'What\'s the path to your assets? (relative to this directory)'
    }
  ];

  this.prompt(prompts, function (props) {
    this.name = props.name;
    this.port = props.port;
    this.grunt = props.grunt;
    this.styleInject = props.styleInject;
    this.fileType  = props.fileType;
    this.assetPath  = props.assetPath;

    var _this = this;
    var child = exec("ifconfig", function(err, stdout, stderr) {
      if (err) throw err;

      var match = /192.168([^ ]*)/.exec(stdout);

      _this.hostIp = match[0];
      cb();

    });

  }.bind(this));
};

FrontendappGenerator.prototype.app = function app() {

  if (this.grunt) {
    this.template('_package.json', 'package.json');
    this.template('_Gruntfile.js', 'Gruntfile.js');
  }

  if (this.styleInject) {
    this.template('_styleinjector.php', 'styleinjector.' + this.fileType);
    this.template('_styleinjector.js', 'styleinjector.js');
  }

};

FrontendappGenerator.prototype.projectfiles = function projectfiles() {

};
