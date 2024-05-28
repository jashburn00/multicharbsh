## Release Notes
### v 0.0.0.1
The extension works but is incomplete (string literals issue below)

## Features
Highlights the current scope relative to the cursor. The highlighting can be configured to custom RGBA (RGB and opacity).
You can set custom delimeters of variable length, such as "begin" and "end".

\!\[feature X\]\(images/feature-x.png\)

## Extension Settings
This extension contributes the following user settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues
- Delimeters found inside of string literals are not ignored, causing the incorrect area to be highlighted when applicable.


# TODO 
- testing
  - different delimeters 
- change names of contributions
- finish the README file