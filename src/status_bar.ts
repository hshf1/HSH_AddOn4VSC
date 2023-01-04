import { window, commands } from 'vscode'
import { menue_button } from './extsettings'
import { treeDataProvider } from './activity_bar'

export let active_addon: boolean = true

export function active_addon_func(active_addon_ext: boolean) {
    active_addon = active_addon_ext
}

export function menue() {
    menue_button.hide()
    let menueitems: {
        label: string
    }[] = [
            { label: 'Menü schließen' },
            { label: 'C-Quiz starten' }
        ]

    if (!active_addon) {
        menueitems.push({ label: 'Erweiterung wieder aktivieren' })
    } else if (active_addon) {
        menueitems.push({ label: 'Erweiterung bis zum nächsten (Neu-)Start von VSCode deaktivieren' })
    }

    window.showQuickPick(menueitems, {
        ignoreFocusOut: true,
        placeHolder: 'Wählen Sie eine Option aus:',

    }).then(selectedOption => {
        const option = selectedOption?.label
        switch (option) {
            case 'Menü schließen':
                break;
            case 'C-Quiz starten':
                commands.executeCommand('exam.start');
                treeDataProvider.refresh();
                break;
            case 'Erweiterung wieder aktivieren':
                active_addon = true;
                commands.executeCommand('extension.on');
                treeDataProvider.refresh();
                break;
            case 'Erweiterung bis zum nächsten (Neu-)Start von VSCode deaktivieren':
                active_addon = false;
                commands.executeCommand('extension.off');
                treeDataProvider.refresh();
                break;
        }
        menue_button.show()
    })
}