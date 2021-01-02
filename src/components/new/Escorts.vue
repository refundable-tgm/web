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
                v-on:click="index"
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
              <EscortsComp
                v-for="(escort, index) in escorts.output"
                v-bind:escort="escort"
                v-bind:index="index"
                v-bind:bsd="escorts.startDate"
                v-bind:bst="escorts.startTime"
                v-bind:bed="escorts.endDate"
                v-bind:bet="escorts.endTime"
                v-bind:key="escort.id"
                v-on:startDate="changeStartDate"
                v-on:endDate="changeEndDate"
                v-on:startTime="changeStartTime"
                v-on:endTime="changeEndTime"
                v-on:selected="changeSelected"
                v-on:validTime="validateTime"
              />
              <center>
                <button
                  :disabled="!allSelected || !validTime"
                  v-on:click="einreichen"
                  class="blueish-gradiant"
                >
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
  props: ["escorts"],
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
    index() {
      if (this.checkClick()) {
        this.changeComponent("Index");
      }
    },
    einreichen() {
      if (this.checkClick()) {
        //Zeugs an Michi schicken und so formatieren, dass Michi was damit anfangen kann
        this.changeComponent("Index");
      }
    },
    changeStartDate(index, newStartDate) {
      this.escorts.output[index].startDate = newStartDate;
    },
    changeEndDate(index, newEndDate) {
      this.escorts.output[index].endDate = newEndDate;
    },
    changeStartTime(index, newStartTime) {
      this.escorts.output[index].startTime = newStartTime;
    },
    changeEndTime(index, newEndTime) {
      this.escorts.output[index].endTime = newEndTime;
    },
    changeSelected(index, newSelected) {
      this.escorts.output[index].selected = newSelected;
      this.checkifAllSelected();
    },
    checkifAllSelected() {
      for (let i = 0; i < this.escorts.output.length; i++) {
        if (this.escorts.output[i].selected === "") {
          this.allSelected = false;
          return;
        }
      }
      this.allSelected = true;
    },
    validateTime(newValidTime) {
      this.validTime = newValidTime;
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
      ],
      allSelected: false,
      validTime: false
    };
  }
};
</script>
