import { window, StatusBarAlignment } from 'vscode'

export let active_addon: boolean = true

const statusbar_button = window.createStatusBarItem(StatusBarAlignment.Right, 100)
statusbar_button.show()

export function active_addon_func(active_addon_ext: boolean) {
    active_addon = active_addon_ext
    statusbar_button.text = active_addon ? 'AddOn4VSC pausieren' : 'AddOn4VSC wieder aktivieren'
    statusbar_button.tooltip = active_addon ? 'Klicken, um die Erweiterung AddOn4VSC zu pausieren pausieren (spätestens, bis wenn VSCode neu startet)' : 'Klicken, um die Erweiterung AddOn4VSC wieder zu aktivieren'
    statusbar_button.command = active_addon ? 'extension.off' : 'extension.on'
}