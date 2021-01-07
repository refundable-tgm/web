<template>
  <div id="main-content">
    <router-view v-on:toIndex="toIndex()" />
  </div>
</template>

<script>
export default {
  methods: {
    toIndex() {
      this.$router.push("/");
    }
  }
};
</script>
