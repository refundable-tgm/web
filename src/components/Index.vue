<template>
  <b-container fluid>
    <!-- Container -->
    <b-row id="index-row" align-h="center" align-v="center">
      <!-- Row -->
      <!-- <b-col class="d-block d-md-none" cols="12">
        <b-container fluid>
          <b-row align-v="center" align-h="center">
            <b-col cols="12">
              <center><h1 style="margin-top:10px;">Dashboard</h1></center>
            </b-col>
            <b-col cols="12">
              <b-button
                variant="outline-danger"
                class="shadow-lg"
                v-on:click="logout"
                style="margin-top:0px; margin-bottom:20px; width:100%"
              >
                <b-icon icon="person" aria-hidden="true"></b-icon> Ausloggen
              </b-button>
            </b-col>

            <b-col cols="12">
              <b-button
                variant="outline-primary"
                class="shadow-lg"
                v-on:click="adminclick"
                v-if="admin"
                style="margin-top:0px; margin-bottom:40px; width:100%"
              >
                Admin Ansicht
              </b-button>
            </b-col>

            <b-col cols="12"
              ><b-button
                size="lg"
                variant="outline-primary"
                v-on:click="newApplication"
                class="shadow-lg"
                style="margin-bottom:20px; width:100%"
              >
                <b-icon icon="plus-circle" aria-hidden="true"></b-icon> Neuer
                Antrag
              </b-button></b-col
            >
            <b-col cols="12"
              ><b-button
                size="lg"
                variant="outline-primary"
                v-on:click="currentApplication"
                class="shadow-lg"
                style="margin-bottom:20px; width:100%"
              >
                <b-icon icon="clock" aria-hidden="true"></b-icon> Aktuelle
                Anträge
              </b-button></b-col
            >
            <b-col cols="12"
              ><b-button
                size="lg"
                variant="outline-primary"
                v-on:click="allApplication"
                class="shadow-lg"
                style="margin-bottom:30px; width:100%"
              >
                <b-icon icon="file-earmark-zip" aria-hidden="true"></b-icon>
                Alle Anträge
              </b-button></b-col
            >
          </b-row>
        </b-container>
      </b-col> -->

      <!-- DASH MOBILE -->
      <b-col class="d-block d-md-none" cols="12">
        <!-- Column -->
        <b-container fluid>
          <b-row align-v="center" align-h="center">
            <b-col cols="12">
              <center><h1 style="margin-top:10px;">Dashboard</h1></center>
            </b-col>
            <b-col cols="12">
              <!-- Logout Button -->
              <b-button
                variant="outline-danger"
                class="shadow-lg"
                v-on:click="logout"
                style="margin-top:0px; margin-bottom:20px; width:100%"
              >
                <b-icon icon="person" aria-hidden="true"></b-icon> Ausloggen
                <!-- Icon -->
              </b-button>
            </b-col>

            <b-col cols="12">
              <!-- Admin Ansicht Button -->
              <b-button
                variant="outline-primary"
                class="shadow-lg"
                v-on:click="adminclick"
                v-if="user.admin"
                style="margin-top:0px; margin-bottom:40px; width:100%"
              >
                Admin Ansicht
              </b-button>
            </b-col>

            <b-col cols="12">
              <!-- Neuer Antrag Button --><b-button
                size="lg"
                variant="outline-primary"
                v-on:click="newApplication"
                class="shadow-lg"
                style="margin-bottom:20px; width:100%"
              >
                <b-icon icon="plus-circle" aria-hidden="true"></b-icon> Neuer
                Antrag
              </b-button></b-col
            >
            <b-col cols="12">
              <!-- Aktuelle Anträge Button --><b-button
                size="lg"
                variant="outline-primary"
                v-on:click="currentApplication"
                class="shadow-lg"
                style="margin-bottom:20px; width:100%"
              >
                <b-icon icon="clock" aria-hidden="true"></b-icon> Aktuelle
                Anträge
              </b-button></b-col
            >
            <b-col cols="12">
              <!-- Alle Anträge Button --><b-button
                size="lg"
                variant="outline-primary"
                v-on:click="allApplication"
                class="shadow-lg"
                style="margin-bottom:30px; width:100%"
              >
                <b-icon icon="file-earmark-zip" aria-hidden="true"></b-icon>
                Alle Anträge
              </b-button></b-col
            >
          </b-row>
        </b-container>
      </b-col>

      <!-- DASH PC -->
      <b-col id="dash-main-cont" class="d-none d-md-block" cols="12" md="4">
        <b-container>
          <b-row
            id="dash-row"
            align-v="center"
            align-h="center"
            class="shadow-xl"
          >
            <b-col cols="12">
              <center><h2 id="menu-h2">Menü</h2></center>
            </b-col>
            <!-- Custom Button für einen neuen Antrag -->
            <b-col
              id="new"
              cols="12"
              class="shadow-lg dash-elem"
              v-on:click="newApplication"
            >
              <b-container style="height: 100%">
                <b-row align-h="center" align-v="center" style="height: 100%">
                  <b-col cols="6" class="ill-wrapper d-none d-md-block">
                    <!-- Illustration neuer Antrag -->
                    <b-img
                      id="all-ill"
                      center
                      src="@/assets/new.svg"
                      alt="Illustration für alle Anträge"
                    ></b-img>
                  </b-col>
                  <b-col cols="12" md="6">
                    <h2 id="new-h2" class="dh">Neuer Antrag</h2>
                  </b-col>
                </b-row>
              </b-container>
            </b-col>
            <!-- Custom Button für das Anzeigen der aktuellen Anträge -->
            <b-col
              id="current"
              cols="12"
              class="shadow-lg dash-elem"
              v-on:click="currentApplication"
            >
              <b-container style="height: 100%">
                <b-row align-h="center" align-v="center" style="height: 100%">
                  <b-col cols="6" class="ill-wrapper d-none d-md-block">
                    <!-- Illustration aktuelle Anträge -->
                    <img
                      src="@/assets/current.svg"
                      id="all-ill"
                      class="img-fluid"
                      alt="Illustration für alle Anträge"
                    />
                  </b-col>
                  <b-col cols="6">
                    <h2 id="new-h2" class="dh">Aktuelle Anträge</h2>
                  </b-col>
                </b-row>
              </b-container>
            </b-col>
            <!-- Custom Button Alle Anträge -->
            <b-col
              id="all"
              cols="12"
              class="shadow-lg dash-elem"
              v-on:click="allApplication"
            >
              <b-container style="height: 100%">
                <b-row align-h="center" align-v="center" style="height: 100%">
                  <b-col cols="6" class="ill-wrapper d-none d-md-block">
                    <!-- Illustration alle Anträge -->
                    <img
                      src="@/assets/all.svg"
                      id="all-ill"
                      class="img-fluid"
                      alt="Illustration für alle Anträge"
                    />
                  </b-col>
                  <b-col cols="6">
                    <h2 id="new-h2" class="dh">Alle Anträge</h2>
                  </b-col>
                </b-row>
              </b-container>
            </b-col>
          </b-row>
        </b-container>
      </b-col>

      <!-- MEDIA - ONLY ON PC -->
      <b-col id="media-main-cont" cols="12" md="4" class="d-none d-md-block">
        <b-container class="">
          <b-row id="media-row" align-h="center" align-v="center">
            <!--<img
              id="profile"
              v-on:click="logout"
              src="@/assets/account.jpg"
              class="img-fluid rounded-circle shadow-xl"
              alt="Illustration von arbeitenden Personen"
              data-toggle="tooltip"
              data-placement="top"
              title="Klicken Sie hier um sich ausloggen zu können!"
            />-->
            <!-- Refundable Logo -->
            <img src="@/assets/logo.svg" alt="" id="logo" class="img-fluid" />
            <!-- Dashboard Illustration -->
            <img
              src="@/assets/brainstorming.jpg"
              class="img-fluid"
              id="dash-img"
              alt="Illustration von arbeitenden Personen"
            />
            <!-- Administrator Ansicht Button -->
            <b-button
              v-on:click="adminclick"
              v-if="user.admin || user.av"
              class="shadow-lg"
              variant="outline-info"
              style="margin-right:1rem"
              >Admin Ansicht</b-button
            >
            <!-- Logout Button -->
            <b-button
              v-on:click="logout"
              class="shadow-lg"
              variant="outline-danger"
              >Abmelden</b-button
            >
          </b-row>
        </b-container>
      </b-col>

      <!-- NEWS PC -->
      <!-- Scrollbarer Container -->
      <b-col id="news-main-cont" class="d-none d-md-block" cols="12" md="4">
        <b-container id="news-cont" class="shadow-xl">
          <b-row id="news-row-heading" align-h="center">
            <b-col cols="12">
              <h2 id="news-h2">Neuigkeiten</h2>
            </b-col>
            <!-- Newes Elemente -->
            <NewsElement
              class="news-elem"
              v-for="snews in news"
              v-bind:key="snews.id"
              v-bind:snews="snews"
              v-on:change-component="changeComponent"
            />
          </b-row>
        </b-container>
      </b-col>

      <!-- NEWS MOBILE -->
      <!-- Nicht scrollbarer Container -->
      <b-col
        id="news-main-cont-mobile"
        class="d-block d-md-none"
        cols="12"
        md="4"
      >
        <b-container id="news-cont-mobile" class="shadow-lg" fluid>
          <b-row id="news-row-heading-mobile" align-h="center">
            <b-col cols="12">
              <h2 id="news-h2-mobile">Neuigkeiten</h2>
            </b-col>
            <!-- News Elemente -->
            <NewsElement
              class="news-elem"
              v-for="snews in news"
              v-bind:key="snews.id"
              v-bind:snews="snews"
              v-on:change-component="changeComponent"
            />
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import NewsElement from "@/components/NewsElement.vue";
import axios from "axios";

