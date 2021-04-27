<template>
  <div class="home">
    <Login
      v-if="currentComponent == 'Login'"
      v-on:change-component="changeComponent"
      v-on:updateToken="updateToken"
      v-on:logout="logout"
      v-on:login="login"
      v-on:requestAnswer="useCookie"
      v-bind:url="url"
      v-bind:token="token"
      v-bind:forward="forward"
      v-bind:cookieset="cookies"
    />
    <Index
      v-if="currentComponent == 'Index'"
      v-on:change-component="changeComponent"
      v-on:updateToken="updateToken"
      v-on:logout="logout"
      v-bind:url="url"
      v-bind:token="token"
      v-bind:refresh_token="refresh_token"
      v-bind:user="user"
    />
    <NewApplication
      v-if="currentComponent == 'NewApplication'"
      v-on:change-component="changeComponent"
      v-on:updateToken="updateToken"
      v-on:logout="logout"
      v-bind:url="url"
      v-bind:token="token"
      v-bind:refresh_token="refresh_token"
      v-bind:user="user"
    />
    <AllApplication
      v-if="currentComponent == 'AllApplication'"
      v-on:change-component="changeComponent"
      v-on:updateToken="updateToken"
      v-on:logout="logout"
      v-bind:url="url"
      v-bind:token="token"
      v-bind:refresh_token="refresh_token"
      v-bind:user="user"
    />
    <CurrentApplication
      v-if="currentComponent == 'CurrentApplication'"
      v-on:change-component="changeComponent"
      v-on:updateToken="updateToken"
      v-on:logout="logout"
      v-bind:url="url"
      v-bind:token="token"
      v-bind:refresh_token="refresh_token"
      v-bind:user="user"
    />
    <School
      v-if="currentComponent == 'School'"
      v-on:change-component="changeComponent"
      v-on:updateToken="updateToken"
      v-on:logout="logout"
      v-bind:url="url"
      v-bind:token="token"
      v-bind:refresh_token="refresh_token"
      v-bind:user="user"
    />
    <Escorts
      v-if="currentComponent == 'Escorts'"
      v-on:change-component="changeComponent"
      v-on:updateToken="updateToken"
      v-on:logout="logout"
      v-bind:url="url"
      v-bind:token="token"
      v-bind:refresh_token="refresh_token"
      v-bind:escorts="escortsdata"
      v-bind:user="user"
    />
    <OtherCause
      v-if="currentComponent == 'OtherCause'"
      v-on:change-component="changeComponent"
      v-on:updateToken="updateToken"
      v-on:logout="logout"
      v-bind:url="url"
      v-bind:token="token"
      v-bind:refresh_token="refresh_token"
      v-bind:user="user"
    />
    <Workshop
      v-if="currentComponent == 'Workshop'"
      v-on:change-component="changeComponent"
      v-on:updateToken="updateToken"
      v-on:logout="logout"
      v-bind:url="url"
      v-bind:token="token"
      v-bind:refresh_token="refresh_token"
      v-bind:user="user"
    />
    <ApplicationView
      v-if="currentComponent == 'ApplicationView'"
      v-on:change-component="changeComponent"
      v-on:updateToken="updateToken"
      v-on:logout="logout"
      v-bind:url="url"
      v-bind:token="token"
      v-bind:refresh_token="refresh_token"
      v-bind:appid="appid"
      v-bind:user="user"
    />
    <ApplicationSearch
      v-if="currentComponent == 'ApplicationSearch'"
      v-on:change-component="changeComponent"
      v-on:updateToken="updateToken"
      v-on:logout="logout"
      v-bind:url="url"
      v-bind:token="token"
      v-bind:refresh_token="refresh_token"
      v-bind:user="user"
    />
    <AdminDashboard
      v-if="currentComponent == 'AdminDashboard'"
      v-on:change-component="changeComponent"
      v-on:updateToken="updateToken"
      v-on:logout="logout"
      v-bind:url="url"
      v-bind:token="token"
      v-bind:refresh_token="refresh_token"
      v-bind:user="user"
    />
    <ApplicationAdminView
      v-if="currentComponent == 'ApplicationAdminView'"
      v-on:change-component="changeComponent"
      v-on:updateToken="updateToken"
      v-on:logout="logout"
      v-bind:url="url"
      v-bind:token="token"
      v-bind:refresh_token="refresh_token"
      v-bind:user="user"
      v-bind:appid="appid"
    />
    <Progress
      v-if="currentComponent == 'Progress'"
      v-on:change-component="changeComponent"
      v-on:updateToken="updateToken"
      v-on:logout="logout"
      v-bind:url="url"
      v-bind:token="token"
      v-bind:refresh_token="refresh_token"
      v-bind:user="user"
    />
    <PageNotFound
      v-if="currentComponent == 'PageNotFound'"
      v-on:change-component="changeComponent"
      v-bind:url="url"
    />
    <Rights
      v-if="currentComponent == 'Rights'"
      v-on:change-component="changeComponent"
      v-on:updateToken="updateToken"
      v-on:logout="logout"
      v-bind:url="url"
      v-bind:token="token"
      v-bind:refresh_token="refresh_token"
      v-bind:user="user"
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
import Escorts from "@/components/new/Escorts.vue";
import OtherCause from "@/components/new/OtherCause.vue";
import Workshop from "@/components/new/Workshop.vue";
import AdminDashboard from "@/components/admin/AdminDashboard.vue";
import Progress from "@/components/Progress.vue";
import PageNotFound from "@/components/PageNotFound.vue";
import ApplicationAdminView from "@/components/admin/ApplicationAdminView.vue";
import Rights from "@/components/Rights.vue";
import data from "@/data.json";

