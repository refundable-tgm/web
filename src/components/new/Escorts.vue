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
    /**
     * Diese Methode ändert die angezeigte Komponente
     * @param component Die neue Komponente, welche angezeigt werden soll
     * @param back Boolean-Wert, ob die neue Komponente in die History des Browsers gespeichert werden soll
     * @param application Die ID des Antrags, welcher angezeigt werden soll
     */
    changeComponent(component, back = true, application = null) {
      this.$emit("change-component", component, back, application);
    },
    /**
     * Diese Methode sorgt dafür, dass nicht unnötigerweise geclickt wird, falls nur makiert worden ist
     */
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
    /**
     * Diese Methode leitet den Benutzer auf die Startseite weiter
     */
    index() {
      if (this.checkClick()) {
        this.changeComponent("Index");
      }
    },
    /**
     * Diese Methode aktualisiert die Daten des Reiseformulars
     * @param index Der Index des zu ändernden Eintrags
     * @param data Die Daten zur aktualisierung
     */
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
    /**
     * Diese Methode gibt den Wert der Variable als Zahl zurück
     * @param input Die Zahl, welche umgewandelt werden soll
     * @returns Die Zahl des gegebenen Werts
     */
    returnValue(input) {
      if (input === undefined || input === null || input === "") {
        return null;
      } else {
        return Number(input);
      }
    },
    /**
     * Diese Methode gibt den String der Variable zurück
     * @param input Der String, welcher umgewandelt werden soll
     * @returns Den String der gegebenen Variable
     */
    returnString(input) {
      if (input === undefined || input === null || input === "") {
        return null;
      } else {
        return input;
      }
    },
    /**
     * Diese Methode gibt den Wert der Variable als Boolean-Wert zurück
     * @param input Der Boolean-Wert als String
     * @returns Der Boolean-Wert der Variable
     */
    returnBoolean(input) {
      if (input === undefined || input === null || input === "") {
        return null;
      } else {
        if (input === "false") return false;
        else return true;
      }
    },
    /**
     * Diese Methode fügt die einzelnen Daten zu einem für das Backend verwendbares Objekt zusammen und sendet dieses an das Backend
     */
    einreichen() {
      if (this.checkClick()) {
        var teachers = [];
        var business = [];
        var invoices = [];
        for (let i = 0; i < this.escorts.output.length; i++) {
          invoices.push({
            ID: i,
            TripBeginTime: this.setTimezone(
              new Date(this.escorts.startDate + "T" + this.escorts.startTime)
            ),
            TripEndTime: this.setTimezone(
              new Date(this.escorts.endDate + "T" + this.escorts.endTime)
            ),
            Staffnr: this.returnValue(this.escorts.output[i].personalnummer),
            StartingPoint: this.returnString(this.escorts.start),
            EndPoint: this.returnString(this.escorts.ziel),
            FilingDate: this.setTimezone(new Date())
          });
          teachers.push({
            AttendanceFrom: this.setTimezone(
              new Date(
                this.escorts.output[i].startDate +
                  "T" +
                  this.escorts.output[i].startTime
              )
            ),
            AttendanceTill: this.setTimezone(
              new Date(
                this.escorts.output[i].endDate +
                  "T" +
                  this.escorts.output[i].endTime
              )
            ),
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
          ) {
            bonus1 = true;
          } else {
            bonus1 = false;
          }

          if (
            this.escorts.output[i].bonus_meilen[0] === "1" ||
            this.escorts.output[i].bonus_meilen[1] === "1"
          ) {
            bonus2 = true;
          } else {
            bonus2 = false;
          }

          business.push({
            ID: i,
            Staffnr: this.returnValue(this.escorts.output[i].personalnummer),
            TripBeginTime: this.setTimezone(
              new Date(this.escorts.startDate + "T" + this.escorts.startTime)
            ),
            TripEndTime: this.setTimezone(
              new Date(this.escorts.endDate + "T" + this.escorts.endTime)
            ),
            ServiceBeginTime: this.setTimezone(
              new Date(
                this.escorts.output[i].startDate +
                  "T" +
                  this.escorts.output[i].startTime
              )
            ),
            ServiceEndTime: this.setTimezone(
              new Date(
                this.escorts.output[i].endDate +
                  "T" +
                  this.escorts.output[i].endTime
              )
            ),
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
          StartTime: this.setTimezone(
            new Date(this.escorts.startDate + "T" + this.escorts.startTime)
          ),
          EndTime: this.setTimezone(
            new Date(this.escorts.endDate + "T" + this.escorts.endTime)
          ),
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
          BusinessTripApplications: business,
          TravelInvoices: invoices
        };
        console.log(data);
        axios
          .post(this.url + "/createApplication", {
            params: {
              app: data,
              token: this.token
            }
          })
          .then(response => {
            response.toString();
            this.changeComponent("Index");
          });
      }
    },
    /**
     * Diese Methode aktualisiert das StartDatum einer Begleitperson
     * @param index Der Index der Begleitperson
     * @param newStartDate Das neue Startdatum
     */
    changeStartDate(index, newStartDate) {
      this.escorts.output[index].startDate = newStartDate;
    },
    /**
     * Diese Methode setzt die verwendete Zeitzone von dem übergebenen Datum
     * @param datum Das Datum, welches angepasst werden soll
     * @returns Das angepasste Datum
     */
    setTimezone(datum) {
      datum.setHours(datum.getHours() + 1);
      return datum.toISOString() + "+01:00";
    },
    /**
     * Diese Methode aktualisiert das EndDatum einer Begleitperson
     * @param index Der Index der Begleitperson
     * @param newEndDate Das neue Enddatum
     */
    changeEndDate(index, newEndDate) {
      this.escorts.output[index].endDate = newEndDate;
    },
    /**
     * Diese Methode aktualisiert die Startzeit einer Begleitperson
     * @param index Der Index der Begleitperson
     * @param newStartTime Die neue Startzeit
     */
    changeStartTime(index, newStartTime) {
      this.escorts.output[index].startTime = newStartTime;
    },
    /**
     * Diese Methode aktualisiert die Endzeit einer Begleitperson
     * @param index Der Index der Begleitperson
     * @param newEndTime Die neue Endzeit
     */
    changeEndTime(index, newEndTime) {
      this.escorts.output[index].endTime = newEndTime;
    },
    /**
     * Diese Methode aktualisiert die Lehrergruppe einer Begleitperson
     * @param index Der Index der Begleitperson
     * @param newSelected Die neue Lehrergruppe
     */
    changeSelected(index, newSelected) {
      this.escorts.output[index].selected = newSelected;
    },
    /**
     * Diese Methode aktualisiert die Startadresse einer Begleitperson
     * @param index Der Index der Begleitperson
     * @param newStartAdresse Die neue Startadresse
     */
    changeStartAdresse(index, newStartAdresse) {
      this.escorts.output[index].startadresse = newStartAdresse;
    },
    /**
     * Diese Methode aktualisiert den MeetingPoint einer Begleitperson
     * @param index Der Index der Begleitperson
     * @param newStartAdresse Der neue MeetingPoint
     */
    changeMeetingPoint(index, newMeetingPoint) {
      this.escorts.output[index].meetingpoint = newMeetingPoint;
    },
    /**
     * Diese Methode setzt die Variable der validen Zeit
     * @param newValidTime Boolean-Wert, ob die eingegebene Zeit eine valide ist
     */
    validateTime(newValidTime) {
      this.validTime = newValidTime;
    },
    /**
     * Diese Methode leitet den Benutzer auf die School-Seite weiter
     */
    school() {
      if (this.checkClick()) {
        this.changeComponent("School");
      }
    },
    /**
     * Diese Methode leitet den Benutzer auf die NewApplication-Seite weiter
     */
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
