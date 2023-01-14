import { promises, unlinkSync } from 'fs'

import { settingsjsondata, tasksjsondata } from './constants'
import { filePath_settingsjson, filePath_tasksjson } from './init'

export async function renewjsons(filePath_todelete: string) {
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
	if (filePath_todelete.includes("settings")) {
		await setsettingsjson()
	} else if (filePath_todelete.includes("tasks")) {
		await settasksjson()
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