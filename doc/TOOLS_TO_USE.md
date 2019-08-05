# What is this?

This document contains information about included tools within this application.
Document relies that you use `docker-compose` to run this application.

## Table of Contents

* [What is this?](#what-is-this)
   * [Table of Contents](#table-of-contents)
   * [Package manager](#package-manager)
   * [Checking package updates](#checking-package-updates)

## Package manager

As in package manager this application is configured to use `yarn` and not 
`npm` and that means if you want to install eg. new package you need to use
`yarn` command for that.

## Checking package updates

Docker image contains `ncu` [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)
tool that you can use to check if there is an update available for any package
that application contains.
