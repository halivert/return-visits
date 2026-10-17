import { base64UrlToBytes, bytesToBase64Url } from "@/base64"
import { getDateForInput } from "@/return-visits/composables/getDateTimeForInput"
import {
	BackupData,
	collectBackupData,
	parseBackupData,
} from "@/backups/backupData"
import {
	compress,
	decompress,
	decrypt,
	deriveKey,
	encrypt,
	PBKDF2_ITERATIONS,
} from "@/backups/encryption"

const BACKUP_FORMAT = "return-visits-backup"
export const MIN_PASSWORD_LENGTH = 8

interface EncryptedBackup {
	format: typeof BACKUP_FORMAT
	version: 1
	iterations: number
	salt: string
	/** iv + gzipped json encrypted with AES-GCM, base64url */
	data: string
}

export class PasswordRequiredError extends Error {
	constructor() {
		super("Escribe la contraseña del respaldo")
	}
}

function isEncryptedBackup(value: unknown): value is EncryptedBackup {
	const backup = value as Partial<EncryptedBackup> | null

	return (
		backup?.format === BACKUP_FORMAT &&
		backup.version === 1 &&
		Number.isSafeInteger(backup.iterations) &&
		typeof backup.salt === "string" &&
		typeof backup.data === "string"
	)
}

export async function createBackupFile(password: string): Promise<File> {
	if (password.length < MIN_PASSWORD_LENGTH) {
		throw new Error(
			`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
		)
	}

	const salt = crypto.getRandomValues(new Uint8Array(16))
	const key = await deriveKey(password, salt)
	const data = await compress(JSON.stringify(await collectBackupData()))

	const backup: EncryptedBackup = {
		format: BACKUP_FORMAT,
		version: 1,
		iterations: PBKDF2_ITERATIONS,
		salt: bytesToBase64Url(salt),
		data: bytesToBase64Url(await encrypt(key, data)),
	}

	const date = getDateForInput(new Date())

	// Plain text type so it can be shared to most apps
	return new File([JSON.stringify(backup)], `revisitas-${date}.txt`, {
		type: "text/plain",
	})
}

/** Reads encrypted backups and the plain JSON ones exported before */
export async function readBackupFile(
	file: File,
	password: string
): Promise<BackupData> {
	let content: unknown

	try {
		content = JSON.parse(await file.text())
	} catch {
		throw new Error("El archivo no es un respaldo válido")
	}

	if (!isEncryptedBackup(content)) return parseBackupData(content)

	if (!password) throw new PasswordRequiredError()

	const key = await deriveKey(
		password,
		base64UrlToBytes(content.salt),
		content.iterations
	)

	const data = await decrypt(key, base64UrlToBytes(content.data)).catch(() => {
		throw new Error("Contraseña incorrecta")
	})

	return parseBackupData(JSON.parse(await decompress(data)))
}
