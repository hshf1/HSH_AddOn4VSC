import { settingsjsondata, tasksjsondata } from './jsonfilesdata'
import { promises, writeFile } from 'fs'
import { IS_LINUX, IS_WINDOWS } from './extsettings'

export function checkjsons(username_from_extpath: string, extpath: string) {
	var filePathsettingsjson = username_from_extpath + '/Library/Application Support/Code/User/settings.json'
	var filePathtasksjson = username_from_extpath + '/Library/Application Support/Code/User/tasks.json'

	if (IS_WINDOWS) {
		filePathsettingsjson = username_from_extpath + '\\AppData\\Roaming\\Code\\User\\settings.json'
		filePathtasksjson = username_from_extpath + '\\AppData\\Roaming\\Code\\User\\tasks.json'
	} else if (IS_LINUX) {
		filePathsettingsjson = username_from_extpath + '/.config/Code/User/settings.json'
		filePathtasksjson = username_from_extpath + '/.config/Code/User/tasks.json'
	}

	promises.access(filePathsettingsjson)
		.then(() => console.log(`${filePathsettingsjson} existiert bereits`))
		.catch(() => setsettingsjson(filePathsettingsjson))
	promises.access(filePathtasksjson)
		.then(() => console.log(`${filePathtasksjson} existiert bereits`))
		.catch(() => settasksjson(filePathtasksjson));
}

function setsettingsjson(filePath: string) {
	console.log(`${filePath}: settings.json existiert nicht, es wird jetzt erstellt`)
	writeFile(filePath, settingsjsondata, (error) => {
		if (error) {
			console.error(error);
		} else {
			console.log(`The file ${filePath} was created successfully!`)
		}
	})
}

function settasksjson(filePath: string) {
	console.log(`${filePath}: tasks.json existiert nicht, es wird jetzt erstellt`)
	writeFile(filePath, tasksjsondata, (error) => {
		if (error) {
			console.error(error);
		} else {
			console.log(`The file ${filePath} was created successfully!`)
		}
	})
}