<template>
  <div>
    <b-alert
      v-model="showBottom"
      class="position-fixed fixed-bottom m-0 rounded-0"
      style="z-index: 2000;"
      variant="warning"
      dismissible
    >
      Diese Seite <b>benötigt</b> Cookies um zu funktionieren. Dies sind nur
      funktionelle Cookies, wir sammeln Ihre Daten <b>nicht</b>. Alle benötigten
      Cookies
      <b-button variant="success" @click="validateCookies()"
        >akzeptieren</b-button
      >
    </b-alert>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showBottom: true,
      cookies: false
    };
  },
  methods: {
    validateCookies() {
      this.$emit("requestAnswer", true);
    }
  }
};
</script>
