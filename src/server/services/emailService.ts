
import { createTestAccount, createTransport, getTestMessageUrl, Transporter } from 'nodemailer'
import * as xoauth2 from 'xoauth2'

import { UserUNSAFE } from 'models/user'
const { noreplyEmail } = require('../../../package.json')

import { singletonPromise } from './singletonPromise'
import { renderTemplate, Data } from './templateService'


export const getTransport = singletonPromise(async () => {
  if (__DEV__) {
    const testAccount = await createTestAccount()

    const { user, pass, smtp } = testAccount
    const { host, port, secure } = smtp
    return createTransport({
      host,
      port,
      secure: false,
      auth: {
        user,
        pass,
      }
    })
  } else {
    if (!process.env.TRANSPORT_AUTH) {
      const err = 'Sending emails in production requires setting the $TRANSPORT_AUTH environment variable'
      console.error(err)
      process.exit(1)
      throw new Error(err)
    }

    return createTransport(JSON.parse(process.env.TRANSPORT_AUTH))
  }
})

function formatEmails (emails: string | string[]): string {
  return emails instanceof Array
       ? emails.join(', ')
       : emails
}

interface TemplateEmailOptions {
  templateName: string
  templateData: Data
  senderName?: string
  senderEmail?: string
  to: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  subject: string
}

export async function sendEmailFromTemplate (options: TemplateEmailOptions) {
  const {
    senderName = 'noreply',
    senderEmail = noreplyEmail,
    to,
    cc = '',
    bcc = '',
    subject,
    templateName,
    templateData,
  } = options

  const from = `${senderName} <${senderEmail}>`

  const transporter = await getTransport()
  const html = renderTemplate(templateName, templateData)
  const info = await transporter.sendMail({
    from,
    to: formatEmails(to),
    cc: formatEmails(cc),
    bcc: formatEmails(bcc),
    subject,
    html,
  })

  if (__DEV__) {
    console.log('email viewing url:', getTestMessageUrl(info))
  }

  return info
}

export async function sendVerifyEmail (user: UserUNSAFE) {
  const templateData = {
    user,
  }
  return sendEmailFromTemplate({
    to: user.email,
    subject: 'Verify your email',
    templateName: 'emails/verifyEmail.ejs',
    templateData,
  })
}
