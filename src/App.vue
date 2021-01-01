<template>
  <div id="main-content">
    <Login
      v-if="currentComponent == 'Login'"
      v-on:change-component="changeComponent"
      v-bind:url="url"
    />
    <Index
      v-if="currentComponent == 'Index'"
      v-on:change-component="changeComponent"
      v-bind:url="url"
    />
    <NewApplication
      v-if="currentComponent == 'NewApplication'"
      v-on:change-component="changeComponent"
      v-bind:url="url"
    />
    <AllApplication
      v-if="currentComponent == 'AllApplication'"
      v-on:change-component="changeComponent"
      v-bind:url="url"
    />
    <CurrentApplication
      v-if="currentComponent == 'CurrentApplication'"
      v-on:change-component="changeComponent"
      v-bind:url="url"
    />
    <School
      v-if="currentComponent == 'School'"
      v-on:change-component="changeComponent"
      v-bind:url="url"
    />
    <Others
      v-if="currentComponent == 'Others'"
      v-on:change-component="changeComponent"
      v-bind:url="url"
    />
    <Escorts
      v-if="currentComponent == 'Escorts'"
      v-on:change-component="changeComponent"
      v-bind:url="url"
    />
    <OtherCause
      v-if="currentComponent == 'OtherCause'"
      v-on:change-component="changeComponent"
      v-bind:url="url"
    />
    <Workshop
      v-if="currentComponent == 'Workshop'"
      v-on:change-component="changeComponent"
      v-bind:url="url"
    />
    <ApplicationView
      v-if="currentComponent == 'ApplicationView'"
      v-on:change-component="changeComponent"
      v-bind:url="url"
    />
    <ApplicationSearch
      v-if="currentComponent == 'ApplicationSearch'"
      v-on:change-component="changeComponent"
      v-bind:url="url"
    />
  </div>
</template>

<script>
import axios from "axios";
import Index from "@/components/Index.vue";
import Login from "@/components/Login.vue";
import NewApplication from "@/components/NewApplication.vue";
import AllApplication from "@/components/AllApplication.vue";
import CurrentApplication from "@/components/CurrentApplication.vue";
import ApplicationView from "@/components/ApplicationView.vue";
import ApplicationSearch from "@/components/ApplicationSearch.vue";
import School from "@/components/new/School.vue";
import Others from "@/components/new/Others.vue";
import Escorts from "@/components/new/Escorts.vue";
import OtherCause from "@/components/new/OtherCause.vue";
import Workshop from "@/components/new/Workshop.vue";

export default {
  components: {
    Index,
    Login,
    NewApplication,
    School,
    Others,
    Escorts,
    AllApplication,
    CurrentApplication,
    ApplicationView,
    ApplicationSearch,
    OtherCause,
    Workshop
  },
  data() {
    return {
      // url is the link from the REST-API
      url: "Michi Link",
      data: Object,
      //currentHeader: Header,
      //currentFooter: Footer,
      currentComponent: ""
    };
  },
  methods: {
    /*
      Request function for specific data from the REST-API

      link: The specific data that is requested
    */
    getData(link) {
      axios.get(this.url + "/" + link).then(response => {
        this.data = response.data;
      });
    },
    changeComponent(component, back = true, application = null) {
      switch (component) {
        case "Login":
          this.change("Login", back);
          break;

        case "Index":
          this.change("Index", back);
          break;

        case "Application":
          this.loadApplication(application);
          this.change("Application", back);
          break;

        case "NewApplication":
          this.change("NewApplication", back);
          console.log("NEW APPLICATION!");
          break;

        case "AllApplication":
          this.change("AllApplication", back);
          console.log("ALL APPLICATIONS!");
          break;

        case "CurrentApplication":
          this.change("CurrentApplication", back);
          console.log("CURRENT APPLICATIONS!");
          break;

        case "School":
          this.change("School", back);
          console.log("SCHOOL!");
          break;

        case "Others":
          this.change("Others", back);
          console.log("OTHERS!");
          break;

        case "Escorts":
          this.change("Escorts", back);
          console.log("ESCORTS!");
          break;

        case "OtherCause":
          this.change("OtherCause", back);
          console.log("OTHERCAUSE!");
          break;

        case "Workshop":
          this.change("Workshop", back);
          console.log("WORKSHOP!");
          break;
        case "ApplicationView":
          this.change("ApplicationView", back);
          console.log("APPLICATIONVIEW!");
          break;
        case "ApplicationSearch":
          this.change("ApplicationSearch", back);
          console.log("APPLICATIONSEARCH!");
          break;

        default:
          console.log("DEFAULT");
          console.log(component);
        //this.change("Login", back)
      }
    },
    change(page, back = true) {
      this.currentComponent = page;
      if (back) {
        if (window.history.state !== page) {
          window.history.pushState(page, null);
        }
      }
      this.setCookie(page);
    },
    loadApplication(application) {
      if (application) console.log("egal");
      console.log("Load Application data from backend");
    },
    generateState(state) {
      let output = "";
      for (let i = 0; i < 100; i++) {
        if (state != undefined) {
          if (state[i] === undefined) {
            return output;
          } else output += state[i];
        }
      }
    },
    checkCookie() {
      var name = "current=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return true;
        }
      }
      return false;
    },
    getCookie() {
      var name = "current=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },
    setCookie(value) {
      var d = new Date();
      d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toUTCString();
      document.cookie =
        "current=" + value + ";" + expires + ";SameSite=Strict;path=/";
    }
  },
  created() {
    window.addEventListener("popstate", e => {
      this.changeComponent(this.generateState(e.state), false);
    });
    if (this.checkCookie()) {
      var c = this.getCookie();
      if (c == this.generateState(window.history.state)) {
        this.changeComponent(c, false);
      } else {
        this.changeComponent(c);
      }
    } else {
      this.changeComponent("Login");
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
