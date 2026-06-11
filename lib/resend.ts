import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'hub@vivesmedia.com'
const FROM_NAME = 'vivesmedia.com'

export async function sendInvitationEmail({
  to,
  clientName,
  projectName,
  magicLink,
}: {
  to: string
  clientName: string
  projectName: string
  magicLink: string
}) {
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to,
    subject: `Accédez à votre espace projet — ${projectName}`,
    html: emailLayout(`
      <h2 style="margin: 0 0 16px; font-size: 20px;">Bonjour ${clientName},</h2>
      <p style="margin: 0 0 12px; color: #374151;">Votre espace projet <strong>${projectName}</strong> est prêt.</p>
      <p style="margin: 0 0 24px; color: #374151;">Cliquez ci-dessous pour y accéder :</p>
      <a href="${magicLink}" style="${btnStyle}">Accéder à mon espace →</a>
      <p style="margin: 24px 0 0; font-size: 13px; color: #9ca3af;">Ce lien est valable 24h. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
    `),
  })
}

export async function sendPhaseChangeEmail({
  to,
  clientName,
  projectName,
  phaseLabel,
  dashboardUrl,
  note,
}: {
  to: string
  clientName: string
  projectName: string
  phaseLabel: string
  dashboardUrl: string
  note?: string
}) {
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to,
    subject: `${projectName} — Nouvelle étape : ${phaseLabel}`,
    html: emailLayout(`
      <h2 style="margin: 0 0 16px; font-size: 20px;">Bonjour ${clientName},</h2>
      <p style="margin: 0 0 12px; color: #374151;">Votre projet <strong>${projectName}</strong> a avancé.</p>
      <div style="background: #f9fafb; border-left: 3px solid #111; padding: 12px 16px; margin: 0 0 24px; border-radius: 4px;">
        <p style="margin: 0; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Nouvelle étape</p>
        <p style="margin: 4px 0 0; font-size: 18px; font-weight: 600; color: #111;">${phaseLabel}</p>
      </div>
      ${note ? `<p style="margin: 0 0 24px; color: #374151; font-style: italic;">"${note}"</p>` : ''}
      <a href="${dashboardUrl}" style="${btnStyle}">Voir mon espace →</a>
    `),
  })
}

export async function sendNewFileEmail({
  to,
  clientName,
  projectName,
  fileName,
  fileCategory,
  dashboardUrl,
}: {
  to: string
  clientName: string
  projectName: string
  fileName: string
  fileCategory: string
  dashboardUrl: string
}) {
  const categoryLabels: Record<string, string> = {
    file: 'document',
    maquette: 'maquette',
    invoice: 'facture',
  }
  const label = categoryLabels[fileCategory] ?? 'fichier'

  return resend.emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to,
    subject: `${projectName} — Nouveau ${label} disponible`,
    html: emailLayout(`
      <h2 style="margin: 0 0 16px; font-size: 20px;">Bonjour ${clientName},</h2>
      <p style="margin: 0 0 24px; color: #374151;">Un nouveau <strong>${label}</strong> a été ajouté à votre espace projet <strong>${projectName}</strong> :</p>
      <div style="background: #f9fafb; padding: 12px 16px; margin: 0 0 24px; border-radius: 4px; font-weight: 500;">${fileName}</div>
      <a href="${dashboardUrl}" style="${btnStyle}">Voir mon espace →</a>
    `),
  })
}

export async function sendReviewRequestEmail({
  to,
  clientName,
  projectName,
  reviewUrl,
}: {
  to: string
  clientName: string
  projectName: string
  reviewUrl: string
}) {
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to,
    subject: `Votre projet est livré — Laissez un avis Google`,
    html: emailLayout(`
      <h2 style="margin: 0 0 16px; font-size: 20px;">Bonjour ${clientName},</h2>
      <p style="margin: 0 0 12px; color: #374151;">Votre projet <strong>${projectName}</strong> est désormais livré. 🎉</p>
      <p style="margin: 0 0 24px; color: #374151;">Votre avis nous aide beaucoup — cela prend moins de 2 minutes.</p>
      <a href="${reviewUrl}" style="${btnStyle}">Laisser un avis Google ★</a>
      <p style="margin: 24px 0 0; color: #374151;">Merci pour votre confiance,<br/><strong>Béranger — vivesmedia.com</strong></p>
    `),
  })
}

export async function sendTicketReplyEmail({
  to,
  clientName,
  ticketTitle,
  replyPreview,
  ticketUrl,
}: {
  to: string
  clientName: string
  ticketTitle: string
  replyPreview: string
  ticketUrl: string
}) {
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to,
    subject: `Réponse à votre ticket — ${ticketTitle}`,
    html: emailLayout(`
      <h2 style="margin: 0 0 16px; font-size: 20px;">Bonjour ${clientName},</h2>
      <p style="margin: 0 0 12px; color: #374151;">Une réponse a été ajoutée à votre ticket <strong>${ticketTitle}</strong> :</p>
      <div style="background: #f9fafb; border-left: 3px solid #111; padding: 12px 16px; margin: 0 0 24px; border-radius: 4px; color: #374151; font-style: italic;">${replyPreview}</div>
      <a href="${ticketUrl}" style="${btnStyle}">Voir le ticket →</a>
    `),
  })
}

const btnStyle =
  'display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px;'

function emailLayout(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin: 0; background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 16px;">
        <tr><td align="center">
          <table width="100%" style="max-width: 560px; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <tr><td style="padding: 24px 32px 0;">
              <p style="margin: 0; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; color: #111;">vivesmedia.com</p>
            </td></tr>
            <tr><td style="padding: 24px 32px 32px;">${content}</td></tr>
            <tr><td style="padding: 16px 32px; border-top: 1px solid #f3f4f6; background: #f9fafb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">vivesmedia.com · Agence web & e-commerce · Avignon</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `
}
