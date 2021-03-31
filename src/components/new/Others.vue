<!-- Komponente zum Auswählen der sonstigen Art des Antrages -->
<template>
  <b-container fluid>
    <b-row id="new-application-row" align-h="center">
      <b-col cols="12">
        <b-container fluid>
          <b-row align-v="center" align-h="center">
            <b-col cols="12" md="6">
              <h1 id="new-application-heading">Neuen Antrag erstellen</h1>
            </b-col>
            <b-col cols="12" md="6">
              <!-- Home Buttons -->
              <b-button
                variant="outline-primary"
                class="float-right"
                v-on:click="index()"
              >
                <b-icon icon="house" aria-hidden="true"></b-icon> Startseite
              </b-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12">
              <!-- Verzeichnisanzeige -->
              <b-breadcrumb style="background-color: white">
                <b-breadcrumb-item v-on:click="uebersicht"
                  >Antrag Übersicht</b-breadcrumb-item
                >
                <b-breadcrumb-item active>Fortbildung, etc</b-breadcrumb-item>
              </b-breadcrumb>
            </b-col>
          </b-row>
          <b-row id="na-srow" align-h="center" align-v="center">
            <b-col cols="12" md="6" lg="4">
              <b-container id="school-button" class="na-elem shadow-xl">
                <!-- Button zum erstellen einer Fortbildung -->
                <b-row
                  class="na-elem-sr"
                  align-v="center"
                  v-on:click="workshop()"
                >
                  <b-col cols="12">
                    <h2 class="na-elem-h">Fortbildung</h2>
                  </b-col>
                </b-row>
              </b-container>
              <b-container id="na-elem-2" class="na-elem shadow-xl">
                <!-- Button zum erstellen eines anderen Antrags -->
                <b-row
                  class="na-elem-sr"
                  align-h="center"
                  align-v="center"
                  v-on:click="otherCause()"
                >
                  <b-col cols="12">
                    <h2 class="na-elem-h">Anderer Grund</h2>
                  </b-col>
                </b-row>
              </b-container>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  name: "NewApplication",
  methods: {
    /**
     * Diese Methode ändert die angezeigte Komponente
     * @param component Die neue Komponente, welche angezeigt werden soll
     * @param back Boolean-Wert, ob die neue Komponente in die History des Browsers gespeichert werden soll
     * @param application Die ID des Antrags, welcher angezeigt werden soll
     */
    changeComponent(component, back = true, application = null) {
      this.$emit("change-component", component, back, application);
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
    },
    /**
     * Diese Methode leitet den Benutzer auf die Workshop-Seite weiter
     */
    workshop() {
      if (this.checkClick()) {
        this.changeComponent("Workshop");
      }
    },
    /**
     * Diese Methode leitet den Benutzer auf die OtherCause-Seite weiter
     */
    otherCause() {
      if (this.checkClick()) {
        this.changeComponent("OtherCause");
      }
    },
    /**
     * Diese Methode leitet den Benutzer auf die Startseite weiter
     */
    index() {
      if (this.checkClick()) {
        this.changeComponent("Index");
      }
    },
    /**
     * Diese Methode leitet den Benutzer auf die NewApplication-Seite weiter
     */
    uebersicht() {
      if (this.checkClick()) {
        this.changeComponent("NewApplication");
      }
    }
  }
};
</script>
