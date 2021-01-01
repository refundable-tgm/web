<template>
  <b-container fluid>
    <b-row id="index-row" align-h="center" align-v="center">
      <b-col class="d-block d-md-none" cols="12">
        <b-container fluid>
          <b-row align-v="center" align-h="center">
            <b-col cols="12">
              <center><h1 style="margin-top:10px;">Dashboard</h1></center>
            </b-col>
            <b-col cols="12">
              <b-button
                variant="outline-primary"
                class="shadow-lg"
                v-on:click="logout"
                style="margin-top:0px; margin-bottom:40px; width:100%"
              >
                <b-icon icon="person" aria-hidden="true"></b-icon> Ausloggen
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
      </b-col>
      <b-col id="dash-main-cont" class="d-none d-md-block" cols="12" md="4">
        <b-container>
          <b-row id="dash-row" align-v="center" align-h="center">
            <b-col
              id="new"
              cols="12"
              class="shadow-xl dash-elem"
              v-on:click="newApplication"
            >
              <b-container style="height: 100%">
                <b-row align-h="center" align-v="center" style="height: 100%">
                  <b-col cols="6" class="ill-wrapper d-none d-md-block">
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
            <b-col
              id="current"
              cols="12"
              class="shadow-xl dash-elem"
              v-on:click="currentApplication"
            >
              <b-container style="height: 100%">
                <b-row align-h="center" align-v="center" style="height: 100%">
                  <b-col cols="6" class="ill-wrapper d-none d-md-block">
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
            <b-col
              id="all"
              cols="12"
              class="shadow-xl dash-elem"
              v-on:click="allApplication"
            >
              <b-container style="height: 100%">
                <b-row align-h="center" align-v="center" style="height: 100%">
                  <b-col cols="6" class="ill-wrapper d-none d-md-block">
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

            <img src="@/assets/logo.svg" alt="" id="logo" class="img-fluid" />
            <img
              src="@/assets/brainstorming.jpg"
              class="img-fluid"
              id="dash-img"
              alt="Illustration von arbeitenden Personen"
            />
            <b-button
              v-on:click="admin"
              class="shadow-lg"
              variant="outline-info"
              style="margin-right:1rem"
              >Admin Ansicht</b-button
            >
            <b-button
              v-on:click="logout"
              class="shadow-lg"
              variant="outline-danger"
              >Abmelden</b-button
            >
          </b-row>
        </b-container>
      </b-col>
      <b-col id="news-main-cont" class="d-none d-md-block" cols="12" md="4">
        <b-container id="news-cont" class="shadow-xl">
          <b-row id="news-row-heading" align-h="center">
            <b-col cols="12">
              <h2 id="news-h2">Neuigkeiten</h2>
            </b-col>
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
//import axios from "axios"

export default {
  name: "Index",
  components: {
    NewsElement
  },
  props: ["url"],
  data() {
    return {
      news: "",
      maxnews: 10
    };
  },
  methods: {
    setNews() {
      /*axios.get(this.url + "/news").then((response) => {
        this.news = this.cutNews(response.data);
      });*/
      var back = [
        { id: "1", title: "TEST 1", description: "Das ist nur Test Nr. 1" },
        { id: "2", title: "TEST 2", description: "Das ist nur Test Nr. 2" },
        { id: "3", title: "TEST 3", description: "Das ist nur Test Nr. 3" },
        { id: "4", title: "TEST 4", description: "Das ist nur Test Nr. 4" },
        { id: "5", title: "TEST 5", description: "Das ist nur Test Nr. 5" },
        { id: "6", title: "TEST 6", description: "Das ist nur Test Nr. 6" },
        { id: "7", title: "TEST 7", description: "Das ist nur Test Nr. 7" },
        { id: "8", title: "TEST 8", description: "Das ist nur Test Nr. 8" },
        { id: "9", title: "TEST 9", description: "Das ist nur Test Nr. 9" },
        { id: "10", title: "TEST 10", description: "Das ist nur Test Nr. 10" }
      ];
      this.news = this.cutNews(back);
    },
    changeComponent(component, back = true, application = null) {
      this.$emit("change-component", component, back, application);
    },
    cutNews(news) {
      var viewnews = [];
      for (let i = 0; i < this.maxnews; i++) {
        if (news[i] == undefined) break;
        viewnews.push(news[i]);
      }
      return viewnews;
    },
    logout() {
      if (this.checkClick()) {
        console.log("Logout!");
        /*
      Implement the logout function with the backend
      */
        this.changeComponent("Login");
      }
    },
    newApplication() {
      if (this.checkClick()) {
        this.changeComponent("NewApplication");
      }
    },
    allApplication() {
      if (this.checkClick()) {
        this.changeComponent("AllApplication");
      }
    },
    currentApplication() {
      if (this.checkClick()) {
        this.changeComponent("CurrentApplication");
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
