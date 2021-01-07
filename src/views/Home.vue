<template>
  <div class="home">
    <Login
      v-if="currentComponent == 'Login'"
      v-on:change-component="changeComponent"
      v-bind:url="url"
      v-bind:forward="forward"
      v-on:requestAnswer="useCookie"
      v-bind:cookieset="cookies"
    />
    <Index
      v-if="currentComponent == 'Index'"
      v-on:change-component="changeComponent"
      v-bind:url="url"
      v-bind:admin="admin"
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
      v-bind:escorts="escortsdata"
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
    <AdminDashboard
      v-if="currentComponent == 'AdminDashboard'"
      v-on:change-component="changeComponent"
      v-bind:url="url"
    />
    <Progress
      v-if="currentComponent == 'Progress'"
      v-on:change-component="changeComponent"
      v-bind:url="url"
    />
    <PageNotFound
      v-if="currentComponent == 'PageNotFound'"
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
import AdminDashboard from "@/components/admin/AdminDashboard.vue";
import Progress from "@/components/Progress.vue";

import PageNotFound from "@/components/PageNotFound.vue";

export default {
  components: {
    PageNotFound,
    Progress,
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
    Workshop,
    AdminDashboard
  },
  props: ["pathing", "query"],
  data() {
    return {
      // url is the link from the REST-API
      url: "Michi Link",
      data: Object,
      //currentHeader: Header,
      //currentFooter: Footer,
      currentComponent: "",
      escortsdata: Object,
      forward: "",
      cookies: false,
      admin: true,
      logged: false
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
    changeComponent(
      component,
      back = true,
      application = null,
      escortsdata = null
    ) {
      switch (component) {
        case "Login":
          this.change("Login", back);
          break;

        case "Index":
          this.change("Index", back);
          break;

        case "ApplicationView":
          this.loadApplication(application);
          this.change("ApplicationView", back);
          console.log("APPLICATIONVIEW!");
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
          this.loadEscortsData(escortsdata);
          this.change("Escorts", back, false);
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
        case "ApplicationSearch":
          this.change("ApplicationSearch", back);
          console.log("APPLICATIONSEARCH!");
          break;
        case "AdminDashboard":
          this.change("AdminDashboard", back);
          console.log("ADMINDASHBOARD!");
          break;
        case "Progress":
          this.change("Progress", back);
          console.log("PROGRESS!");
          break;

        case "PageNotFound":
          this.change("PageNotFound", back);
          console.log("PAGENOTFOUND!");
          break;

        default:
          console.log("DEFAULT");
          console.log(component);
        //this.change("Login", back)
      }
    },
    change(page, back = true, cookie = true) {
      this.currentComponent = page;
      window.scrollTo(0, 0);
      if (back) {
        if (window.history.state !== page) {
          window.history.pushState(page, null);
        }
      }
      if (cookie) {
        this.setCookie(page);
      }
    },
    loadApplication(application) {
      if (application) console.log("egal");
      console.log("Load Application data from backend");
    },
    loadEscortsData(escortsdata) {
      let output = [];
      for (let i = 0; i < escortsdata.teacher.length; i++) {
        output.push(
          JSON.parse(
            '{"options":[],"name":"' +
              this.getFullName(escortsdata.teacher[i]) +
              '","startDate":"' +
              escortsdata.startDate +
              '","endDate":"' +
              escortsdata.endDate +
              '","startTime":"' +
              escortsdata.startTime +
              '","endTime":"' +
              escortsdata.endTime +
              '","selected":""}'
          )
        );
      }
      escortsdata.output = output;
      this.escortsdata = escortsdata;
    },
    getFullName(shortName) {
      console.log("Request für " + shortName + " um vollen Namen zu bekommen");
      //Request an Michi um einen vollen Namen zu bekommen
      return shortName;
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
      if (this.cookies) {
        var d = new Date();
        d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
        var expires = "expires=" + d.toUTCString();
        document.cookie =
          "current=" + value + ";" + expires + ";SameSite=Strict;path=/";
      }
    },
    useCookie(cookie) {
      this.cookies = cookie;
    }
  },
  created() {
    window.addEventListener("popstate", e => {
      if (this.generateState(e.state) === "Escorts") {
        this.changeComponent("School", false);
      } else {
        this.changeComponent(this.generateState(e.state), false);
      }
    });
    console.log("NEU");
    console.log(this.pathing);
    console.log(this.query);
    if (this.pathing === undefined) {
      if (this.query !== undefined) {
        let tmp1 = false;
        if (tmp1) {
          // Wenn eine Session da ist, hol den Antrag und zeig ihn an
          this.changeComponent("ApplicationView", true, this.query);
        } else {
          this.forward = {
            name: "ApplicationView",
            id: this.query
          };
          this.changeComponent("Login");
          // Wenn keine Session da ist --> zeig die Login Seite an --> nach erfolgreichem Login --> Zeig Antrag an
        }
      } else {
        let tmp2 = false;
        if (tmp2) {
          // Wenn eine Session da ist, zeig die Application Search Seite an
          this.changeComponent("ApplicationSearch");
        } else {
          // Wenn keine Session da ist, zeig die Login Seite an und nach erfolgreichem Login die Application Search Seite
          this.forward = {
            name: "ApplicationSearch"
          };
          this.changeComponent("Login");
        }
      }
    } else {
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
