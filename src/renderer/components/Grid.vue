<template>
  <div :class="`grid${disableSidebar ? ' no-sidebar' : ''}`">
    <div class="titlebar"></div>
    <div class="sidebar">
      <slot name="sidebar"></slot>
    </div>
    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["disableSidebar"]
};
</script>


<style lang="scss">
.grid {
  display: grid;
  grid-template-areas: "top top top" "side body body" "side body body";
  grid-template-rows: 1.5rem 1fr 1fr;
  grid-template-columns: 200px 1fr 1fr;
  height: 100vh;
  overflow: hidden;

  &.no-sidebar {
    grid-template-areas: "top" "body";
    grid-template-rows: 1.5rem 1fr;
    grid-template-columns: 1fr;
  }
}

.titlebar {
  background: hsla(176, 32%, 14%, 1);
  grid-area: top;
  -webkit-app-region: drag;
}

.sidebar {
  grid-area: side;
  background-color: var(--color-primary);
  position: relative;

  &__menu {
    a {
      color: var(--color-light);
      display: block;
      padding: 0.5rem 0.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    a:hover,
    a:focus {
      background-color: rgba(255, 255, 255, 0.1);
    }

    a.is-active {
      background-color: hsl(191, 42%, 60%);
      color: #fff;
    }

    small {
      font-size: 0.8em;
    }
  }

  &__actions {
    bottom: 0;
    position: absolute;
    left: 0;
    right: 0;

    a {
      color: #fff;
    }
  }
}

.body {
  grid-area: body;

  .no-sidebar & {
    overflow: scroll;
  }
}
</style>

