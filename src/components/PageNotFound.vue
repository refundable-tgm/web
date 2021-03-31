<!-- Komponente die angezeigt wird, wenn die Seite nicht gefunden wurde -->
<template>
  <b-container fluid style="height:100vh;width:100vw">
    <b-row
      ><b-col cols="12" class="mt-3">
        <!-- Anzeigen eines Bootstrap Skeletons -->
        <b-skeleton-img
          animation="fade"
          no-aspect
          height="150px"
        ></b-skeleton-img> </b-col
    ></b-row>
    <b-row>
      <b-col>
        <center>
          <!-- Warnhinweis -->
          <h1>Whoops! Diese Seite existiert nicht.</h1>
          <h2><b-badge variant="danger">Error-404</b-badge> Page not found</h2>
          <p>
            Die Seite die Sie aufrufen wollten existiert leider nicht, bitte
            überprüfen Sie die <b-badge>URL</b-badge>, die Sie eingegeben haben
            oder begeben Sie sich zurück auf die<br />
            <!-- Button um auf die Index Seite zu kommen -->
            <b-button variant="outline-success" v-on:click="index()"
              >Webseite</b-button
            >
          </p>
        </center>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <!-- Anzeigen eines Bootstrap Skeletons -->
        <b-skeleton-img animation="fade"></b-skeleton-img>
      </b-col>
      <b-col>
        <!-- Anzeigen eines Bootstrap Skeletons -->
        <b-skeleton-img animation="fade"></b-skeleton-img>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  methods: {
    /**
     * Diese Methode ändert die Komponente auf die Index-Seite (Hauptseite)
     */
    index() {
      if (this.checkClick()) {
        this.$emit("toIndex");
      }
    },
    /**
     * Diese Methode sorgt dafür, dass nicht unnötigerweise geclickt wird, falls nur makiert worden ist
     */
    checkClick() {
      if (
        window
          .getSelection()
          .toString()
          .trim() === ""
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>
