import { Resend } from 'resend';
import { envs } from 'src/config/envs';
import { PASSWORD_RESET } from './email-templates/password-reset';

const resend = new Resend(envs.RESEND_KEY);

type SendEmail = {
  email: string;
  template: {
    type: 'password-reset';
    data: {
      code: number | string;
      name: string;
      minutes: number;
    };
  };
};

export const sendEmail = async ({ email, template }: SendEmail) => {
  const selectedTemplate = TEMPLATES[template.type];
  if (!selectedTemplate) throw new Error('Template not found');

  const { subject, html } = selectedTemplate;

  await resend.emails.send({
    from: 'retrospective-util@resend.dev',
    to: email,
    subject,
    html: injectDynamicData(html, template.data),
  });
};

const injectDynamicData = (html: string, data?: Record<string, any>) => {
  if (!data) return html;

  Object.entries(data).forEach(([key, value]) => {
    console.log(key);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    html = html.replaceAll(`{{${key}}}`, value);
  });

  return html;
};

const TEMPLATES = {
  ...PASSWORD_RESET,
} as const;
