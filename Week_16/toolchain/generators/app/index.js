var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    initPackage(){
        const pkgJson = {
            devDependencies: {
              eslint: '^3.15.0'
            },
            dependencies: {
              react: '^16.2.0'
            }
        };

        // Extend or create package.json file in destination path
        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
        this.npmInstall();
    }

    async step1() {
        this.fs.copyTpl(
            this.templatePath('t.html'),
            this.destinationPath('public/index.html'),
            { title: 'Templating with Yeoman' }   // 传一个json 给.html，给<%  %>空位填上内容。
        );
    }
};