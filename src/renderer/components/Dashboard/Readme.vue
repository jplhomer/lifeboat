<template>
  <div class="tab-area" ref="tabArea">
    <div class="content" v-html="readme"></div>
  </div>
</template>

<script>
import markdown from "markdown";
import fs from "fs";

export default {
  props: ["dir"],
  data() {
    return {};
  },
  methods: {
    setTabAreaHeight() {
      const height =
        window.innerHeight - this.$refs.tabArea.getBoundingClientRect().top;
      this.$refs.tabArea.style.height = `${height}px`;
    }
  },
  computed: {
    readme() {
      try {
        return markdown.markdown.toHTML(
          fs.readFileSync(`${this.dir}/README.md`, "utf8")
        );
      } catch (e) {
        console.log(e);
        return "No README.md file found.";
      }
    }
  },
  mounted() {
    this.setTabAreaHeight();
    window.addEventListener("resize", this.setTabAreaHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setTabAreaHeight);
  }
};
</script>

