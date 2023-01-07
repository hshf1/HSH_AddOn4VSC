import { settingsjsondata, tasksjsondata } from './jsonfilesdata'
import { promises, unlinkSync } from 'fs'
import { filePath_settingsjson, filePath_tasksjson } from './extsettings'

export async function deletejsons(filePath_todelete: string) {
	try {
		unlinkSync(filePath_todelete)
	} catch (err: any) {
		if (err.code === 'ENOENT') {
			console.error(`Datei existiert nicht: ${filePath_todelete}`)
		} else {
			console.error(`Ein Problem ist beim löschen der Datei aufgetreten: ${filePath_todelete}`)
			console.error(err)
		}
	}
}

export async function checkjsons() {
	try {
		await promises.stat(filePath_settingsjson)
	} catch {
		await setsettingsjson()
	}
	try {
		await promises.stat(filePath_tasksjson)
	} catch {
		await settasksjson()
	}
}

async function setsettingsjson() {
	try {
		await promises.writeFile(filePath_settingsjson, settingsjsondata)
	} catch (err) {
		console.error(err)
	}
}

async function settasksjson() {
	try {
		await promises.writeFile(filePath_tasksjson, tasksjsondata)
	} catch (err) {
		console.error(err)
	}
}