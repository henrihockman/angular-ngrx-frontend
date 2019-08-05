# What is this?

This document contains information how you can use [Angular CLI](https://angular.io/cli)
within this application.

## Table of Contents

* [What is this?](#what-is-this)
   * [Table of Contents](#table-of-contents)
   * [Requirements](#requirements)
   * [Usage](#usage)
   * [Notes](#notes)

## Requirements

You need to start application within development mode with following command:

```bash
docker-compose up
```

## Usage

You need to get shell access to running container with following command:

```bash
docker-compose exec node /bin/bash
```

After this you can use `ng` command as in described in official docs.

## Notes

If/when you use `ng` command to generate eg. new Angular component, after that
you need to shutdown running container and start it again. This is needed to
ensure that file permissions are correct ones.
