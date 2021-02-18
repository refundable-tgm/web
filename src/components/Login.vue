<template>
  <b-container fluid>
    <CookieRequest
      :key="componentKey"
      v-on:requestAnswer="requestAnswer"
      v-if="!setcookie"
    />
    <b-row align-v="center" align-h="center" class="template-main-row">
      <b-col cols="12" md="6">
        <b-container>
          <b-row align-h="center">
            <b-col cols="12" md="6">
              <center>
                <h1 id="lheading">Refundable</h1>
                <h2 id="lsheading">
                  Die automatisierte Reisekosetenabrechnung
                </h2>
              </center>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
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
                    <a
                      id="forgotten-password"
                      href="https://elearning.tgm.ac.at/login/forgot_password.php"
                      >Passwort vergessen?</a
                    >
                  </b-col>
                </b-row>
                <b-row align-h="center" id="r-login-btn">
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
    login() {
      if (this.checkClick()) {
        if (this.cookieset === true) {
          // Login Request an Michi
          console.log("Login!");
          console.log(this.email);
          console.log(this.password);
          // Userid getten von dem request
          axios
            .get(
              this.url + "/login?mail=" + this.email + ",pswd=" + this.password
            )
            .then(response => {
              if (response.success) {
                // Wenn login stimmt:
                switch (this.forward.name) {
                  case "ApplicationSearch":
                    this.$emit("login", response.user, response.admin);
                    this.$emit("change-component", this.forward.name);
                    break;
                  case "ApplicationView":
                    this.$emit("login", response.user, response.admin);
                    this.$emit(
                      "change-component",
                      this.forward.name,
                      true,
                      this.forward.id
                    );
                    break;
                  default:
                    this.$emit("login", response.user, response.admin);
                    this.$emit("change-component", "Index");
                    //Wenn Login failed:
                    //Eine Meldung an den User, dass etwas (nicht spezifisch) nicht stimmt
                    break;
                }
              } else {
                // Wenn login nicht stimmt:
                this.loginFailed();
              }
            });
          // Temporär, damit man sich einloggen kann
          switch (this.forward.name) {
            case "ApplicationSearch":
              //this.$emit("login", response.user, response.admin);
              this.$emit("change-component", this.forward.name);
              break;
            case "ApplicationView":
              //this.$emit("login", response.user, response.admin);
              this.$emit(
                "change-component",
                this.forward.name,
                true,
                this.forward.id
              );
              break;
            default:
              //this.$emit("login", response.user, response.admin);
              this.$emit("change-component", "Index");
              //Wenn Login failed:
              //Eine Meldung an den User, dass etwas (nicht spezifisch) nicht stimmt
              break;
          }
          // Temporär ende, damit man sich einloggen kann
        } else {
          this.forceRender();
          this.makeToast();
        }
      }
    },
    forgot() {
      if (this.checkClick()) {
        // Passwort vergessen
        console.log("Passwort vergessen!");
      }
    },
    forceRender() {
      this.componentKey += 1;
    },
    makeToast() {
      this.$bvToast.toast("Bitte akzeptieren Sie unsere Cookies!", {
        title: "Ein Fehler ist aufgetreten!",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
    },
    loginFailed() {
      this.$bvToast.toast("Username oder Passwort ist nicht korrekt", {
        title: "Ein Fehler ist aufgetreten!",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
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
    },
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
