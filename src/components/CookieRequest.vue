<!-- Cookie Popup -->
<template>
  <div>
    <!-- Bestätigung, dass diese Seite Cookies benutzt -->
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
      <!-- Button zum akzeptieren -->
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
    /**
     * Diese Methode leitet die Antwort des Benutzers auf den Parent (Login) weiter
     */
    validateCookies() {
      this.$emit("requestAnswer", true);
    }
  }
};
</script>
