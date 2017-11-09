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
:root {
  --sidebar-size: 200px;
}

.grid {
  display: flex;
  flex-flow: row nowrap;
  height: 100vh;
  padding-top: 1.5rem;
  overflow: hidden;
}

.titlebar {
  background: hsla(176, 32%, 14%, 1);
  -webkit-app-region: drag;
  height: 1.5rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  .platform-win32 & {
    display: none;
  }
}

.sidebar {
  width: var(--sidebar-size);
  flex-shrink: 0;
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
  width: calc(100% - var(--sidebar-size));
  height: calc(100vh - 1.5rem);

  .no-sidebar & {
    overflow: scroll;
    width: 100%;
  }
}
</style>

