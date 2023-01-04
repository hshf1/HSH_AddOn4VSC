import { WebviewPanel, ExtensionContext, window, ViewColumn } from 'vscode'
import { menue_button as button } from './extsettings'

let currentPanel: WebviewPanel | undefined = undefined;

export function quiz(context: ExtensionContext) {
    const columnToShowIn = window.activeTextEditor ? window.activeTextEditor.viewColumn : undefined;

    if (currentPanel) {
        currentPanel.reveal(columnToShowIn);
    } else {
        button.hide()
        currentPanel = window.createWebviewPanel(
            'c_uebung',
            'C-Übung',
            ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );
        currentPanel.webview.html = getWebviewContent();

        currentPanel.onDidDispose(
            () => {
                button.show()
                currentPanel = undefined;
            },
            null,
            context.subscriptions
        );

        // Handle messages from the webview
        currentPanel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'alert':
                        window.showErrorMessage(message.text);
                        return;
                }
            },
            undefined,
            context.subscriptions
        );
    }
}

export function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
    <h1 id="lines-of-code-counter">0</h1>
    <?php foreach ($quiz as $question) { ?>
        <li>
          <h3><?= $question['question'] ?></h3>
          <?php foreach ($question['answers'] as $answer) { ?>
            <label>
              <input type="radio" name="question-<?= $question['id'] ?>" value="<?= $answer ?>">
              <?= $answer ?>
            </label>
          <?php } ?>
        </li>
      <?php } ?>

    <script>
        (function() {
            const quiz = JSON.parse('<?= $questionJson ?>');
            const vscode = acquireVsCodeApi();
            const counter = document.getElementById('lines-of-code-counter');

            const previousState = vscode.getState();
            let count = previousState ? previousState.count : 0;
            counter.textContent = count;
            setInterval(() => {
                counter.textContent = count++;

                // Alert the extension when our cat introduces a bug
                if (Math.random() < 0.001 * count) {
                    vscode.postMessage({
                        command: 'alert',
                        text: '🐛  on line ' + count
                    })
                }
                vscode.setState({ count });
            }, 100);
        }())
    </script>
</body>
</html>`
}