<template>
  <div :class="{ notification: true, 'is-info': (available || downloading) }">
    <p v-if="available">
      An update is available! The update will be installed the next time you start Lifeboat.<br>
      <a @click.prevent="quitAndInstall">Restart and install now</a>.
    </p>
    <p v-if="downloading">
      An update is available! It is downloading right now...

      <span class="icon is-pulled-right">
        <i class="fa fa-refresh fa-spin"></i>
      </span>
    </p>
    <p v-if="!available && !downloading">
      Lifeboat is
      <b>up to date</b> running version {{ version }}!
      <a @click.prevent="checkForUpdates" class="is-pulled-right" v-show="!checkingForUpdates">Check for updates</a>
      <span class="icon is-pulled-right" v-show="checkingForUpdates">
        <i class="fa fa-refresh fa-spin"></i>
      </span>
    </p>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapState } from "vuex";
import { autoUpdater } from "electron-updater";

export default {
  data() {
    return {
      checkingForUpdates: false,
      downloading: false
    };
  },
  computed: {
    version() {
      return this.$electron.remote.require("electron").app.getVersion();
    },
    ...mapState({
      available: state => state.App.updateAvailable
    })
  },
  methods: {
    checkForUpdates() {
      this.checkingForUpdates = true;

      ipcRenderer.send("autoupdate-check", true);
    },
    quitAndInstall() {
      ipcRenderer.send("autoupdate-quitandinstall", true);
    }
  },
  mounted() {
    ipcRenderer.on("autoupdate-update-not-available", (e, data) => {
      this.checkingForUpdates = false;
    });

    ipcRenderer.on("autoupdate-update-available", (e, data) => {
      this.downloading = true;
      this.checkingForUpdates = false;
    });

    ipcRenderer.on("autoupdate-update-downloaded", (e, data) => {
      this.downloading = false;
      this.checkingForUpdates = false;
    });
  }
};
</script>
