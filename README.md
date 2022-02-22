# Team 11 Laser Tag Project
Members: Callum Bruton, Evan Foley, Shi Yin Hong, Austin Rodriguez and Ethan Genser

# Methodology
Apply agile methods via incremental delivery + system reuse techniques.
Reference for the reusable system: https://devcenter.heroku.com/articles/getting-started-with-nodejs (suggested by Professor Strother)

# How to view the deployed app
Open terminal and type in the following commands:
```sh
    0) (cd into the project directory - **make sure it is cloned from a git repo/linked to GitHub)
        - for GitHub Desktop, the project is saved  under: /../Documents/GitHub/(project name)
    1) 'heroku login'
        - 'syhong@uark.edu' (email)   'laser-tag-11' (password)
    2) 'heroku git:remote -a team-11-app'
        - remotely connects our app with Heroku
    3) 'npm install'
        - start the app using package.json
    4) 'git push heroku main'
        - **make sure we are using the LATEST version of our app (clone the lastest version)
        - pushing codes to our app
    5) 'heroku open' 
        - to see our app in web mode
        - other options:
            1. we can also enter 'https://team-11-app.herokuapp.com/' in a browser 
            2. we can also use the command 'heroku local' then paste in 'http://localhost:5000/' in a browser 
```
To view our database's contents in Heroku terminal:
```sh
    1) 'heroku pg:psql -a team-11-app'
        - enter the database 
    2) 'SELECT * FROM player;'
        - we are viewing everything in the database named "player."
    3) 'exit'
        - return to heroku command prompt
```

# How to test changes made to the app in deployed mode
First, follow 1) to 2) from 'How to view deployed app' section above.
Commit changes:
```sh
    1) Option 1: we can commit changes to our repo using regular command lines/GitHub Desktop.
    2) Option 2: IF we want to make commits using Heroku (in terminal when logged in):
        1. 'git add .'
        2. 'git commit -m "(description)"
```
Then, push the changes: $'git push heroku main'
Finally, use any of the options under 5) above to see the deployed app.