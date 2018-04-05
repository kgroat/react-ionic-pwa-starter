
import { TemplateFunction, Data } from 'ejs'

const pkg = require('../../../package.json')
const defaultStyle = require('../templates/defaultStyle.scss')
const templateContext = require.context('../templates', true)

export { Data }

export const defaultData = {
  defaultStyle,
  package: pkg,
}

export function getTemplate (templatePath: string): TemplateFunction {
  return templateContext(`./${templatePath}`)
}

export function renderTemplate (templatePath: string, data: Data): string {
  const template = getTemplate(templatePath)

  data = {
    defaultStyle,
    package: pkg,
    ...data,
  }

  return template(data)
}
