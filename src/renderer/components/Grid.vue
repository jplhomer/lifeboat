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
  background: #010101;
  grid-area: top;
  -webkit-app-region: drag;
}

.sidebar {
  grid-area: side;
  background-image: linear-gradient(130deg, #335fff 15%, #05b5ff 70%);

  &__menu {
    a {
      color: #b6c9fb;
      display: block;
      padding: .5rem .5rem;
      border-left-width: 5px;
      border-left-style: solid;
      border-left-color: transparent;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    a:hover,
    a:focus {
      background-color: rgba(255, 255, 255, .1);
    }

    a.is-active {
      background-color: #558bff;
      color: #fff;
    }

    small {
      font-size: .8em;
    }
  }
}

.body {
  grid-area: body;
}
</style>

