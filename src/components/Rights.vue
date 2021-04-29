<!-- Komponente zum auswählen der Art des neuen Antrags -->
<template>
  <b-container fluid>
    <b-row id="new-application-row" align-h="center">
      <b-col cols="12">
        <b-container fluid>
          <b-row align-v="center" align-h="center">
            <b-col cols="12" md="6">
              <h1 id="new-application-heading">Rechte verwalten</h1>
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
          <b-row id="na-srow" align-h="center" align-v="center">
            <b-col
              cols="12"
              md="6"
              lg="6"
              class="shadow-lg"
              style="padding:2rem;border-radius:1rem"
            >
              <!-- Email Eingabe -->
              <b-input-group size="lg">
                <b-input-group-text id="tgm-addon" class="shadow" slot="append"
                  ><span>@tgm.ac.at</span></b-input-group-text
                >
                <b-form-input
                  id="email"
                  class="shadow login-inputs"
                  v-model="teacher"
                  type="text"
                  placeholder="E-Mail"
                ></b-form-input>
              </b-input-group>
              <!-- Rechte-Einstellungen Eingabe -->
              <b-form-group
                style="margin-top:5%;"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die Rechte des Kontos an."
                label="Rechte"
                label-for="tp"
                :id="index + 'transport'"
              >
                <b-form-checkbox-group
                  id="rights"
                  v-model="rights"
                  :name="index + 'tp'"
                  stacked
                >
                  <b-form-checkbox value="0">Admin</b-form-checkbox>
                  <b-form-checkbox value="1">AV</b-form-checkbox>
                  <b-form-checkbox value="2">Administration</b-form-checkbox>
                  <b-form-checkbox value="3">PEK</b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>
              <!-- Speichern Button -->
              <b-button
                variant="outline-success"
                id="show-btn"
                style="margin-right: 1rem"
                class="float-right"
                @click="save"
                ><b-icon icon="file-earmark-check"></b-icon> Rechte
                speichern</b-button
              >
            </b-col>
          </b-row>
        </b-container>
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
      teacher: "",
      rights: []
    };
  },
  methods: {
    /**
     * Diese Methode leitet den Benutzer auf die Startseite weiter
     */
    index() {
      if (this.checkClick()) {
        this.changeComponent("Index");
      }
    },
    /**
     * Diese Methode lässt auf sich warten
     */
    sleep() {
      return new Promise(resolve => setTimeout(resolve, 1000));
    },
    /**
     * Diese Methode sendet die Rechte für das angegebene Konto an das Backend
     */
    save() {
      if (this.teacher === "") {
        this.noTeacher();
      } else {
        var rechte = {
          super_user: false,
          av: false,
          administration: false,
          pek: false
        };
        if (this.rights.includes("0")) rechte.super_user = true;
        if (this.rights.includes("1")) rechte.av = true;
        if (this.rights.includes("2")) rechte.administration = true;
        if (this.rights.includes("3")) rechte.pek = true;
        if (this.checkClick()) {
          axios
            .get(this.url + "/getTeacherByShort?name=" + this.teacher, {
              headers: {
                Authorization: "Basic " + this.token
              }
            })
            .then(response => {
              this.sleep();
              axios
                .post(
                  this.url +
                    "/setTeacherPermissions?uuid=" +
                    response.data.uuid,
                  rechte,
                  {
                    headers: {
                      Authorization: "Basic " + this.token
                    }
                  }
                )
                .then(res => {
                  res.toString();
                  this.saveComplete();
                  this.reset();
                })
                .catch(erro => {
                  erro.toString();
                  this.saveFailed();
                });
            })
            .catch(error => {
              switch (error.response.status) {
                case 401:
                  axios
                    .post(this.url + "login/refresh", {
                      refresh_token: this.refresh_token
                    })
                    .then(resp => {
                      this.$emit(
                        "updateToken",
                        resp.data.access_token,
                        resp.data.refresh_token
                      );
                      axios
                        .get(
                          this.url + "/getTeacherByShort?name=" + this.teacher,
                          {
                            headers: {
                              Authorization: "Basic " + resp.data.access_token
                            }
                          }
                        )
                        .then(re => {
                          this.sleep();
                          axios
                            .post(
                              this.url +
                                "/setTeacherPermissions?uuid=" +
                                re.data.uuid,
                              rechte,
                              {
                                headers: {
                                  Authorization:
                                    "Basic " + resp.data.access_token
                                }
                              }
                            )
                            .then(r => {
                              r.toString();
                              this.saveComplete();
                              this.reset();
                            })
                            .catch(er => {
                              er.toString();
                              this.saveFailed();
                            });
                        })
                        .catch(e => {
                          e.toString();
                        });
                    })
                    .catch(err => {
                      err.toString();
                      this.$emit("logout");
                    });
                  break;
                default:
                  this.saveFailed();
                  break;
              }
            });
        }
      }
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass das Speichern fehlgeschlagen ist
     */
    saveFailed() {
      this.$bvToast.toast("Speichern ist fehlgeschlagen!", {
        title: "Ein Fehler ist aufgetreten!",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass kein Lehrer eingegeben worden ist
     */
    noTeacher() {
      this.$bvToast.toast("Kein Konto angegeben!", {
        title: "Ein Fehler ist aufgetreten!",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
    },
    /**
     * Diese Methode setzt das Formular zurück
     */
    reset() {
      this.teacher = "";
      this.rights = [];
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass das Speichern erfolgreich ist
     */
    saveComplete() {
      this.$bvToast.toast("Die Rechte des Kontos wurden aktualisiert!", {
        title: "Speichern erfolgreich!",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "success"
      });
    },
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
    }
  }
};
</script>
