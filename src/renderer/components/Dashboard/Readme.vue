<template>
  <div class="tab-area" ref="tabArea">
    <div class="content" v-html="readme"></div>
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
          fs.readFileSync(`${this.activeProject.dir}/README.md`, "utf8")
        );
      } catch (e) {
        console.log(e);
        return "No README.md file found.";
      }
    },
    ...mapGetters(["activeProject"])
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

