
import * as Generator from 'yeoman-generator'
import * as path from 'path'
import * as fs from 'fs'

interface Replacer {
  test: RegExp
  value: (() => string) | string
}

export default abstract class CopyTemplateGenerator<TOpts> extends Generator {
  options: TOpts

  abstract replacers: Replacer[]

  constructor (args, opts) {
    super(args, opts)
    this.on('error', (err) => {
      if (err) {
        console.error(err)
      }

      process.exit(1)
    })
  }

  protected get allReplacers (): Replacer[] {
    return this.replacers.concat(
      {
        test: /\.tmpl/g,
        value: '',
      },
    )
  }

  protected copyTemplateDirRecursive (location: string, relative: string = '.') {
    fs.mkdirSync(path.join(relative))
    const children = fs.readdirSync(location)
    children.forEach(child => {
      const fullPath = path.join(location, child)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        this.copyTemplateDirRecursive(fullPath, path.join(relative, child))
      } else {
        this.copyTemplate(fullPath, relative)
      }
    })
  }

  protected copyTemplate (file: string, relativePath: string) {
    const templateString = fs.readFileSync(file).toString()
    const content = this.runReplacers(templateString)
    this.writeFile(path.basename(file), content, relativePath)
  }

  protected writeFile (filename: string, content: string, relativePath: string) {
    filename = this.runReplacers(filename)
    const fullPath = path.join(relativePath, filename)
    console.log(`Writing ${fullPath} ...`)
    fs.writeFileSync(fullPath, content)
  }

  protected runReplacers (original: string): string {
    let currentVal = original
    this.replacers.forEach(({ test, value }) => {
      if (typeof value === 'function') {
        value = value()
      }
      if (!test.global) {
        test = new RegExp(test, `${test.flags}g`)
      }

      currentVal = currentVal.replace(test, value)
    })

    return currentVal
  }
}
