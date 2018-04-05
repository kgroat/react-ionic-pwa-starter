"use strict";
const path = require("path");
const fs = require("fs");
const FileTemplateGenerator_1 = require("../../base/FileTemplateGenerator");
module.exports = class ContainerGenerator extends FileTemplateGenerator_1.default {
    constructor(args, opts) {
        super(args, opts);
        this.replacers = [
            {
                test: /COMPONENT_NAME/g,
                value: () => this.options.componentName
            }
        ];
        this.argument('componentName', { type: String, required: true });
        this.option('rootDir', { description: 'The source root directory', alias: 'r', type: String, default: 'src/app' });
        this.location = path.join(this.options.rootDir, 'containers', `${this.options.componentName}View`);
    }
    checkExistance() {
        if (fs.existsSync(this.location)) {
            return Promise.reject(`Error: Container ${this.options.componentName}View already exists!`);
        }
    }
    copyFiles() {
        const templateDir = path.join(__dirname, 'templates');
        this.copyTemplateDirRecursive(templateDir, this.location);
    }
};
