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
              <b-breadcrumb style="background-color: white">
                <b-breadcrumb-item v-on:click="uebersicht"
                  >Antrag Übersicht</b-breadcrumb-item
                >
                <b-breadcrumb-item v-on:click="school"
                  >Schulveranstaltung - Allg. Infos</b-breadcrumb-item
                >
                <b-breadcrumb-item active>Begleitpersonal</b-breadcrumb-item>
              </b-breadcrumb>
            </b-col>
          </b-row>
          <b-row align-h="center">
            <b-col cols="12" md="8">
              <div
                v-for="(escort, index) in escorts.output"
                v-bind:key="escort.id"
              >
                <EscortsComp
                  v-bind:escort="escort"
                  v-bind:index="index"
                  v-bind:bsd="escorts.startDate"
                  v-bind:bst="escorts.startTime"
                  v-bind:bed="escorts.endDate"
                  v-bind:bet="escorts.endTime"
                  v-on:startDate="changeStartDate"
                  v-on:endDate="changeEndDate"
                  v-on:startTime="changeStartTime"
                  v-on:endTime="changeEndTime"
                  v-on:selected="changeSelected"
                  v-on:validTime="validateTime"
                />
                <TravelApplication
                  v-bind:escort="escort"
                  v-bind:index="index"
                  v-on:update="updateTravel"
                />
              </div>
              <center>
                <button v-on:click="einreichen" class="blueish-gradiant">
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
import TravelApplication from "@/components/new/TravelApplication.vue";

export default {
  name: "NewApplication",
  components: {
    TravelApplication,
    EscortsComp
  },
  props: ["escorts", "user"],
  data() {
    return {
      travelData: []
    }
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
    index() {
      if (this.checkClick()) {
        this.changeComponent("Index");
      }
    },
    updateTravel(index, data) {
      this.escorts.output[index].personalnummer = data.personalnummer;
      this.escorts.output[index].transport = data.transport;
      this.escorts.output[index].ausgangspuunkt = data.ausgangspuunkt;
      this.escorts.output[index].endpunkt = data.endpunkt;
      this.escorts.output[index].reason = data.reason;
      this.escorts.output[index].bonus_meilen = data.bonus_meilen;
      this.escorts.output[index].reisekosten = data.reisekosten;
      this.escorts.output[index].reisekosten_von = data.reisekosten_von;
      this.escorts.output[index].aufenthaltskosten = data.aufenthaltskosten;
      this.escorts.output[index].aufenthaltskosten_von = data.aufenthaltskosten_von;
      this.escorts.output[index].sonstige_kosten = data.sonstige_kosten;
      this.escorts.output[index].geschaetzte_kosten = data.geschaetzte_kosten;
    },
    einreichen() {
      if (this.checkClick()) {
        var data = {
          name: this.escorts.description,
          type: 0,
          startTimeStamp: new Date(
            this.escorts.startDate + "T" + this.escorts.startTime
          ),
          endTimeStamp: new Date(
            this.escorts.endDate + "T" + this.escorts.endTime
          ),
          anmerkung: this.escorts.notes,
          zielAdresse: this.escorts.end,
          startAdresse: this.escorts.start,
          leader: this.user,
          escorts: this.escorts.teacher,
          classes: this.escorts.class,
          count_student_male: this.escorts.count_student_male,
          count_student_female: this.escorts.count_student_female,
          length: this.escorts.exkursLength,
          teacher: this.escorts.output
        };
        //Anpassen
        console.log(data);
        //Zeugs an Michi schicken und so formatieren, dass Michi was damit anfangen kann
        //this.changeComponent("Index");
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
    },
    validateTime(newValidTime) {
      this.validTime = newValidTime;
    },
    school() {
      if (this.checkClick()) {
        this.changeComponent("School");
      }
    },
    uebersicht() {
      if (this.checkClick()) {
        this.changeComponent("NewApplication");
      }
    }
  }
};
</script>
