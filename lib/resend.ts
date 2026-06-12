import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'hub@vivesmedia.com'
const FROM_NAME = 'vivesmedia.com'
const ORANGE = '#F4521E'

// ─── CLIENT EMAILS ─────────────────────────────────────────────────────────

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
    subject: `Votre espace projet est prêt — ${projectName}`,
    html: emailLayout(`
      <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #111;">Bonjour ${clientName},</h2>
      <p style="margin: 0 0 6px; color: #555; font-size: 15px;">Votre espace projet <strong style="color: #111;">${projectName}</strong> vient d'être créé.</p>
      <p style="margin: 0 0 28px; color: #555; font-size: 15px;">Accédez à votre tableau de bord pour suivre l'avancement, télécharger vos fichiers et échanger avec notre équipe.</p>
      ${orangeBtn('Accéder à mon espace →', magicLink)}
      <p style="margin: 28px 0 0; font-size: 13px; color: #999;">Ce lien est valable 24h. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
    `),
  })
}

export async function sendPhaseChangeEmail({
  to,
  clientName,
  projectName,
  phaseLabel,
  phaseDescription,
  dashboardUrl,
  note,
}: {
  to: string
  clientName: string
  projectName: string
  phaseLabel: string
  phaseDescription?: string
  dashboardUrl: string
  note?: string
}) {
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to,
    subject: `${projectName} — Nouvelle étape : ${phaseLabel}`,
    html: emailLayout(`
      <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #111;">Bonjour ${clientName},</h2>
      <p style="margin: 0 0 20px; color: #555; font-size: 15px;">Votre projet <strong style="color: #111;">${projectName}</strong> a franchi une nouvelle étape.</p>
      <div style="background: #fff8f6; border-left: 3px solid ${ORANGE}; padding: 16px 20px; margin: 0 0 20px; border-radius: 8px;">
        <p style="margin: 0 0 4px; font-size: 11px; color: ${ORANGE}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">Étape en cours</p>
        <p style="margin: 0; font-size: 20px; font-weight: 700; color: #111;">${phaseLabel}</p>
        ${phaseDescription ? `<p style="margin: 8px 0 0; font-size: 14px; color: #666;">${phaseDescription}</p>` : ''}
      </div>
      ${note ? `<p style="margin: 0 0 20px; color: #555; font-size: 14px; font-style: italic; padding: 12px 16px; background: #f9f9f9; border-radius: 8px;">"${note}"</p>` : ''}
      ${orangeBtn('Voir mon espace →', dashboardUrl)}
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
  const categoryIcons: Record<string, string> = {
    maquette: '&#127912;',
    invoice: '&#128196;',
    file: '&#128193;',
  }
  const label = categoryLabels[fileCategory] ?? 'fichier'
  const icon = categoryIcons[fileCategory] ?? '&#128193;'

  return resend.emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to,
    subject: `${projectName} — Nouveau ${label} disponible`,
    html: emailLayout(`
      <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #111;">Bonjour ${clientName},</h2>
      <p style="margin: 0 0 20px; color: #555; font-size: 15px;">Un nouveau <strong style="color: #111;">${label}</strong> a été ajouté à votre espace projet <strong style="color: #111;">${projectName}</strong>.</p>
      <div style="background: #f9f9f9; padding: 14px 18px; margin: 0 0 24px; border-radius: 10px;">
        <span style="font-size: 18px;">${icon}</span>
        <span style="font-size: 14px; font-weight: 600; color: #111; margin-left: 8px;">${fileName}</span>
      </div>
      ${orangeBtn('Accéder à mon espace →', dashboardUrl)}
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
      <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #111;">Bonjour ${clientName},</h2>
      <p style="margin: 0 0 12px; color: #555; font-size: 15px;">Votre projet <strong style="color: #111;">${projectName}</strong> est désormais en ligne — félicitations !</p>
      <p style="margin: 0 0 24px; color: #555; font-size: 15px;">Si vous êtes satisfait de notre collaboration, un avis Google nous aide beaucoup à nous faire connaître. Cela prend moins de 2 minutes.</p>
      ${orangeBtn('&#11088; Laisser un avis Google', reviewUrl)}
      <p style="margin: 24px 0 0; color: #555; font-size: 14px;">Merci pour votre confiance,<br/><strong style="color: #111;">Béranger — vivesmedia.com</strong></p>
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
      <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #111;">Bonjour ${clientName},</h2>
      <p style="margin: 0 0 16px; color: #555; font-size: 15px;">Une réponse a été ajoutée à votre ticket <strong style="color: #111;">${ticketTitle}</strong> :</p>
      <div style="background: #fff8f6; border-left: 3px solid ${ORANGE}; padding: 14px 18px; margin: 0 0 24px; border-radius: 8px; color: #444; font-size: 14px; font-style: italic; line-height: 1.6;">${replyPreview}</div>
      ${orangeBtn('Voir le ticket →', ticketUrl)}
    `),
  })
}

export async function sendOnboardingReminderEmail({
  to,
  clientName,
  projectName,
  onboardingUrl,
}: {
  to: string
  clientName: string
  projectName: string
  onboardingUrl: string
}) {
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to,
    subject: `Action requise — Formulaire de démarrage ${projectName}`,
    html: emailLayout(`
      <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #111;">Bonjour ${clientName},</h2>
      <p style="margin: 0 0 16px; color: #555; font-size: 15px;">Votre projet <strong style="color: #111;">${projectName}</strong> est prêt à démarrer.</p>
      <div style="background: #fff8f6; border-left: 3px solid ${ORANGE}; padding: 14px 18px; margin: 0 0 20px; border-radius: 8px;">
        <p style="margin: 0; font-size: 14px; color: #444;">Pour avancer rapidement, merci de remplir le formulaire de démarrage. Il vous prend <strong>5 à 10 minutes</strong> et nous permet de commencer le travail dès réception.</p>
      </div>
      ${orangeBtn('Remplir le formulaire →', onboardingUrl)}
      <p style="margin: 20px 0 0; font-size: 13px; color: #999;">Si vous avez des questions, répondez directement à cet email.</p>
    `),
  })
}

// ─── ADMIN ALERT EMAILS ─────────────────────────────────────────────────────

export async function sendAdminNewTicketAlert({
  adminEmail,
  clientName,
  projectName,
  ticketTitle,
  ticketDescription,
  priority,
  ticketUrl,
}: {
  adminEmail: string
  clientName: string
  projectName: string
  ticketTitle: string
  ticketDescription: string
  priority: 'low' | 'medium' | 'high'
  ticketUrl: string
}) {
  const priorityLabels = { low: 'Faible', medium: 'Moyen', high: 'URGENT' }
  const priorityColors = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' }

  return resend.emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to: adminEmail,
    subject: `[Hub] Nouveau ticket${priority === 'high' ? ' URGENT' : ''} — ${clientName} · ${projectName}`,
    html: emailLayout(`
      <div style="background: ${priority === 'high' ? '#fef2f2' : '#fff8f6'}; border-left: 3px solid ${priorityColors[priority]}; padding: 12px 16px; margin: 0 0 20px; border-radius: 8px;">
        <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; color: ${priorityColors[priority]}; text-transform: uppercase; letter-spacing: 0.08em;">${priorityLabels[priority]}</p>
        <p style="margin: 0; font-size: 17px; font-weight: 700; color: #111;">${ticketTitle}</p>
      </div>
      <p style="margin: 0 0 4px; font-size: 13px; color: #999;">Client : <strong style="color: #111;">${clientName}</strong></p>
      <p style="margin: 0 0 20px; font-size: 13px; color: #999;">Projet : <strong style="color: #111;">${projectName}</strong></p>
      <div style="background: #f9f9f9; padding: 14px 18px; border-radius: 10px; margin: 0 0 24px; font-size: 14px; color: #444; line-height: 1.6;">${ticketDescription}</div>
      ${orangeBtn('Voir le ticket →', ticketUrl)}
    `),
  })
}

export async function sendAdminOnboardingCompleteAlert({
  adminEmail,
  clientName,
  projectName,
  projectUrl,
}: {
  adminEmail: string
  clientName: string
  projectName: string
  projectUrl: string
}) {
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to: adminEmail,
    subject: `[Hub] Onboarding complété — ${clientName} · ${projectName}`,
    html: emailLayout(`
      <div style="background: #f0fdf4; border-left: 3px solid #10b981; padding: 12px 16px; margin: 0 0 20px; border-radius: 8px;">
        <p style="margin: 0; font-size: 15px; font-weight: 700; color: #065f46;">&#10003; Formulaire d'onboarding complété</p>
      </div>
      <p style="margin: 0 0 4px; font-size: 13px; color: #999;">Client : <strong style="color: #111;">${clientName}</strong></p>
      <p style="margin: 0 0 24px; font-size: 13px; color: #999;">Projet : <strong style="color: #111;">${projectName}</strong></p>
      <p style="margin: 0 0 24px; color: #555; font-size: 14px;">Les informations sont disponibles dans l'onglet Onboarding du projet. Vous pouvez maintenant passer à la phase Design.</p>
      ${orangeBtn('Voir le projet →', projectUrl)}
    `),
  })
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

function orangeBtn(label: string, href: string) {
  return `<a href="${href}" style="display: inline-block; background: ${ORANGE}; color: #fff; padding: 13px 28px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 14px; letter-spacing: 0.01em;">${label}</a>`
}

function emailLayout(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin: 0; background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 16px;">
        <tr><td align="center">
          <table width="100%" style="max-width: 560px; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <tr>
              <td style="padding: 20px 32px; border-bottom: 1px solid #f3f4f6;">
                <p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.05em; color: ${ORANGE};">vivesmedia.com</p>
              </td>
            </tr>
            <tr><td style="padding: 32px 32px 36px;">${content}</td></tr>
            <tr>
              <td style="padding: 16px 32px; border-top: 1px solid #f3f4f6; background: #fafafa;">
                <p style="margin: 0; font-size: 12px; color: #bbb;">vivesmedia.com · Agence web &amp; e-commerce · Avignon</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `
}
