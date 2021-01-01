<template>
  <b-container fluid>
    <b-row id="new-application-row" align-h="center">
      <b-col cols="12">
        <b-container fluid>
          <b-row align-v="center" align-h="center">
            <b-col cols="12" md="6">
              <h1 id="new-application-heading">Neuen Antrag erstellen</h1>
            </b-col>
            <b-col cols="12" md="6">
              <b-button
                variant="outline-primary"
                class="float-right"
                v-on:click="index()"
              >
                <b-icon icon="house" aria-hidden="true"></b-icon> Startseite
              </b-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12">
              <b-breadcrumb
                style="background-color: white"
                :items="items"
              ></b-breadcrumb>
            </b-col>
          </b-row>
          <b-row id="na-srow" align-h="center" align-v="center">
            <b-col cols="12" md="6" lg="4">
              <b-container id="school-button" class="na-elem shadow-xl">
                <b-row
                  class="na-elem-sr"
                  align-v="center"
                  v-on:click="workshop()"
                >
                  <b-col cols="12">
                    <h2 class="na-elem-h">Fortbildung</h2>
                  </b-col>
                </b-row>
              </b-container>
              <b-container id="na-elem-2" class="na-elem shadow-xl">
                <b-row
                  class="na-elem-sr"
                  align-h="center"
                  align-v="center"
                  v-on:click="otherCause()"
                >
                  <b-col cols="12">
                    <h2 class="na-elem-h">Anderer Grund</h2>
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
    workshop() {
      if (this.checkClick()) {
        this.changeComponent("Workshop");
      }
    },
    otherCause() {
      if (this.checkClick()) {
        this.changeComponent("OtherCause");
      }
    },
    index() {
      if (this.checkClick()) {
        this.changeComponent("Index");
      }
    }
  },
  data() {
    return {
      items: [
        //{
        //  text: "Admin",
        //  href: "#"
        //},
        //{
        //  text: "Manage",
        //  href: "#"
        //},
        {
          text: "Antrag Übersicht",
          active: true
        }
      ]
    };
  }
};
</script>