export default {
  components: {
    PageNotFound,
    Progress,
    Index,
    Login,
    NewApplication,
    School,
    Escorts,
    AllApplication,
    CurrentApplication,
    ApplicationView,
    ApplicationSearch,
    OtherCause,
    Workshop,
    AdminDashboard,
    ApplicationAdminView,
    Rights
  },
  props: ["pathing", "query"],
  data() {
    return {
      // url is the link from the REST-API
      url: "http://" + data.url + ":8080/api",
      data: Object,
      currentComponent: "",
      escortsdata: Object,
      forward: "",
      cookies: false,
      user: {
        uuid: null,
        short: null,
        longname: null,
        admin: null,
        av: null,
        administration: null,
        pek: null
      },
      logged: false,
      appid: "",
      token: "",
      refresh_token: ""
    };
  },
  methods: {
    /**
     * Diese Methode ändert die angezeigte Komponente auf die Übegebene
     * @param component Die neue Komponente, die angezeigt werden soll
     * @param back Boolean-Wert, der aussagt, ob in die History des Browsers geschrieben werden soll
     * @param application Der Antrag, welcher angezeigt werden soll
     * @param escortsdata Die Informationen eines Schulantrags
     */
    changeComponent(
      component,
      back = true,
      application = null,
      escortsdata = null
    ) {
      switch (component) {
        case "Login":
          this.change("Login", back, false);
          break;

        case "Index":
          this.change("Index", back);
          break;

        case "ApplicationView":
          this.loadApplication(application);
          this.change("ApplicationView", back, false);
          break;

        case "NewApplication":
          this.change("NewApplication", back);
          break;

        case "AllApplication":
          this.change("AllApplication", back);
          break;

        case "CurrentApplication":
          this.change("CurrentApplication", back);
          break;

        case "School":
          this.change("School", back);
          break;

        case "Others":
          this.change("Others", back);
          break;

        case "Escorts":
          if (this.loadEscortsData(escortsdata)) {
            this.change("Escorts", back, false);
          } else {
            this.failedConfirm();
          }
          break;

        case "OtherCause":
          this.change("OtherCause", back);
          break;

        case "Workshop":
          this.change("Workshop", back);
          break;
        case "ApplicationSearch":
          this.change("ApplicationSearch", back);
          break;
        case "AdminDashboard":
          this.change("AdminDashboard", back);
          break;
        case "Progress":
          this.change("Progress", back);
          break;

        case "PageNotFound":
          this.change("PageNotFound", back);
          break;

        case "ApplicationAdminView":
          this.loadApplication(application);
          this.change("ApplicationAdminView", back, false);
          break;

        case "Rights":
          this.change("Rights", back);
          break;
      }
    },
    /**
     * Diese Methode ändert die angezeigte Komponente und schreibt nach Bedarf in die History und die Cookies des Browsers
     * @param page Die neue Komponente, die angezeigt werden soll
     * @param back Boolean-Wert, ob in die History des Browsers geschrieben werden soll
     * @param cookie Boolean-Wert, ob in die Cookies des Browsers geschrieben werden soll
     */
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
    /**
     * Ändert den derzeitig offenen Antrag
     * @param application Der neue Antrag, welcher angezeigt werden soll
     */
    loadApplication(application) {
      this.appid = application;
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass der Antrag erfolgreich gespeichert worden ist
     */
    failedConfirm() {
      this.$bvToast.toast("Es ist ein Fehler aufgetreten!", {
        title: "Zumindest ein Leherer ist nicht am System registriert",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
    },
    /**
     * Diese Methode setzt alle notwendigen Werte, wenn sich jemand anmeldet.
     * @param user Der Nutzer, der sich angemeldet hat
     * @param admin Boolean-Wert, ob der Benutzer Admin ist
     * @param administration Boolean-Wert, ob der Benutzer zur Administration gehört
     * @param av Boolean-Wert, ob der Benutzer AV ist
     * @param pek Boolean-Wert, ob der Benutzer eine Reiserechnungsabteilung ist
     */
    login(uuid, admin, administration, av, pek, token, refresh, short, long) {
      this.user.uuid = uuid;
      this.user.short = short;
      this.user.longname = long;
      this.user.admin = admin;
      this.user.administration = administration;
      this.user.av = av;
      this.user.pek = pek;
      this.setToken(token);
      this.setRefresh(refresh);
      this.setUser(uuid);
      this.token = token;
      this.refresh_token = refresh;
      if (administration || pek) {
        this.changeComponent("AdminDashboard");
      }
    },
    /**
     * Diese Methode setzt die Daten der Webseite zurück
     */
    resetData() {
      this.user = {};
      this.token = "";
      this.refresh_token = "";
      this.data = "";
      this.escortsdata = "";
      this.appid = "";
      this.logged = false;
      this.forward = "";
      this.cookies = false;
    },
    /**
     * Diese Methode meldet den Benutzer vom System ab
     */
    logout() {
      this.terminateSession();
      this.resetData();
      this.deleteCookies();
      this.changeComponent("Login");
    },
    /**
     * Beendet die derzeitige Session
     */
    terminateSession() {
      axios.post(
        this.url + "/logout",
        {},
        {
          headers: {
            Authorization: "Basic " + this.token
          }
        }
      );
    },
    /**
     * Diese Methode aktualisiert die Tokens
     */
    updateToken(token, refresh) {
      this.token = token;
      this.refresh_token = refresh;
    },
    /**
     * Diese Methode erstellt die Datenstruktur für die Begleitpersonenformulare
     * @param escortsdata Die Informationen aus dem Schulveranstaltungsformular
     */
    loadEscortsData(escortsdata) {
      let output = [
        {
          name: this.user.longname.split(" ")[0],
          surname: this.user.longname.split(" ")[1],
          shortname: this.user.short,
          startDate: escortsdata.startDate,
          endDate: escortsdata.endDate,
          startTime: escortsdata.startTime,
          endTime: escortsdata.endTime,
          selected: "",
          startadresse: escortsdata.start,
          meetingpoint: escortsdata.start,
          role: 0
        }
      ];
      for (let i = 0; i < escortsdata.teacher.length; i++) {
        var curTeach = this.getTeacher(escortsdata.teacher[i]);
        console.log(curTeach);
        if (curTeach === undefined) {
          return false;
        }
        output.push(
          JSON.parse(
            '{"name":"' +
              curTeach.longname.split(" ")[0] +
              '","surname":"' +
              curTeach.longname.split(" ")[1] +
              '","shortname":"' +
              escortsdata.teacher[i] +
              '","startDate":"' +
              escortsdata.startDate +
              '","endDate":"' +
              escortsdata.endDate +
              '","startTime":"' +
              escortsdata.startTime +
              '","endTime":"' +
              escortsdata.endTime +
              '","selected":"","role":1, "startadresse":"' +
              escortsdata.start +
              '","meetingpoint":"' +
              escortsdata.start +
              '"}'
          )
        );
      }
      escortsdata.output = output;
      this.escortsdata = escortsdata;
      return true;
    },
    /**
     * Diese Methode gibt den vollen Namen eines Lehrers zurück
     * @param shortName Der Kürzel des verlangten Lehrers
     */
    getTeacher(shortName) {
      axios
        .get(this.url + "/getTeacherByShort?name=" + shortName, {
          headers: {
            Authorization: "Basic " + this.token
          }
        })
        .then(response => {
          return response.data;
        })
        .catch(error => {
          switch (error.response.status) {
            case 401:
              axios
                .post(this.url + "/login/refresh", {
                  refresh_token: this.refresh_token
                })
                .then(resp => {
                  this.token = resp.data.access_token;
                  this.refresh_token = resp.data.refresh_token;
                  this.setToken(resp.data.access_token);
                  this.setRefresh(resp.data.refresh_token);
                  axios
                    .get(this.url + "/getTeacherByShort?name=" + shortName, {
                      headers: {
                        Authorization: "Basic " + resp.data.access_token
                      }
                    })
                    .then(res => {
                      return res.data;
                    })
                    .catch(e => {
                      e.toString();
                      return false;
                    });
                })
                .catch(err => {
                  err.toString();
                  this.logout();
                });
              break;
            default:
              return false;
          }
        });
    },
    /**
     * Diese Methode gitb alle states des übergebenen state-Arrays zurück
     * @param state Das state-Objekt, welches zurückgegeben werden soll
     */
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
    /**
     * Diese Methode schaut, ob ein Seiten-Cookie von dieser Seite gespeichert ist
     * @returns Boolean-Wert, je nach dem, ob ein Cookie gesetzt ist, oder nicht
     */
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
    /**
     * Diese Methode gibt den Cookie der Webseite zurück
     * @returns Der Cookie mit all seinen Informationen
     */
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
    /**
     * Diese Methode setzt den Cookie der Webseite
     * @param value Der Wert des Cookies
     */
    setCookie(value) {
      if (this.cookies) {
        var d = new Date();
        d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
        var expires = "expires=" + d.toUTCString();
        document.cookie =
          "current=" + value + ";" + expires + ";SameSite=Strict;path=/";
      }
    },
    /**
     * Diese Methode setzt den Cookie der Webseite
     * @param value Der Wert des Cookies
     */
    setToken(value) {
      if (this.cookies) {
        var d = new Date();
        d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
        var expires = "expires=" + d.toUTCString();
        document.cookie =
          "token=" + value + ";" + expires + ";SameSite=Strict;path=/";
      }
    },
    /**
     * Diese Methode setzt den Cookie der Webseite
     * @param value Der Wert des Cookies
     */
    setRefresh(value) {
      if (this.cookies) {
        var d = new Date();
        d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
        var expires = "expires=" + d.toUTCString();
        document.cookie =
          "refresh=" + value + ";" + expires + ";SameSite=Strict;path=/";
      }
    },
    /**
     * Diese Methode setzt den Cookie der Webseite
     * @param value Der Wert des Cookies
     */
    setUser(value) {
      if (this.cookies) {
        var d = new Date();
        d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
        var expires = "expires=" + d.toUTCString();
        document.cookie =
          "user=" + value + ";" + expires + ";SameSite=Strict;path=/";
      }
    },
    /**
     * Diese Methode gibt den Cookie der Webseite zurück
     * @returns Der Cookie mit all seinen Informationen
     */
    getRefresh() {
      var name = "refresh=";
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
    /**
     * Diese Methode schaut, ob ein Token-Cookie von dieser Seite gespeichert ist
     * @returns Boolean-Wert, je nach dem, ob ein Cookie gesetzt ist, oder nicht
     */
    checkToken() {
      var name = "token=";
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
    /**
     * Diese Methode schaut, ob ein Refresh-Cookie von dieser Seite gespeichert ist
     * @returns Boolean-Wert, je nach dem, ob ein Cookie gesetzt ist, oder nicht
     */
    checkRefresh() {
      var name = "refresh=";
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
    /**
     * Diese Methode gibt den Cookie der Webseite zurück
     * @returns Der Cookie mit all seinen Informationen
     */
    getToken() {
      var name = "token=";
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
    /**
     * Diese Methode gibt den Cookie der Webseite zurück
     * @returns Der Cookie mit all seinen Informationen
     */
    getUser() {
      var name = "user=";
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
    /**
     * Diese Methode setzt die Variable, falls Cookies akzeptiert worden sind
     * @param cookie Boolean-Wert, ob die Cookies akzeptiert worden sind
     */
    useCookie(cookie) {
      this.cookies = cookie;
    },
    /**
     * Diese Methode löscht vorhanderen Cookies
     */
    deleteCookies() {
      var d = new Date();
      var expires = "expires=" + d.toUTCString();
      var value = this.getCookie();
      document.cookie =
        "current=" + value + ";" + expires + ";SameSite=Strict;path=/";
      var value2 = this.getToken();
      document.cookie =
        "token=" + value2 + ";" + expires + ";SameSite=Strict;path=/";
      var value3 = this.getRefresh();
      document.cookie =
        "refresh=" + value3 + ";" + expires + ";SameSite=Strict;path=/";
      var value4 = this.getUser();
      document.cookie =
        "user=" + value4 + ";" + expires + ";SameSite=Strict;path=/";
    },
    /**
     * Diese Methode schaut, welche Komponente geladen werden soll, wenn die Webseite aufgerufen wird
     */
    manageLoading(tokenPresent) {
      // Weiterleitung, falls der Token gesetzt ist und eine die ApplicationView-Seite aufgerufen werden soll
      if (this.pathing === undefined) {
        if (this.query !== undefined) {
          if (tokenPresent) {
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
          if (tokenPresent) {
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
        /* 
      Falls nicht weitergeleitet werden soll, wird geschaut, ob
      der Benutzer mit dem Browser zuletzt auf einer anderen Seite war und wird auf diese Seite weitergeleitet
      */
        if (this.checkCookie()) {
          this.useCookie(true);
          var c = this.getCookie();
          if (c == this.generateState(window.history.state)) {
            this.changeComponent(c, false);
          } else {
            this.changeComponent(c);
          }
        } else {
          // Falls kein Cookie gesetzt ist, wird der Benutzer auf die Login-Seite weitergeleitet
          this.changeComponent("Login");
        }
      }
    }
  },
  created() {
    // Hier wird der Listener für die Pfeile des Browsers erstellt
    window.addEventListener("popstate", e => {
      if (this.generateState(e.state) === "Escorts") {
        this.changeComponent("School", false);
      } else {
        this.changeComponent(this.generateState(e.state), false);
      }
    });

    /**
     * In diesem Block muss geschaut werden, ob die Session gütlig ist und falls nicht, ob man die Session aktualisieren kann mit dem refresh token
     */

    if (this.checkToken() && this.checkRefresh()) {
      this.cookies = true;
      this.token = this.getToken();
      this.refresh_token = this.getRefresh();
      axios
        .get(this.url + "/getTeacher?uuid=" + this.getUser(), {
          headers: {
            Authorization: "Basic " + this.token
          }
        })
        .then(response => {
          this.user.av = response.data.av;
          this.user.admin = response.data.super_user;
          this.user.administration = response.data.administration;
          this.user.pek = response.data.pek;
          this.user.uuid = response.data.uuid;
          this.user.short = response.data.short;
          this.user.longname = response.data.longname;
          this.setUser(response.data.uuid);
          this.manageLoading(true);
        })
        .catch(error => {
          switch (error.response.status) {
            case 401:
              axios
                .post(this.url + "/login/refresh", {
                  refresh_token: this.refresh_token
                })
                .then(resp => {
                  this.token = resp.data.access_token;
                  this.refresh_token = resp.data.refresh_token;
                  this.setToken(resp.data.access_token);
                  this.setRefresh(resp.data.refresh_token);
                  axios
                    .get(this.url + "/getTeacher?uuid=" + this.getUser(), {
                      headers: {
                        Authorization: "Basic " + resp.data.access_token
                      }
                    })
                    .then(res => {
                      this.user.av = res.data.av;
                      this.user.admin = res.data.super_user;
                      this.user.administration = res.data.administration;
                      this.user.pek = res.data.pek;
                      this.user.uuid = res.data.uuid;
                      this.user.short = res.data.short;
                      this.user.longname = res.data.longname;
                      this.setUser(res.data.uuid);
                      this.manageLoading(true);
                    })
                    .catch(err => {
                      err.toString();
                      this.manageLoading(false);
                    });
                  this.manageLoading(true);
                })
                .catch(e => {
                  e.toString();
                  this.manageLoading(false);
                });
              break;
            default:
              this.manageLoading(false);
              break;
          }
        });
    } else {
      this.cookies = false;
      this.manageLoading(false);
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
