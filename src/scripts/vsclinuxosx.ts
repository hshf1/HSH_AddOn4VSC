export const vsclinuxosxCScript = `# System bestimmen
os_name=$(uname -s)

#### Beginn Installation, wenn uninstall!=true ####

# Setzen der Verwendung als Variable
usageinfo="Installation"

if [ "$os_name" = "Darwin" ]; then
    #### Beginn Installation MacOS ####

    # Compiler installieren, falls nicht vorhanden
    command xcode-select --install
    
#### Ende Installation MacOS ####
else
    #### Beginn Installation Linux ####

    # Compiler installieren, falls nicht vorhanden
    sudo apt install gcc
    
#### Ende Installation Linux ####
fi

# Umgebungsvariable für die aktuelle Terminalsitzung hinzufügen und aktualisieren
cat <<-EOF >>~/.bash_profile
# Add Visual Studio Code (code)
export PATH="\\$PATH:/Applications/Visual Studio Code.app/Contents/Resources/app/bin"
EOF
source ~/.bash_profile

#### Ende Installation ####

# Output im Terminal
echo "#################################################################################################"
echo "$usageinfo beendet! Das Terminal kann jetzt geschlossen werden."
echo "#################################################################################################"

# exit script
exit 0`