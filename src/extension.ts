// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "px-to-viewport" is now active!'
  );

  // The command has been defined in the package.json file
  let disposable = vscode.commands.registerTextEditorCommand(
    "px-to-viewport.convertPxToVw",
    (textEditor, textEditorEdit) => {
      const regexStr = "([0-9]*\\.?[0-9]+)px";
      placeholder(
        regexStr,
        (_: any, value: number) => `${px2Vw(value)}vw`,
        textEditor,
        textEditorEdit
      );
    }
  );
  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerTextEditorCommand(
    "px-to-viewport.convertPxToVh",
    (textEditor, textEditorEdit) => {
      const regexStr = "([0-9]*\\.?[0-9]+)px";
      placeholder(
        regexStr,
        (_: any, value: number) => `${px2Vh(value)}vh`,
        textEditor,
        textEditorEdit
      );
    }
  );
  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerTextEditorCommand(
    "px-to-viewport.convertPxToMinVwVh",
    (textEditor, textEditorEdit) => {
      const regexStr = "([0-9]*\\.?[0-9]+)px";
      placeholder(
        regexStr,
        (_: any, value: number) => `min(${px2Vw(value)}vw, ${px2Vh(value)}vh)`,
        textEditor,
        textEditorEdit
      );
    }
  );
  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerTextEditorCommand(
    "px-to-viewport.convertPxToRem",
    (textEditor, textEditorEdit) => {
      const regexStr = "([0-9]*\\.?[0-9]+)px";
      placeholder(
        regexStr,
        (_: any, value: number) => `${px2Rem(value)}rem`,
        textEditor,
        textEditorEdit
      );
    }
  );
  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerCommand(
    "px-to-viewport.setViewportSize",
    async () => {
      const config = vscode.workspace.getConfiguration("px-to-viewport");
      const viewportWidth = config.get("viewportWidth");
      let inputValue = await vscode.window.showInputBox({
        prompt: "Number of viewport width in px. Default is 720px.",
        value: `${viewportWidth}`,
        placeHolder: "Default value is 720px",
      });
      if (inputValue === "undefined") {
        // Closed input box
        return;
      }
      inputValue = inputValue?.trim();
      if (inputValue === "") {
        inputValue = "720";
      }
      const newViewportWidth = parseInt(inputValue as string);
      if (isNaN(newViewportWidth)) {
        vscode.window.showErrorMessage(
          `${inputValue} is not a valid integer to set as px per vw.`
        );
        return;
      }

      const viewportHeight = config.get("viewportHeight");
      inputValue = await vscode.window.showInputBox({
        prompt: "Number of viewport height in px. Default is 480px.",
        value: `${viewportHeight}`,
        placeHolder: "Default value is 480px",
      });
      if (inputValue === "undefined") {
        // Closed input box
        return;
      }
      inputValue = inputValue?.trim();
      if (inputValue === "") {
        inputValue = "480";
      }
      const newViewportHeight = parseInt(inputValue as string);
      if (isNaN(newViewportHeight)) {
        vscode.window.showErrorMessage(
          `${inputValue} is not a valid integer to set as px per vh.`
        );
        return;
      }
      config.update("viewportWidth", newViewportWidth);
      config.update("viewportHeight", newViewportHeight);
      vscode.window.showInformationMessage(
        `viewportWidth and viewportHeight are updated to ${newViewportWidth}px, ${newViewportHeight}px`
      );
    }
  );
  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerCommand(
    "px-to-viewport.setRootFontSize",
    async () => {
      const config = vscode.workspace.getConfiguration("px-to-viewport");
      const rootFontSize = config.get("rootFontSize");
      let inputValue = await vscode.window.showInputBox({
        prompt: "Enter Number of root font-size in px. Default is 16px.",
        value: `${rootFontSize}`,
        placeHolder: "Default value is 16px",
      });
      if (inputValue === "undefined") {
        return; // Closed input box
      }
      inputValue = inputValue?.trim();
      if (inputValue === "") {
        inputValue = "16";
      }
      const newRootFontSize = parseInt(inputValue as string);
      if (isNaN(newRootFontSize)) {
        vscode.window.showErrorMessage(
          `${inputValue} is not a valid integer to set as px per rem.`
        );
        return;
      }
      config.update("rootFontSize", newRootFontSize);
      vscode.window.showInformationMessage(
        `rootFontSize (rem) was updated to ${newRootFontSize}px`
      );
    }
  );
  context.subscriptions.push(disposable);

  console.log("Congratulations, Everything is loaded");
}

