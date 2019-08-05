# What is this?

This is an Angular-NgRx -frontend application template project.

## Table of Contents

* [What is this?](#what-is-this)
   * [Table of Contents](#table-of-contents)
   * [Requirements](#requirements)
   * [Installation](#installation)
      * [1. Clone repository](#1-clone-repository)
      * [2. Start containers](#2-start-containers)
      * [3. Using application](#3-using-application)
      * [4. Getting shell to container](#4-getting-shell-to-container)
      * [5. Building containers](#5-building-containers)
   * [Resources](#resources)
   * [External links / resources](#external-links--resources)
   * [LICENSE](#license)

## Requirements

* [docker-compose](https://docs.docker.com/compose/install/)
* If you are not using docker / docker-compose then follow [this](doc/INSTALLATION_WITHOUT_DOCKER.md)

## Installation

### 1. Clone repository

Use your favorite IDE and get checkout from GitHub or just use following 
command

```bash
git clone https://github.com/henrihockman/angular-ngrx-frontend.git
```

### 2. Start containers

For this just run following command:

```bash
docker-compose up
```

This command will create one (1) container to run this frontend application:
 * node (this is for actual application)
 
### 3. Using application

By default `docker-compose up` command starts this application container and 
exposes following ports on `localhost`:
 * 4200 (node)
 
And this application is usable within your browser on `http://localhost:4200`
address.

### 4. Getting shell to container

After you've run `docker-compose up` command you can list all running containers
with `docker ps` command.

And to eg. get shell access inside one of those containers you can run following
command:

```bash
docker-compose exec node /bin/bash
```

Where that `node` is that actual container where this frontend application is
running.

### 5. Building containers

For time to time you probably need to build containers again. This is something
that you should do everytime if you have some problems to get containers up and
running. This you can do with following command:

```bash
docker-compose up --build 
```

## Resources

* [Installation without docker](doc/INSTALLATION_WITHOUT_DOCKER.md)
* [Angular CLI](doc/ANGULAR_CLI.md)
* [Tools to use](doc/TOOLS_TO_USE.md)
* [Handling translations](doc/TRANSLATIONS.md)

## External links / resources

* [Angular](https://angular.io/)
* [Angular Material](https://material.angular.io/)
* [The RxJS Library](https://angular.io/guide/rx-library)
* [Store](https://ngrx.io/guide/store)
 
## LICENSE

[The MIT License (MIT)](LICENSE)

Copyright © 2019 Henri Hockman
