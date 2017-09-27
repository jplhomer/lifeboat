import electron from "electron";
import fs from "fs";
import path from "path";

const settingsPath = path.join(
  (electron.app || electron.remote.app).getPath("userData"),
  "settings.json"
);

export default {
  load() {
    try {
      return JSON.parse(fs.readFileSync(settingsPath));
    } catch (e) {
      return {};
    }
  },

  save(args) {
    const data = Object.assign({}, this.load(), args);
    fs.writeFileSync(settingsPath, JSON.stringify(data));
  }
};
