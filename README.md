# Oracle Database Tasks for VSC

This is a simple extension for Visual Studio Code, inspired by my equivalent extension for Atom. Basically, you define a configuration file in the root of your project. Unlike Atom being named `.atom-build-oracle.json`, this will look for `.build-oracle.json`. The file is an Array which supports two properties:

1. targetName
2. connectionString

`connectionString` must include the password and basically would be connection string you would be used to using to connect to SQL*Plus. So for my local XE database, my configuration file would look like:

```json
[
    {
        "targetName": "DEV",
        "connectionString": "user/password@XE"
    }
]
```

One direction I have diverged from the Atom extension is the support for both SQL*Plus and SQLcl commands simultaneously. One of the reasons for this direction is due to fact I like to use SQL\*Plus as it starts up much faster, but SQLcl provides some nice new features not available in SQL\*Plus.

So, when you search the command pallette you will find two entries related to this extension:

1. Compile with SQL*Plus
2. Compile with SQLcl


# Author

Trent Schafer

# LICENSE

MIT