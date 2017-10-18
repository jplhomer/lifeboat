<template>
  <div class="readme content" v-html="readme">
  </div>
</template>

<script>
import markdown from "markdown";
import fs from "fs";

export default {
  props: ["project"],
  data() {
    return {};
  },
  methods: {},
  computed: {
    readme() {
      try {
        return markdown.markdown.toHTML(
          fs.readFileSync(`${this.project.dir}/README.md`, "utf8")
        );
      } catch (e) {
        console.log(e);
        return "No README.md file found.";
      }
    }
  }
};
</script>

<style>
.readme {
  padding: 1rem;
  height: 100%;
  overflow: scroll;
}
</style>

