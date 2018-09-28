# Oracle Database Tasks for VSC

## Overview

The goal of this extension is to simplify the ability to run scripts against your database connections. It works around the concept of having a config file in the root of your project with a list of all your connection details.

## Install

Search the marketplace for `odb-task` and click the install button. Depends on having SQL\*Plus or SQLcl available on your system (I recommend going to the effort of installing SQL\*Plus).

![image](https://user-images.githubusercontent.com/1747643/46234234-a861b180-c343-11e8-8871-094eaf69f808.png)

## Set up

1. Open your project
2. Create a file in your project root named `.build-oracle.json`
3. Update the contents per the below example
4. Reload Code just to make sure everything is detected

### Key bindings

The best way to create a shortcut for build is to define it in keyboard shortcuts.

1. Ensure you have run a compile task - the command doesn't appear in the keyboard shortcuts settings until you have successfully run the task
2. Navigate to Keyboard Shortcuts: File -> Preferences -> Keyboard Shortcuts
3. Search `odb-task` and set your desired keyboard binding

Alternatively, you can just add to your keybindings.json file directly:

```json
{
    "key": "ctrl+shift+b",
    "command": "odb-task.compileSqlPlus"
}
```

The `command` property can be either: `odb-task.compileSqlPlus` or `odb-task.compileSqcl`.

### Example config

```json
[
    {
        "targetName": "DEV",
        "connectionString": "user/password@XE"
    }
]
```

## Usage

Open the command palette and type `Compile with`. You will see two entries:

1. Compile with SQL*Plus
2. Compile with SQLcl

note: This extension doesn't ship with these binaries, so it assumes if you are running one or the other, the command is available on your system.

Choose the interpreter you wish to compile with.

You will prompted for which connection to compile against. Choose the connection name.


![image](https://user-images.githubusercontent.com/1747643/34592761-5ded2e9e-f194-11e7-9f70-fea9edfc5251.png)

![image](https://user-images.githubusercontent.com/1747643/34592822-bf594b86-f194-11e7-9671-66e38defcfe9.png)

## Configuration

As mentioned, this extension depends on the binaries for SQL*Plus or SQLcl being available on your system. These default to `sqlplus` and `sql` respectively. If these are not within your Path, or have been renamed to something else, you can set an alternative path/name within settings.

![image](https://user-images.githubusercontent.com/1747643/46234325-eeb71080-c343-11e8-96a3-f420072de5bc.png)


## Author

Trent Schafer

## LICENSE

MIT