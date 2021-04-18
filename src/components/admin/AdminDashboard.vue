<!-- Admin Dashboard Template -->
<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row align-v="center" align-h="center">
      <b-col cols="12" md="6">
        <h1 id="new-application-heading">Alle Anträge</h1>
      </b-col>
      <div class="col-12 col-md-6">
        <!-- Logout Button -->
        <b-button
          variant="outline-danger"
          class="float-right"
          v-on:click="logout"
        >
          Abmelden
        </b-button>
        <!-- Ansicht wechseln Button -->
        <b-button
          variant="outline-primary"
          class="float-right"
          v-on:click="normal"
          style="margin-right:20px"
          v-if="!(user.pek || user.administration)"
        >
          Normale Ansicht
        </b-button>
        <!-- Rechte verwalten Button -->
        <b-button
          variant="outline-primary"
          class="float-right"
          v-on:click="rights"
          style="margin-right:20px"
          v-if="user.admin"
        >
          Rechte Verwalten
        </b-button>
      </div>
    </b-row>

    <!-- Such Element -->
    <b-row align-h="center" style="margin-top: 1rem; margin-bottom: 2rem">
      <b-col cols="12" md="6">
        <b-form-group
          label="Filter"
          label-for="filter-input"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder="Begriff suchen"
            ></b-form-input>

            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''"
                >Löschen</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
    <!-- Tabelle auswählen Button -->
    <b-button size="sm" @click="selectAllRows" style="margin-right:1rem"
      >Alle auswählen</b-button
    >
    <!-- Tabellenauswahl aufheben Button -->
    <b-button size="sm" @click="clearSelected" style="margin-right:1rem"
      >Auswahl aufheben</b-button
    >
    <!-- Drucken Button -->
    <b-button size="sm" @click="printSelected">Auswahl drucken</b-button>
    <!-- Tabelle, die die Anträge der Lehrer anzeigt -->
    <b-table
      striped
      :select-mode="selectMode"
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
      ref="selectableTable"
      @filtered="onFiltered"
      selectable
      @row-selected="onRowSelected"
    >
      <!-- Auswahl Spalte -->
      <template #cell(selected)="{ rowSelected }">
        <template v-if="rowSelected">
          <span aria-hidden="true">&check;</span>
          <span class="sr-only">Selected</span>
        </template>
        <template v-else>
          <span aria-hidden="true">&nbsp;</span>
          <span class="sr-only">Not selected</span>
        </template>
      </template>

      <!-- Antragsart Spalte -->
      <template #cell(kind)="data">
        <b-badge :variant="getKindVariant(data.item.kind)">{{
          loadKind(data.item.kind)
        }}</b-badge>
      </template>
      <!-- Funktionsspalte zum betrachten des Antrags -->
      <template #cell(actions)="row">
        <b-button size="sm" @click="info(row.item)">
          Antrag betrachten
        </b-button>
      </template>
      <!-- Antragsstatus Spalte -->
      <template #cell(stat)="data">
        <b-badge :variant="getStateVariant(data.item.stat)">{{
          data.item.stat.toUpperCase()
        }}</b-badge>
      </template>
      <!-- Antragssteller Spalte -->
      <template #cell(from)="data">
        <b-badge variant="secondary">{{ data.item.from }}</b-badge>
      </template>
      <!-- Ausklappbare Detailansicht -->
      <template #row-details="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">
              {{ key }}: {{ value }}
            </li>
          </ul>
        </b-card>
      </template>
    </b-table>

    <!-- Info Modal -->
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
export default {
  props: ["url", "user", "token", "refresh_token"],
  data() {
    return {
      selectMode: "multi",
      selected: [],
      items: [],
      fields: [
        { key: "selected", label: "Ausgewählt" },
        { key: "title", label: "Titel", sortable: true, sortDirection: "desc" },
        { key: "kind", label: "Art", sortable: true, sortDirection: "desc" },
        {
          key: "edat",
          label: "Einreich Datum",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "start",
          label: "Beginn",
          sortable: true,
          sortDirection: "desc"
        },
        { key: "stat", label: "Status", sortable: true },
        {
          key: "from",
          label: "Antragsteller",
          sortable: true
        },
        { key: "actions", label: "Aktionen" }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 1000,
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: ""
      }
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
  },
  methods: {
    /**
     * Diese Methode gibt die Art des Antrags zurück
     * @param kind Integer Wert der Art des Antrags
     * @returns String der Art des Antrags
     */
    loadKind(kind) {
      switch (kind) {
        case 0:
          return "Schulveranstaltung";
        case 1:
          return "Fortbildung";
        case 2:
          return "Seminar";
        case 3:
          return "Tagung";
        case 4:
          return "Lehrgang";
        case 5:
          return "Sonstiges";
        case 6:
          return "Sonstiger Antrag";
        case 7:
          return "Pflegefreistellung";
        case 8:
          return "Dienstauftrag";
        case 9:
          return "Arzttermin";
        case 10:
          return "Sonstiges";
        default:
          return "Fehler!";
      }
    },
    /**
     * Diese Methode setzt den Status der Anträge in Textform um
     * @param kind Die Art des Antrags
     * @param progress Der Fortschritt des Antrags
     * @returns String-Form des Fortschritts
     */
    loadStatus(kind, progress) {
      if (kind === 0) {
        switch (progress) {
          case 0:
            return "Abgelehnt";
          case 1:
            return "Einreichung";
          case 2:
            return "Akzeptierungsphase";
          case 3:
            return "Bestätigt";
          case 4:
            return "Läuft...";
          case 5:
            return "Kosten ausstehend";
          case 6:
            return "Rechnungsphase";
          case 7:
            return "Abgeschlossen";
          default:
            return "Abgelehnt";
        }
      } else {
        switch (progress) {
          case 0:
            return "Abgelehnt";
          case 1:
            return "Akzeptierungsphase";
          case 2:
            return "Bestätigt";
          case 3:
            return "Läuft...";
          case 4:
            return "Kosten ausstehend";
          case 5:
            return "Rechnungsphase";
          case 6:
            return "Abgeschlossen";
          default:
            return "Abgelehnt";
        }
      }
    },
    loadView(applications) {
      var apps = applications;
      for (let i = 0; i < apps.length; i++) {
        apps[i].title = apps[i].name;
        apps[i].stat = this.loadStatus(apps[i].kind, apps[i].progress);
        apps[i].edat = this.formatDate(
          apps[i].business_trip_applications[0].date_application_filed
        );
        apps[i].start = this.formatDate(apps[i].start_time);
        apps[i].from = apps[i].staffnr;
        if (this.user.pek) {
          if (apps[i].kind === 0) {
            if (apps[i].progress !== 6) {
              apps.splice(i, 1);
            }
          } else {
            if (apps[i].progress !== 5) {
              apps.splice(i, 1);
            }
          }
        }
        if (this.user.av || this.user.administration) {
          if (apps[i].kind === 0) {
            if (apps[i].progress !== 2) {
              apps.splice(i, 1);
            }
          } else {
            if (apps[i].progress !== 1) {
              apps.splice(i, 1);
            }
          }
        }
      }
      this.items = apps;
      // Set the initial number of items
      this.totalRows = this.items.length;
    },
    /**
     * TODO Testdaten
     * Diese Methode lädt die Daten aus dem Backend für das AdminDashboard und fügt die notwendigen Variablen hinzu
     */
    loadData() {
      axios
        .get(this.url + "/getAdminApplications", {
          headers: {
            Authorization: "Basic " + this.token
          }
        })
        .then(response => {
          switch (response.status) {
            case 200:
              this.loadView(response.data);
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
                        .get(this.url + "/getAdminApplications", {
                          headers: {
                            Authorization: "Basic " + this.token
                          }
                        })
                        .then(res => {
                          switch (res.status) {
                            case 200:
                              this.loadView(res.data);
                              break;
                            default:
                              this.failedLoad();
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
              this.failedLoad();
              break;
          }
        });
      // Test data:
      var apps = [
        {
          uuid: "3ae8ec07-1ef5-4e13-ace9-c3e9ea3d3b51",
          name: "Sommersportwoche",
          kind: 0,
          miscellaneous_reason: "",
          progress: 1,
          start_time: "2021-04-12T17:54:40.035095+01:00",
          end_time: "2021-04-19T17:54:40.035095+01:00",
          notes: "Sommersportwoche ist cool",
          start_address: "Wexstraße 19-23, 1200 Wien",
          destination_address: "Karl-Hönck-Heim-Straße 1, 1234 Hönckheimsdorf",
          last_changed: "2021-03-01T17:54:40.035096+01:00",
          school_event_details: {
            classes: ["5BHIT"],
            amount_male_students: 22,
            amount_female_students: 1,
            duration_in_days: 3,
            teachers: [
              {
                name: "Stefan Zakall",
                shortname: "szakall",
                attendance_from: "2021-04-12T17:54:40.035095+01:00",
                attendance_till: "2021-04-19T17:54:40.035095+01:00",
                group: 2,
                start_address: "Wexstraße 19-23, 1200 Wien",
                meeting_point: "Wexstraße 19-23, 1200 Wien",
                role: 0
              },
              {
                name: "Dominik Dolezal",
                shortname: "ddolezal",
                attendance_from: "2021-04-12T17:54:40.035095+01:00",
                attendance_till: "2021-04-19T17:54:40.035095+01:00",
                group: 1,
                start_address: "Wexstraße 19-23, 1200 Wien",
                meeting_point: "Wexstraße 19-23, 1200 Wien",
                role: 1
              }
            ]
          },
          training_details: {
            kind: 8,
            miscellaneous_reason: "Fortbildung im Privatem",
            ph: 12,
            organizer: "PRIA"
          },
          other_reason_details: {
            kind: 2,
            service_mandate_title: "Stellung",
            service_mandate_gz: 1234,
            miscellaneous_reason: "Ist nicht so wichtig"
          },
          business_trip_applications: [
            {
              id: 0,
              surname: "Zakall",
              name: "Stefan",
              degree: "B. Sc.",
              title: "Prof.",
              staffnr: 12345,
              trip_begin_time: "2021-04-12T17:54:40.035095+01:00",
              trip_end_time: "2021-04-19T17:54:40.035095+01:00",
              service_begin_time: "2021-04-12T17:54:40.035095+01:00",
              service_end_time: "2021-04-19T17:54:40.035095+01:00",
              trip_goal: "Karl-Hönck-Heim-Straße 1, 1234 Hönckheimsdorf",
              travel_purpose: "Aus Gesundheitsgründen",
              travel_mode: 2,
              starting_point: 0,
              end_point: 0,
              reasoning: "Weil es näher ist",
              other_participants: ["ddolezal"],
              bonus_mile_confirmation_1: true,
              bonus_mile_confirmation_2: true,
              travel_costs_paid_by_someone: false,
              staying_costs_paid_by_someone: false,
              paid_by_whom: "",
              other_costs: 10,
              estimated_costs: 20,
              date_application_filed: "2021-01-01T17:54:40.035095+01:00",
              date_application_approved: "2021-02-01T17:54:40.035095+01:00",
              referee: "",
              business_card_emitted_outward: false,
              business_card_emitted_return: false
            },
            {
              id: 1,
              surname: "Dolezal",
              name: "Dominik",
              degree: "B. Sc.",
              title: "Prof.",
              staffnr: 1234,
              trip_begin_time: "2021-04-12T17:54:40.035095+01:00",
              trip_end_time: "2021-04-19T17:54:40.035095+01:00",
              service_begin_time: "2021-04-12T17:54:40.035095+01:00",
              service_end_time: "2021-04-19T17:54:40.035095+01:00",
              trip_goal: "Karl-Hönck-Heim-Straße 1, 1234 Hönckheimsdorf",
              travel_purpose: "Aus Gründen, die ich nicht nennen möchte",
              travel_mode: 0,
              starting_point: 0,
              end_point: 0,
              reasoning: "Weil es am nähesten ist von allem",
              other_participants: ["szakall"],
              bonus_mile_confirmation_1: true,
              bonus_mile_confirmation_2: true,
              travel_costs_paid_by_someone: true,
              staying_costs_paid_by_someone: false,
              paid_by_whom: "Firma",
              other_costs: 30,
              estimated_costs: 40,
              date_application_filed: "2021-01-01T17:54:40.035095+01:00",
              date_application_approved: "2021-02-01T17:54:40.035095+01:00",
              referee: "",
              business_card_emitted_outward: false,
              business_card_emitted_return: false
            }
          ],
          travel_invoices: [
            {
              id: 0,
              surname: "Zakall",
              name: "Stefan",
              degree: "B. Sc.",
              title: "Prof.",
              trip_begin_time: "2021-04-12T17:54:40.035095+01:00",
              trip_end_time: "2021-04-19T17:54:40.035095+01:00",
              staffnr: 12345,
              starting_point: "Wexstraße 19-23, 1200 Wien",
              end_point: "Karl-Hönck-Heim-Straße 1, 1234 Hönckheimsdorf",
              filing_date: "2021-01-01T17:54:40.035095+01:00",
              daily_charges_mode: 2,
              shortened_amount: 100,
              nightly_charges_mode: 1,
              breakfasts: 4,
              lunches: 3,
              dinners: 2,
              official_business_card_got: true,
              travel_grant: true,
              travel_costs_pre_grant: 500,
              replacement_for_advantage_card: true,
              replacement_for_train_card_class_2: true,
              kilometre_allowance: true,
              kilometre_amount: 18,
              nr_and_indications_of_participants: true,
              travel_costs_cited: true,
              no_travel_costs: true,
              calculation: {
                id: 0,
                sum_travel_costs: 18,
                sum_daily_charges: 18,
                sum_nightly_charges: 18,
                sum_additional_costs: 18,
                sum_of_sums: 72,
                rows: [
                  {
                    id: 0,
                    kind_of_costs: [1, 2, 3],
                    date: "2021-04-12T17:54:40.035095+01:00",
                    begin: "2021-04-12T07:00:00.035095+01:00",
                    end: "2021-04-12T17:00:00.035095+01:00",
                    kilometres: 5,
                    travel_costs: 0,
                    daily_charges: 5,
                    nightly_charges: 5,
                    additional_costs: 5,
                    sum: 15
                  },
                  {
                    id: 1,
                    kind_of_costs: [1, 2, 3],
                    date: "2021-04-13T17:54:40.035095+01:00",
                    begin: "2021-04-13T07:00:00.035095+01:00",
                    end: "2021-04-13T17:00:00.035095+01:00",
                    kilometres: 6,
                    travel_costs: 0,
                    daily_charges: 6,
                    nightly_charges: 6,
                    additional_costs: 6,
                    sum: 18
                  },
                  {
                    id: 2,
                    kind_of_costs: [0, 1, 3],
                    date: "2021-04-14T07:00:00.035095+01:00",
                    begin: "2021-04-14T07:00:00.035095+01:00",
                    end: "2021-04-14T17:00:00.035095+01:00",
                    kilometres: 7,
                    travel_costs: 7,
                    daily_charges: 7,
                    nightly_charges: 0,
                    additional_costs: 7,
                    sum: 21
                  },
                  {
                    id: 3,
                    kind_of_costs: [0, 2, 3],
                    date: "2021-04-15T07:00:00.035095+01:00",
                    begin: "2021-04-15T07:00:00.035095+01:00",
                    end: "2021-04-15T17:00:00.035095+01:00",
                    kilometres: 8,
                    travel_costs: 8,
                    daily_charges: 0,
                    nightly_charges: 8,
                    additional_costs: 8,
                    sum: 24
                  },
                  {
                    id: 4,
                    kind_of_costs: [0, 3],
                    date: "2021-04-16T07:00:00.035095+01:00",
                    begin: "2021-04-16T07:00:00.035095+01:00",
                    end: "2021-04-16T17:00:00.035095+01:00",
                    kilometres: 9,
                    travel_costs: 9,
                    daily_charges: 0,
                    nightly_charges: 0,
                    additional_costs: 9,
                    sum: 18
                  },
                  {
                    id: 5,
                    kind_of_costs: [3],
                    date: "2021-04-17T07:00:00.035095+01:00",
                    begin: "2021-04-17T07:00:00.035095+01:00",
                    end: "2021-04-17T17:00:00.035095+01:00",
                    kilometres: 10,
                    travel_costs: 0,
                    daily_charges: 0,
                    nightly_charges: 0,
                    additional_costs: 10,
                    sum: 10
                  },
                  {
                    id: 6,
                    kind_of_costs: [2, 3],
                    date: "2021-04-18T07:00:00.035095+01:00",
                    begin: "2021-04-18T07:00:00.035095+01:00",
                    end: "2021-04-18T17:00:00.035095+01:00",
                    kilometres: 11,
                    travel_costs: 0,
                    daily_charges: 0,
                    nightly_charges: 11,
                    additional_costs: 11,
                    sum: 22
                  },
                  {
                    id: 7,
                    kind_of_costs: [],
                    date: "2021-04-19T07:00:00.035095+01:00",
                    begin: "2021-04-19T07:00:00.035095+01:00",
                    end: "2021-04-19T17:00:00.035095+01:00",
                    kilometres: 10,
                    travel_costs: 0,
                    daily_charges: 0,
                    nightly_charges: 0,
                    additional_costs: 0,
                    sum: 0
                  }
                ]
              }
            },
            {
              id: 1,
              surname: "Dolezal",
              name: "Dominik",
              degree: "B. Sc.",
              title: "Prof.",
              trip_begin_time: "2021-03-01T17:54:40.035095+01:00",
              trip_end_time: "2021-03-03T17:54:40.035095+01:00",
              staffnr: 1234,
              starting_point: "Wexstraße 19-23, 1200 Wien",
              end_point: "Karl-Hönck-Heim-Straße 1, 1234 Hönckheimsdorf",
              filing_date: "2021-01-01T17:54:40.035095+01:00",
              daily_charges_mode: 2,
              shortened_amount: 250,
              nightly_charges_mode: 1,
              breakfasts: 3,
              lunches: 4,
              dinners: 2,
              official_business_card_got: true,
              travel_grant: true,
              travel_costs_pre_grant: 200,
              replacement_for_advantage_card: true,
              replacement_for_train_card_class_2: true,
              kilometre_allowance: true,
              kilometre_amount: 18,
              nr_and_indications_of_participants: true,
              travel_costs_cited: true,
              no_travel_costs: false,
              calculation: {
                id: 0,
                sum_travel_costs: 15,
                sum_daily_charges: 15,
                sum_nightly_charges: 15,
                sum_additional_costs: 15,
                sum_of_sums: 60,
                rows: [
                  {
                    id: 0,
                    kind_of_costs: [1, 2, 3],
                    date: "2021-04-12T17:54:40.035095+01:00",
                    begin: "2021-04-12T07:00:00.035095+01:00",
                    end: "2021-04-12T17:00:00.035095+01:00",
                    kilometres: 5,
                    travel_costs: 0,
                    daily_charges: 5,
                    nightly_charges: 5,
                    additional_costs: 5,
                    sum: 15
                  },
                  {
                    id: 1,
                    kind_of_costs: [1, 2, 3],
                    date: "2021-04-13T17:54:40.035095+01:00",
                    begin: "2021-04-13T07:00:00.035095+01:00",
                    end: "2021-04-13T17:00:00.035095+01:00",
                    kilometres: 6,
                    travel_costs: 0,
                    daily_charges: 6,
                    nightly_charges: 6,
                    additional_costs: 6,
                    sum: 18
                  },
                  {
                    id: 2,
                    kind_of_costs: [0, 1, 3],
                    date: "2021-04-14T07:00:00.035095+01:00",
                    begin: "2021-04-14T07:00:00.035095+01:00",
                    end: "2021-04-14T17:00:00.035095+01:00",
                    kilometres: 7,
                    travel_costs: 7,
                    daily_charges: 7,
                    nightly_charges: 0,
                    additional_costs: 7,
                    sum: 21
                  },
                  {
                    id: 3,
                    kind_of_costs: [0, 2, 3],
                    date: "2021-04-15T07:00:00.035095+01:00",
                    begin: "2021-04-15T07:00:00.035095+01:00",
                    end: "2021-04-15T17:00:00.035095+01:00",
                    kilometres: 8,
                    travel_costs: 8,
                    daily_charges: 0,
                    nightly_charges: 8,
                    additional_costs: 8,
                    sum: 24
                  },
                  {
                    id: 4,
                    kind_of_costs: [0, 3],
                    date: "2021-04-16T07:00:00.035095+01:00",
                    begin: "2021-04-16T07:00:00.035095+01:00",
                    end: "2021-04-16T17:00:00.035095+01:00",
                    kilometres: 9,
                    travel_costs: 9,
                    daily_charges: 0,
                    nightly_charges: 0,
                    additional_costs: 9,
                    sum: 18
                  },
                  {
                    id: 5,
                    kind_of_costs: [3],
                    date: "2021-04-17T07:00:00.035095+01:00",
                    begin: "2021-04-17T07:00:00.035095+01:00",
                    end: "2021-04-17T17:00:00.035095+01:00",
                    kilometres: 10,
                    travel_costs: 0,
                    daily_charges: 0,
                    nightly_charges: 0,
                    additional_costs: 10,
                    sum: 10
                  },
                  {
                    id: 6,
                    kind_of_costs: [2, 3],
                    date: "2021-04-18T07:00:00.035095+01:00",
                    begin: "2021-04-18T07:00:00.035095+01:00",
                    end: "2021-04-18T17:00:00.035095+01:00",
                    kilometres: 11,
                    travel_costs: 0,
                    daily_charges: 0,
                    nightly_charges: 11,
                    additional_costs: 11,
                    sum: 22
                  },
                  {
                    id: 7,
                    kind_of_costs: [],
                    date: "2021-04-19T07:00:00.035095+01:00",
                    begin: "2021-04-19T07:00:00.035095+01:00",
                    end: "2021-04-19T17:00:00.035095+01:00",
                    kilometres: 10,
                    travel_costs: 0,
                    daily_charges: 0,
                    nightly_charges: 0,
                    additional_costs: 0,
                    sum: 0
                  }
                ]
              }
            }
          ]
        }
      ];
      this.loadView(apps);
    },
    /**
     * Diese Methode sorgt dafür, dass die richtige ID an die viewApplication-Methode weitergegeben wird
     */
    info(item) {
      this.viewApplication(item.uuid);
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass der Antrag einen Fehler beim Laden hatte
     */
    failedLoad() {
      this.$bvToast.toast("Es ist ein Fehler aufgetreten!", {
        title: "Anträge konnten nicht geladen werden",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
    },
    /**
     * Diese Methode formatiert das Datum um korrekt angezeigt zu werden
     * @param datum Das Datum
     * @returns Das Datum in einfacher Form
     */
    formatDate(datum) {
      let date = new Date(datum);
      return (
        date.getFullYear() +
        "-" +
        date.getUTCMonth() +
        1 +
        "-" +
        date.getUTCDate()
      );
    },
    /**
     * TODO
     * Diese Methode gibt die "Farbe" der verschiedenen Phasen zurück
     * @param status Die Phase eines Antrags
     * @returns Die Farbe, welche zur Phase des Antrags passt
     */
    getStateVariant(status) {
      //TODO: Weitere States hinzufügen
      switch (status.toLowerCase()) {
        case "akzeptierungsphase":
          return "secondary";
        case "rechnungsphase":
          return "success";
        case "abgelehnt":
          return "danger";
        default:
          return "primary";
      }
    },
    /**
     * TODO
     * Diese Methode gibt die "Farbe" der verschiedenen Arten von Anträgen zurück
     * @param kind Die Art eines Antrags
     * @returns Die Farbe, welche zur Art des Antrags passt
     */
    getKindVariant(kind) {
      switch (kind) {
        case 0:
          return "secondary";
        case 1:
          return "info";
        case 2:
          return "info";
        case 3:
          return "info";
        case 4:
          return "info";
        case 5:
          return "info";
        case 6:
          return "success";
        case 7:
          return "success";
        case 8:
          return "success";
        case 9:
          return "success";
        case 10:
          return "success";
        default:
          return "primary";
      }
    },
    /**
     * Diese Methode leitet den Benutzer auf den Antrag-Viewer weiter
     * @param app Der Antrag, welcher dem Benutzer angezeigt werden soll
     */
    viewApplication(app) {
      this.changeComponent("ApplicationAdminView", true, app);
    },
    /**
     * Diese Methode leert den Inhalt und den Titel des Modals
     */
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    /**
     * Filter-Methode von Bootstrap-vue Table
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    /**
     * Diese Methode wählt einen Antrag aus
     */
    onRowSelected(items) {
      this.selected = items;
    },
    /**
     * Diese Methode lädt die gewünschten PDFs aus dem Backend
     */
    printSelected() {
      var req = [];
      for (let i = 0; i < this.selected.length; i++) {
        req.push({
          id: this.selected[i].id
        });
      }
      axios
        .get(this.url + "/getPDFs", {
          params: {
            token: this.token,
            pdfs: req
          }
        })
        .then(response => {
          var pdf = response.data.pdf;
          this.showPDF(pdf);
        });
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
     * Diese Methode wählt alle Anträge aus
     */
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows();
    },
    /**
     * Diese Methode leert die derzeitige Auswahl an Anträgen
     */
    clearSelected() {
      this.$refs.selectableTable.clearSelected();
    },
    /**
     * Diese Methode leitet den Benutzer auf die Startseite weiter
     */
    normal() {
      if (this.checkClick()) {
        this.changeComponent("Index");
      }
    },
    /**
     * Diese Methode leitet den Benutzer auf die Rechte-Verwalten Seite weiter
     */
    rights() {
      if (this.checkClick()) {
        this.changeComponent("Rights");
      }
    },
    /**
     * TODO
     * Diese Methode loggt den Benutzer aus und leitet ihn auf die Startseite weiter
     */
    logout() {
      if (this.checkClick()) {
        /*
      Implement the logout function with the backend
      */
        this.$emit("logout");
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
    }
  }
};
</script>
