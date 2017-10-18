<template>
  <div class="readme content" v-html="readme" ref="readme">
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
  },
  mounted() {
    this.$refs.readme.querySelectorAll("a").forEach(el => {
      if (el.href.slice(0, 1) === "#") return;
      el.addEventListener("click", e => {
        e.preventDefault();
        this.$electron.shell.openExternal(e.target.href);
      });
    });
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

