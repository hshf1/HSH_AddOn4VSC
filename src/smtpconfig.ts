const host = process.env.SMTP_HOST
const email = process.env.SMTP_EMAIL
const password = process.env.SMTP_PASSWORD

/** Gibt den Host des SMTP-Servers zurück */
export function getSmtpHost() {
    return host
}

/** Gibt den Port des SMTP-Servers zurück */
export function getSmtpPort() {
    return 465
}

/** Gibt die E-Mail Adresse zur Anmeldung am SMTP-Server zurück */
export function getSmtpEMail() {
    return email
}

/** Gibt das APP-Passwort zur Anmeldung am SMTP-Server zurück */
export function getSmtpPW() {
    return password
}