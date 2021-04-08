<!-- Komponente zum anzeigen eines Antrags -->
<template>
  <b-container fluid>
    <b-row align-v="center" align-h="center">
      <b-col cols="12" md="6">
        <!-- Titel des Antrags -->
        <h1 id="new-application-heading">Antrag für {{ app.name }}</h1>
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
        <!-- Neuer Antrag Button -->
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
        <!-- Progressbar -->
        <Progress v-bind:progress="app.progress" v-bind:kind="app.kind" />
      </b-col>
    </b-row>
    <b-row style="margin-top:2rem">
      <b-col cols="12">
        <!-- Tabelle die die Dokumente beinhalttet -->
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
          <!-- Name des Dokuments -->
          <template #cell(name)="row">
            {{ row.value.first }} {{ row.value.last }}
          </template>
          <!-- Aktionen -->
          <template #cell(actions)="row">
            <!-- PDF öffnen -->
            <b-button
              variant="outline-secondary"
              size="sm"
              @click="openPDF(row.item)"
              style="margin-right:1rem"
            >
              <b-icon icon="file-earmark-text"></b-icon> PDF öffnen
            </b-button>
            <!-- Details anzeigen -->
            <b-button
              variant="outline-secondary"
              size="sm"
              @click="row.toggleDetails"
            >
              <b-icon icon="pencil-square"></b-icon> Bearbeitung
              {{ row.detailsShowing ? "schließen" : "öffnen" }}
            </b-button>
          </template>

          <!-- Details -->
          <template #row-details="row">
            <b-card>
              <!-- Schulveranstaltung -->
              <SchoolGeneral
                v-bind:readonly="sgreadonly"
                v-bind:data="app"
                v-bind:token="token"
                v-bind:url="url"
                v-on:update="updateSG"
                v-if="isLeader && row.item.title == 'Allgemeine Infos'"
              />
              <!-- Veranstaltuns BEgleiter -->
              <SchoolEscorts
                v-bind:readonly="sereadonly"
                v-bind:data="sedata"
                v-on:update="updateSE"
                v-if="row.item.title == 'Begleitformular'"
              />
              <!-- Reiseantrag -->
              <TravelApplication
                v-bind:readonly="tareadonly"
                v-bind:app="tadata"
                v-bind:index="0"
                v-on:update="updateTA"
                v-if="row.item.title == 'Reiseformular'"
              />
              <!-- Reiserechung -->
              <TravelBill
                v-bind:readonly="tbreadonly"
                v-bind:index="0"
                v-bind:start="start"
                v-bind:end="end"
                v-bind:app="tbdata"
                v-on:update="updateTB"
                v-if="row.item.title == 'Reiserechnung'"
              />
              <!-- Andere -->
              <Others
                v-bind:readonly="oreadonly"
                v-bind:data="odata"
                v-on:update="updateO"
                v-if="row.item.title == 'Abwesenheitsformular'"
              />
              <!-- Forbildungen -->
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

    <!-- Aktuonen zum schließen und speichern -->
    <b-row style="margin-bottom:2rem">
      <b-col cols="12">
        <!-- Antrag schließen -->
        <b-button
          variant="outline-danger"
          v-if="isLeader"
          id="show-btn"
          @click="closeAntrag"
          class="float-right"
          ><b-icon icon="file-earmark-excel"></b-icon> Antrag
          schließen</b-button
        >
        <!-- Änderungen speichern -->
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

    <!-- Sicherheitshinweis Antrag schließen -->
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
            <!-- Antrag schließen bestätigung -->
            <b-button class="mt-2" variant="outline-danger" block @click="delAn"
              >Antrag schließen <b-spinner small type="grow"></b-spinner
            ></b-button>
          </b-col>
          <b-col cols="6">
            <!-- Abbrechen Button --><b-button
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
    /**
     * Aktualisiert die Daten der Schulveranstaltung
     * @param sgdata Die Daten der Schulveranstaltung
     */
    updateSG(sgdata) {
      this.app = sgdata;
    },
    /**
     * Aktualisiert die Daten der Begleitformulare
     * @param sedata Die Daten der Begleitformulare
     */
    updateSE(sedata) {
      this.app.SchoolEventDetails.Teachers[this.currentTeacherIndex] = sedata;
    },
    /**
     * Aktualisiert die Daten der Sonstigen Anträge
     * @param odata Die Daten der Sonstigen Anträge
     */
    updateO(odata) {
      this.app = odata;
    },
    /**
     * Aktualisiert die Daten der Fortbildungen
     * @param wdata Die Daten der Fortbildungen
     */
    updateW(wdata) {
      this.app = wdata;
    },
    /**
     * Aktualisiert die Daten der Reiserechnung
     * @param index Der Index, bei dem die Daten aktualisiert werden sollen
     * @param data Die Daten der Reiserechnung
     */
    updateTB(index, data) {
      index.toString();
      if (data.selected.includes("a1")) {
        this.app.travel_invoices[
          this.currentTeacherIndex
        ].official_business_card_got = true;
      } else {
        this.app.travel_invoices[
          this.currentTeacherIndex
        ].official_business_card_got = false;
      }
      if (data.selected.includes("a2")) {
        this.app.travel_invoices[this.currentTeacherIndex].travel_grant = true;
      } else {
        this.app.travel_invoices[this.currentTeacherIndex].travel_grant = false;
      }
      if (data.selected.includes("a3")) {
        this.app.travel_invoices[
          this.currentTeacherIndex
        ].replacement_for_advantage_card = true;
      } else {
        this.app.travel_invoices[
          this.currentTeacherIndex
        ].replacement_for_advantage_card = false;
      }
      if (data.selected.includes("a4")) {
        this.app.travel_invoices[
          this.currentTeacherIndex
        ].replacement_for_train_card_class_2 = true;
      } else {
        this.app.travel_invoices[
          this.currentTeacherIndex
        ].replacement_for_train_card_class2 = false;
      }
      if (data.selected.includes("a5")) {
        this.app.travel_invoices[
          this.currentTeacherIndex
        ].kilometre_allowance = true;
      } else {
        this.app.travel_invoices[
          this.currentTeacherIndex
        ].kilometre_allowance = false;
      }
      if (data.selected.includes("a6")) {
        this.app.travel_invoices[
          this.currentTeacherIndex
        ].nr_and_indications_of_participants = true;
      } else {
        this.app.travel_invoices[
          this.currentTeacherIndex
        ].nr_and_indications_of_participants = false;
      }
      if (data.selected.includes("a7")) {
        this.app.travel_invoices[
          this.currentTeacherIndex
        ].travel_costs_cited = true;
      } else {
        this.app.travel_invoices[
          this.currentTeacherIndex
        ].travel_costs_cited = true;
      }
      if (data.selected.includes("a8")) {
        this.app.travel_invoices[this.currentTeacherIndex].no_travel_costs = true;
      } else {
        this.app.travel_invoices[this.currentTeacherIndex].no_travel_costs = false;
      }
      switch (data.dcm) {
        case "a1":
          this.app.travel_invoices[
            this.currentTeacherIndex
          ].daily_charges_mode = 0;
          break;
        case "a2":
          this.app.travel_invoices[
            this.currentTeacherIndex
          ].daily_charges_mode = 1;
          break;
        case "a3":
          this.app.travel_invoices[
            this.currentTeacherIndex
          ].daily_charges_mode = 2;
          break;
      }
      switch (data.ncm) {
        case "a1":
          this.app.travel_invoices[
            this.currentTeacherIndex
          ].nightly_charges_mode = 0;
          break;
        case "a2":
          this.app.travel_invoices[
            this.currentTeacherIndex
          ].nightly_charges_mode = 1;
          break;
        case "a3":
          this.app.travel_invoices[
            this.currentTeacherIndex
          ].nightly_charges_mode = 2;
          break;
      }
      this.app.travel_invoices[
        this.currentTeacherIndex
      ].travel_mode = this.app.business_trip_applications[
        this.currentTeacherIndex
      ].travel_mode;
      this.app.travel_invoices[
        this.currentTeacherIndex
      ].id = this.currentTeacherIndex;
      this.app.travel_invoices[
        this.currentTeacherIndex
      ].trip_begin_time = this.app.start_time;
      this.app.travel_invoices[
        this.currentTeacherIndex
      ].trip_end_time = this.app.end_time;
      this.app.travel_invoices[
        this.currentTeacherIndex
      ].staffnr = this.app.business_trip_applications[
        this.currentTeacherIndex
      ].staffnr;
      this.app.travel_invoices[
        this.currentTeacherIndex
      ].starting_point = this.app.start_address;
      this.app.travel_invoices[
        this.currentTeacherIndex
      ].end_point = this.app.destination_address;
      this.app.travel_invoices[this.currentTeacherIndex].shortened_amount =
        data.short;
      this.app.travel_invoices[this.currentTeacherIndex].breakfasts =
        data.breakfast;
      this.app.travel_invoices[this.currentTeacherIndex].lunches = data.lunch;
      this.app.travel_invoices[this.currentTeacherIndex].dinners = data.dinner;
      this.app.travel_invoices[this.currentTeacherIndex].kilometreAmount =
        data.km;
      this.app.travel_invoices[this.currentTeacherIndex].calculation = {};
      this.app.travel_invoices[this.currentTeacherIndex].calculation.id = 0;
      this.app.travel_invoices[this.currentTeacherIndex].calculation.rows = [];
      this.app.travel_invoices[
        this.currentTeacherIndex
      ].calculation.sum_travel_costs = data.SumTravelCosts;
      this.app.travel_invoices[
        this.currentTeacherIndex
      ].calculation.sum_daily_charges = data.SumDailyCharges;
      this.app.travel_invoices[
        this.currentTeacherIndex
      ].calculation.sum_nightly_charges = data.SumNightlyCharges;
      this.app.travel_invoices[
        this.currentTeacherIndex
      ].calculation.sum_additional_costs = data.SumAdditionalCosts;
      this.app.travel_invoices[this.currentTeacherIndex].calculation.sum_of_sums =
        data.SumOfSums;
      for (let i = 0; i < data.items.length; i++) {
        this.app.travel_invoices[this.currentTeacherIndex].calculation.rows.push(
          {
            nr: this.returnValue(data.items[i].index),
            date: this.calcDate(data.items[i].date),
            begin: this.calcTime(data.items[i].start),
            end: this.calcTime(data.items[i].end),
            kilometres: this.returnValue(data.items[i].km),
            travel_costs: this.returnValue(data.items[i].travelcosts),
            daily_charges: this.returnValue(data.items[i].daycharge),
            nightly_charges: this.returnValue(data.items[i].sleepcharge),
            additional_costs: this.returnValue(data.items[i].othercosts),
            sum: this.returnValue(data.items[i].sum)
          }
        );
      }
    },
    /**
     * Aktualisiert die Daten der Reiseformulare
     * @param index Der Index, bei dem die Daten aktualisiert werden sollen
     * @param data Die Daten der Reiseformulare
     */
    updateTA(index, data) {
      index.toString();
      if (data.bonus_meilen[0] === "0" || data.bonus_meilen[1] === "0") {
        this.app.business_trip_applications[
          this.currentTeacherIndex
        ].bonus_mile_confirmation_1 = true;
      } else {
        this.app.business_trip_applications[
          this.currentTeacherIndex
        ].bonus_mile_confirmation_1 = false;
      }
      if (data.bonus_meilen[0] === "1" || data.bonus_meilen[1] === "1") {
        this.app.business_trip_applications[
          this.currentTeacherIndex
        ].bonus_mile_confirmation_2 = true;
      } else {
        this.app.business_trip_applications[
          this.currentTeacherIndex
        ].bonus_mile_confirmation_2 = false;
      }
      this.app.business_trip_applications[
        this.currentTeacherIndex
      ].staffnr = this.returnValue(data.personalnummer);
      this.app.business_trip_applications[
        this.currentTeacherIndex
      ].travel_mode = this.returnValue(data.transport);
      this.app.business_trip_applications[
        this.currentTeacherIndex
      ].starting_point = this.returnValue(data.ausgangspunkt);
      this.app.business_trip_applications[
        this.currentTeacherIndex
      ].end_point = this.returnValue(data.endpunkt);
      this.app.business_trip_applications[
        this.currentTeacherIndex
      ].reasoning = this.returnString(data.reason);
      this.app.business_trip_applications[
        this.currentTeacherIndex
      ].travel_purpose = this.returnString(data.reason1);
      this.app.business_trip_applications[
        this.currentTeacherIndex
      ].travel_costs_payed_by_someone = this.returnBoolean(data.reisekosten);
      this.app.business_trip_applications[
        this.currentTeacherIndex
      ].staying_costs_payed_by_someone = this.returnBoolean(data.aufenthaltskosten);
      this.app.business_trip_applications[
        this.currentTeacherIndex
      ].payed_by_whom = this.returnString(data.von);
      this.app.business_trip_applications[
        this.currentTeacherIndex
      ].other_costs = this.returnValue(data.sonstige_kosten);
      this.app.business_trip_applications[
        this.currentTeacherIndex
      ].estimated_costs = this.returnValue(data.geschaetzte_kosten);
    },
    /**
     * Diese Methode rechnet das Datum in das verwendete Datumsformat um
     */
    calcDate(date) {
      var tmp = date.split(".");
      return tmp[2] + "-" + tmp[1] + "-" + tmp[0] + "T00:00:00+01:00";
    },
    /**
     * Diese Methode rechnet die Zeit in das verwendete Datumsformat um
     */
    calcTime(date) {
      var tmp = date.split(":");
      return "2000-01-01T" + tmp[0] + ":" + tmp[1] + ":00+01:00";
    },
    /**
     * TODO
     * Diese Methode lädt alle notwendigen Daten und formatiert jene so, dass diese richtig angezeigt werden
     */
    loadData() {
      axios
        .get(this.url + "/application/getApplication?id=" + this.appid, {
          params: {
            token: this.token
          }
        })
        .then(response => {
          this.app = response.data.application;
          this.title = this.app.name;
          this.kind = this.app.kind;
          this.currentTeacher = this.getCurrentTeacher();
          if (this.app.kind === 4) {
            if (
              this.currentTeacher ===
              this.app.school_event_details.teachers[0].shortname
            ) {
              this.isLeader = true;
            } else {
              this.isLeader = false;
            }
            for (
              let i = 0;
              i < this.app.school_event_details.teachers.length;
              i++
            ) {
              if (
                this.currentTeacher ===
                this.app.school_event_details.teachers[i].shortname
              ) {
                this.currentTeacherIndex = i;
              }
            }
            this.start = this.app.school_event_details.teachers[
              this.currentTeacherIndex
            ].attendance_from;
            this.end = this.app.school_event_details.teachers[
              this.currentTeacherIndex
            ].attendance_till;
            this.sedata = this.app.school_event_details.teachers[
              this.currentTeacherIndex
            ];
          } else {
            this.currentTeacherIndex = 0;
          }
          if (this.app.kind === 0) {
            this.start = this.app.start_time;
            this.end = this.app.end_time;
            this.wdata = this.app;
          }
          if (this.app.kind === 8) {
            this.start = this.app.start_time;
            this.end = this.app.end_time;
            this.odata = this.app;
          }
          this.tadata = this.app.business_trip_applications[
            this.currentTeacherIndex
          ];
          this.tbdata = this.app.travel_invoices[this.currentTeacherIndex];
          this.setItems(this.app);
          this.setReads(this.app);
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
     * TODO
     * Diese Methode sendet den veränderten Antrag an das Backend
     */
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
    /**
     * Diese Methode öffnet das Modal, in dem man den Antrag schließen kann
     */
    closeAntrag() {
      this.$refs["close-modal"].show();
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass der Antrag erfolgreich gespeichert worden ist
     */
    saveConfirm() {
      this.$bvToast.toast("Die Änderungen wurden erfolgreich gespeichert!", {
        title: "Änderungen gespeichert",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "success"
      });
    },
    /**
     * Diese Methode setzt je nach Art und Fortschritts des Antrags die Lese- und Schreibberechtigungen
     * @param app Der gesamte Antrag
     */
    setReads(app) {
      var progress = app.progress;
      if (app.kind === 4) {
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
        if (app.kind === 0) {
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
        if (app.kind === 8) {
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
    /**
     * Diese Methode setzt je nach Art und Fortschritts des Antrags die angezeigten Formulare
     * @param app Der gesamte Antrag
     */
    setItems(app) {
      if (app.kind === 4) {
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
        if (app.kind === 0) {
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
    /**
     * TODO
     * Diese Methode gibt den Kürzel des derzeit angemeldeten Benutzers zurück
     */
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
    /**
     * Diese Methode lädt die PDF von dem Backend
     */
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
    /**
     * Diese Methode versteckt das Modal
     */
    hideClose() {
      this.$refs["close-modal"].hide();
    },
    /**
     * Code aus StackOverflow
     * Diese Methode wandelt den Base64String in eine PDF um und zeigt diese in einem neuen Tab an
     * @param pdf Das PDF formatiert in Base64
     */
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
    /**
     * Diese Methode leert das Modal
     */
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    /**
     * Methode von Bootstrap-vue Table
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    /**
     * Diese Methode leitet den Benutzer auf die NewApplication-Seite weiter
     */
    newApplication() {
      if (this.checkClick()) {
        this.changeComponent("NewApplication");
        this.changeURL("NewApplication");
      }
    },
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
      if (this.checkClick) {
        this.changeComponent("Index");
        this.changeURL("Index");
      }
    },
    /**
     * TODO
     * Diese Methode löscht den Antrag
     */
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
    /**
     * Diese Methode sorgt dafür, dass die URL angepasst ist, damit keine Reste des Viewers (ApplicationSearch) in der URL stehen
     * @param nextpage Die nächste Seite, welche aufgerufen wird
     */
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
