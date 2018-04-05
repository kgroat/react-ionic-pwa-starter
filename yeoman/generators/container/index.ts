
import * as path from 'path'
import * as fs from 'fs'

import FileTemplateGenerator from '../../base/FileTemplateGenerator'

interface Options {
  componentName: string
  rootDir: string
}

export = class ContainerGenerator extends FileTemplateGenerator<Options> {
  location: string
  replacers = [
    {
      test: /COMPONENT_NAME/g,
      value: () => this.options.componentName
    }
  ]

  constructor(args, opts) {
    super(args, opts)
    this.argument('componentName', { type: String, required: true })
    this.option('rootDir', { description: 'The source root directory', alias: 'r', type: String, default: 'src/app' })

    this.location = path.join(this.options.rootDir, 'containers', `${this.options.componentName}View`)
  }

  checkExistance () {
    if (fs.existsSync(this.location)) {
      return Promise.reject(`Error: Container ${this.options.componentName}View already exists!`)
    }
  }

  copyFiles () {
    const templateDir = path.join(__dirname, 'templates')
    this.copyTemplateDirRecursive(templateDir, this.location)
  }
}
