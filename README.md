# Psyduck-Nest

Psyduck-Nest is a boilerplate for Nestjs with Firebase Authentication and Firestore. It is a simple and easy to use boilerplate for starting a new project with Nestjs. It is also a monorepo with a web application built with Reactjs and TailwindCSS by Vitejs, which is a fast build tool for modern web development. The monorepo is managed by TurboRepo. The tools used in this project are:

- [Nestjs](https://nestjs.com/)
- [Firebase](https://firebase.google.com/)
- [Reactjs](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vitejs](https://vitejs.dev/)
- [Jest](https://jestjs.io/)
- [Turoborepo](https://turbo.build/)

## Installation

```bash
$ npm install
```

## Running the app

```bash
$ npm run dev
```

## Build

```bash
$ npm run build
```

## Start the app in production

```bash
$ npm run start
```

## Test

```bash
$ npm run test
```

## Docker

```bash
$ docker build -f apps/api/Dockerfile -t psyduck-nest .
$ docker run -p 8080:8080 psyduck-nest
```

## License

Psyduck-Nest is [MIT licensed](LICENSE).
