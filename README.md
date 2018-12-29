
### Installation and setup

Dependencies
  - Postgres 9.6
  - Node 9.8

Database setup
  - create database ```timezones```
  - create database ```timezones```
  - create user with username ```timezones```
  - assign password to user ```timezones```
  - start postgres on default port ```5432```


Setup Database

```$xslt
$ create database timezones;
$ create database timezones_test;
$ create user timezones;
$ ALTER USER timezones WITH PASSWORD 'timezones';
$ grant all privileges on database timezones to timezones;
$ grant all privileges on database timezones_test to timezones;

```
Install the Node
```sh
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
$ source ~/.bashrc
$ nvm install 9.8.0
$ npm i pm2 -g
```

Install and run the API module
```
$ cd project
$ npm i
$ npm run migrate
$ npm run seed-all
$ npm run server
$ npm run prod
$ npm run built-dev
$ npm run test
```


API Documentation:
```
localhost:3000/api-docs/
```


