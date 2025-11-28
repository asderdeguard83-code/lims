<template>
  <div class="app-layout">
    <header class="app-header">
      <h1>Управление техническими требованиями</h1>
    </header>
    <main class="app-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: #2c3e50;
  color: white;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  h1 {
    font-size: 18px;
    font-weight: 500;
  }
}

.app-main {
  flex: 1;
  overflow: hidden;
}
</style>