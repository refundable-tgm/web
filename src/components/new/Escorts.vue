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
              <!-- Startseite Button -->
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
              <!-- Verzeichnisanzeige -->
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
              <!-- Einfügen der Templates für die Begleitpersonen -->
              <div
                v-for="(escort, index) in escorts.output"
                v-bind:key="escort.id"
              >
                <!-- Begleitformular -->
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
                <!-- Reiseantragsformular -->
                <TravelApplication
                  v-bind:escort="escort"
                  v-bind:index="index"
                  v-on:update="updateTravel"
                />
              </div>

              <center>
                <!-- Button zum einreichen -->
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
  props: ["escorts", "user", "url", "token", "refresh_token"],
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
      this.escorts.output[index].degree = data.degree;
      this.escorts.output[index].title = data.title;
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
      this.escorts.output[index].emitted_out = data.emitted_out;
      this.escorts.output[index].emitted_ret = data.emitted_ret;
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
            id: i,
            degree: this.returnString(this.escorts.output[i].degree),
            title: this.returnString(this.escorts.output[i].title),
            name: this.returnString(this.escorts.output[i].name),
            surname: this.returnString(this.escorts.output[i].surname),
            trip_begin_time: this.createNewDate(
              this.escorts.startDate,
              this.escorts.startTime
            ),
            trip_end_time: this.createNewDate(
              this.escorts.endDate,
              this.escorts.endTime
            ),
            staffnr: this.returnValue(this.escorts.output[i].personalnummer),
            starting_point: this.returnString(this.escorts.start),
            end_point: this.returnString(this.escorts.ziel),
            clerk: "",
            reviewer: "",
            zi: null,
            filing_date: this.createNewDate(
              new Date().toISOString().split("T")[0],
              new Date().toISOString().split("T")[1]
            ),
            approval_date: null,
            daily_charges_mode: null,
            shortened_amount: null,
            nightly_charges_mode: null,
            breakfasts: null,
            lunches: null,
            dinners: null,
            official_business_card_got: null,
            travel_grant: null,
            replacement_for_train_card_class_2: null,
            kilometre_allowance: null,
            kilometre_amount: null,
            nr_and_indications_of_participants: null,
            travel_costs_cited: null,
            no_travel_costs: null,
            calculation: null
          });
          teachers.push({
            attendance_from: this.createNewDate(
              this.escorts.output[i].startDate,
              this.escorts.output[i].startTime
            ),
            attendance_till: this.createNewDate(
              this.escorts.output[i].endDate,
              this.escorts.output[i].endTime
            ),
            meeting_point: this.returnString(
              this.escorts.output[i].meetingpoint
            ),
            name: this.returnString(this.escorts.output[i].name),
            role: this.returnValue(this.escorts.output[i].role),
            group: this.returnValue(this.escorts.output[i].selected),
            shortname: this.returnString(this.escorts.output[i].shortname),
            start_address: this.returnString(
              this.escorts.output[i].startadresse
            )
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
            id: i,
            degree: this.returnString(this.escorts.output[i].degree),
            title: this.returnString(this.escorts.output[i].title),
            name: this.returnString(this.escorts.output[i].name),
            surname: this.returnString(this.escorts.output[i].surname),
            staffnr: this.returnValue(this.escorts.output[i].personalnummer),
            trip_begin_time: this.createNewDate(
              this.escorts.startDate,
              this.escorts.startTime
            ),
            trip_end_time: this.createNewDate(
              this.escorts.endDate,
              this.escorts.endTime
            ),
            service_begin_time: this.createNewDate(
              this.escorts.output[i].startDate,
              this.escorts.output[i].startTime
            ),
            service_end_time: this.createNewDate(
              this.escorts.output[i].endDate,
              this.escorts.output[i].endTime
            ),
            trip_goal: this.returnString(this.escorts.ziel),
            travel_purpose: this.returnString(this.escorts.output[i].reason1),
            travel_mode: this.returnValue(this.escorts.output[i].transport),
            starting_point: this.returnValue(
              this.escorts.output[i].ausgangspunkt
            ),
            end_point: this.returnValue(this.escorts.output[i].endpunkt),
            reasoning: this.returnString(this.escorts.output[i].reason),
            other_participants: otherteachers,
            bonus_mile_confirmation_1: bonus1,
            bonus_mile_confirmation_2: bonus2,
            travel_costs_paid_by_someone: this.returnBoolean(
              this.escorts.output[i].reisekosten
            ),
            staying_costs_paid_by_someone: this.returnBoolean(
              this.escorts.output[i].aufenthaltskosten
            ),
            paid_by_whom: this.returnString(this.escorts.output[i].von),
            other_costs: this.returnValue(
              this.escorts.output[i].sonstige_kosten
            ),
            estimated_costs: this.returnValue(
              this.escorts.output[i].geschaetzte_kosten
            ),
            date_application_filed: this.createNewDate(
              new Date().toISOString().split("T")[0],
              new Date().toISOString().split("T")[1]
            ),
            date_application_approved: null,
            referee: null,
            business_card_emitted_outward: this.returnBoolean(
              this.teacher.emitted_out
            ),
            business_card_emitted_return: this.returnBoolean(
              this.teacher.emitted_ret
            )
          });
        }
        var data = {
          name: this.returnString(this.escorts.description),
          kind: 0,
          miscellaneous_reason: this.returnString(""),
          progress: 1,
          start_time: this.createNewDate(
            this.escorts.startDate,
            this.escorts.startTime
          ),
          end_time: this.createNewDate(
            this.escorts.endDate,
            this.escorts.endTime
          ),
          notes: this.returnString(this.escorts.notes),
          start_address: this.returnString(this.escorts.start),
          destination_address: this.returnString(this.escorts.ziel),
          school_event_details: {
            classes: this.escorts.class,
            amount_male_students: this.returnValue(
              this.escorts.count_student_male
            ),
            amount_female_students: this.returnValue(
              this.escorts.count_student_female
            ),
            duration_in_days: this.returnValue(this.escorts.exkursLength),
            teachers: teachers
          },
          business_trip_applications: business,
          travel_invoices: invoices
        };
        axios
          .post(
            this.url + "/createApplication",
            {
              headers: {
                Authorization: "Basic " + this.token
              }
            },
            data
          )
          .then(response => {
            switch (response.status) {
              case 200:
                this.createConfirm();
                setTimeout(this.changeComponent("Index"), 1000);
                break;
              case 401:
                axios
                  .post(this.url + "/login/refresh", {
                    headers: {
                      Authorization: "Basic " + this.refresh_token
                    }
                  })
                  .then(resp => {
                    switch (resp.status) {
                      case 200:
                        this.$emit(
                          "updateToken",
                          resp.data.access_token,
                          resp.data.refresh_token
                        );
                        axios
                          .post(
                            this.url + "/createApplication",
                            {
                              headers: {
                                Authorization: "Basic " + this.token
                              }
                            },
                            data
                          )
                          .then(res => {
                            switch (res.status) {
                              case 200:
                                this.createConfirm();
                                setTimeout(this.changeComponent("Index"), 1000);
                                break;
                              default:
                                this.failedConfirm();
                                break;
                            }
                          });
                        break;
                      default:
                        this.$emit("logout");
                        break;
                    }
                  });
                break;
              default:
                this.failedConfirm();
                break;
            }
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
     * Erstellt ein neues Datum, welches im richtigen Datenformat ist
     */
    createNewDate(date, time) {
      var tmp = new Date(date + "T" + time);
      var str = tmp.toISOString();
      str = str.split("T");
      var str2 = str[1].split(":");
      var str3 = Number(str2[0]) + 2;
      if (str3 < 10) {
        return str[0] + "T0" + str3 + ":" + str2[1] + ":" + str2[2] + "Z+02:00";
      } else {
        return str[0] + "T" + str3 + ":" + str2[1] + ":" + str2[2] + "Z+02:00";
      }
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass der Antrag erfolgreich gespeichert worden ist
     */
    createConfirm() {
      this.$bvToast.toast("Antrag erstellt!", {
        title: "Antrag wurde erfolgreich erstellt",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "success"
      });
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass der Antrag erfolgreich gespeichert worden ist
     */
    failedConfirm() {
      this.$bvToast.toast("Es ist ein Fehler aufgetreten!", {
        title: "Antrag wurden nicht erstellt",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
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
      (this.escorts.output[i].degree = null),
        (this.escorts.output[i].title = null),
        (this.escorts.output[i].personalnummer = null);
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