export default {
  name: "Index",
  components: {
    NewsElement
  },
  props: ["url", "token", "refresh_token", "user"],
  data() {
    return {
      news: "",
      maxnews: 10
    };
  },
  methods: {
    /**
     * TODO
     * Diese Methode requestet die News von dem Benutzer und erstellt damit die Komponenten
     */
    setNews() {
      axios
        .get(this.url + "/getNews", {
          headers: {
            Authorization: "Basic " + this.token
          }
        })
        .then(response => {
          switch (response.status) {
            case 200:
              this.news = this.cutNews(response.data);
              break;
            case 401:
              axios
                .post(this.url + "/login/refresh", {
                  headers: {
                    Authorization: "Basic " + this.refresh_token
                  }
                })
                .then(resp => {
                  switch (resp.status) {
                    case 200:
                      this.$emit(
                        "updateToken",
                        resp.data.access_token,
                        resp.data.refresh_token
                      );
                      axios.get(this.url + "/getNews", {
                        headers: {
                          Authorization: "Basic " + this.token
                        }
                      }).then(res => {
                        switch(res.status) {
                          case 200:
                            this.news = this.cutNews(response.data);
                            break;
                          default:
                            this.failedNews();
                            break;
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
              this.failedNews();
              break;
          }
        });
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass der Antrag erfolgreich gespeichert worden ist
     */
    failedNews() {
      this.$bvToast.toast("Es ist ein Fehler aufgetreten!", {
        title: "Es konnten nicht die neuesten Nachrichten geladen werden",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
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
     * Diese Methode legt die maximale Anzahl an angezeigten News auf der Startseite fest
     * @param news Die geladenen News
     * @returns
     */
    cutNews(news) {
      var viewnews = [];
      for (let i = 0; i < this.maxnews; i++) {
        if (news[i] == undefined) break;
        viewnews.push(news[i]);
      }
      return viewnews;
    },
    /**
     * TODO
     * Diese Methode loggt den Benutzer vom System aus
     */
    logout() {
      if (this.checkClick()) {
        this.$emit("logout");
      }
    },
    /**
     * Diese Methode leitet den Benutzer auf die NewApplication-Seite weiter
     */
    newApplication() {
      if (this.checkClick()) {
        this.changeComponent("NewApplication");
      }
    },
    /**
     * Diese Methode leitet den Benutzer auf die AllApplication-Seite weiter
     */
    allApplication() {
      if (this.checkClick()) {
        this.changeComponent("AllApplication");
      }
    },
    /**
     * Diese Methode leitet den Benutzer auf die CurrentApplication-Seite weiter
     */
    currentApplication() {
      if (this.checkClick()) {
        this.changeComponent("CurrentApplication");
      }
    },
    /**
     * Diese Methode leitet den Benutzer auf das Admin-Dashboard weiter
     */
    adminclick() {
      if (this.checkClick()) {
        this.changeComponent("AdminDashboard");
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
  },
  created() {
    this.setNews();
  }
};
</script>
<style lang="scss">
.h1,
.h2,
.h3,
.h4,
.h5,
.h6,
h1,
h2,
h3,
h4,
h5,
h6 {
  margin-bottom: 0.5rem;
  font-weight: 400;
  line-height: 1.2;
}
</style>
