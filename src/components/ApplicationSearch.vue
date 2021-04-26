<!-- Komponente zum Suchen eines Antrages -->
<template>
  <b-container fluid>
    <b-row align-v="center" align-h="center">
      <b-col cols="12" md="6">
        <h1 id="new-application-heading">Antrag Suchen</h1>
      </b-col>
      <div class="col-12 col-md-6">
        <!-- Home Button -->
        <b-button
          variant="outline-primary"
          class="float-right"
          v-on:click="index"
        >
          <b-icon icon="house" aria-hidden="true"></b-icon> Startseite
        </b-button>
        <!-- Neuer Antrag Button -->
        <b-button
          variant="outline-primary"
          class="float-right"
          v-on:click="newApplication"
          style="margin-right:20px"
        >
          <b-icon icon="plus" aria-hidden="true"></b-icon> Neuer Antrag
        </b-button>
      </div>
    </b-row>
    <b-row align-h="center" align-v="center" style="margin-top:3rem">
      <b-col>
        <!-- Input zur eingabe der ID des gewünschten Antrags -->
        <b-form-group
          id="search-application"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die ID des gewünschten Antrags ein."
          label-for="search"
        >
          <b-input-group id="search" prepend="Antrags ID" class="mt-3">
            <b-form-input v-model="searching"></b-form-input>
            <b-input-group-append>
              <!-- Antrag suchen -->
              <b-button v-on:click="search" variant="info">Suchen</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from "axios";
export default {
  props: ["url", "user", "token", "refresh_token"],
  data() {
    return {
      searching: "",
      uuid: ""
    };
  },
  methods: {
    /**
     * Diese Methode leitet den Benutzer auf die NewApplication-Seite weiter
     */
    newApplication() {
      if (this.checkClick()) {
        this.changeComponent("NewApplication");
        this.changeURL("NewApplication");
      }
    },
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
     * Diese Methode leitet den Benutzer auf die Startseite weiter
     */
    index() {
      if (this.checkClick()) {
        this.changeComponent("Index");
        this.changeURL("Index");
      }
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass keine ID in das Suchfeld eingegeben worden ist
     */
    makeToast() {
      this.$bvToast.toast("Es wurde keine ID eingegeben!", {
        title: "Ein Fehler ist aufgetreten!",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
    },
    /**
     * Diese Methode gibt die ID des Antrgas zurück
     * @returns Die ID des Antrags
     */
    requestApplication() {
      axios
        .get(this.url + "/getApplication?uuid=" + this.searching, {
          headers: {
            Authorization: "Basic " + this.token
          }
        })
        .then(response => {
          switch (response.status) {
            case 200:
              this.uuid = response.data.uuid;
              return true;
            case 401:
              axios
                .post(
                  this.url + "/login/refresh",
                  {},
                  {
                    headers: {
                      Authorization: "Basic " + this.refresh_token
                    }
                  }
                )
                .then(resp => {
                  switch (resp) {
                    case 201:
                      this.$emit(
                        "updateToken",
                        resp.data.access_token,
                        resp.data.refresh_token
                      );
                      axios
                        .get(this.url + "/getApplication?uuid=" + this.appid, {
                          headers: {
                            Authorization: "Basic " + this.token
                          }
                        })
                        .then(res => {
                          switch (res.status) {
                            case 200:
                              this.uuid = response.data.uuid;
                              return true;
                            default:
                              return false;
                          }
                        });
                      break;
                    default:
                      this.$emit("logout");
                      break;
                  }
                });
              break;
            default:
              return false;
          }
        });
    },
    /**
     * Diese Methode lädt den gefragten Antrag und leitet den Benutzer darauf weiter
     */
    search() {
      if (this.checkClick()) {
        if (this.searching === "") {
          this.makeToast();
        } else {
          let application = this.requestApplication();
          if (application) {
            this.changeComponent("ApplicationView", application);
            this.changeURL("ApplicationView");
          } else {
            this.failedLoad();
          }
        }
      }
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass der Antrag einen Fehler beim Laden hatte
     */
    failedLoad() {
      this.$bvToast.toast("Es ist ein Fehler aufgetreten!", {
        title: "Antrag konnte nicht geladen werden",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
    },
    /**
     * Diese Methode sorgt dafür, dass die URL angepasst ist, damit keine Reste des Viewers (ApplicationSearch) in der URL stehen
     * @param nextpage Die nächste Seite, welche aufgerufen wird
     */
    changeURL(nextpage) {
      if (window.location.href.indexOf("/viewer") >= 0) {
        history.replaceState(
          nextpage,
          null,
          window.location.href.substring(
            0,
            window.location.href.indexOf("/viewer")
          )
        );
      }
    }
  }
};
</script>
