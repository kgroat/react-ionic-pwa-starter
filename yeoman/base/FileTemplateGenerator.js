"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Generator = require("yeoman-generator");
const path = require("path");
const fs = require("fs");
class CopyTemplateGenerator extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.on('error', (err) => {
            if (err) {
                console.error(err);
            }
            process.exit(1);
        });
    }
    get allReplacers() {
        return this.replacers.concat({
            test: /\.tmpl/g,
            value: '',
        });
    }
    copyTemplateDirRecursive(location, relative = '.') {
        fs.mkdirSync(path.join(relative));
        const children = fs.readdirSync(location);
        children.forEach(child => {
            const fullPath = path.join(location, child);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                this.copyTemplateDirRecursive(fullPath, path.join(relative, child));
            }
            else {
                this.copyTemplate(fullPath, relative);
            }
        });
    }
    copyTemplate(file, relativePath) {
        const templateString = fs.readFileSync(file).toString();
        const content = this.runReplacers(templateString);
        this.writeFile(path.basename(file), content, relativePath);
    }
    writeFile(filename, content, relativePath) {
        filename = this.runReplacers(filename);
        const fullPath = path.join(relativePath, filename);
        console.log(`Writing ${fullPath} ...`);
        fs.writeFileSync(fullPath, content);
    }
    runReplacers(original) {
        let currentVal = original;
        this.replacers.forEach(({ test, value }) => {
            if (typeof value === 'function') {
                value = value();
            }
            if (!test.global) {
                test = new RegExp(test, `${test.flags}g`);
            }
            currentVal = currentVal.replace(test, value);
        });
        return currentVal;
    }
}
exports.default = CopyTemplateGenerator;
