# lifeboat

A Docker UI for projects.

![Screenshot of Lifeboat UI](https://pbs.twimg.com/media/DK_DFpLUMAAg315.png:large)

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

# run unit & end-to-end tests
yarn test

# lint all JS/Vue component files in `src/`
yarn run lint

```

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
