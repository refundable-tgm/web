<template>
  <b-container fluid>
    <b-row id="new-application-row" align-h="center">
      <b-col cols="12">
        <b-container>
          <b-row align-h="center">
            <b-col cols="12" md="6">
              <h1 id="new-application-heading">Neuen Antrag erstellen</h1>
            </b-col>
            <div class="col-12 col-md-6"></div>
          </b-row>
          <b-row>
            <b-col cols="12">
              <b-breadcrumb :items="items"></b-breadcrumb>
            </b-col>
          </b-row>
          <b-row id="na-srow" align-h="center" align-v="center">
            <b-col cols="12" md="6" lg="4">
              <b-container class="na-elem shadow-xl">
                <b-row
                  class="na-elem-sr"
                  align-v="center"
                  v-on:click="school()"
                >
                  <b-col cols="12">
                    <h2 id="na-elem-h">Schulveranstaltung</h2>
                  </b-col>
                </b-row>
              </b-container>
              <b-container id="na-elem-2" class="na-elem shadow-xl">
                <b-row class="na-elem-sr" align-v="center" v-on:click="other()">
                  <b-col cols="12">
                    <h2>Fortbildung, etc.</h2>
                  </b-col>
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
export default {
  name: "NewApplication",
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
    }
  },
  data() {
    return {
      items: [
        {
          text: "Admin",
          href: "#"
        },
        {
          text: "Manage",
          href: "#"
        },
        {
          text: "Library",
          active: true
        }
      ]
    };
  }
};
</script>
