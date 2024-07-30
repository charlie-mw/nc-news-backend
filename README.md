# Northcoders News API

## Summary of project

This project built an API for accessing application data, in the form of a blog/article based site. The backend created provides the necessary information for the frontend application. The backend uses JavaScript, SQL and Express, and implements a RESTful API to handle CRUD operations. Express was used to handle client requests, and SQL was used for database management to allow for storage and manipulation of data. Testing was incoroporated using JEST in order to improve code reliability, as well as to ensure that test cases covered the interactions with the API endpoints. The frontend uses JavaScript, React and Vite and builds on top of the backend. React was used to create a responsive user interface by communicating efficently with the backend, and Vite was used to enhance the applications performance. The frontend features a clean and responsive design which enables a consistent experience for users across platforms. 
## Link to the hosted version: 

https://nc-news-project-woew.onrender.com

 ## How to connect to the databases
- Have a look in the .env-example to see what format is expected
- Find out the two different database names by looking in db/setup.sql
- Create two new files, .env.development and .env.test
- In each of these files use PGDATABASE= and then insert the correct database name

## Minimum package requirements 

The minimum versions of Node.js and Postgres you will need to run this project are version 4 or higher for Node.js and version ^8.11.5 for Postgres

## Installing dependencies 

There are several npm packages required to run this project. Use the command `npm i [package_name]` to install:

- express
- dotenv
- pg
- pg-format
- node-postgres
- jest
- supertest


## How to seed the local database

Run `npm run setup-dbs` to create the databases required
Run `npm run seed` to seed the development database 'be-nc-news'
--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
