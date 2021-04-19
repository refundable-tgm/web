<!-- Fortbildungsantrag Template -->
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
              <!-- Home Button -->
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
              <!-- Verzeichnisansicht -->
              <b-breadcrumb style="background-color: white">
                <b-breadcrumb-item v-on:click="uebersicht"
                  >Antrag Übersicht</b-breadcrumb-item
                >
                <b-breadcrumb-item active>Fortbildung</b-breadcrumb-item>
              </b-breadcrumb>
            </b-col>
          </b-row>
          <b-row align-h="center">
            <b-col cols="12" md="8">
              <!-- Name der Fortbildung -->
              <b-form-group
                id="titel"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie den Titel der Fortbildung ein."
                label="Titel"
                label-for="tit"
              >
                <b-form-input
                  id="tit"
                  v-model="title"
                  :state="Titel"
                  v-on:input="checkTitel"
                ></b-form-input>
                <b-form-invalid-feedback id="titel-feedback">
                  Kein Titel angegeben!
                </b-form-invalid-feedback>
              </b-form-group>
              <!-- Startdatum -->
              <b-form-group
                id="startd"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie das Startdatum der Fortbildung ein."
                label="Startdatum"
                label-for="std"
              >
                <b-form-datepicker
                  id="std"
                  v-model="startDate"
                  :state="Time"
                  v-on:input="checkTime"
                  class="mb-2"
                  placeholder="Datum auswählen"
                ></b-form-datepicker>
                <b-form-invalid-feedback id="std-feedback">
                  Start der Fortbildung muss vor dem Ende der Fortbildung sein!
                </b-form-invalid-feedback>
              </b-form-group>
              <!-- Startzeit -->
              <b-form-group
                id="startz"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die Startzeit der Fortbildung ein."
                label="Startzeit"
                label-for="stz"
              >
                <b-form-timepicker
                  id="stz"
                  v-model="startTime"
                  :state="Time"
                  v-on:input="checkTime"
                  locale="de"
                  placeholder="Zeit auswählen"
                ></b-form-timepicker>
                <b-form-invalid-feedback id="stz-feedback">
                  Start der Fortbildung muss vor dem Ende der Fortbildung sein!
                </b-form-invalid-feedback>
              </b-form-group>
              <!-- Enddatum -->
              <b-form-group
                id="endd"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie das Enddatum der Fortbildung ein."
                label="Enddatum"
                label-for="end"
              >
                <b-form-datepicker
                  id="end"
                  v-model="endDate"
                  :state="Time"
                  v-on:input="checkTime"
                  class="mb-2"
                  placeholder="Datum auswählen"
                ></b-form-datepicker>
                <b-form-invalid-feedback id="end-feedback">
                  Start der Fortbildung muss vor dem Ende der Fortbildung sein!
                </b-form-invalid-feedback>
              </b-form-group>
              <!-- Endzeit -->
              <b-form-group
                id="endz"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die Endzeit der Fortbildung ein."
                label="Endzeit"
                label-for="enz"
              >
                <b-form-timepicker
                  id="enz"
                  v-model="endTime"
                  :state="Time"
                  v-on:input="checkTime"
                  locale="de"
                  placeholder="Zeit auswählen"
                ></b-form-timepicker>
                <b-form-invalid-feedback id="enz-feedback">
                  Start der Fortbildung muss vor dem Ende der Fortbildung sein!
                </b-form-invalid-feedback>
              </b-form-group>
              <!-- PH-Zahl -->
              <b-form-group
                id="phzahl"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie Ihre PH-Zahl ein."
                label="PH-Zahl"
                label-for="phz"
              >
                <b-form-input
                  id="phz"
                  type="number"
                  min="1"
                  max="3000"
                  v-model="phNumber"
                  :state="PhZahl"
                  v-on:input="checkPhZahl"
                ></b-form-input>
                <b-form-invalid-feedback id="phz-feedback">
                  Keine PH-Zahl angegeben!
                </b-form-invalid-feedback>
              </b-form-group>
              <!-- Name des Veranstalters -->
              <b-form-group
                id="veran"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie den Namen des Veranstalters ein."
                label="Veranstalter"
                label-for="ver"
              >
                <b-form-input
                  id="ver"
                  v-model="veran"
                  :state="Veranstalter"
                  v-on:input="checkVeranstalter"
                ></b-form-input>
              </b-form-group>
              <b-form-invalid-feedback id="ver-feedback">
                Kein Veranstalter angegeben!
              </b-form-invalid-feedback>
              <!-- Startadresse -->
              <b-form-group
                id="start"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die Startadresse ein."
                label="Startadresse"
                label-for="sa"
              >
                <b-form-input
                  id="sa"
                  v-model="start"
                  :state="Start"
                  v-on:input="checkStart"
                ></b-form-input>
                <b-form-invalid-feedback id="sa-feedback">
                  Keine Startadresse angegeben!
                </b-form-invalid-feedback>
              </b-form-group>
              <!-- Zieladresse -->
              <b-form-group
                id="end"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die Adresse der Fortbildung ein."
                label="Fortbildungsadresse"
                label-for="ea"
              >
                <b-form-input
                  id="ea"
                  v-model="end"
                  :state="End"
                  v-on:input="checkEnd"
                ></b-form-input>
                <b-form-invalid-feedback id="ea-feedback">
                  Keine Adresse der Fortbildung angegeben!
                </b-form-invalid-feedback>
              </b-form-group>
              <!-- Art der Fortbildung -->
              <b-form-group
                id="art"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Wählen Sie die Art der Fortbildung."
                label="Art"
                label-for="ar"
              >
                <b-form-radio-group
                  id="ar"
                  v-model="selected"
                  :options="options"
                  v-on:input="checkSelected"
                  class="mb-3"
                  value-field="item"
                  text-field="name"
                  disabled-field="notEnabled"
                ></b-form-radio-group>
              </b-form-group>
              <!-- Input für die Sonstige Art -->
              <b-form-group
                id="sonst"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie Sonstige Art ein."
                label="Sonstige Art"
                label-for="son"
                v-if="selected == '8'"
              >
                <b-form-input
                  id="son"
                  v-model="son"
                  :state="Sonstiges"
                  v-on:input="checkSonstiges"
                ></b-form-input>
              </b-form-group>
              <!-- Anmerkungen -->
              <b-form-group
                id="anmerkung"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie zusätzliche Anmerkungen an."
                label="Anmerkungen"
                label-for="an"
              >
                <b-form-textarea
                  id="an"
                  placeholder="Anmerkungen"
                  rows="3"
                  no-resize
                  v-model="notes"
                ></b-form-textarea>
              </b-form-group>
              <!-- Reiseantrag -->
              <TravelApplication
                v-bind:escort="escort"
                v-bind:index="1"
                v-on:update="updateTravel"
              />
              <center>
                <!-- Button zum einreichen des Antrages -->
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
import axios from "axios";
import TravelApplication from "@/components/new/TravelApplication.vue";
export default {
  name: "NewApplication",
  props: ["user", "token", "refresh_token", "url"],
  components: {
    TravelApplication
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
     * Diese Methode aktualisiert die Daten des Reiseformulars
     * @param index Der Index des zu ändernden Eintrags
     * @param data Die Daten zur aktualisierung
     */
    updateTravel(index, data) {
      index.toString();
      this.teacher.degree = data.degree;
      this.teacher.title = data.title;
      this.teacher.personalnummer = data.personalnummer;
      this.teacher.transport = data.transport;
      this.teacher.ausgangspunkt = data.ausgangspunkt;
      this.teacher.endpunkt = data.endpunkt;
      this.teacher.reason1 = data.reason1;
      this.teacher.reason = data.reason;
      this.teacher.bonus_meilen = data.bonus_meilen;
      this.teacher.reisekosten = data.reisekosten;
      this.teacher.aufenthaltskosten = data.aufenthaltskosten;
      this.teacher.von = data.von;
      this.teacher.sonstige_kosten = data.sonstige_kosten;
      this.teacher.geschaetzte_kosten = data.geschaetzte_kosten;
      switch (data.business_karte) {
        case "no":
          this.teacher.emitted_out = false;
          this.teacher.emitted_ret = false;
          break;
        case "too":
          this.teacher.emitted_out = true;
          this.teacher.emitted_ret = false;
          break;
        case "back":
          this.teacher.emitted_out = false;
          this.teacher.emitted_ret = true;
          break;
        default:
          this.teacher.emitted_out = false;
          this.teacher.emitted_ret = false;
          break;
      }
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
     * Diese Methode zeigt dem Benutzer an, dass nicht alle Felder ausgefüllt worden sind
     */
    makeToast() {
      this.$bvToast.toast("Es wurden nicht alle Felder richtig ausgefüllt!", {
        title: "Ein Fehler ist aufgetreten!",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
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
        if (this.validInputs) {
          var bonus1 = false;
          var bonus2 = false;
          if (this.teacher.bonus_meilen.includes("0")) {
            bonus1 = true;
          } else {
            bonus1 = false;
          }
          if (this.teacher.bonus_meilen.includes("1")) {
            bonus2 = true;
          } else {
            bonus2 = false;
          }
          var business = [
            {
              id: 0,
              name: this.returnString(this.user.longname.split(" ")[0]),
              surname: this.returnString(this.user.longname.split(" ")[1]),
              degree: this.returnString(this.teacher.degree),
              title: this.returnString(this.teacher.title),
              staffnr: this.returnValue(this.teacher.personalnummer),
              trip_begin_time: this.createNewDate(
                this.startDate,
                this.startTime
              ),
              trip_end_time: this.createNewDate(this.endDate, this.endTime),
              service_begin_time: this.createNewDate(
                this.startDate,
                this.startTime
              ),
              service_end_time: this.createNewDate(this.endDate, this.endTime),
              trip_goal: this.returnString(this.start),
              travel_purpose: this.returnString(this.teacher.reason1),
              travel_mode: this.returnValue(this.teacher.transport),
              starting_point: this.returnValue(this.teacher.ausgangspunkt),
              end_point: this.returnValue(this.teacher.endpunkt),
              reasoning: this.returnString(this.teacher.reason),
              other_participants: [],
              bonus_mile_confirmation_1: bonus1,
              bonus_mile_confirmation_2: bonus2,
              travel_costs_paid_by_someone: this.teacher.reisekosten,
              staying_costs_paid_by_someone: this.teacher.aufenthaltskosten,
              paid_by_whom: this.returnString(this.teacher.von),
              other_costs: this.returnValue(this.teacher.sonstige_kosten),
              estimated_costs: this.returnValue(
                this.teacher.geschaetzte_kosten
              ),
              date_application_filed: this.createNewDate(
                new Date().toISOString().split("T")[0],
                new Date().toISOString().split("T")[1]
              ),
              date_application_approved: null,
              referee: null,
              business_card_emitted_outward: this.teacher.emitted_out,
              business_card_emitted_return: this.teacher.emitted_ret
            }
          ];
          var data = {
            name: this.returnString(this.title),
            kind: 1,
            miscellaneous_reason: this.returnString(""),
            progress: 1,
            start_time: this.createNewDate(this.startDate, this.startTime),
            end_time: this.createNewDate(this.endDate, this.endTime),
            notes: this.returnString(this.notes),
            start_address: this.returnString(this.start),
            destination_address: this.returnString(this.end),
            last_changed: this.createNewDate(
              new Date().toISOString().split("T")[0],
              new Date().toISOString().split("T")[1]
            ),
            training_details: {
              kind: this.returnValue(this.selected),
              miscellaneous_reason: this.returnString(this.son),
              ph: this.returnValue(this.phNumber),
              organizer: this.returnString(this.veran)
            },
            business_trip_applications: business,
            travel_invoices: [
              {
                id: 0,
                name: this.returnString(this.user.longname.split(" ")[0]),
                surname: this.returnString(this.user.longname.split(" ")[1]),
                degree: this.returnString(this.teacher.degree),
                title: this.returnString(this.teacher.title),
                trip_begin_time: this.createNewDate(
                  this.startDate,
                  this.startTime
                ),
                trip_end_time: this.createNewDate(this.endDate, this.endTime),
                travel_costs_pre_grant: null,
                staffnr: this.returnValue(this.teacher.personalnummer),
                starting_point: this.returnString(this.start),
                end_point: this.returnString(this.end),
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
              }
            ]
          };
          console.log(data);
          this.changeComponent("Index");
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
                        case 201:
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
                                  setTimeout(
                                    this.changeComponent("Index"),
                                    1000
                                  );
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
        } else {
          this.makeToast();
          if (this.Time == null) this.Time = false;
          if (this.Sonstiges == null) this.Sonstiges = false;
          if (this.Titel == null) this.Titel = false;
          if (this.PhZahl == null) this.PhZahl = false;
          if (this.Veranstalter == null) this.Veranstalter = false;
        }
      }
    },
    /**
     * Erstellt ein neues Datum, welches im richtigen Datenformat ist
     */
    createNewDate(date, time) {
      var tmp = new Date(date + "T" + time);
      var str = tmp.toISOString();
      str = str.split("T");
      var str2 = str[1].split(":");
      var str3 = Number(str2[0]) + 1;
      if (str3 < 10) {
        return str[0] + "T0" + str3 + ":" + str2[1] + ":" + str2[2] + "Z+01:00";
      } else {
        return str[0] + "T" + str3 + ":" + str2[1] + ":" + str2[2] + "Z+01:00";
      }
    },
    /**
     * Diese Methode überprüft die eingegebenen Daten, ob diese einen sinnvollen Wert haben
     */
    checkTime() {
      if (
        this.startDate !== "" &&
        this.startTime !== "" &&
        this.endDate !== "" &&
        this.endTime !== ""
      ) {
        let start = new Date(this.startDate + "T" + this.startTime);
        let end = new Date(this.endDate + "T" + this.endTime);
        if (end - start <= 0) {
          this.Time = false;
        } else {
          this.Time = true;
        }
        this.checkInputs();
      }
    },
    /**
     * Diese Methode leitet den Benutzer auf die Others-Seite weiter
     */
    workshop() {
      if (this.checkClick()) {
        this.changeComponent("Others");
      }
    },
    /**
     * Diese Methode leitet den Benutzer auf die NewApplication-Seite weiter
     */
    uebersicht() {
      if (this.checkClick()) {
        this.changeComponent("NewApplication");
      }
    },
    /**
     * Diese Methode überprüft, ob der Titel der Fortbildung eingegeben worden ist
     */
    checkTitel() {
      if (this.title === "") {
        this.Titel = false;
      } else {
        this.Titel = true;
      }
      this.checkInputs();
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
     * Diese Methode überprüft, ob die PHZahl eingegeben worden ist
     */
    checkPhZahl() {
      if (this.phNumber === "") {
        this.PhZahl = false;
      } else {
        this.PhZahl = true;
      }
      this.checkInputs();
    },
    /**
     * Diese Methode überprüft, ob der Veranstalter eingegeben worden ist
     */
    checkVeranstalter() {
      if (this.veran === "") {
        this.Veranstalter = false;
      } else {
        this.Veranstalter = true;
      }
      this.checkInputs();
    },
    /**
     * Diese Methode überprüft, ob die Endadresse eingegeben worden ist
     */
    checkEnd() {
      if (this.end === "") {
        this.End = false;
      } else {
        this.End = true;
      }
      this.checkInputs();
    },
    /**
     * Diese Methode überprüft, ob die Startadresse eingegeben worden ist
     */
    checkStart() {
      if (this.start === "") {
        this.Start = false;
      } else {
        this.Start = true;
      }
      this.checkInputs();
    },
    /**
     * Diese Methode überprüft, ob eine Art von Fortbildung ausgewählt worden ist
     */
    checkSelected() {
      if (this.selected !== "") {
        this.isSelected = true;
      } else {
        this.isSelected = false;
      }
      this.checkInputs();
    },
    /**
     * Diese Methode überprüft, ob eine Sonstiger Grund eingegeben worden ist
     */
    checkSonstiges() {
      if (this.son === "") {
        this.Sonstiges = false;
      } else {
        this.Sonstiges = true;
      }
      this.checkInputs();
    },
    /**
     * Diese Methode überprüft, ob die Eingaben valide sind
     */
    checkInputs() {
      if (this.selected === "D") {
        if (
          this.Time === true &&
          this.Titel === true &&
          this.PhZahl === true &&
          this.Veranstalter === true &&
          this.Sonstiges === true
        ) {
          this.validInputs = true;
        } else {
          this.validInputs = false;
        }
      } else {
        if (
          this.Time === true &&
          this.Titel === true &&
          this.PhZahl === true &&
          this.Veranstalter === true &&
          this.isSelected === true
        ) {
          this.validInputs = true;
        } else {
          this.validInputs = false;
        }
      }
    }
  },
  data() {
    return {
      selected: "",
      options: [
        { item: "2", name: "Seminar" },
        { item: "3", name: "Tagung" },
        { item: "4", name: "Lehrgang" },
        { item: "5", name: "Sonstiges" }
      ],
      validInputs: false,
      Titel: null,
      Time: null,
      PhZahl: null,
      Veranstalter: null,
      isSelected: false,
      Sonstiges: null,
      Start: null,
      End: null,
      title: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      phNumber: "",
      veran: "",
      son: "",
      notes: "",
      start: "",
      end: "",
      escort: Object,
      teacher: Object
    };
  }
};
</script>
