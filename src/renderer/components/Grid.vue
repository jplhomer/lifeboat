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
  display: flex;
  flex-flow: row wrap;
  height: 100vh;
  overflow: hidden;
}

.titlebar {
  background: hsla(176, 32%, 14%, 1);
  -webkit-app-region: drag;
  flex-basis: 100%;

  .platform-win32 & {
    display: none;
  }
}

.sidebar {
  width: 200px;
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

  .no-sidebar & {
    display: none;
  }
}

.body {
  flex-grow: 1;

  .no-sidebar & {
    overflow: scroll;
  }
}
</style>

