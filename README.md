# lifeboat

A Docker UI for projects. **[Download for Mac, Windows and Linux](https://github.com/jplhomer/lifeboat/releases) from the Releases tab.**

![Screenshot of Lifeboat UI](https://user-images.githubusercontent.com/848147/32585014-ea2a74b2-c4c0-11e7-8563-9bd4800590ff.png)

## Development

This is an Electron app, scaffolded with [electron-vue](https://github.com/SimulatedGREG/electron-vue).

- You will need to have Node/Yarn installed locally.
- You will need to have [Docker for Mac](https://docs.docker.com/docker-for-mac/install/) or [Docker for Windows](https://store.docker.com/editions/community/docker-ce-desktop-windows) installed and running. **Older implementations of Docker, using docker-machine or boot2docker, are not supported**.
- You will need a test project with a valid `docker-compose.yml` file. Consider using one of the [example Docker Compose projects](https://docs.docker.com/compose/) to test.

#### Build Setup

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:9080
yarn run dev

# build electron application for production
yarn run build

# quick build (.app only)
yarn run build:dir

# run unit tests
yarn test

# lint all JS/Vue component files in `src/`
yarn run lint

```

#### Writing Tests

Unit tests are written for Vue components and should be placed in the `test/specs` directory. Here are a few guides for writing tests using Lifeboat's setup:

- [Vue Test Utils](https://vue-test-utils.vuejs.org): The library of tool used to test shallow copies of Vue components.
- [Expect](https://facebook.github.io/jest/docs/en/expect.html): Part of Facebook's Jest testing suite. Used for assertions.
- [Sinon](http://sinonjs.org/): Used for spies, mocks, stubs, and fake timers.

#### Troubleshooting

A valid Apple Developer ID signing certificate is required if you want to release a build. If you get an issue during code signing similar to `...resource fork, Finder information, or similar detritus not allowed`, try inspecting which files are causing trouble with:

```
xattr -lr /path/to/lifeboat/
```

And clean up any files with:

```
xattr -cr /path/to/lifeboat/<optional pattern>
```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[331f85f](https://github.com/SimulatedGREG/electron-vue/tree/331f85fd556cc0d60a30ad019a44a29baaed49f5) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
