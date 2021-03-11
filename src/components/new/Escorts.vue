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
                  v-on:startadresse="changeStartAdresse"
                  v-on:meetingpoint="changeMeetingPoint"
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
import axios from "axios";

export default {
  name: "NewApplication",
  components: {
    TravelApplication,
    EscortsComp
  },
  props: ["escorts", "user", "url", "token"],
  data() {
    return {
      travelData: []
    };
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
      this.escorts.output[index].ausgangspunkt = data.ausgangspunkt;
      this.escorts.output[index].endpunkt = data.endpunkt;
      this.escorts.output[index].reason1 = data.reason1;
      this.escorts.output[index].reason = data.reason;
      this.escorts.output[index].bonus_meilen = data.bonus_meilen;
      this.escorts.output[index].reisekosten = data.reisekosten;
      this.escorts.output[index].aufenthaltskosten = data.aufenthaltskosten;
      this.escorts.output[index].von = data.von;
      this.escorts.output[index].sonstige_kosten = data.sonstige_kosten;
      this.escorts.output[index].geschaetzte_kosten = data.geschaetzte_kosten;
    },
    returnValue(input) {
      if (input === undefined || input === null || input === "") {
        return null;
      } else {
        return Number(input);
      }
    },
    returnString(input) {
      if (input === undefined || input === null || input === "") {
        return null;
      } else {
        return input;
      }
    },
    returnBoolean(input) {
      if (input === undefined || input === null || input === "") {
        return null;
      } else {
        if (input === "false") return false;
        else return true;
      }
    },
    einreichen() {
      if (this.checkClick()) {
        var teachers = [];
        var business = [];
        for (let i = 0; i < this.escorts.output.length; i++) {
          teachers.push({
            AttendanceFrom: new Date(
              this.escorts.output[i].startDate +
                "T" +
                this.escorts.output[i].startTime
            ).toISOString(),
            AttendanceTill: new Date(
              this.escorts.output[i].endDate +
                "T" +
                this.escorts.output[i].endTime
            ).toISOString(),
            MeetingPoint: this.returnString(
              this.escorts.output[i].meetingpoint
            ),
            Name: this.returnString(this.escorts.output[i].name),
            Role: this.returnValue(this.escorts.output[i].role),
            Group: this.returnValue(this.escorts.output[i].selected),
            Shortname: this.returnString(this.escorts.output[i].shortname),
            StartAddress: this.returnString(this.escorts.output[i].startadresse)
          });
          var otherteachers = [];
          for (let j = 0; j < this.escorts.output.length; j++)
            otherteachers.push(this.escorts.output[j].shortname);
          otherteachers.splice(i, 1);
          var bonus1;
          var bonus2;
          if (
            this.escorts.output[i].bonus_meilen[0] === "0" ||
            this.escorts.output[i].bonus_meilen[1] === "0"
          )
            bonus1 = true;
          if (
            this.escorts.output[i].bonus_meilen[0] === "1" ||
            this.escorts.output[i].bonus_meilen[1] === "1"
          )
            bonus2 = true;
          business.push({
            ID: i,
            Staffnr: this.returnValue(this.escorts.output[i].personalnummer),
            TripBeginTime: new Date(
              this.escorts.startDate + "T" + this.escorts.startTime
            ).toISOString(),
            TripEndTime: new Date(
              this.escorts.endDate + "T" + this.escorts.endTime
            ).toISOString(),
            ServiceBeginTime: new Date(
              this.escorts.output[i].startDate +
                "T" +
                this.escorts.output[i].startTime
            ).toISOString(),
            ServiceEndTime: new Date(
              this.escorts.output[i].endDate +
                "T" +
                this.escorts.output[i].endTime
            ).toISOString(),
            TripGoal: this.returnString(this.escorts.ziel),
            TravelPurpose: this.returnString(this.escorts.output[i].reason1),
            TravelMode: this.returnValue(this.escorts.output[i].transport),
            StartingPoint: this.returnValue(
              this.escorts.output[i].ausgangspunkt
            ),
            EndPoint: this.returnValue(this.escorts.output[i].endpunkt),
            Reasoning: this.returnString(this.escorts.output[i].reason),
            OtherParticipants: otherteachers,
            BonusMileConfirmation1: bonus1,
            BonusMileConfirmation2: bonus2,
            TravelCostsPayedBySomeone: this.returnBoolean(
              this.escorts.output[i].reisekosten
            ),
            StayingCostsPayedBySomeone: this.returnBoolean(
              this.escorts.output[i].aufenthaltskosten
            ),
            PayedByWhom: this.returnString(this.escorts.output[i].von),
            OtherCosts: this.returnValue(
              this.escorts.output[i].sonstige_kosten
            ),
            EstimatedCosts: this.returnValue(
              this.escorts.output[i].geschaetzte_kosten
            )
          });
        }
        var data = {
          Name: this.returnString(this.escorts.description),
          Kind: 4,
          MiscellaneousReason: this.returnString(""),
          Progress: 1,
          StartTime: new Date(
            this.escorts.startDate + "T" + this.escorts.startTime
          ).toISOString(),
          EndTime: new Date(
            this.escorts.endDate + "T" + this.escorts.endTime
          ).toISOString(),
          Notes: this.returnString(this.escorts.notes),
          StartAddress: this.returnString(this.escorts.start),
          DestinationAddress: this.returnString(this.escorts.ziel),
          SchoolEventDetails: {
            Classes: this.escorts.class,
            AmountMaleStudent: this.returnValue(
              this.escorts.count_student_male
            ),
            AmountFemaleStudent: this.returnValue(
              this.escorts.count_student_female
            ),
            DurationInDays: this.returnValue(this.escorts.exkursLength),
            Teachers: teachers
          },
          BusinessTripApplications: business
        };
        axios
          .post(this.url + "/createApplication", this.token, data)
          .then(response => {
            response.toString();
            this.changeComponent("Index");
          });
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
    changeStartAdresse(index, newStartAdresse) {
      this.escorts.output[index].startadresse = newStartAdresse;
    },
    changeMeetingPoint(index, newMeetingPoint) {
      this.escorts.output[index].meetingpoint = newMeetingPoint;
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
  },
  mounted() {
    for (let i = 0; i < this.escorts.output.length; i++) {
      this.escorts.output[i].personalnummer = null;
      this.escorts.output[i].transport = null;
      this.escorts.output[i].ausgangspunkt = null;
      this.escorts.output[i].endpunkt = null;
      this.escorts.output[i].reason1 = null;
      this.escorts.output[i].reason = null;
      this.escorts.output[i].bonus_meilen = [];
      this.escorts.output[i].reisekosten = null;
      this.escorts.output[i].aufenthaltskosten = null;
      this.escorts.output[i].von = null;
      this.escorts.output[i].sonstige_kosten = null;
      this.escorts.output[i].geschaetzte_kosten = null;
    }
  }
};
</script>
