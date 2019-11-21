# - How to integrate SASS into Create-React-App projects

1. create-react-app

2. Install package like this: yarn add node-sass --dev (saving to DEV dependencies and not to regular dependencies!)

3. create folder "sass" in src with main.scss file inside it (all scss files goes there by import like this: @import 'file path here')

4. in package.json add script: "watch-sass": "node-sass -w ./src/sass/main.scss ./src/index.css" - file paths can be changed according to          folders structure

   (when starting development open new terminal and type " yarn watch-sass " so your sass files will be complied to css on the fly)

5. add script : "prebuild": "node-sass ./src/sass/main.scss ./src/index.css" will run automaticlly before build to complie the sass files into css


*** all scss files should start with underscore for example: _testing.scss