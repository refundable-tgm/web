<template>
  <b-container fluid style="height:100vh;width:100vw">
    <b-row
      ><b-col cols="12" class="mt-3">
        <b-skeleton-img
          animation="fade"
          no-aspect
          height="150px"
        ></b-skeleton-img> </b-col
    ></b-row>
    <b-row>
      <b-col>
        <center>
          <h1>Whoops! Diese Seite existiert nicht.</h1>
          <h2><b-badge variant="danger">Error-404</b-badge> Page not found</h2>
          <p>
            Die Seite die Sie aufrufen wollten existiert leider nicht, bitte
            überprüfen Sie die <b-badge>URL</b-badge>, die Sie eingegeben haben
            oder begeben Sie sich zurück auf die<br />
            <b-button variant="outline-success" v-on:click="index()"
              >Startseite</b-button
            >
          </p>
        </center>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-skeleton-img animation="fade"></b-skeleton-img>
      </b-col>
      <b-col>
        <b-skeleton-img animation="fade"></b-skeleton-img>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  methods: {
    index() {
      console.log("INDEX!");
      if (this.checkClick()) {
        this.$emit("toIndex");
      }
    },
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
