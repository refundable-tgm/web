<template>
  <b-container fluid>
    <!--<b-row
      align-h="center"
      class="d-none d-md-block"
      style="margin: 0;margin-top:1rem; margin-bottom: 0;"
    >
      <b-col style="margin:0" cols="12" md="4">bla</b-col>
      <b-col style="margin:0" cols="12" md="4"
        ><img src="@/assets/logo.svg" alt="" id="logo" class="img-fluid"
      /></b-col>
      <b-col cols="12" md="4"
        ><b-button class="float-right" style="margin-right:1rem"
          >Abmelden</b-button
        ><b-button class="float-right" style="margin-right:1rem"
          >Admin Ansicht</b-button>
      </b-col>
    </b-row>
    -->
    <b-row
      style="padding-right:35px; padding-left:35px"
      align-v="center"
      class=""
    >
      <b-col cols="4"></b-col>
      <b-col cols="4"
        ><center>
          <img
            src="@/assets/logo.svg"
            alt=""
            id="logo"
            class="img-fluid"
          /></center
      ></b-col>
      <b-col cols="4"
        ><b-button class="float-right" style="margin-right:1rem"
          >Abmelden</b-button
        ><b-button class="float-right" style="margin-right:1rem"
          >Admin Ansicht</b-button
        ></b-col
      >
    </b-row>
    <b-row style="width:100%; padding: 0;" align-h="center">
      <b-col cols="12" style="width:100%; padding: 0; padding-left:20px">
        <Dashboard style=" width:100%; " />
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import Dashboard from "@/components/Dashboard.vue";
//import axios from "axios"

export default {
  name: "Index",
  components: {
    Dashboard
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
