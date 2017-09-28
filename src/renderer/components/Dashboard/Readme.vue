<template>
  <div class="tab-area" ref="tabArea">
    <div class="readme content" v-html="readme"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import markdown from "markdown";
import fs from "fs";

export default {
  data() {
    return {};
  },
  methods: {},
  computed: {
    readme() {
      try {
        return markdown.markdown.toHTML(
          fs.readFileSync(`${this.activeProject.dir}/README.md`, "utf8")
        );
      } catch (e) {
        console.log(e);
        return "No README.md file found.";
      }
    },
    ...mapGetters(["activeProject"])
  }
};
</script>

<style>
.readme {
  padding: 1rem;
}
</style>

