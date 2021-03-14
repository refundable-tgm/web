<template>
  <b-container fluid>
    <b-row align-v="center" align-h="center">
      <b-col cols="12" md="6">
        <h1 id="new-application-heading">Antrag für {{ app.Name }}</h1>
      </b-col>
      <div class="col-12 col-md-6">
        <b-button
          variant="outline-primary"
          class="float-right"
          v-on:click="index"
        >
          <b-icon icon="house" aria-hidden="true"></b-icon> Startseite
        </b-button>
        <b-button
          variant="outline-primary"
          class="float-right"
          v-on:click="newApplication"
          style="margin-right:20px"
        >
          <b-icon icon="plus" aria-hidden="true"></b-icon> Neuer Antrag
        </b-button>
      </div>
    </b-row>
    <b-row
      align-h="center"
      align-v="center"
      style="margin-top:1rem;margin-bottom:3rem"
    >
      <b-col cols="12">
        <Progress v-bind:progress="app.Progress" v-bind:kind="app.Kind" />
      </b-col>
    </b-row>
    <b-row style="margin-top:2rem">
      <b-col cols="12">
        <!-- Main table element -->
        <b-table
          striped
          :items="items"
          :fields="fields"
          :filter="filter"
          :filter-included-fields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          stacked="md"
          show-empty
          small
          @filtered="onFiltered"
        >
          <template #cell(name)="row">
            {{ row.value.first }} {{ row.value.last }}
          </template>

          <template #cell(actions)="row">
            <b-button
              variant="outline-secondary"
              size="sm"
              @click="openPDF(row.item)"
              style="margin-right:1rem"
            >
              <b-icon icon="file-earmark-text"></b-icon> PDF öffnen
            </b-button>
            <b-button
              variant="outline-secondary"
              size="sm"
              @click="row.toggleDetails"
            >
              <b-icon icon="pencil-square"></b-icon> Bearbeitung
              {{ row.detailsShowing ? "schließen" : "öffnen" }}
            </b-button>
          </template>

          <template #row-details="row">
            <b-card>
              <SchoolGeneral
                v-bind:readonly="sgreadonly"
                v-bind:data="app"
                v-bind:token="token"
                v-bind:url="url"
                v-on:update="updateSG"
                v-if="isLeader && row.item.title == 'Allgemeine Infos'"
              />
              <SchoolEscorts
                v-bind:readonly="sereadonly"
                v-bind:data="sedata"
                v-on:update="updateSE"
                v-if="row.item.title == 'Begleitformular'"
              />
              <TravelApplication
                v-bind:readonly="tareadonly"
                v-bind:app="tadata"
                v-bind:index="0"
                v-on:update="updateTA"
                v-if="row.item.title == 'Reiseformular'"
              />
              <TravelBill
                v-bind:readonly="tbreadonly"
                v-bind:index="0"
                v-bind:start="start"
                v-bind:end="end"
                v-bind:app="tbdata"
                v-on:update="updateTB"
                v-if="row.item.title == 'Reiserechnung'"
              />
              <Others
                v-bind:readonly="oreadonly"
                v-bind:data="odata"
                v-on:update="updateO"
                v-if="row.item.title == 'Abwesenheitsformular'"
              />
              <Workshop
                v-bind:readonly="wreadonly"
                v-bind:data="wdata"
                v-on:update="updateW"
                v-if="row.item.title == 'Fortbildung'"
              />
            </b-card>
          </template>
        </b-table>
      </b-col>
    </b-row>

    <b-row style="margin-bottom:2rem">
      <b-col cols="12">
        <b-button
          variant="outline-danger"
          v-if="isLeader"
          id="show-btn"
          @click="closeAntrag"
          class="float-right"
          ><b-icon icon="file-earmark-excel"></b-icon> Antrag
          schließen</b-button
        >
        <b-button
          variant="outline-success"
          id="show-btn"
          style="margin-right: 1rem"
          class="float-right"
          @click="save"
          :disabled="
            sgreadonly &&
              sereadonly &&
              oreadonly &&
              wreadonly &&
              tareadonly &&
              tbreadonly
          "
          ><b-icon icon="file-earmark-check"></b-icon> Änderungen
          speichern</b-button
        >
      </b-col>
    </b-row>

    <b-modal ref="close-modal" hide-footer title="Antrag schließen">
      <b-container fluid>
        <b-row
          ><b-col cols="12">
            <div class="d-block text-center">
              <p>
                Sind Sie sich sicher, dass Sie den Antrag schließen wollen? Er
                wird danach nicht mehr für die Prüfer sichtbar sein und
                <b>kann nicht mehr geöffnet werden!</b>
              </p>
            </div>
          </b-col></b-row
        >
        <b-row>
          <b-col cols="6">
            <b-button class="mt-2" variant="outline-danger" block @click="delAn"
              >Antrag schließen <b-spinner small type="grow"></b-spinner
            ></b-button>
          </b-col>
          <b-col cols="6"
            ><b-button
              class="mt-2"
              variant="outline-success"
              block
              @click="hideClose"
              >Abbrechen</b-button
            ></b-col
          >
        </b-row>
      </b-container>
    </b-modal>

    <!-- Info modal -->
    <b-modal
      :id="infoModal.id"
      :title="infoModal.title"
      ok-only
      @hide="resetInfoModal"
    >
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </b-container>
</template>

