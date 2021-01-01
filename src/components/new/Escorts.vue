<template>
  <b-container fluid>
    <b-row align-h="center">
      <b-col cols="12">
        <b-container fluid>
          <b-row align-v="center" align-h="center">
            <b-col cols="12" md="6">
              <h1 id="new-application-heading">Neuen Antrag erstellen</h1>
            </b-col>
            <div class="col-12 col-md-6">
              <b-button
                variant="outline-primary"
                class="float-right"
                v-on:click="index()"
              >
                <b-icon icon="house" aria-hidden="true"></b-icon> Startseite
              </b-button>
            </div>
          </b-row>
          <b-row>
            <b-col cols="12">
              <b-breadcrumb
                style="background-color: white"
                :items="items"
              ></b-breadcrumb>
            </b-col>
          </b-row>
          <b-row align-h="center">
            <b-col cols="12" md="8">
              <EscortsComp />
              <EscortsComp />
              <EscortsComp />
              <EscortsComp />
              <center>
                <button v-on:click="index()" class="blueish-gradiant">
                  Einreichen
                </button>
              </center>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import EscortsComp from "@/components/new/EscortsComp.vue";

export default {
  name: "NewApplication",
  components: {
    EscortsComp
  },
  methods: {
    changeComponent(component, back = true, application = null) {
      this.$emit("change-component", component, back, application);
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
    school() {
      if (this.checkClick()) {
        this.changeComponent("School");
      }
    },
    other() {
      if (this.checkClick()) {
        this.changeComponent("Others");
      }
    },
    index() {
      if (this.checkClick()) {
        this.changeComponent("Index");
      }
    },
    next() {
      if (this.checkClick()) [this.changeComponent("Escorts")];
    }
  },
  data() {
    return {
      items: [
        //{
        //  text: "Admin",
        //  href: "#"
        //},
        {
          text: "Antrag Übersicht",
          href: "#"
        },
        {
          text: "Schulveranstaltung - Allg. Infos",
          href: "#"
        },
        {
          text: "Begleitpersonal",
          active: true
        }
      ]
    };
  }
};
</script>
