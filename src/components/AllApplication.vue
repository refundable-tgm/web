<!-- Komponent zum Anzeigen aller zugehörigen Anträge -->
<template>
  <b-container fluid>
    <b-row align-v="center" align-h="center">
      <b-col cols="12" md="6">
        <h1 id="new-application-heading">Alle Anträge</h1>
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

    <!-- Tabelle mit allen zugehörigen Anträgen -->
    <b-table
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
      <!-- Name des Leiters -->
      <template #cell(name)="row">
        {{ row.value.first }} {{ row.value.last }}
      </template>

      <!-- Aktionen -->
      <template #cell(actions)="row">
        <!-- Schnelle Infos -->
        <b-button
          size="sm"
          @click="showInfo(row.item, row.index, $event.target)"
          class="mr-1"
        >
          Schnelle Information
        </b-button>
        <div class="d-block d-lg-none" style="width:100%; height:0.5rem"></div>
        <!-- Antrag betrachten -->
        <b-button size="sm" @click="info(row.item)">
          Antrag Betrachten
        </b-button>
      </template>

      <!-- Details -->
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
  props: ["url", "user", "token"],
  data() {
    return {
      items: [],
      fields: [
        {
          key: "title",
          label: "Titel",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "leader",
          label: "Leiter",
          sortable: true
        },
        {
          key: "edate",
          label: "Einreichdatum",
          sortable: true
        },
        {
          key: "active",
          label: "Aktiv",
          sortable: true,
          formatter: value => {
            return value ? "Offen" : "Geschlossen";
          }
        },
        {
          key: "status",
          label: "Status",
          sortable: true
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
     * Diese Methode sorgt dafür, dass die richtige ID an die viewApplication-Methode weitergegeben wird
     */
    info(item) {
      this.viewApplication(item.uuid);
    },
    tmp() {
      var data = [
        {
          uuid: "3ae8ec07-1ef5-4e13-ace9-c3e9ea3d3b51",
          name: "Sommersportwoche",
          kind: 0,
          miscellaneous_reason: "",
          progress: 3,
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
      for (let i = 0; i < data.length; i++) {
        if (data[i].kind === 0) {
          for (
            let j = 0;
            j < data[i].school_event_details.teachers.length;
            j++
          ) {
            if (data[i].school_event_details.teachers[j].role === 0) {
              data[i].leader = data[i].school_event_details.teachers[j].name;
            }
          }
        } else {
          data[i].leader = this.user.longname;
        }
        data[i].status = this.loadStatus(data[i].kind, data[i].progress);
        data[i].active = this.isActive(data[i].kind, data[i].progress);
        data[i].title = data[i].name;
        data[i].edate = this.formatDate(
          data[i].business_trip_applications[0].date_application_filed
        );
        if (data[i].kind === 0) {
          switch (data[i].progress) {
            case 7:
              data[i]._rowVariant = "success";
              break;
            case 1:
              data[i]._rowVariant = "warning";
              break;
            case 2:
              data[i]._rowVariant = "warning";
              break;
            case 3:
              data[i]._rowVariant = "warning";
              break;
            case 4:
              data[i]._rowVariant = "warning";
              break;
            case 5:
              data[i]._rowVariant = "warning";
              break;
            case 6:
              data[i]._rowVariant = "warning";
              break;
            case 0:
              data[i]._rowVariant = "danger";
              break;
            default:
              data[i]._rowVariant = "danger";
              break;
          }
        } else {
          switch (data[i].progress) {
            case 6:
              data[i]._rowVariant = "success";
              break;
            case 1:
              data[i]._rowVariant = "warning";
              break;
            case 2:
              data[i]._rowVariant = "warning";
              break;
            case 3:
              data[i]._rowVariant = "warning";
              break;
            case 4:
              data[i]._rowVariant = "warning";
              break;
            case 5:
              data[i]._rowVariant = "warning";
              break;
            case 0:
              data[i]._rowVariant = "danger";
              break;
            default:
              data[i]._rowVariant = "danger";
              break;
          }
        }
      }
      this.items = data;
      // Set the initial number of items
      this.totalRows = this.items.length;
    },
    /**
     * Diese Methode schaut, ob die geladenen Anträge aktiv oder unaktiv sind
     * @param kind Die Art des Antrags
     * @param progress Der Fortschritt des Antrags
     * @returns Boolean-Wert, ob der Antrag aktiv ist oder nicht
     */
    isActive(kind, progress) {
      if (kind === 0) {
        if (progress > 0 && progress < 7) return true;
        else return false;
      } else {
        if (progress > 0 && progress < 6) return true;
        else return false;
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
            return "In Bearbeitung";
          case 3:
            return "Bestätigt";
          case 4:
            return "Läuft...";
          case 5:
            return "Kosten ausstehend";
          case 6:
            return "Kosten in Bearbeitung";
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
            return "In Bearbeitung";
          case 2:
            return "Bestätigt";
          case 3:
            return "Läuft...";
          case 4:
            return "Kosten ausstehend";
          case 5:
            return "Kosten in Bearbeitung";
          case 6:
            return "Abgeschlossen";
          default:
            return "Abgelehnt";
        }
      }
    },
    /**
     * Diese Methode sorgt dafür, dass die wichtigsten Informationen im Modal angezeigt werden
     * @param item Das Element in der Liste, auf welches gedrückt worden ist
     * @param button Der Knopf, mit dem die Methode aufgerufen worden ist
     */
    showInfo(item, button) {
      this.infoModal.title = item.title;
      let leiter = "Leiter: " + item.leader;
      let date = "Einreichdatum: " + item.edate;
      let status = "Status: " + item.status;
      let active = "Aktiv: ";
      if (item.active) active += "Offen";
      else active += "Geschlossen";
      this.infoModal.content =
        leiter + "\n" + date + "\n" + status + "\n" + active;
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    /**
     * TODO
     * Diese Methode lädt alle Anträge für die Liste der aktiven Anträge
     */
    loadData() {
      axios
        .get(this.url + "/getAllApplications?user=" + this.user.uuid, {
          params: {
            token: this.token
          }
        })
        .then(response => {
          var data = response.data;
          for (let i = 0; i < data.length; i++) {
            if (data[i].kind === 0) {
              for (
                let j = 0;
                j < data[i].school_event_details.teachers.length;
                j++
              ) {
                if (data[i].school_event_details.teachers[j].role === 0) {
                  data[i].leader =
                    data[i].school_event_details.teachers[j].name;
                }
              }
            } else {
              data[i].leader = this.user.longname;
            }
            data[i].status = this.loadStatus(data[i].kind, data[i].progress);
            data[i].active = this.isActive(data[i].kind, data[i].progress);
            data[i].title = data[i].name;
            data[i].edate = this.formatDate(
              data[i].business_trip_applications[0].date_application_filed
            );
            if (data[i].kind === 0) {
              switch (data[i].progress) {
                case 7:
                  data[i]._rowVariant = "success";
                  break;
                case 1 || 2 || 3 || 4 || 5 || 6:
                  data[i]._rowVariant = "warning";
                  break;
                case 0:
                  data[i]._rowVariant = "danger";
                  break;
                default:
                  data[i]._rowVariant = "danger";
                  break;
              }
            } else {
              switch (data[i].progress) {
                case 2 || 3 || 6:
                  data[i]._rowVariant = "success";
                  break;
                case 1 || 4 || 5:
                  data[i]._rowVariant = "warning";
                  break;
                case 0:
                  data[i]._rowVariant = "danger";
                  break;
                default:
                  data[i]._rowVariant = "danger";
                  break;
              }
            }
          }
          this.items = data;
          // Set the initial number of items
          this.totalRows = this.items.length;
        });
      this.tmp();
    },
    /**
     * Diese Methode leert den Inhalt und den Titel des Modals
     */
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
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
     * Filter-Methode von Bootstrap-vue Table
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    /**
     * Leitet den Benutzer auf die NewApplication-Seite weiter
     */
    newApplication() {
      if (this.checkClick()) {
        this.changeComponent("NewApplication");
      }
    },
    /**
     * Öffnet den Antrag im Antrag-Viewer
     * @param application Der Antrag, welcher geöffnet werden soll
     */
    openApplication(application) {
      if (this.checkClick()) {
        this.changeComponent("ApplicationView", true, application);
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
      }
    },
    /**
     * Diese Methode leitet den Benutzer auf den Antrag-Viewer weiter
     * @param app Der Antrag, welcher dem Benutzer angezeigt werden soll
     */
    viewApplication(app) {
      this.changeComponent("ApplicationView", true, app);
    }
  }
};
</script>
