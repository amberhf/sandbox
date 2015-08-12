# labs-static

A barebones static html app using [Express 4](http://expressjs.com/).

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

You'll also need to have a name for your project - see https://github.com/decodedco/labs for guidelines
```sh
$ git clone git@github.com:decodedco/labs-static.git <your-project-name-here>
$ cd <your-project-name-here>
$ git remote rm origin # so you don't change the sample site
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

All HTML/CSS/JS files are in the `public` directory, anything stored in `public` will be served statically to the user.

## Deploying to Heroku

The next step deploys your app to heroku.

In this step you'll need the labs router IP address, stored in a secure note in lastpass.

```
$ heroku create decoded-<your-project-name-here> # may ask you to login (check details in lastpass)
$ heroku config:set LABS_IP=<labs-router-ip-goes-here>
$ git push heroku master
$ heroku open # will give you a "Direct access forbidden" error - see below
```

## Setting up the labs server routing config
To finish setting up your project, return to the documentation at https://github.com/decodedco/labs 

## Making changes
Heroku runs on git - to deploy code changes, commit your code and push it to heroku e.g.:

```
# make some changes!
$ git add --all
$ git commit -m "Here is a concise description of my changes"
$ git push heroku master # this will take a few moments while your app is deployed.
```
You can then view your app at it's labs.decoded.com url.

You can (and should) also store your code on github. Heroku does not interfere with this process.
