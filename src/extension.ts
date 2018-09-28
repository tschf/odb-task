'use strict';
// The module 'vscode' contains the VS Code extensibility API
// API docs: https://code.visualstudio.com/docs/extensionAPI/vscode-api
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as ChildProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { QuickPickItem } from 'vscode';

// BuildConfig represents the supported properties in the .build-oracle.json configuration file.
// It extends from vscode.QuickPickItem in order to support showing a list to the user when
// there is more than one target defined in the config, so they can select which target to
// compile their code against.
interface BuildConfig extends vscode.QuickPickItem {
    targetName: string,
    connectionString: string
};

// runScript
// Generic function that runs the actual compilation process of SQL or PL/SQL code.
// Send all the output to VSC's output window, to give user visual feedback on the outcome.
function runScript(command: string, connectionString: string, output: vscode.OutputChannel){

    output.clear();
    output.show();

    let activeDoc = vscode.window.activeTextEditor.document;
    let activefilePath = activeDoc.fileName;

    if (activeDoc.isDirty ) {
        let autoSave = vscode.workspace.getConfiguration("odb-task").get("auto-save");

        if (autoSave) {
            vscode.commands.executeCommand("workbench.action.files.save");
        } else {
            vscode.window.showWarningMessage("Your file is not saved. You should save before compiling");
        }
    }

    let childProcessConfig = {
        "cwd": path.dirname(activefilePath)
    };

    let sqlplusCompilationWrapper = path.resolve(__dirname, '..', 'dist', 'compile.sql');
    var compilePid = ChildProcess.spawn(command, [connectionString, `@${sqlplusCompilationWrapper}`, activefilePath], childProcessConfig);

    compilePid.stdout.on('data', (data) => {
        output.append( data.toString() );
    });
}

function chooseConnection(programPath: string, outputChannel: vscode.OutputChannel, dbConnections: BuildConfig[]) {

    if (dbConnections.length == 0){
        vscode.window.showWarningMessage("No connections defined");
    } else if (dbConnections.length == 1){
        runScript(programPath, dbConnections[0].connectionString, outputChannel);
    } else {
        vscode.window.showQuickPick(dbConnections)
            .then(selectedBuild => {
                if (selectedBuild){
                    runScript(programPath, selectedBuild.connectionString, outputChannel);
                }
            });
    }

}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // IDEA: Disable commands if there is no build configuration defined. Reference points:
    // https://github.com/eamodio/vscode-gitlens/blob/master/package.json#L162
    // https://github.com/Microsoft/vscode/issues/19345#issuecomment-277953793
    // https://github.com/Microsoft/vscode/issues/10401


    const taskContext = this;
    taskContext.outputChannel = vscode.window.createOutputChannel("odb-task");

    let extConfig = vscode.workspace.getConfiguration("odb-task");
    taskContext.exePaths = {
        sqlplus: extConfig.get("sqlplus-path"),
        sqlcl: extConfig.get("sqlcl-path")
    };

    taskContext.workspacePath = vscode.workspace.rootPath;
    let buildTargetsFile = path.join(taskContext.workspacePath, ".build-oracle.json");

    if (!fs.existsSync(buildTargetsFile)){
        vscode.window.showWarningMessage("No build targets defined");
        return;
    }

    let buildTargets;
    try {
        buildTargets = JSON.parse(fs.readFileSync(buildTargetsFile).toString());
    } catch (e) {
        vscode.window.showErrorMessage("Config file contains invalid JSON");
        return;
    }

    let quickPickList: BuildConfig[] = buildTargets.map(target => {
        target.label = target.targetName;

        return target;
    });

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let sqlPlusCommand = vscode.commands.registerCommand('odb-task.compileSqlPlus', () => {
        var programPath = taskContext.exePaths.sqlplus;
        chooseConnection(programPath, taskContext.outputChannel, quickPickList);
    });

    let sqlClCommand = vscode.commands.registerCommand('odb-task.compileSqlcl', () => {
        var programPath = taskContext.exePaths.sqlcl;
        chooseConnection(programPath, taskContext.outputChannel, quickPickList);
    });

    context.subscriptions.push(sqlPlusCommand);
    context.subscriptions.push(sqlClCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
