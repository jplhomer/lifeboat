<template>
  <div class="grid">
    <div class="titlebar"></div>
    <div class="sidebar">
      <slot name="sidebar"></slot>
    </div>
    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
.grid {
  display: grid;
  grid-template-areas: "top top top" "side body body" "side body body";
  grid-template-rows: 1.5rem 1fr 1fr;
  grid-template-columns: 200px 1fr 1fr;
  height: 100vh;
}

.titlebar {
  background: #010101;
  border-bottom: 1px solid #ccc;
  grid-area: top;
  -webkit-app-region: drag;
}

.sidebar {
  grid-area: side;
  padding: .5rem;
  background-color: #fafafa;
}

.body {
  grid-area: body;
}
</style>

