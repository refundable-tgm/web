<!-- Komponente zum auswählen der Art des neuen Antrags -->
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
              <!-- Home Button -->
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
              <b-breadcrumb
                style="background-color: white"
                :items="items"
              ></b-breadcrumb>
            </b-col>
          </b-row>
          <b-row id="na-srow" align-h="center" align-v="center">
            <b-col cols="12" md="6" lg="4">
              <b-container id="school-button" class="na-elem shadow-xl">
                <!-- Custom Button zum erstellen eines Schulantrages -->
                <b-row
                  class="na-elem-sr"
                  align-v="center"
                  v-on:click="school()"
                >
                  <b-col cols="12">
                    <h2 class="na-elem-h">Schulveranstaltung</h2>
                  </b-col>
                </b-row>
              </b-container>
              <b-container id="na-elem-2" class="na-elem shadow-xl">
                <!-- Custom Button zum erstellen eines anderen Antrages -->
                <b-row
                  class="na-elem-sr"
                  align-h="center"
                  align-v="center"
                  v-on:click="other()"
                >
                  <b-col cols="12">
                    <h2 class="na-elem-h">Fortbildung, etc.</h2>
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
     */
    changeComponent(component, back = true) {
      this.$emit("change-component", component, back);
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
     * Diese Methode leitet den Benutzer auf die Schulveranstaltungs-Seite weiter
     */
    school() {
      if (this.checkClick()) {
        this.changeComponent("School");
      }
    },
    /**
     * Diese Methode leitet den Benutzer auf die Fortbildung,etc.-Seite weiter
     */
    other() {
      if (this.checkClick()) {
        this.changeComponent("Others");
      }
    },
    /**
     * Diese Methode leitet den Benutzer auf die Startseite weiter
     */
    index() {
      if (this.checkClick()) {
        this.changeComponent("Index");
      }
    }
  },
  data() {
    return {
      items: [
        {
          text: "Antrag Übersicht",
          active: true
        }
      ]
    };
  }
};
</script>