function px2Vw(px: number) {
  const config = vscode.workspace.getConfiguration("px-to-viewport");
  const unitPrecision = config.get("unitPrecision") as number;
  const viewportWidth = config.get("viewportWidth") as number;
  if (viewportWidth === 0) {
    return 0;
  }
  const value = parseFloat(((px * 100) / viewportWidth).toFixed(unitPrecision));
  return value;
}

function px2Vh(px: number) {
  const config = vscode.workspace.getConfiguration("px-to-viewport");
  const unitPrecision = config.get("unitPrecision") as number;
  const viewportHeight = config.get("viewportHeight") as number;
  if (viewportHeight === 0) {
    return 0;
  }
  const value = parseFloat(
    ((px * 100) / viewportHeight).toFixed(unitPrecision)
  );
  return value;
}

function px2Rem(px: number) {
  const config = vscode.workspace.getConfiguration("px-to-viewport");
  const unitPrecision = config.get("unitPrecision") as number;
  const rootFontSize = config.get("rootFontSize") as number;
  if (rootFontSize === 0) {
    return px;
  }
  const value = parseFloat((px / rootFontSize).toFixed(unitPrecision));
  return value;
}

function placeholder(
  regexString: string,
  replaceFunction: any,
  textEditor: vscode.TextEditor,
  textEditorEdit: vscode.TextEditorEdit
) {
  let regexExp = new RegExp(regexString, "i");
  let regexExpG = new RegExp(regexString, "ig");
  const selections = textEditor.selections;
  if (
    (selections.length === 0 ||
      selections.reduce((acc, val) => acc || val.isEmpty),
    false)
  ) {
    return;
  }
  const changesMade = new Map();
  textEditor
    .edit((builder) => {
      let numOcurrences = 0;
      selections.forEach((selection) => {
        for (
          var index = selection.start.line;
          index <= selection.end.line;
          index++
        ) {
          let start = 0,
            end = textEditor.document.lineAt(index).range.end.character;
          if (index === selection.start.line) {
            let tmpSelection = selection.with({ end: selection.start });
            let range = findValueRangeToConvert(
              tmpSelection,
              regexString,
              textEditor
            );
            if (range) {
              start = range.start.character;
            } else {
              start = selection.start.character;
            }
          }
          if (index === selection.end.line) {
            let tmpSelection = selection.with({ start: selection.end });
            let range = findValueRangeToConvert(
              tmpSelection,
              regexString,
              textEditor
            );
            if (range) {
              end = range.end.character;
            } else {
              end = selection.end.character;
            }
          }
          let text = textEditor.document.lineAt(index).text.slice(start, end);
          const matches = text.match(regexExpG);
          numOcurrences += matches ? matches.length : 0;
          if (numOcurrences === 0) {
            continue;
          }
          const regex = regexExpG;
          const newText = text.replace(regex, replaceFunction);
          const selectionTmp = new vscode.Selection(index, start, index, end);
          const key = `${index}-${start}-${end}`;
          if (!changesMade.has(key)) {
            changesMade.set(key, true);
            builder.replace(selectionTmp, newText);
          }
        }
        return;
      });
      if (numOcurrences === 0) {
        vscode.window.showWarningMessage("There were no values to transform");
      }
    })
    .then((success) => {
      textEditor.selections.forEach((selection, index, newSelections) => {
        if (selections[index].start.isEqual(selections[index].end)) {
          const newPosition = selection.end;
          const newSelection = new vscode.Selection(newPosition, newPosition);
          textEditor.selections[index] = newSelection;
        }
      });
      textEditor.selections = textEditor.selections;
      if (!success) {
        console.log(`Error: ${success}`);
      }
    });
}

function findValueRangeToConvert(
  selection: any,
  regexString: any,
  textEditor: any
) {
  const line = selection.start.line;
  const startChar = selection.start.character;
  const text = textEditor.document.lineAt(line).text;
  const regexExpG = new RegExp(regexString, "ig");

  var result,
    indices = [];
  while ((result = regexExpG.exec(text))) {
    const resultStart = result.index;
    const resultEnd = result.index + result[0].length;
    if (startChar >= resultStart && startChar <= resultEnd) {
      return new vscode.Range(line, resultStart, line, resultEnd);
    }
  }
  return null;
}
// this method is called when your extension is deactivated
export function deactivate() {}
