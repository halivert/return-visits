-- Only push subscriptions and opaque reminder ids are stored here. Names,
-- notes, topics or locations never leave the device.
CREATE TABLE IF NOT EXISTS devices (
	id TEXT PRIMARY KEY,
	token_hash TEXT NOT NULL,
	endpoint TEXT NOT NULL,
	p256dh TEXT NOT NULL,
	auth TEXT NOT NULL,
	updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS reminders (
	device_id TEXT NOT NULL REFERENCES devices (id) ON DELETE CASCADE,
	uuid TEXT NOT NULL,
	send_at INTEGER NOT NULL,
	PRIMARY KEY (device_id, uuid)
);

CREATE INDEX IF NOT EXISTS reminders_send_at ON reminders (send_at);

-- Encrypted data waiting to be picked up by another phone. The key is only in
-- the QR code, so this is unreadable here. Rows are deleted on download or
-- after they expire.
CREATE TABLE IF NOT EXISTS transfers (
	id TEXT PRIMARY KEY,
	data BLOB NOT NULL,
	expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS transfers_expires_at ON transfers (expires_at);
