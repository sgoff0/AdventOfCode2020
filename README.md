## Advent of Code

This is my personal playground for [advent of code](https://adventofcode.com/), implemented in typescript.

### Scaffolding

To pull in your input dynamically create a .env file with your advent of code session cookie value. You can find this by logging into advent of code and viewing your cookie/inspecting your request headers in the chrome developer console or similar tools. See the .env.example as what your .env file should look like.

Run `npm run generate` and follow the prompts to select the year and day you plan to scaffold, or run `npm run generate <year> <day>`.

The this command will both scaffold the boilerplate code required for the specified year & day as well as output the command to execute that year & day as well as copy it to your clipboard so you can paste it in a terminal and run quickly.

If you do not populate your session cookie your input.txt file that is scaffolded will have the text `error` in it, you can simply copy the input manually from the website into this file.

### Example execution

`npm run dev src\2018\01`

Will run the script for day 1 of 2018.
