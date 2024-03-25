# Documentation &middot; [![npm](https://img.shields.io/npm/v/npm.svg?style=flat-square)](https://www.npmjs.com/package/npm)
> Guide of installation stuff

Backend for Platform submitting Flags.

## Installing / Getting started

A quick introduction of the minimal setup you need to get a
running server .

```shell
git clone https://github.com/your/your-project.git](https://github.com/chakibdzm/Platform
cd your-project/
Create your own Branch:
git checkout -b ＜new-branch＞
packagemanager install
npm install
npm install -g ts-node
npx tsc --init 
```


## Prisma Installation
### Prerequisites
What is needed to set up the dev environment. For instance, global dependencies or any other tools. include download links.
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

### Setting up your Database

After Installing your PostgreSQL server and configure the port And Host&Password , Go to Your .env file and configure the DATABASE_URL After executing this one

```shell
npx prisma init
```

You will find the Prisma.schema in the main just copy the same one or merge it with your branch

### Running Migrations

When You completly done with configuring the database and make a correct connection just and written schema db just run this command :

```shell
npx prisma migrate dev --name init  
```

And then You should have the /src file contains the server prisma and the index.ts the one u took from the main.
Note: Keep a clean Architecture at least .


### Running Server


```shell
npm run dev
```

ENJOY listening on Port .....
