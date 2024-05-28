## Release Notes
### v 0.0.0.1 (May 26, 2024)
* The extension is incomplete, but works in some situations (issue cases described below).
  * If the delimeters do not commonly appear in code or comments (such as }, #, @, etc.) then it will be less prone to the current version's issues.

## Features
Highlights the current scope relative to the cursor. 
The highlighting can be configured to custom RGBA (RGB color and opacity).
You can set custom delimeters of variable length, such as "begin" and "end".

JSON example:
![Example 1](images/Example1.png)
JavaScript example:
![Example 2](images/Example2.PNG)
Business Central AL example:
![Example 3](images/Example3.png)

*Note: the extension is currently not designed to handle indentation-based scope.*

## Extension Settings
This extension contributes the following user settings:

* `scope-highlighter.startDelimeter`: the string to delimit start of scope. Default is "{".
* `scope-highlighter.endDelimeter`: The string to delimit the end of scope. Default is "}".
* `scope-highlighter.multiLineCommentStart`: The string to delimit the beginning of a multi-line comment. Default is "/*".
* `scope-highlighter.multiLineCommentEnd`: The string to delimit the end of a multi-line comment. Default is "*/".
* `scope-highlighter.singleLineComment`: The string to create a comment. Default is "//".
* `scope-highlighter.red`: The red value for the highlighting RGB (0-255). Default is 100.
* `scope-highlighter.green`: The green value for the highlighting RGB (0-255). Default is 40.
* `scope-highlighter.blue`: The blue value for the highlighting RGB (0-255). Default is 80.
* `scope-highlighter.alpha`: The alpha (opacity) value for the highlighting RGB (0.0-1.0). Default is 0.4. Higher values mean more visible highlighting.

## Known Issues
- Delimeters found in certain areas of the document are not ignored, causing the incorrect area to be highlighted in some cases.
  - delimeter instances found inside string literals
  - delimeter instances inside the name of an identifier or function
  - delimeter instances in single line comments that contain code on the same line
- Extension must sometimes be reloaded after making configuration changes.

# Developer TODO List 
- investigate auto reload extension settings
- fix single line comment issue
- fix string literals issue
- fix identifiers issue
- more testing
- finish the README file