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
            <!-- Excel herunterladen -->
            <b-button
              v-if="
                row.item.form === 'BusinessTripApplication' ||
                  row.item.form === 'TravelInvoice'
              "
              variant="outline-secondary"
              size="sm"
              @click="downloadExcel(row.item)"
              style="margin-right:1rem"
            >
              <b-icon variant="success" icon="file-earmark-text"></b-icon> Excel
              herunterladen
            </b-button>
            <!-- Abgeltung PDF öffnen -->
            <b-button
              v-if="row.item.form === 'Compensation'"
              variant="outline-secondary"
              size="sm"
              @click="openAbgeltung()"
            >
              <b-icon variant="danger" icon="file-earmark-text"></b-icon> PDF
              öffnen
            </b-button>
            <!-- PDF öffnen -->
            <b-button
              v-if="row.item.form !== 'Compensation'"
              variant="outline-secondary"
              size="sm"
              @click="openPDF(row.item)"
              style="margin-right:1rem"
            >
              <b-icon variant="danger" icon="file-earmark-text"></b-icon> PDF
              öffnen
            </b-button>
            <!-- Details anzeigen -->
            <b-button
              variant="outline-secondary"
              size="sm"
              v-if="row.item.form !== 'Compensation'"
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
                v-on:updateToken="updateToken"
                v-on:logout="logout"
                v-if="isLeader && row.item.form == 'SchoolEventDetails'"
              />
              <!-- Veranstaltuns BEgleiter -->
              <SchoolEscorts
                v-bind:readonly="sereadonly"
                v-bind:data="sedata"
                v-on:update="updateSE"
                v-if="row.item.form == 'SchoolEventTeacherDetails'"
              />
              <!-- Reiseantrag -->
              <TravelApplication
                v-bind:readonly="tareadonly"
                v-bind:app="tadata"
                v-bind:index="0"
                v-on:update="updateTA"
                v-if="row.item.form == 'BusinessTripApplication'"
              />
              <!-- Reiserechung -->
              <TravelBill
                v-bind:readonly="tbreadonly"
                v-bind:index="0"
                v-bind:start="start"
                v-bind:end="end"
                v-bind:app="tbdata"
                v-on:update="updateTB"
                v-if="row.item.form == 'TravelInvoice'"
              />
              <!-- Andere -->
              <Others
                v-bind:readonly="oreadonly"
                v-bind:data="odata"
                v-on:update="updateO"
                v-if="row.item.form == 'OtherReasonDetails'"
              />
              <!-- Forbildungen -->
              <Workshop
                v-bind:readonly="wreadonly"
                v-bind:data="wdata"
                v-on:update="updateW"
                v-if="row.item.form == 'TrainingDetails'"
              />
            </b-card>
          </template>
        </b-table>
      </b-col>
    </b-row>

    <!-- Aktionen zum löschen, schließen und speichern -->
    <b-row style="margin-bottom:2rem">
      <b-col cols="12">
        <!-- Antrag löschen -->
        <b-button
          variant="outline-danger"
          v-if="isLeader"
          id="show-btn"
          @click="delAntrag"
          class="float-right"
          ><b-icon icon="file-earmark-excel"></b-icon> Antrag löschen</b-button
        >
        <!-- Antrag schließen -->
        <b-button
          variant="outline-danger"
          v-if="isLeader"
          style="margin-right: 1rem"
          id="show-btn"
          @click="closeAntrag"
          :disabled="isFinished()"
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

    <!-- Sicherheitshinweis Antrag löschen -->
    <b-modal ref="del-modal" hide-footer title="Antrag löschen">
      <b-container fluid>
        <b-row
          ><b-col cols="12">
            <div class="d-block text-center">
              <p>
                Sind Sie sich sicher, dass Sie den Antrag löschen wollen? Er
                wird danach nicht mehr für die Prüfer sichtbar sein und
                <b>kann nicht mehr geöffnet werden!</b>
              </p>
            </div>
          </b-col></b-row
        >
        <b-row>
          <b-col cols="6">
            <!-- Antrag löschen bestätigung -->
            <b-button class="mt-2" variant="outline-danger" block @click="delAn"
              >Antrag löschen <b-spinner small type="grow"></b-spinner
            ></b-button>
          </b-col>
          <b-col cols="6">
            <!-- Abbrechen Button --><b-button
              class="mt-2"
              variant="outline-success"
              block
              @click="hideDel"
              >Abbrechen</b-button
            ></b-col
          >
        </b-row>
      </b-container>
    </b-modal>
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
            <b-button
              class="mt-2"
              variant="outline-danger"
              block
              @click="closeAn"
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
    <!-- Auswahl Klassen -->
    <b-modal ref="class-modal" hide-footer title="Klassen auswählen">
      <b-container fluid>
        <b-row
          ><b-col cols="12">
            <div class="d-block text-center">
              <p>
                Bitte wählen Sie aus, welche Klassen in der Datei inkludiert
                sein sollen:
              </p>
              <!-- Klassen Auswählen -->
              <b-form-group
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                label-for="zud"
                id="zu"
              >
                <b-form-checkbox-group
                  id="zud"
                  v-model="auswahl"
                  stacked
                  v-for="c in klassen"
                  v-bind:key="c"
                >
                  <b-form-checkbox checked="true" :value="c">{{
                    c
                  }}</b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>
            </div>
          </b-col></b-row
        >
        <b-row>
          <b-col cols="6">
            <!-- PDF öffnen bestätigung -->
            <b-button
              class="mt-2"
              variant="outline-success"
              block
              @click="generallPDF"
              >Bestätigen</b-button
            >
          </b-col>
          <b-col cols="6">
            <!-- Abbrechen Button --><b-button
              class="mt-2"
              variant="outline-danger"
              block
              @click="hideClass"
              >Abbrechen</b-button
            ></b-col
          >
        </b-row>
      </b-container>
    </b-modal>

    <!-- Delete modal -->
    <b-modal
      :id="delModal.id"
      :title="delModal.title"
      ok-only
      @hide="resetDelModal"
    >
      <pre>{{ delModal.content }}</pre>
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
    <!-- Klassen modal -->
    <b-modal
      :id="classModal.id"
      :title="classModal.title"
      ok-only
      @hide="resetClassModal"
    >
      <pre>{{ classModal.content }}</pre>
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
  props: ["url", "appid", "user", "token", "refresh_token"],
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
      classModal: {
        id: "info-modal",
        title: "",
        content: ""
      },
      delModal: {
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
      currentTeacherIndex: -1,
      auswahl: [],
      klassen: [],
      belege: []
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
      this.app.school_event_details.teachers[this.currentTeacherIndex] = sedata;
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
      this.belege = data.beleg;
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
        this.app.travel_invoices[
          this.currentTeacherIndex
        ].no_travel_costs = true;
      } else {
        this.app.travel_invoices[
          this.currentTeacherIndex
        ].no_travel_costs = false;
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
      this.app.travel_invoices[this.currentTeacherIndex].kilometre_amount =
        data.km;
      this.app.travel_invoices[
        this.currentTeacherIndex
      ].travel_costs_pre_grant = data.travel_grant;
      this.app.travel_invoices[this.currentTeacherIndex].calculation = {};
      this.app.travel_invoices[this.currentTeacherIndex].calculation.id = 0;
      this.app.travel_invoices[this.currentTeacherIndex].calculation.rows = [];
      this.app.travel_invoices[
        this.currentTeacherIndex
      ].calculation.sum_travel_costs = data.sum_travelcosts;
      this.app.travel_invoices[
        this.currentTeacherIndex
      ].calculation.sum_daily_charges = data.sum_daily_charges;
      this.app.travel_invoices[
        this.currentTeacherIndex
      ].calculation.sum_nightly_charges = data.sum_nightly_charges;
      this.app.travel_invoices[
        this.currentTeacherIndex
      ].calculation.sum_additional_costs = data.sum_additional_costs;
      this.app.travel_invoices[
        this.currentTeacherIndex
      ].calculation.sum_of_sums = data.sum_of_sums;
      for (let i = 0; i < data.items.length; i++) {
        let tmp_kind = [];
        if (data.items[i].kind_of_costs.includes("0")) {
          tmp_kind.push(0);
        }
        if (data.items[i].kind_of_costs.includes("1")) {
          tmp_kind.push(1);
        }
        if (data.items[i].kind_of_costs.includes("2")) {
          tmp_kind.push(2);
        }
        if (data.items[i].kind_of_costs.includes("3")) {
          tmp_kind.push(3);
        }
        this.app.travel_invoices[
          this.currentTeacherIndex
        ].calculation.rows.push({
          nr: this.returnValue(data.items[i].index),
          date: this.calcDate(data.items[i].date),
          begin: this.calcTime(data.items[i].start),
          end: this.calcTime(data.items[i].end),
          kind_of_costs: tmp_kind,
          kilometres: this.returnValue(data.items[i].km),
          travel_costs: this.returnValue(data.items[i].travelcosts),
          daily_charges: this.returnValue(data.items[i].daycharge),
          nightly_charges: this.returnValue(data.items[i].sleepcharge),
          additional_costs: this.returnValue(data.items[i].othercosts),
          sum: this.returnValue(data.items[i].sum)
        });
      }
    },
    /**
     * Aktualisiert die Daten der Reiseformulare
     * @param index Der Index, bei dem die Daten aktualisiert werden sollen
     * @param data Die Daten der Reiseformulare
     */
    updateTA(index, data) {
      index.toString();
      switch (data.business_karte) {
        case "no":
          this.app.business_trip_applications[
            this.currentTeacherIndex
          ].business_card_emitted_outward = false;
          this.app.business_trip_applications[
            this.currentTeacherIndex
          ].business_card_emitted_return = false;
          break;
        case "too":
          this.app.business_trip_applications[
            this.currentTeacherIndex
          ].business_card_emitted_outward = true;
          this.app.business_trip_applications[
            this.currentTeacherIndex
          ].business_card_emitted_return = false;
          break;
        case "back":
          this.app.business_trip_applications[
            this.currentTeacherIndex
          ].business_card_emitted_outward = false;
          this.app.business_trip_applications[
            this.currentTeacherIndex
          ].business_card_emitted_return = true;
          break;
        default:
          this.app.business_trip_applications[
            this.currentTeacherIndex
          ].business_card_emitted_outward = false;
          this.app.business_trip_applications[
            this.currentTeacherIndex
          ].business_card_emitted_return = false;
          break;
      }
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
      this.app.business_trip_applications[this.currentTeacherIndex].busin;
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
      ].travel_costs_paid_by_someone = this.returnBoolean(data.reisekosten);
      this.app.business_trip_applications[
        this.currentTeacherIndex
      ].staying_costs_paid_by_someone = this.returnBoolean(
        data.aufenthaltskosten
      );
      this.app.business_trip_applications[
        this.currentTeacherIndex
      ].paid_by_whom = this.returnString(data.von);
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
      if (tmp[0] <= 10) {
        return "2000-01-01T0" + (tmp[0] - 1) + ":" + tmp[1] + ":00+01:00";
      } else {
        return "2000-01-01T" + (tmp[0] - 1) + ":" + tmp[1] + ":00+01:00";
      }
    },
    /**
     * Diese Methode lädt alle notwendigen Daten und formatiert jene so, dass diese richtig angezeigt werden
     */
    loadData() {
      axios
        .get(this.url + "/getApplication?uuid=" + this.appid, {
          headers: {
            Authorization: "Basic " + this.token
          }
        })
        .then(response => {
          this.loadView(response.data);
        })
        .catch(error => {
          switch (error.response.status) {
            case 401:
              axios
                .post(this.url + "/login/refresh", {
                  refresh_token: this.refresh_token
                })
                .then(resp => {
                  this.$emit(
                    "updateToken",
                    resp.data.access_token,
                    resp.data.refresh_token
                  );
                  axios
                    .get(this.url + "/getApplication?uuid=" + this.appid, {
                      headers: {
                        Authorization: "Basic " + resp.data.access_token
                      }
                    })
                    .then(res => {
                      this.loadView(res.data);
                    })
                    .catch(e => {
                      e.toString();
                      this.failedLoad();
                    });
                })
                .catch(err => {
                  err.toString();
                  this.$emit("logout");
                });
              break;
            default:
              this.failedLoad();
              break;
          }
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
     * Diese Methode setzt alle wichtigen Variablen, um einen Antrag richtig darzustellen
     */
    loadView(data) {
      this.app = data;
      if (this.checkRunning()) {
        this.save();
      } else {
        console.log("Do not save!");
      }
      this.title = this.app.name;
      this.kind = this.app.kind;
      this.currentTeacher = this.user.short;
      if (this.app.kind === 0) {
        this.klassen = this.app.school_event_details.classes;
        this.auswahl = this.klassen;
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
      if (this.app.kind === 1) {
        this.isLeader = true;
        this.start = this.app.start_time;
        this.end = this.app.end_time;
        this.wdata = this.app;
      }
      if (this.app.kind === 6) {
        this.isLeader = true;
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
     * Diese Methode schaut nach, ob in dem Antrag alle Begleitlehrer ihre Daten eingetragen haben, damit die Progression weiter geht.
     * @returns Einen Boolean Wert, welcher aussagt, ob alle Begleitlehrere Ihre Informationen angegeben haben.
     */
    checkProgression() {
      if (this.app.kind === 0) {
        if (this.app.progress === 1) {
          var allInput = true;
          for (
            let i = 0;
            i < this.app.school_event_details.teachers.length;
            i++
          ) {
            if (
              this.app.school_event_details.teachers[i].attendance_from !==
                "" &&
              this.app.school_event_details.teachers[i].attendance_from !==
                undefined &&
              this.app.school_event_details.teachers[i].attendance_from !== null
            ) {
              if (
                this.app.school_event_details.teachers[i].attendance_till !==
                  "" &&
                this.app.school_event_details.teachers[i].attendance_till !==
                  undefined &&
                this.app.school_event_details.teachers[i].attendance_till !==
                  null
              ) {
                if (
                  this.app.school_event_details.teachers[i].group === 1 ||
                  this.app.school_event_details.teachers[i].group === 2 ||
                  this.app.school_event_details.teachers[i].group === 3
                ) {
                  if (
                    this.app.school_event_details.teachers[i].start_address !==
                      "" &&
                    this.app.school_event_details.teachers[i].start_address !==
                      undefined &&
                    this.app.school_event_details.teachers[i].start_address !==
                      null
                  ) {
                    if (
                      this.app.school_event_details.teachers[i]
                        .meeting_point !== "" &&
                      this.app.school_event_details.teachers[i]
                        .meeting_point !== undefined &&
                      this.app.school_event_details.teachers[i]
                        .meeting_point !== null
                    ) {
                      if (
                        this.app.business_trip_applications[i].staffnr !== "" ||
                        this.app.business_trip_applications[i].staffnr !==
                          undefined ||
                        this.app.business_trip_applications[i].staffnr !== null
                      ) {
                        if (
                          this.app.business_trip_applications[i].travel_mode !==
                            "" ||
                          this.app.business_trip_applications[i].travel_mode !==
                            undefined ||
                          this.app.business_trip_applications[i].travel_mode !==
                            null
                        ) {
                          allInput = true;
                        } else {
                          return false;
                        }
                      } else {
                        return false;
                      }
                    } else {
                      return false;
                    }
                  } else {
                    return false;
                  }
                } else {
                  return false;
                }
              } else {
                return false;
              }
            } else {
              return false;
            }
          }
          if (allInput) {
            return true;
          }
        }
      }
    },
    /**
     * Diese Methode schaut, ob der Antrag läuft oder bereits beendet ist und setzt den Progress auf Läuft oder auf Kosten ausstehend.
     */
    checkRunning() {
      let current = new Date();
      current.setHours(current.getHours() + 1);
      if (this.app.kind === 0) {
        if (this.app.progress === 3) {
          if (
            new Date(this.app.start_time) <= current &&
            current <= new Date(this.app.end_time)
          ) {
            this.app.progress = 4;
            return true;
          }
        }
        if (this.app.progress === 4) {
          if (current >= new Date(this.app.end_time)) {
            this.app.progress = 5;
            return true;
          }
        }
      } else {
        if (this.app.progress === 2) {
          if (
            new Date(this.app.start_time) <= current &&
            current <= new Date(this.app.end_time)
          ) {
            this.app.progress = 3;
            return true;
          }
        }
        if (this.app.progress === 3) {
          if (current >= new Date(this.app.end_time)) {
            if (this.app.kind === 6) {
              if (
                this.app.other_reason_details.kind !== 7 &&
                this.app.other_reason_details.kind !== 9
              ) {
                this.app.progress = 4;
                return true;
              } else {
                this.app.progress = 6;
                return true;
              }
            }
          }
        }
      }
      return false;
    },
    /**
     * Diese Methode schaut nach, ob in dem Antrag alle Begleitlehrer ihre Reiserechnungen eingetragen haben, damit die Progression weiter geht.
     */
    checkInvoices() {
      if (this.app.kind === 0) {
        if (this.app.progress === 5) {
          for (let i = 0; i < this.app.travel_invoices.length; i++) {
            var allInputed = false;
            if (
              this.app.travel_invoices[i].daily_charges_mode === 0 ||
              this.app.travel_invoices[i].daily_charges_mode === 1 ||
              this.app.travel_invoices[i].daily_charges_mode === 2
            ) {
              if (this.app.travel_invoices[i].daily_charges_mode === 2) {
                if (
                  this.app.travel_invoices[i].shortened_amount === "" ||
                  isNaN(this.app.travel_invoices[i].shortened_amount) ||
                  this.app.travel_invoices[i].shortened_amount === undefined ||
                  this.app.travel_invoices[i].shortened_amount === null
                ) {
                  return false;
                }
              }
              if (
                this.app.travel_invoices[i].nightly_charges_mode === 0 ||
                this.app.travel_invoices[i].nightly_charges_mode === 1 ||
                this.app.travel_invoices[i].nightly_charges_mode === 2
              ) {
                if (
                  this.app.travel_invoices[i].breakfasts !== "" &&
                  this.app.travel_invoices[i].breakfasts !== undefined &&
                  this.app.travel_invoices[i].breakfasts !== null
                ) {
                  if (
                    this.app.travel_invoices[i].lunches !== "" &&
                    this.app.travel_invoices[i].lunches !== undefined &&
                    this.app.travel_invoices[i].lunches !== null
                  ) {
                    if (
                      this.app.travel_invoices[i].dinners !== "" &&
                      this.app.travel_invoices[i].dinners !== undefined &&
                      this.app.travel_invoices[i].dinners !== null
                    ) {
                      if (this.app.travel_invoices[i].kilometre_allowance) {
                        if (
                          this.app.travel_invoices[i].kilometre_amount === "" ||
                          this.app.travel_invoices[i].kilometre_amount ===
                            undefined ||
                          this.app.travel_invoices[i].kilometre_amount === null
                        ) {
                          return false;
                        }
                      }
                      if (
                        this.app.travel_invoices[i].calculation
                          .sum_travel_costs !== "" &&
                        this.app.travel_invoices[i].calculation
                          .sum_travel_costs !== undefined &&
                        this.app.travel_invoices[i].calculation
                          .sum_travel_costs !== null
                      ) {
                        if (
                          this.app.travel_invoices[i].calculation
                            .sum_daily_charges !== "" &&
                          this.app.travel_invoices[i].calculation
                            .sum_daily_charges !== undefined &&
                          this.app.travel_invoices[i].calculation
                            .sum_daily_charges !== null
                        ) {
                          if (
                            this.app.travel_invoices[i].calculation
                              .sum_nightly_charges !== "" &&
                            this.app.travel_invoices[i].calculation
                              .sum_nightly_charges !== undefined &&
                            this.app.travel_invoices[i].calculation
                              .sum_nightly_charges !== null
                          ) {
                            if (
                              this.app.travel_invoices[i].calculation
                                .sum_additional_costs !== "" &&
                              this.app.travel_invoices[i].calculation
                                .sum_additional_costs !== undefined &&
                              this.app.travel_invoices[i].calculation
                                .sum_additional_costs !== null
                            ) {
                              if (
                                this.app.travel_invoices[i].calculation
                                  .sum_of_sums !== "" &&
                                this.app.travel_invoices[i].calculation
                                  .sum_of_sums !== undefined &&
                                this.app.travel_invoices[i].calculation
                                  .sum_of_sums !== null
                              ) {
                                for (
                                  let j = 0;
                                  j <
                                  this.app.travel_invoices[i].calculation.rows
                                    .length;
                                  j++
                                ) {
                                  if (
                                    this.app.travel_invoices[i].calculation
                                      .rows[j].begin !== "" &&
                                    this.app.travel_invoices[i].calculation
                                      .rows[j].begin !== undefined &&
                                    this.app.travel_invoices[i].calculation
                                      .rows[j].begin !== null
                                  ) {
                                    if (
                                      this.app.travel_invoices[i].calculation
                                        .rows[j].end !== "" &&
                                      this.app.travel_invoices[i].calculation
                                        .rows[j].end !== undefined &&
                                      this.app.travel_invoices[i].calculation
                                        .rows[j].end !== null
                                    ) {
                                      allInputed = true;
                                    } else {
                                      return false;
                                    }
                                  } else {
                                    return false;
                                  }
                                }
                              } else {
                                return false;
                              }
                            } else {
                              return false;
                            }
                          } else {
                            return false;
                          }
                        } else {
                          return false;
                        }
                      } else {
                        return false;
                      }
                    } else {
                      return false;
                    }
                  } else {
                    return false;
                  }
                } else {
                  return false;
                }
              } else {
                return false;
              }
            } else {
              return false;
            }
          }
          if (allInputed) {
            return true;
          }
        }
      }
    },
    /**
     * Erstellt ein neues Datum, welches im richtigen Datenformat ist
     */
    createNewDate() {
      var tmp = new Date();
      tmp.setHours(tmp.getHours() + 2);
      var str = tmp.toISOString();
      str = str.split("T");
      var str2 = str[1].split(":");
      var str3 = str2[0];
      return (
        str[0] +
        "T" +
        str3 +
        ":" +
        str2[1] +
        ":" +
        str2[2].replace("Z", "") +
        "+01:00"
      );
    },
    /**
     * Diese Methode sendet die Rechnungen eines Benutzers an das Backend zu dem entsprechenden Antrag
     */
    sendReceipts(belege) {
      axios
        .post(
          this.url +
            "/saveBillingReceipt?uuid=" +
            this.app.uuid +
            "&short=" +
            this.user.short,
          belege,
          {
            headers: {
              Authorization: "Basic " + this.token
            }
          }
        )
        .then(response => {
          response.toString();
          this.belegeConfirm();
        })
        .catch(error => {
          switch (error.response.status) {
            case 401:
              axios
                .post(this.url + "/login/refresh", {
                  refresh_token: this.refresh_token
                })
                .then(resp => {
                  this.$emit(
                    "updateToken",
                    resp.data.access_token,
                    resp.data.refresh_token
                  );
                  axios
                    .post(
                      this.url +
                        "/saveBillingReceipt?uuid=" +
                        this.app.uuid +
                        "&short=" +
                        this.user.short,
                      belege,
                      {
                        headers: {
                          Authorization: "Basic " + resp.data.access_token
                        }
                      }
                    )
                    .then(res => {
                      res.toString();
                      this.belegeConfirm();
                    })
                    .catch(e => {
                      e.toString();
                      this.belegeFailed();
                    });
                })
                .catch(err => {
                  err.toString();
                  this.$emit("logout");
                });
              break;
            default:
              this.belegeFailed();
              break;
          }
        });
    },
    /**
     * Diese Methode sendet den veränderten Antrag an das Backend
     */
    save() {
      if (this.app.progress === 0) {
        this.app.progress = 1;
      }
      if (this.app.kind === 0) {
        if (this.belege.files.length >= 1) {
          this.sendReceipts(this.belege);
        }
      } else {
        if (this.app.kind === 1) {
          if (this.belege.files.length >= 1) {
            this.sendReceipts(this.belege);
          }
        } else {
          if (
            this.app.other_reason_details.kind !== 7 &&
            this.app.other_reason_details.kind !== 9
          ) {
            if (this.belege.files.length >= 1) {
              this.sendReceipts(this.belege);
            }
          }
        }
      }
      if (this.checkProgression()) {
        this.app.progress = 2;
      }
      if (this.checkInvoices()) {
        this.app.progress = 6;
      }
      this.app.last_changed = this.createNewDate();
      axios
        .put(this.url + "/updateApplication?uuid=" + this.app.uuid, this.app, {
          headers: {
            Authorization: "Basic " + this.token
          }
        })
        .then(response => {
          response.toString();
          this.saveConfirm();
        })
        .catch(error => {
          switch (error.response.status) {
            case 401:
              axios
                .post(this.url + "/login/refresh", {
                  refresh_token: this.refresh_token
                })
                .then(resp => {
                  this.$emit(
                    "updateToken",
                    resp.data.access_token,
                    resp.data.refresh_token
                  );
                  axios
                    .put(
                      this.url + "/updateApplication?uuid=" + this.app.uuid,
                      this.app,
                      {
                        headers: {
                          Authorization: "Basic " + resp.data.access_token
                        }
                      }
                    )
                    .then(res => {
                      res.toString();
                      this.saveConfirm();
                    })
                    .catch(e => {
                      e.toString();
                      this.failedConfirm();
                    });
                })
                .catch(err => {
                  err.toString();
                  this.$emit("logout");
                });
              break;
            default:
              this.failedConfirm();
              break;
          }
        });
    },
    /**
     * Diese Methode öffnet das Modal, in dem man den Antrag schließen kann
     */
    closeAntrag() {
      this.$refs["close-modal"].show();
    },
    /**
     * Diese Methode öffnet das Modal, in dem man den Antrag schließen kann
     */
    delAntrag() {
      this.$refs["del-modal"].show();
    },
    /**
     * Diese Methode öffnet das Modal, in dem man den die Klassen definieren kann
     */
    classForm() {
      this.$refs["class-modal"].show();
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
     * Diese Methode zeigt dem Benutzer an, dass der Antrag erfolgreich gespeichert worden ist
     */
    belegeConfirm() {
      this.$bvToast.toast("Die Belege wurden erfolgreich gespeichert!", {
        title: "Änderungen gespeichert",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "success"
      });
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass der Antrag erfolgreich gespeichert worden ist
     */
    belegeFailed() {
      this.$bvToast.toast("Die Belege wurden nicht gespeichert!", {
        title: "Änderungen nicht gespeichert",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass der Antrag erfolgreich gespeichert worden ist
     */
    failedConfirm() {
      this.$bvToast.toast("Es ist ein Fehler aufgetreten!", {
        title: "Änderungen wurden nicht gespeichert",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass der Antrag einen Fehler beim Laden hatte
     */
    failedLoad() {
      this.$bvToast.toast("Es ist ein Fehler aufgetreten!", {
        title: "Antrag konnte nicht geladen werden",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass der Antrag erfolgreich gespeichert worden ist
     */
    failedExcel() {
      this.$bvToast.toast("Es ist ein Fehler aufgetreten!", {
        title: "Das Formular konnte nicht heruntergeladen werden",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass der Antrag erfolgreich gespeichert worden ist
     */
    failedPDF() {
      this.$bvToast.toast("Es ist ein Fehler aufgetreten!", {
        title: "Die PDF konnte nicht geöffnet werden",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
    },
    /**
     * Diese Methode setzt je nach Art und Fortschritts des Antrags die Lese- und Schreibberechtigungen
     * @param app Der gesamte Antrag
     */
    setReads(app) {
      var progress = app.progress;
      if (app.kind === 0) {
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
              this.sgreadonly = true;
              this.sereadonly = false;
              this.tareadonly = false;
              this.tbreadonly = true;
              break;
            case 1:
              this.sgreadonly = true;
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
        }
      } else {
        if (app.kind === 1) {
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
        if (app.kind === 6) {
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
      if (app.kind === 0) {
        if (this.isLeader) {
          this.items = [
            {
              title: "Allgemeine Infos - Abwesenheitsformulare der Klassen",
              form: "SchoolEventDetails"
            },
            {
              title: "Abgeltung für pädagogische Betreuung",
              form: "Compensation"
            },
            {
              title: "Begleitformular - Abwesenheitsformular",
              form: "SchoolEventTeacherDetails"
            },
            {
              title: "Reiseformular",
              form: "BusinessTripApplication"
            }
          ];
          if (app.progress >= 5) {
            this.items.push({
              title: "Reiserechnung",
              form: "TravelInvoice"
            });
          }
        } else {
          this.items = [
            {
              title: "Allgemeine Infos - Abwesenheitsformulare der Klassen",
              form: "SchoolEventDetails"
            },
            {
              title: "Abgeltung für pädagogische Betreuung",
              form: "Compensation"
            },
            {
              title: "Begleitformular",
              form: "SchoolEventTeacherDetails - Abwesenheitsformular"
            },
            {
              title: "Reiseformular",
              form: "BusinessTripApplication"
            }
          ];
          if (app.progress >= 5) {
            this.items.push({
              title: "Reiserechnung",
              form: "TravelInvoice"
            });
          }
        }
      } else {
        if (app.kind === 1) {
          this.items = [
            {
              title: "Fortbildung - Abwesenheitsformular",
              form: "TrainingDetails"
            },
            {
              title: "Reiseformular",
              form: "BusinessTripApplication"
            }
          ];
          if (app.progress >= 4) {
            this.items.push({
              title: "Reiserechnung",
              form: "TravelInvoice"
            });
          }
        } else {
          if (
            app.other_reason_details.kind === 7 ||
            app.other_reason_details.kind === 9
          ) {
            this.items = [
              {
                title: "Sonstiger Antrag - Abwesenheitsformular",
                form: "OtherReasonDetails"
              }
            ];
          } else {
            this.items = [
              {
                title: "Sonstiger Antrag - Abwesenheitsformular",
                form: "OtherReasonDetails"
              },
              {
                title: "Reiseformular",
                form: "BusinessTripApplication"
              }
            ];
            if (app.progress >= 4) {
              this.items.push({
                title: "Reiserechnung",
                form: "TravelInvoice"
              });
            }
          }
        }
      }
    },
    /**
     * Code aus https://codepen.io/DanIgnatov/pen/RvbeeB
     * Diese Funktion downloaded das Excel-File beim Benutzer
     */
    excelDownload(excel) {
      var anchor_href =
        "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
        excel;
      var exportLinkElement = document.createElement("a");

      exportLinkElement.hidden = true;
      exportLinkElement.download = "Formular.xlsx";
      exportLinkElement.href = anchor_href;
      exportLinkElement.text = "downloading...";

      document.body.appendChild(exportLinkElement);
      exportLinkElement.click();
      exportLinkElement.remove();
    },
    /**
     * Lädt die PDF für die Klassen herunter
     */
    generallPDF() {
      this.classForm();
      axios
        .get(
          this.url + "/getAbsenceFormForClasses",
          {
            params: {
              uuid: this.app.uuid,
              classes: this.auswahl
            }
          },
          {
            headers: {
              Authorization: "Basic " + this.token
            }
          }
        )
        .then(response => {
          this.showPDF(response.data);
        })
        .catch(error => {
          switch (error.response.status) {
            case 401:
              axios
                .post(this.url + "/login/refresh", {
                  refresh_token: this.refresh_token
                })
                .then(resp => {
                  this.$emit(
                    "updateToken",
                    resp.data.access_token,
                    resp.data.refresh_token
                  );
                  axios
                    .get(
                      this.url + "/getAbsenceFormForClasses",
                      {
                        params: {
                          uuid: this.app.uuid,
                          classes: this.auswahl
                        }
                      },
                      {
                        headers: {
                          Authorization: "Basic " + resp.data.access_token
                        }
                      }
                    )
                    .then(res => {
                      this.showPDF(res.data);
                    })
                    .catch(e => {
                      e.toString();
                      this.failedPDF();
                    });
                })
                .catch(err => {
                  err.toString();
                  this.$emit("logout");
                });
              break;
            default:
              this.failedPDF();
              break;
          }
        });
    },
    /**
     * Diese Methode lädt das Excel-File von dem Backend und lädt diese dem Benutzer herunter
     */
    downloadExcel(item) {
      switch (item.form) {
        case "BusinessTripApplication":
          axios
            .get(
              this.url + "/getBusinessTripApplicationExcel",
              {
                params: {
                  uuid: this.app.uuid,
                  short: this.user.short,
                  bta_id: this.currentTeacherIndex
                }
              },
              {
                headers: {
                  Authorization: "Basic " + this.token
                }
              }
            )
            .then(response => {
              this.excelDownload(response.data);
            })
            .catch(error => {
              switch (error.response.status) {
                case 401:
                  axios
                    .post(this.url + "/login/refresh", {
                      refresh_token: this.refresh_token
                    })
                    .then(resp => {
                      this.$emit(
                        "updateToken",
                        resp.data.access_token,
                        resp.data.refresh_token
                      );
                      axios
                        .get(
                          this.url + "/getBusinessTripApplicationExcel",
                          {
                            params: {
                              uuid: this.app.uuid,
                              short: this.user.short,
                              bta_id: this.currentTeacherIndex
                            }
                          },
                          {
                            headers: {
                              Authorization: "Basic " + resp.data.access_token
                            }
                          }
                        )
                        .then(res => {
                          this.excelDownload(res.data);
                        })
                        .catch(e => {
                          e.toString();
                          this.failedExcel();
                        });
                    })
                    .catch(err => {
                      err.toString();
                      this.$emit("logout");
                    });
                  break;
                default:
                  this.failedExcel();
                  break;
              }
            });
          break;
        case "TravelInvoice":
          axios
            .get(
              this.url + "/getTravelInvoiceExcel",
              {
                params: {
                  uuid: this.app.uuid,
                  short: this.user.short,
                  ti_id: this.currentTeacherIndex
                }
              },
              {
                headers: {
                  Authorization: "Basic " + this.token
                }
              }
            )
            .then(response => {
              this.excelDownload(response.data);
            })
            .catch(error => {
              switch (error.response.status) {
                case 401:
                  axios
                    .post(this.url + "/login/refresh", {
                      refresh_token: this.refresh_token
                    })
                    .then(resp => {
                      this.$emit(
                        "updateToken",
                        resp.data.access_token,
                        resp.data.refresh_token
                      );
                      axios
                        .get(
                          this.url + "/getTravelInvoiceExcel",
                          {
                            params: {
                              uuid: this.app.uuid,
                              short: this.user.short,
                              ti_id: this.currentTeacherIndex
                            }
                          },
                          {
                            headers: {
                              Authorization: "Basic " + resp.data.access_token
                            }
                          }
                        )
                        .then(res => {
                          this.excelDownload(res.data);
                        })
                        .catch(e => {
                          e.toString();
                          this.failedExcel();
                        });
                    })
                    .catch(err => {
                      err.toString();
                      this.$emit("logout");
                    });
                  break;
                default:
                  this.failedExcel();
                  break;
              }
            });

          break;
        default:
          this.failedExcel();
          break;
      }
    },
    /**
     * Diese Methode lädt das Abwesenheitsformular des Lehers aus dem Backend und öffnet es
     */
    applicationPDF() {
      axios
        .get(
          this.url + "/getAbsenceFormForTeacher",
          {
            params: {
              uuid: this.app.uuid
            }
          },
          {
            headers: {
              Authorization: "Basic " + this.token
            }
          }
        )
        .then(response => {
          this.showPDF(response.data);
        })
        .catch(error => {
          switch (error.response.status) {
            case 401:
              axios
                .post(this.url + "/login/refresh", {
                  refresh_token: this.refresh_token
                })
                .then(resp => {
                  this.$emit(
                    "updateToken",
                    resp.data.access_token,
                    resp.data.refresh_token
                  );
                  axios
                    .get(
                      this.url + "/getAbsenceFormForTeacher",
                      {
                        params: {
                          uuid: this.app.uuid
                        }
                      },
                      {
                        headers: {
                          Authorization: "Basic " + resp.data.access_token
                        }
                      }
                    )
                    .then(res => {
                      this.showPDF(res.data);
                    })
                    .catch(e => {
                      e.toString();
                      this.failedPDF();
                    });
                })
                .catch(err => {
                  err.toString();
                  this.$emit("logout");
                });
              break;
            default:
              this.failedPDF();
              break;
          }
        });
    },
    /**
     * Diese Methode lädt die Abgeltung für Lehrer herunter und zeigt diese an
     */
    openAbgeltung() {
      axios
        .get(
          this.url + "/getCompensationForEducationalSupportForm",
          {
            params: {
              uuid: this.app.uuid
            }
          },
          {
            headers: {
              Authorization: "Basic " + this.token
            }
          }
        )
        .then(response => {
          this.showPDF(response.data);
        })
        .catch(error => {
          switch (error.response.status) {
            case 401:
              axios
                .post(this.url + "/login/refresh", {
                  refresh_token: this.refresh_token
                })
                .then(resp => {
                  this.$emit(
                    "updateToken",
                    resp.data.access_token,
                    resp.data.refresh_token
                  );
                  axios
                    .get(
                      this.url + "/getCompensationForEducationalSupportForm",
                      {
                        params: {
                          uuid: this.app.uuid
                        }
                      },
                      {
                        headers: {
                          Authorization: "Basic " + resp.data.access_token
                        }
                      }
                    )
                    .then(res => {
                      this.showPDF(res.data);
                    })
                    .catch(e => {
                      e.toString();
                      this.failedPDF();
                    });
                })
                .catch(err => {
                  err.toString();
                  this.$emit("logout");
                });
              break;
            default:
              this.failedPDF();
              break;
          }
        });
    },
    /**
     * Diese Methode lädt die PDF von dem Backend
     */
    openPDF(item) {
      switch (item.form) {
        case "SchoolEventDetails":
          this.classForm();
          break;
        case "SchoolEventTeacherDetails":
          this.applicationPDF();
          break;
        case "TrainingDetails":
          this.applicationPDF();
          break;
        case "OtherReasonDetails":
          this.applicationPDF();
          break;
        case "BusinessTripApplication":
          axios
            .get(
              this.url + "/getBusinessTripApplicationForm",
              {
                params: {
                  uuid: this.app.uuid,
                  short: this.user.short,
                  bta_id: this.currentTeacherIndex
                }
              },
              {
                headers: {
                  Authorization: "Basic " + this.token
                }
              }
            )
            .then(response => {
              this.showPDF(response.data);
            })
            .catch(error => {
              switch (error.response.status) {
                case 401:
                  axios
                    .post(this.url + "/login/refresh", {
                      refresh_token: this.refresh_token
                    })
                    .then(resp => {
                      this.$emit(
                        "updateToken",
                        resp.data.access_token,
                        resp.data.refresh_token
                      );
                      axios
                        .get(
                          this.url + "/getBusinessTripApplicationForm",
                          {
                            params: {
                              uuid: this.app.uuid,
                              short: this.user.short,
                              bta_id: this.currentTeacherIndex
                            }
                          },
                          {
                            headers: {
                              Authorization: "Basic " + resp.data.access_token
                            }
                          }
                        )
                        .then(res => {
                          this.showPDF(res.data);
                        })
                        .catch(e => {
                          e.toString();
                          this.failedPDF();
                        });
                    })
                    .catch(err => {
                      err.toString();
                      this.$emit("logout");
                    });
                  break;
                default:
                  this.failedPDF();
                  break;
              }
            });
          break;
        case "TravelInvoice":
          axios
            .get(
              this.url + "/getTravelInvoiceForm",
              {
                params: {
                  uuid: this.app.uuid,
                  short: this.user.short,
                  ti_id: this.currentTeacherIndex
                }
              },
              {
                headers: {
                  Authorization: "Basic " + this.token
                }
              }
            )
            .then(response => {
              this.showPDF(response.data);
            })
            .catch(error => {
              switch (error.response.status) {
                case 401:
                  axios
                    .post(this.url + "/login/refresh", {
                      refresh_token: this.refresh_token
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
                            .get(
                              this.url + "/getTravelInvoiceForm",
                              {
                                params: {
                                  uuid: this.app.uuid,
                                  short: this.user.short,
                                  ti_id: this.currentTeacherIndex
                                }
                              },
                              {
                                headers: {
                                  Authorization:
                                    "Basic " + resp.data.access_token
                                }
                              }
                            )
                            .then(res => {
                              this.showPDF(res.data);
                            })
                            .catch(e => {
                              e.toString();
                              this.failedPDF();
                            });
                          break;
                      }
                    })
                    .catch(err => {
                      err.toString();
                      this.$emit("logout");
                    });
                  break;
                default:
                  this.failedPDF();
                  break;
              }
            });
          break;
        default:
          this.failedPDF();
          break;
      }
    },
    /**
     * Diese Methode versteckt das Info-Modal
     */
    hideClose() {
      this.$refs["close-modal"].hide();
    },
    /**
     * Diese Methode versteckt das Delete-Modal
     */
    hideDel() {
      this.$refs["del-modal"].hide();
    },
    /**
     * Diese Methode versteckt das Klassen-Modal
     */
    hideClass() {
      this.$refs["class-modal"].hide();
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
     * Diese Methode leert das Info-Modal
     */
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    /**
     * Diese Methode leert das Delete-Modal
     */
    resetDelModal() {
      this.delModal.title = "";
      this.delModal.content = "";
    },
    /**
     * Diese Methode leert das Klassen-Modal
     */
    resetClassModal() {
      this.classModal.title = "";
      this.classModal.content = "";
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
     * Diese Methode zeigt dem Benutzer, dass der Antrag gelöscht worden ist
     */
    deleteConfirmed() {
      this.$bvToast.toast("Der Antrag wurde erfolgreich gelöscht!", {
        title: "Antrag geschlossen",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "success"
      });
    },
    /**
     * Diese Methode zeigt dem Benutzer, dass der Antrag nicht gelöscht worden ist
     */
    deleteFailed() {
      this.$bvToast.toast("Der Antrag wurde nicht gelöscht!", {
        title: "Ein Fehler ist aufgetreten",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
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
     * Diese Methode löscht den Antrag
     */
    delAn() {
      axios
        .delete(this.url + "/deleteApplication?uuid=" + this.app.uuid, {
          headers: {
            Authorization: "Basic " + this.token
          }
        })
        .then(response => {
          response.toString();
          this.deleteConfirmed();
          this.changeComponent("Index");
        })
        .catch(error => {
          switch (error.response.status) {
            case 401:
              axios
                .post(this.url + "/login/refresh", {
                  refresh_token: this.refresh_token
                })
                .then(resp => {
                  this.$emit(
                    "updateToken",
                    resp.data.access_token,
                    resp.data.refresh_token
                  );
                  axios
                    .delete(
                      this.url + "/deleteApplication?uuid=" + this.app.uuid,
                      {
                        headers: {
                          Authorization: "Basic " + resp.data.access_token
                        }
                      }
                    )
                    .then(res => {
                      res.toString();
                      this.deleteConfirmed();
                      this.changeComponent("Index");
                    })
                    .catch(e => {
                      e.toString();
                      this.deleteFailed();
                    });
                })
                .catch(err => {
                  err.toString();
                  this.$emit("logout");
                });
              break;
            default:
              this.deleteFailed();
              break;
          }
        });
    },
    /**
     * Diese Methode schließt den geöffneten Antrag
     */
    closeAn() {
      if (this.app.kind === 0) {
        this.app.progress = 7;
      } else {
        this.app.progress = 6;
      }
      this.save();
      this.hideClose();
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
    },
    /**
     * Diese methode sendet ein Signal an die Eltern-Componente
     */
    updateToken(access, refresh) {
      this.$emit("updateToken", access, refresh);
    },
    /**
     * Diese Methode sendet das Signal zum ausloggen an den Manager
     */
    logout() {
      this.$emit("logout");
    },
    /**
     * Gibt zurück, ob der Antrag abgeschlossen ist
     */
    isFinished() {
      if (this.app.kind === 0) {
        if (this.app.progress === 7) {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.app.progress === 6) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
};
</script>
