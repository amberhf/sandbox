# labs-static

A barebones static html app using [Express 4](http://expressjs.com/).

## Prerequisities

1. You have already started following the instructions at [https://github.com/decodedco/labs](https://github.com/decodedco/labs)
2. You have a \<project-category\> and \<project-name\> for your project
2. You have a \<project-remote\> from your project repository (e.g. `git@github.com:DecodedCo/yourproject.git`)
1. You have [Node.js](http://nodejs.org/) installed.

## Running Locally

```sh
$ git clone git@github.com:decodedco/labs-static.git <project-category>-<project-name>
$ cd <project-category>-<project-name>
$ git remote rm origin # so you don't change the sample site
$ git remote add origin <project-remote> # switches to your new repo
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

All HTML/CSS/JS files are in the `public` directory, anything stored in `public` will be served statically to the user.

## Next steps

When you're ready to move onto labs, continue the instructions at [https://github.com/decodedco/labs](https://github.com/decodedco/labs)