<script>
import axios from "axios";
import Progress from "@/components/Progress.vue";
import SchoolGeneral from "@/components/applicationViewComponents/SchoolGeneral.vue";
import SchoolEscorts from "@/components/applicationViewComponents/SchoolEscorts.vue";
import Others from "@/components/applicationViewComponents/Others.vue";
import Workshop from "@/components/applicationViewComponents/Workshop.vue";
import TravelApplication from "@/components/new/TravelApplication.vue";
import TravelBill from "@/components/new/TravelBill.vue";
export default {
  components: {
    Others,
    Workshop,
    SchoolEscorts,
    SchoolGeneral,
    Progress,
    TravelApplication,
    TravelBill
  },
  props: ["url", "appid", "user", "token"],
  data() {
    return {
      items: [],
      fields: [
        {
          key: "title",
          label: "Dokument",
          sortable: true,
          sortDirection: "desc"
        },
        { key: "actions", label: "Aktionen", class: "text-right" }
      ],
      totalRows: 1,
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: ""
      },
      title: "",
      app: Object,
      isLeader: false,
      sgreadonly: true,
      sedata: {},
      sereadonly: true,
      odata: {},
      oreadonly: true,
      wdata: {},
      wreadonly: true,
      start: null,
      end: null,
      tbreadonly: true,
      tareadonly: true,
      tadata: {},
      tbdata: {},
      currentTeacher: "",
      currentTeacherIndex: -1
    };
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    }
  },
  mounted() {
    this.loadData();
    // Set the initial number of items
    this.totalRows = this.items.length;
  },
  methods: {
    updateSG(sgdata) {
      this.app = sgdata;
    },
    updateSE(sedata) {
      this.app.SchoolEventDetails.Teachers[this.currentTeacherIndex] = sedata;
    },
    updateO(odata) {
      this.app = odata;
    },
    updateW(wdata) {
      this.app = wdata;
    },
    updateTB(index, data) {
      index.toString();
      if (data.selected.includes("a1")) {
        this.app.TravelInvoices[
          this.currentTeacherIndex
        ].OfficialBusinessCardGot = true;
      } else {
        this.app.TravelInvoices[
          this.currentTeacherIndex
        ].OfficialBusinessCardGot = false;
      }
      if (data.selected.includes("a2")) {
        this.app.TravelInvoices[this.currentTeacherIndex].TravelGrant = true;
      } else {
        this.app.TravelInvoices[this.currentTeacherIndex].TravelGrant = false;
      }
      if (data.selected.includes("a3")) {
        this.app.TravelInvoices[
          this.currentTeacherIndex
        ].ReplacementForAdvantageCard = true;
      } else {
        this.app.TravelInvoices[
          this.currentTeacherIndex
        ].ReplacementForAdvantageCard = false;
      }
      if (data.selected.includes("a4")) {
        this.app.TravelInvoices[
          this.currentTeacherIndex
        ].ReplacementForTrainCardClass2 = true;
      } else {
        this.app.TravelInvoices[
          this.currentTeacherIndex
        ].ReplacementForTrainCardClass2 = false;
      }
      if (data.selected.includes("a5")) {
        this.app.TravelInvoices[
          this.currentTeacherIndex
        ].KilometreAllowance = true;
      } else {
        this.app.TravelInvoices[
          this.currentTeacherIndex
        ].KilometreAllowance = false;
      }
      if (data.selected.includes("a6")) {
        this.app.TravelInvoices[
          this.currentTeacherIndex
        ].NRAndIdicationsOfParticipants = true;
      } else {
        this.app.TravelInvoices[
          this.currentTeacherIndex
        ].NRAndIdicationsOfParticipants = false;
      }
      if (data.selected.includes("a7")) {
        this.app.TravelInvoices[
          this.currentTeacherIndex
        ].TravelCostsCited = true;
      } else {
        this.app.TravelInvoices[
          this.currentTeacherIndex
        ].TravelCostsCited = true;
      }
      if (data.selected.includes("a8")) {
        this.app.TravelInvoices[this.currentTeacherIndex].NoTravelCosts = true;
      } else {
        this.app.TravelInvoices[this.currentTeacherIndex].NoTravelCosts = false;
      }
      switch (data.dcm) {
        case "a1":
          this.app.TravelInvoices[
            this.currentTeacherIndex
          ].DailyChargesMode = 0;
          break;
        case "a2":
          this.app.TravelInvoices[
            this.currentTeacherIndex
          ].DailyChargesMode = 1;
          break;
        case "a3":
          this.app.TravelInvoices[
            this.currentTeacherIndex
          ].DailyChargesMode = 2;
          break;
      }
      switch (data.ncm) {
        case "a1":
          this.app.TravelInvoices[
            this.currentTeacherIndex
          ].NightlyChargesMode = 0;
          break;
        case "a2":
          this.app.TravelInvoices[
            this.currentTeacherIndex
          ].NightlyChargesMode = 1;
          break;
        case "a3":
          this.app.TravelInvoices[
            this.currentTeacherIndex
          ].NightlyChargesMode = 2;
          break;
      }
      this.app.TravelInvoices[
        this.currentTeacherIndex
      ].TravelMode = this.app.BusinessTripApplications[
        this.currentTeacherIndex
      ].TravelMode;
      this.app.TravelInvoices[
        this.currentTeacherIndex
      ].ID = this.currentTeacherIndex;
      this.app.TravelInvoices[
        this.currentTeacherIndex
      ].TripBeginTime = this.app.StartTime;
      this.app.TravelInvoices[
        this.currentTeacherIndex
      ].TripEndTime = this.app.EndTime;
      this.app.TravelInvoices[
        this.currentTeacherIndex
      ].Staffnr = this.app.BusinessTripApplications[
        this.currentTeacherIndex
      ].Staffnr;
      this.app.TravelInvoices[
        this.currentTeacherIndex
      ].StartingPoint = this.app.StartAddress;
      this.app.TravelInvoices[
        this.currentTeacherIndex
      ].EndPoint = this.app.DestinationAddress;
      this.app.TravelInvoices[this.currentTeacherIndex].ShortenedAmount =
        data.short;
      this.app.TravelInvoices[this.currentTeacherIndex].Breakfasts =
        data.breakfast;
      this.app.TravelInvoices[this.currentTeacherIndex].Lunches = data.lunch;
      this.app.TravelInvoices[this.currentTeacherIndex].Dinners = data.dinner;
      this.app.TravelInvoices[this.currentTeacherIndex].KilometreAmount =
        data.km;
      this.app.TravelInvoices[this.currentTeacherIndex].Calculation = {};
      this.app.TravelInvoices[this.currentTeacherIndex].Calculation.ID = 0;
      this.app.TravelInvoices[this.currentTeacherIndex].Calculation.Rows = [];
      this.app.TravelInvoices[
        this.currentTeacherIndex
      ].Calculation.SumTravelCosts = data.SumTravelCosts;
      this.app.TravelInvoices[
        this.currentTeacherIndex
      ].Calculation.SumDailyCharges = data.SumDailyCharges;
      this.app.TravelInvoices[
        this.currentTeacherIndex
      ].Calculation.SumNightlyCharges = data.SumNightlyCharges;
      this.app.TravelInvoices[
        this.currentTeacherIndex
      ].Calculation.SumAdditionalCosts = data.SumAdditionalCosts;
      this.app.TravelInvoices[this.currentTeacherIndex].Calculation.SumOfSums =
        data.SumOfSums;
      for (let i = 0; i < data.items.length; i++) {
        this.app.TravelInvoices[this.currentTeacherIndex].Calculation.Rows.push(
          {
            NR: this.returnValue(data.items[i].index),
            Date: this.calcDate(data.items[i].date),
            Begin: this.calcTime(data.items[i].start),
            End: this.calcTime(data.items[i].end),
            Kilometres: this.returnValue(data.items[i].km),
            TravelCosts: this.returnValue(data.items[i].travelcosts),
            DailyCharges: this.returnValue(data.items[i].daycharge),
            NightlyCharges: this.returnValue(data.items[i].sleepcharge),
            AdditionalCosts: this.returnValue(data.items[i].othercosts),
            Sum: this.returnValue(data.items[i].sum)
          }
        );
      }
    },
    updateTA(index, data) {
      index.toString();
      if (data.bonus_meilen[0] === "0" || data.bonus_meilen[1] === "0") {
        this.app.BusinessTripApplications[
          this.currentTeacherIndex
        ].BonusMileConfirmation1 = true;
      } else {
        this.app.BusinessTripApplications[
          this.currentTeacherIndex
        ].BonusMileConfirmation1 = false;
      }
      if (data.bonus_meilen[0] === "1" || data.bonus_meilen[1] === "1") {
        this.app.BusinessTripApplications[
          this.currentTeacherIndex
        ].BonusMileConfirmation2 = true;
      } else {
        this.app.BusinessTripApplications[
          this.currentTeacherIndex
        ].BonusMileConfirmation2 = false;
      }
      this.app.BusinessTripApplications[
        this.currentTeacherIndex
      ].Staffnr = this.returnValue(data.personalnummer);
      this.app.BusinessTripApplications[
        this.currentTeacherIndex
      ].TravelMode = this.returnValue(data.transport);
      this.app.BusinessTripApplications[
        this.currentTeacherIndex
      ].StartingPoint = this.returnValue(data.ausgangspunkt);
      this.app.BusinessTripApplications[
        this.currentTeacherIndex
      ].EndPoint = this.returnValue(data.endpunkt);
      this.app.BusinessTripApplications[
        this.currentTeacherIndex
      ].Reasoning = this.returnString(data.reason);
      this.app.BusinessTripApplications[
        this.currentTeacherIndex
      ].TravelPurpose = this.returnString(data.reason1);
      this.app.BusinessTripApplications[
        this.currentTeacherIndex
      ].TravelCostsPayedBySomeone = this.returnBoolean(data.reisekosten);
      this.app.BusinessTripApplications[
        this.currentTeacherIndex
      ].StayingCostsPayedBySomeone = this.returnBoolean(data.aufenthaltskosten);
      this.app.BusinessTripApplications[
        this.currentTeacherIndex
      ].PayedByWhom = this.returnString(data.von);
      this.app.BusinessTripApplications[
        this.currentTeacherIndex
      ].OtherCosts = this.returnValue(data.sonstige_kosten);
      this.app.BusinessTripApplications[
        this.currentTeacherIndex
      ].EstimatedCosts = this.returnValue(data.geschaetzte_kosten);
    },
    calcDate(date) {
      var tmp = date.split(".");
      return tmp[2] + "-" + tmp[1] + "-" + tmp[0] + "T00:00:00+01:00";
    },
    calcTime(date) {
      var tmp = date.split(":");
      return "2000-01-01T" + tmp[0] + ":" + tmp[1] + ":00+01:00";
    },
    loadData() {
      axios
        .get(this.url + "/application/getApplication?id=" + this.appid, {
          params: {
            token: this.token
          }
        })
        .then(response => {
          this.app = response.data.application;
          this.title = this.app.Name;
          this.kind = this.app.Kind;
          this.currentTeacher = this.getCurrentTeacher();
          if (this.app.Kind === 4) {
            if (
              this.currentTeacher ===
              this.app.SchoolEventDetails.Teachers[0].Shortname
            ) {
              this.isLeader = true;
            } else {
              this.isLeader = false;
            }
            for (
              let i = 0;
              i < this.app.SchoolEventDetails.Teachers.length;
              i++
            ) {
              if (
                this.currentTeacher ===
                this.app.SchoolEventDetails.Teachers[i].Shortname
              ) {
                this.currentTeacherIndex = i;
              }
            }
            this.start = this.app.SchoolEventDetails.Teachers[
              this.currentTeacherIndex
            ].AttendanceFrom;
            this.end = this.app.SchoolEventDetails.Teachers[
              this.currentTeacherIndex
            ].AttendanceTill;
            this.sedata = this.app.SchoolEventDetails.Teachers[
              this.currentTeacherIndex
            ];
          } else {
            this.currentTeacherIndex = 0;
          }
          if (this.app.Kind === 0) {
            this.start = this.app.StartTime;
            this.end = this.app.EndTime;
            this.wdata = this.app;
          }
          if (this.app.Kind === 8) {
            this.start = this.app.StartTime;
            this.end = this.app.EndTime;
            this.odata = this.app;
          }
          this.tadata = this.app.BusinessTripApplications[
            this.currentTeacherIndex
          ];
          this.tbdata = this.app.TravelInvoices[this.currentTeacherIndex];
          this.setItems(this.app);
          this.setReads(this.app);
        });
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
    save() {
      axios
        .put(this.url + "/saveApplication", {
          params: {
            application: this.app.UUID,
            token: this.token,
            data: this.app,
            user: this.user
          }
        })
        .then(() => {
          this.saveConfirm();
        });
    },
    closeAntrag() {
      this.$refs["close-modal"].show();
    },
    saveConfirm() {
      this.$bvToast.toast("Die Änderungen wurden erfolgreich gespeichert!", {
        title: "Änderungen gespeichert",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "success"
      });
    },
    setReads(app) {
      var progress = app.Progress;
      if (app.Kind === 4) {
        if (this.isLeader) {
          switch (progress) {
            case 0:
              this.sgreadonly = false;
              this.sereadonly = false;
              this.tareadonly = false;
              this.tbreadonly = true;
              break;
            case 1:
              this.sgreadonly = false;
              this.sereadonly = false;
              this.tareadonly = false;
              this.tbreadonly = true;
              break;
            case 2:
              this.sgreadonly = true;
              this.sereadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            case 3:
              this.sgreadonly = true;
              this.sereadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            case 4:
              this.sgreadonly = true;
              this.sereadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            case 5:
              this.sgreadonly = true;
              this.sereadonly = true;
              this.tareadonly = true;
              this.tbreadonly = false;
              break;
            case 6:
              this.sgreadonly = true;
              this.sereadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            case 7:
              this.sgreadonly = true;
              this.sereadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            default:
              this.sgreadonly = true;
              this.sereadonly = true;
              this.oreadonly = true;
              this.wreadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
          }
        } else {
          switch (progress) {
            case 0:
              this.sereadonly = false;
              this.tareadonly = false;
              this.tbreadonly = true;
              break;
            case 1:
              this.sereadonly = false;
              this.tareadonly = false;
              this.tbreadonly = true;
              break;
            case 2:
              this.sereadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            case 3:
              this.sereadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            case 4:
              this.sereadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            case 5:
              this.sereadonly = true;
              this.tareadonly = true;
              this.tbreadonly = false;
              break;
            case 6:
              this.sereadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            case 7:
              this.sereadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            default:
              this.sgreadonly = true;
              this.sereadonly = true;
              this.oreadonly = true;
              this.wreadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
          }
        }
      } else {
        if (app.Kind === 0) {
          switch (progress) {
            case 0:
              this.wreadonly = false;
              this.tareadonly = false;
              this.tbreadonly = true;
              break;
            case 1:
              this.wreadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            case 2:
              this.wreadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            case 3:
              this.wreadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            case 4:
              this.wreadonly = true;
              this.tareadonly = true;
              this.tbreadonly = false;
              break;
            case 5:
              this.wreadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            case 6:
              this.wreadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            default:
              this.readonly = true;
              this.sereadonly = true;
              this.oreadonly = true;
              this.wreadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
          }
        }
        if (app.Kind === 8) {
          switch (progress) {
            case 0:
              this.oreadonly = false;
              this.tareadonly = false;
              this.tbreadonly = true;
              break;
            case 1:
              this.oreadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            case 2:
              this.oreadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            case 3:
              this.oreadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            case 4:
              this.oreadonly = true;
              this.tareadonly = true;
              this.tbreadonly = false;
              break;
            case 5:
              this.oreadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            case 6:
              this.oreadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
              break;
            default:
              this.readonly = true;
              this.sereadonly = true;
              this.oreadonly = true;
              this.wreadonly = true;
              this.tareadonly = true;
              this.tbreadonly = true;
          }
        }
      }
    },
    setItems(app) {
      if (app.Kind === 4) {
        if (this.isLeader) {
          this.items = [
            {
              title: "Allgemeine Infos",
              form: "SchoolEventDetails"
            },
            {
              title: "Begleitformular",
              form: "SchoolEventTeacherDetails"
            },
            {
              title: "Reiseformular",
              form: "BusinessTripApplication"
            },
            {
              title: "Reiserechnung",
              form: "TravelInvoice"
            }
          ];
        } else {
          this.items = [
            {
              title: "Begleitformular",
              form: "SchoolEventTeacherDetails"
            },
            {
              title: "Reiseformular",
              form: "BusinessTripApplication"
            },
            {
              title: "Reiserechnung",
              form: "TravelInvoice"
            }
          ];
        }
      } else {
        if (app.Kind === 0) {
          this.items = [
            {
              title: "Fortbildung",
              form: "TrainingDetails"
            },
            {
              title: "Reiseformular",
              form: "BusinessTripApplication"
            },
            {
              title: "Reiserechnung",
              form: "TravelInvoice"
            }
          ];
        } else {
          this.items = [
            {
              title: "Abwesenheitsformular",
              form: "OtherReasonDetails"
            },
            {
              title: "Reiseformular",
              form: "BusinessTripApplication"
            },
            {
              title: "Reiserechnung",
              form: "TravelInvoice"
            }
          ];
        }
      }
    },
    getCurrentTeacher() {
      axios
        .get(this.url + "/getTeacher?id=" + this.user, {
          params: {
            token: this.token
          }
        })
        .then(response => {
          let data = response.data;
          return data.Short;
        });
    },
    openPDF(item) {
      axios
        .get(this.url + "/getPDF", {
          params: {
            application: this.app.UUID,
            form: item.form,
            user: this.user,
            token: this.token
          }
        })
        .then(response => {
          var pdf = response.data.pdf;
          this.showPDF(pdf);
        });
    },
    hideClose() {
      this.$refs["close-modal"].hide();
    },
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    showPDF(pdf) {
      let pdfWindow = window.open("");
      var fileName = "PDF";
      pdfWindow.document.write(
        "<html<head><title>" +
          fileName +
          "</title><style>body{margin: 0px;}iframe{border-width: 0px;}</style></head>"
      );
      pdfWindow.document.write(
        "<body><embed width='100%' height='100%' src='data:application/pdf;base64, " +
          encodeURI(pdf) +
          "#toolbar=0&navpanes=0&scrollbar=0'></embed></body></html>"
      );
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    newApplication() {
      if (this.checkClick()) {
        this.changeComponent("NewApplication");
        this.changeURL("NewApplication");
      }
    },
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
      if (this.checkClick) {
        this.changeComponent("Index");
        this.changeURL("Index");
      }
    },
    delAn() {
      axios
        .delete(this.url + "/closeApplication", {
          params: {
            application: this.app.UUID,
            token: this.token
          }
        })
        .then(() => {
          this.index();
        });
    },
    changeURL(nextpage) {
      if (window.location.href.indexOf("/viewer") >= 0) {
        history.replaceState(
          nextpage,
          null,
          window.location.href.substring(
            0,
            window.location.href.indexOf("/viewer")
          )
        );
      }
    }
  }
};
</script>
