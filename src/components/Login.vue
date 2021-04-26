<!-- Komponente für das Login -->
<template>
  <b-container fluid>
    <!-- Einbinden der Cookie Abfrage -->
    <CookieRequest
      :key="componentKey"
      v-on:requestAnswer="requestAnswer"
      v-if="!setcookie"
    />
    <b-row align-v="center" align-h="center" class="template-main-row">
      <!-- Titel -->
      <b-col cols="12" md="6">
        <b-container>
          <b-row align-h="center">
            <b-col cols="12" md="6">
              <center>
                <h1 id="lheading">Refundable</h1>
                <h2 id="lsheading">
                  Die automatisierte Reisekostenabrechnung
                </h2>
              </center>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
      <!-- Anmeldungsformular -->
      <b-col cols="12" md="6">
        <b-container>
          <b-row align-h="center">
            <b-col cols="12" sm="10" md="10" lg="8" xl="6">
              <b-container id="login-wrap" class="shadow-lg">
                <b-row id="r-login" align-h="center">
                  <h2 id="lheading2">Anmeldung</h2>
                </b-row>
                <b-row align-h="center" id="r-email">
                  <b-col cols="12">
                    <!-- Input des Benutzernamens / der Email -->
                    <b-input-group size="lg">
                      <b-input-group-text
                        id="tgm-addon"
                        class="shadow"
                        slot="append"
                        ><span>@tgm.ac.at</span></b-input-group-text
                      >
                      <b-form-input
                        id="email"
                        class="shadow login-inputs"
                        v-model="email"
                        type="text"
                        placeholder="E-Mail"
                      ></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row id="r-password">
                  <b-col cols="12">
                    <!-- Input des Passworts -->
                    <b-form-input
                      id="password"
                      class="shadow login-inputs"
                      v-model="password"
                      type="password"
                      placeholder="Password"
                      size="lg"
                    ></b-form-input>
                  </b-col>
                </b-row>
                <b-row id="r-forgotten">
                  <b-col cols="12">
                    <!-- Passwort vergessen Weiterleitung auf Moodle -->
                    <a
                      id="forgotten-password"
                      href="https://elearning.tgm.ac.at/login/forgot_password.php"
                      >Passwort vergessen?</a
                    >
                  </b-col>
                </b-row>
                <b-row align-h="center" id="r-login-btn">
                  <!-- Login Button -->
                  <b-button size="lg" id="login-btn" v-on:click="login"
                    >Anmelden</b-button
                  >
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
import CookieRequest from "@/components/CookieRequest.vue";
import axios from "axios";
export default {
  components: {
    CookieRequest
  },
  name: "Login",
  props: ["url", "forward", "cookieset"],
  data() {
    return {
      email: "",
      password: "",
      setcookie: false,
      componentKey: 0
    };
  },
  methods: {
    /**
     * Diese Methode loggt den Benutzer mit dem eingegebenen Benutzernamen und dem eingegebenen Passwort ein
     */
    login() {
      if (this.checkClick()) {
        if (this.cookieset === true) {
          axios
            .post(this.url + "/login", {
              username: this.email,
              password: this.password
            })
            .then(response => {
              switch (response.status) {
                case 200:
                  axios
                    .get(this.url + "/getTeacherByShort?name=" + this.email, {
                      headers: {
                        Authorization: "Basic " + response.data.access_token
                      }
                    })
                    .then(resp => {
                      switch (resp.status) {
                        case 200:
                          this.$emit(
                            "login",
                            resp.data.uuid,
                            resp.data.super_user,
                            resp.data.administration,
                            resp.data.av,
                            resp.data.pek,
                            response.data.access_token,
                            response.data.refresh_token,
                            resp.data.short,
                            resp.data.longname
                          );
                          switch (this.forward.name) {
                            case "ApplicationSearch":
                              this.$emit("change-component", this.forward.name);
                              break;
                            case "ApplicationView":
                              this.$emit(
                                "change-component",
                                this.forward.name,
                                true,
                                this.forward.id
                              );
                              break;
                            default:
                              if (!resp.data.av && !resp.data.super_user) {
                                if (resp.data.administration || resp.data.pek) {
                                  this.$emit(
                                    "change-component",
                                    "AdminDashboard"
                                  );
                                } else {
                                  this.$emit("change-component", "Index");
                                }
                              } else {
                                this.$emit("change-component", "Index");
                              }
                              break;
                          }
                          break;
                        default:
                          this.loginFailed();
                          break;
                      }
                    });
                  break;
                default:
                  this.loginFailed();
                  break;
              }
            });
        } else {
          this.forceRender();
          this.makeToast();
        }
      }
    },
    /**
     * Diese Methode sorgt dafür, dass die Cookie-Komponente neu geladen wird
     */
    forceRender() {
      this.componentKey += 1;
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass der Benutzer die Cookies der Webseite akzeptieren muss
     */
    makeToast() {
      this.$bvToast.toast("Bitte akzeptieren Sie unsere Cookies!", {
        title: "Ein Fehler ist aufgetreten!",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass der Login fehlgeschlagen ist
     */
    loginFailed() {
      this.$bvToast.toast("Username oder Passwort ist nicht korrekt", {
        title: "Ein Fehler ist aufgetreten!",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
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
     * Diese Methode leitet die Antwort auf die Cookie-Frage an den Parent (Home) weiter
     */
    requestAnswer(answer) {
      this.setcookie = answer;
      this.$emit("requestAnswer", answer);
    }
  },
  mounted() {
    this.setcookie = this.cookieset;
  }
};
</script>
<style lang="scss">
#tgm-addon {
  border-radius: 0 1rem 1rem 0;
}
</style>
