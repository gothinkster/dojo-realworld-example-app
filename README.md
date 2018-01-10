# ![RealWorld Example App](logo.png)

> ### Dojo 2 codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.


### [Demo](https://agubler.github.io/dojo2-realworld/dist/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)


This codebase was created to demonstrate a fully fledged fullstack application built with Dojo 2 including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the Dojo 2 community style guides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.


# How it works

Dojo 2 RealWorld using @dojo/widget-core, @dojo/routing and @dojo/stores

# Getting started

You can view a live demo over at https://agubler.github.io/dojo2-realworld/dist/

To get the frontend running locally:

- Clone this repo
- `npm install` to install all req'd dependencies
- `dojo build -w` to start the local server ([http:localhost:9999](http:localhost:9999))

Local web server will use port 9999.

For a production build of the application:

- `dojo build` to build the output into the `dist` directory.

To run the tests run `dojo test`
