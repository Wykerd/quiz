# Quiz!
A simple quiz app built with the MERN stack

Currently under development.

# Deployment
This application uses a microservice architecture. It includes a client and backend service eachi with a Dockerfile to run them in containers.

I recommend running the application in docker containers as it handles most of the setup for you. See __Running in docker__ for more detailed instructions.

If you prefer running the application on your host machine during development, see __Building on host__ for build instructions.

# Running on docker
This application contains two services that will need to be run in docker. Use the Dockerfile in the subdirectories to build the containers and run them using docker or the orchestrator of your choice.

See below instructions for running in docker-compose.

## Running in docker-compose
The root of this project contains a docker-compose.yml file that you can use to run the application using docker-compose.

### Build and spin up the container
```
docker-compose up --build
```

### Stop the containers
```
docker-compose down
```

See docker's documentation for more detailed instructions on running the application in containers.

# Building on host

Follow these steps to build the application from source on your computer. See __Running in docker__ if you prefer running the application in a container.

## Install dependencies
Before building the client or server make sure to install the dependencies using your prefered package manager (yarn or npm).

You can use the script below to do this for you if you're using yarn. (You must run it in the project root directory)
```sh
cd ./client
yarn
cd ../server
yarn
cd .
```

## Build
Run `yarn build` or `npm run build` in both the client and server directories to build the source.

The build is available in the dist folders within these subdirectories.

# Running on host
## Running the backend
The steps below assume you've already built the backend, see __Building on host__ for details.

First set the environment variables

Key | Description | Default
--- | --- | ---
MONGO_HOST | The Hostname for the mongodb database | localhost
PORT | The server port | 9100
PUBLIC_URL | The public url of the client PWA, used to allow CORS | http://localhost

Now run the backend with the following command (assuming you're in the ./server dir)
```
node dist/index
```

## Running the frontend

### Development
For development, you might want to use webpack-dev-server. Config included in the ```./client/webpack.config.js``` file.

To run the webpack server, issue the following command (assuming you're in the ./client dir)
```
yarn start
```

### Production
You can use any static webpage hosting to host a production version of the site. Simply build the production code as described in __Building on host__. 