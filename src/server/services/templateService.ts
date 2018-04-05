
import { TemplateFunction, Data } from 'ejs'

const pkg = require('../../../package.json')
const defaultStylesObject = require('../templates/defaultStyle.scss')
const templateContext = require.context('../templates', true)

export { Data }

const uppercase = /^[A-Z]$/
function fixStyleProp (prop: string) {
  return prop.split('').map(char => {
    if (uppercase.test(char)) {
      char = `-${char.toLowerCase()}`
    }
    return char
  }).join('')
}

function styleObjectToString (style: { [key: string]: string }): string {
  const styleItems: string[] = []
  Object.keys(style).forEach(styleProp => {
    styleItems.push(`${fixStyleProp(styleProp)}:${style[styleProp]}`)
  })
  return styleItems.join(';')
}

let defaultData

function getDefaultData () {
  if (!defaultData) {
    const defaultStyles: { [key: string]: string } = {}
    Object.keys(defaultStylesObject).forEach(styleName => {
      defaultStyles[styleName] = styleObjectToString(defaultStylesObject[styleName])
    })

    console.log('default styles', defaultStyles)

    defaultData = {
      defaultStyles,
      package: pkg,
    }
  }
  return defaultData
}

export function getTemplate (templatePath: string): TemplateFunction {
  return templateContext(`./${templatePath}`)
}

export function renderTemplate (templatePath: string, data: Data): string {
  const template = getTemplate(templatePath)

  data = {
    ...getDefaultData(),
    ...data,
  }

  return template(data)
}
