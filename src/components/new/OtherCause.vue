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
                <b-breadcrumb-item v-on:click="workshop"
                  >Fortbildung, etc</b-breadcrumb-item
                >
                <b-breadcrumb-item active>Anderer Grund</b-breadcrumb-item>
              </b-breadcrumb>
            </b-col>
          </b-row>
          <b-row align-h="center">
            <b-col cols="12" md="8">
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
              <b-form-group
                id="end"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die Zieladresse des Antrags ein."
                label="Antragsadresse"
                label-for="ea"
              >
                <b-form-input
                  id="ea"
                  v-model="end"
                  :state="End"
                  v-on:input="checkEnd"
                ></b-form-input>
                <b-form-invalid-feedback id="ea-feedback">
                  Keine Zieladresse angegeben!
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group
                id="grund"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Wählen Sie Ihren Grund aus."
                label="Gründe"
                label-for="gr"
              >
                <b-form-radio-group
                  id="gr"
                  v-model="selected"
                  :options="options"
                  v-on:input="checkSelected"
                  class="mb-3"
                  value-field="item"
                  text-field="name"
                  disabled-field="notEnabled"
                ></b-form-radio-group>
              </b-form-group>
              <b-form-group
                id="sonst"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie den Grund an."
                label="Sonstiger Grund"
                label-for="son"
                v-if="selected == '8'"
              >
                <b-form-input
                  id="son"
                  v-model="son"
                  :state="Sonstiges"
                  v-on:input="checkSonstiges"
                >
                </b-form-input>
                <b-form-invalid-feedback id="sonst-feedback">
                  Kein Sonstiger Grund angegeben!
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group
                id="titel"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie den Titel des Dienstauftrages ein."
                label="Titel"
                label-for="tit"
                v-if="selected == '2'"
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
              <b-form-group
                id="gz"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die GZ des Dienstauftrages ein."
                label="GZ"
                label-for="gzn"
                v-if="selected == '2'"
              >
                <b-form-input
                  id="gzn"
                  type="number"
                  v-model="gz"
                  :state="GZset"
                  v-on:input="checkGZ"
                ></b-form-input>
                <b-form-invalid-feedback id="gzn-feedback">
                  Keine GZ angegeben!
                </b-form-invalid-feedback>
              </b-form-group>
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
              <TravelApplication
                v-bind:escort="escort"
                v-bind:index="1"
                v-on:update="updateTravel"
              />
              <center>
                <button v-on:click="einreichen()" class="blueish-gradiant">
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
  components: {
    TravelApplication
  },
  name: "NewApplication",
  props: ["url", "user", "token"],
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
    checkSelected() {
      if (this.selected !== "") {
        this.isSelected = true;
      } else {
        this.isSelected = false;
      }
      this.checkInputs();
    },
    checkTitel() {
      if (this.title === "") {
        this.Titel = false;
      } else {
        this.Titel = true;
      }
      this.checkInputs();
    },
    checkGZ() {
      if (this.gz === "") {
        this.GZset = false;
      } else {
        this.GZset = true;
      }
      this.checkInputs();
    },
    checkSonstiges() {
      if (this.son === "") {
        this.Sonstiges = false;
      } else {
        this.Sonstiges = true;
      }
      this.checkInputs();
    },
    checkInputs() {
      switch (this.selected) {
        case "B":
          if (
            this.Time === true &&
            this.Titel === true &&
            this.GZset === true
          ) {
            this.validInputs = true;
          } else {
            this.validInputs = false;
          }
          break;
        case "D":
          if (this.Time === true && this.Sonstiges === true) {
            this.validInputs = true;
          } else {
            this.validInputs = false;
          }
          break;
        default:
          if (this.Time === true && this.isSelected === true) {
            this.validInputs = true;
          } else {
            this.validInputs = false;
          }
          break;
      }
    },
    makeToast() {
      this.$bvToast.toast(
        "Es wurden nicht allen Begleitern eine Klasse zugewiesen!",
        {
          title: "Ein Fehler ist aufgetreten!",
          autoHideDelay: 2500,
          appendToast: false,
          variant: "danger"
        }
      );
    },
    workshop() {
      if (this.checkClick()) {
        this.changeComponent("Others");
      }
    },
    checkEnd() {
      if (this.end === "") {
        this.End = false;
      } else {
        this.End = true;
      }
      this.checkInputs();
    },
    checkStart() {
      if (this.start === "") {
        this.Start = false;
      } else {
        this.Start = true;
      }
      this.checkInputs();
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
    updateTravel(index, data) {
      index.toString();
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
    },
    getLeader() {
      axios
        .get(this.url + "/getTeacher?id=" + this.user, {
          params: {
            token: this.token
          }
        })
        .then(response => {
          let data = response.data;
          return { longname: data.Longname, short: data.Short };
        });
    },
    einreichen() {
      if (this.checkClick()) {
        if (this.validInputs) {
          if (
            this.teacher.bonus_meilen[0] === "0" ||
            this.teacher.bonus_meilen[1] === "0"
          )
            var bonus1 = true;
          if (
            this.teacher.bonus_meilen[0] === "1" ||
            this.teacher.bonus_meilen[1] === "1"
          )
            var bonus2 = true;
          var business = {
            ID: 0,
            Staffnr: this.returnValue(this.teacher.personalnummer),
            TripBeginTime: new Date(
              this.startDate + "T" + this.startTime
            ).toISOString(),
            TripEndTime: new Date(
              this.endDate + "T" + this.endTime
            ).toISOString(),
            ServiceBeginTime: new Date(
              this.startDate + "T" + this.startTime
            ).toISOString(),
            ServiceEndTime: new Date(
              this.endDate + "T" + this.endTime
            ).toISOString(),
            TripGoal: this.returnString(this.start),
            TravelPurpose: this.returnString(this.teacher.reason1),
            TravelMode: this.returnValue(this.teacher.transport),
            StartingPoint: this.returnValue(this.teacher.ausgangspunkt),
            EndPoint: this.returnValue(this.teacher.endpunkt),
            Reasoning: this.returnString(this.teacher.reason),
            OtherParticipants: [],
            BonusMileConfirmation1: bonus1,
            BonusMileConfirmation2: bonus2,
            TravelCostsPayedBySomeone: this.returnBoolean(
              this.teacher.reisekosten
            ),
            StayingCostsPayedBySomeone: this.returnBoolean(
              this.teacher.aufenthaltskosten
            ),
            PayedByWhom: this.returnString(this.teacher.von),
            OtherCosts: this.returnValue(this.teacher.sonstige_kosten),
            EstimatedCosts: this.returnValue(this.teacher.geschaetzte_kosten)
          };
          var data = {
            Name: this.returnString(""),
            Kind: 8,
            MiscellaneousReason: this.returnString(this.son),
            Progress: 1,
            StartTime: new Date(
              this.startDate + "T" + this.startTime
            ).toISOString(),
            EndTime: new Date(this.endDate + "T" + this.endTime).toISOString(),
            Notes: this.returnString(this.notes),
            StartAddress: this.returnString(""),
            DestinationAddress: this.returnString(""),
            OtherReasonDetails: {
              Kind: this.returnValue(this.selected),
              MiscellaneousReason: this.returnString(this.son),
              ServiceMandateGZ: this.returnValue(this.gz),
              ServiceMandateTitle: this.returnString(this.title)
            },
            BusinessTripApplications: business
          };

          axios
            .post(this.url + "/createApplication", this.token, data)
            .then(response => {
              response.toString();
              this.changeComponent("Index");
            });
        } else {
          this.makeToast();
          if (this.Time === null) this.Time = false;
          if (this.Titel === null) this.Titel = false;
          if (this.GZset === null) this.GZset = false;
          if (this.Sonstiges === null) this.Sonstiges = false;
        }
      }
    }
  },
  data() {
    return {
      selected: "",
      options: [
        { item: "1", name: "Pflegefreistellung" },
        { item: "2", name: "Dienstauftrag" },
        { item: "3", name: "Arzttermin" },
        { item: "8", name: "Sonstiges" }
      ],
      validInputs: false,
      Time: null,
      isSelected: null,
      Titel: null,
      GZset: null,
      Sonstiges: null,
      Start: null,
      End: null,
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      title: "",
      gz: "",
      son: "",
      notes: "",
      start: "",
      end: "",
      escort: Object,
      teacher: Object
    };
  },
  mounted() {
    let leader = this.getLeader();
    let output = [
      {
        name: leader.longname,
        shortname: leader.short,
        startDate: this.startDate,
        endDate: this.endDate,
        startTime: this.startTime,
        endTime: this.endTime,
        selected: "",
        startadresse: this.start,
        meetingpoint: this.start,
        role: 0
      }
    ];
    this.escort = output;
  }
};
</script>
