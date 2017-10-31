import Vue from "vue";

const REF = "scrollToBottom";

/**
 * Use the scrollToBottom mixin by including it in the component and marking
 * the scroll area with ref="scrollToBottom"
 */
export default {
  data() {
    return {
      isScrolledUp: false
    };
  },
  methods: {
    scrollToBottom() {
      if (this.isScrolledUp) {
        return;
      }

      Vue.nextTick(() => {
        this.$refs[REF].scrollTop =
          this.$refs[REF].scrollHeight - this.$refs[REF].offsetHeight;
      });
    }
  },
  mounted() {
    this.$refs[REF].addEventListener("scroll", () => {
      this.isScrolledUp =
        this.$refs[REF].scrollTop !=
        this.$refs[REF].scrollHeight - this.$refs[REF].offsetHeight;
    });
  }
};
