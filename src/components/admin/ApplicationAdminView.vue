<!-- Administrator Ansicht Template -->
<template>
  <b-container fluid>
    <b-row align-v="center" align-h="center">
      <b-col cols="12" md="6">
        <!-- Name des Antrages -->
        <h1 id="new-application-heading">Antrag für {{ app.name }}</h1>
      </b-col>
      <div class="col-12 col-md-6">
        <!-- Startseite Button -->
        <b-button
          variant="outline-primary"
          class="float-right"
          v-on:click="index"
          v-if="!(user.pek || user.administration)"
        >
          <b-icon icon="house" aria-hidden="true"></b-icon> Startseite
        </b-button>
        <!-- Dashoard Button -->
        <b-button
          variant="outline-primary"
          class="float-right"
          v-on:click="dashboard"
          v-if="user.pek || user.administration"
        >
          <b-icon icon="house" aria-hidden="true"></b-icon> Startseite
        </b-button>
      </div>
    </b-row>
    <!-- Progress Bar -->
    <b-row
      align-h="center"
      align-v="center"
      style="margin-top:1rem;margin-bottom:3rem"
    >
      <b-col cols="12">
        <Progress v-bind:progress="app.progress" v-bind:kind="app.kind" />
      </b-col>
    </b-row>
    <b-row style="margin-top:2rem">
      <b-col cols="12">
        <!-- Tabelle mit den spezifischen Dokumenten -->
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
          <!-- Dokumenten Art -->
          <template #cell(name)="row">
            {{ row.value.first }} {{ row.value.last }}
          </template>

          <!-- Funktionstasten -->
          <template #cell(actions)="row">
            <!-- PDF öffnen Button -->
            <b-button
              variant="outline-secondary"
              size="sm"
              @click="openPDF(row.item)"
              style="margin-right:1rem"
            >
              <b-icon icon="file-earmark-text"></b-icon> PDF öffnen
            </b-button>
            <!-- Details anschauen Button -->
            <b-button
              variant="outline-secondary"
              size="sm"
              @click="row.toggleDetails"
            >
              <b-icon icon="pencil-square"></b-icon> Infos
              {{ row.detailsShowing ? "schließen" : "öffnen" }}
            </b-button>
          </template>

          <!-- Detailanzeige -->
          <template #row-details="row">
            <b-card>
              <!-- Schulveranstaltungen -->
              <SchoolGeneral
                v-bind:data="app"
                v-bind:readonly="true"
                v-if="row.item.title == 'Allgemeine Infos'"
              />
              <!-- Abwesenheitsformular -->
              <Others
                v-bind:data="app"
                v-bind:readonly="true"
                v-if="row.item.title == 'Abwesenheitsformular'"
              />
              <!-- Fortbildung -->
              <Workshop
                v-bind:data="app"
                v-bind:readonly="true"
                v-if="row.item.title == 'Fortbildung'"
              />
              <!-- Reiseantrag -->
              <TravelApplication
                v-bind:index="index"
                v-bind:app="app.business_trip_applications[0]"
                v-bind:readonly="true"
                v-if="row.item.title == 'Reiseformular'"
              />
              <!-- Reiserechnung -->
              <TravelBill
                v-bind:index="index"
                v-bind:start="app.start_time"
                v-bind:end="app.end_time"
                v-bind:app="app.travel_invoices[0]"
                v-bind:readonly="true"
                v-if="row.item.title == 'Reiserechnung'"
              />
              <div
                v-for="(teach, index) in app.school_event_details.teachers"
                v-bind:key="teach.shortname"
              >
                <!-- Begleitformular -->
                <SchoolEscorts
                  v-bind:readonly="true"
                  v-bind:data="app.school_event_details.teachers[index]"
                  v-if="
                    row.item.title ==
                      'Begleitformular - ' +
                        app.business_trip_applications[index].surname +
                        ' ' +
                        app.business_trip_applications[index].name
                  "
                />
              </div>
              <div
                v-for="(busi, index) in app.business_trip_applications"
                v-bind:key="busi.staffnr"
              >
                <!-- Reiseantrag für den jeweiligen Lehrer -->
                <TravelApplication
                  v-bind:index="index"
                  v-bind:app="busi"
                  v-bind:readonly="true"
                  v-if="
                    row.item.title ==
                      'Reiseformular - ' +
                        app.business_trip_applications[index].surname +
                        ' ' +
                        app.business_trip_applications[index].name
                  "
                />
              </div>
              <div
                v-for="(bill, index) in app.travel_invoices"
                v-bind:key="bill.id"
              >
                <!-- Reiserechnung für den jeweiligen Lehrer -->
                <TravelBill
                  v-bind:index="index"
                  v-bind:start="
                    app.school_event_details.teachers[index].attendance_from
                  "
                  v-bind:end="
                    app.school_event_details.teachers[index].attendance_till
                  "
                  v-bind:app="bill"
                  v-bind:readonly="true"
                  v-if="
                    row.item.title ==
                      'Reiserechnung - ' +
                        app.travel_invoices[index].surname +
                        ' ' +
                        app.travel_invoices[index].name
                  "
                />
              </div>
            </b-card>
          </template>
        </b-table>
      </b-col>
    </b-row>

    <!-- Funktionen zum annehmen/ablehnen der Anträge -->
    <b-row style="margin-bottom:2rem">
      <b-col cols="12">
        <!-- Antrag ablehnen Button -->
        <b-button
          variant="outline-danger"
          id="show-btn"
          @click="closeAntrag"
          class="float-right"
          :disabled="isActive()"
          ><b-icon icon="file-earmark-excel"></b-icon> Antrag ablehnen</b-button
        >
        <!-- Antrag annehmen Button -->
        <b-button
          variant="outline-success"
          id="show-btn"
          style="margin-right: 1rem"
          class="float-right"
          @click="confirmed"
          :disabled="isActive()"
          ><b-icon icon="file-earmark-check"></b-icon> Antrag annehmen</b-button
        >
      </b-col>
    </b-row>

    <!-- Antrag Ablehnen Warnhinweis -->
    <b-modal ref="close-modal" hide-footer title="Antrag ablehnen">
      <b-container fluid>
        <b-row
          ><b-col cols="12">
            <div class="d-block text-center">
              <p>
                Sind Sie sich sicher, dass Sie den Antrag ablehnen wollen?
              </p>
              <!-- Begründung der Ablehnung -->
              <b-form-textarea
                id="decline-reason"
                placeholder="Begründung"
                rows="3"
                no-resize
              ></b-form-textarea>
            </div> </b-col
        ></b-row>
        <b-row>
          <b-col cols="6">
            <!-- Antrag ablehnen Bestätigung -->
            <b-button class="mt-2" variant="outline-danger" block @click="delAn"
              >Antrag ablehnen <b-spinner small type="grow"></b-spinner
            ></b-button>
          </b-col>
          <b-col cols="6">
            <!-- Abbrechen Button -->
            <b-button
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
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only>
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
  props: ["url", "token", "user", "appid"],
  components: {
    Others,
    Workshop,
    SchoolEscorts,
    SchoolGeneral,
    Progress,
    TravelApplication,
    TravelBill
  },
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
      app: Object
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
     * TODO
     * Diese Methode lädt den gewünschte Antrag aus dem Backend
     */
    loadData() {
      axios
        .get(this.url + "/application/getApplication?id=" + this.appid)
        .then(response => {
          this.app = response.data;
          this.setItems(this.app);
        });
      var application = {
        uuid: "3ae8ec07-1ef5-4e13-ace9-c3e9ea3d3b51",
        name: "Sommersportwoche",
        kind: 0,
        miscellaneous_reason: "",
        progress: 6,
        start_time: "2021-04-12T18:54:40.035095+01:00",
        end_time: "2021-04-19T18:54:40.035095+01:00",
        notes: "Sommersportwoche ist cool",
        start_address: "Wexstraße 19-23, 1200 Wien",
        destination_address: "Karl-Hönck-Heim-Straße 1, 1234 Hönckheimsdorf",
        last_changed: "2021-03-01T18:54:40.035096+01:00",
        school_event_details: {
          classes: ["5BHIT"],
          amount_male_students: 22,
          amount_female_students: 1,
          duration_in_days: 3,
          teachers: [
            {
              name: "Stefan Zakall",
              shortname: "szakall",
              attendance_from: "2021-04-12T18:54:40.035095+01:00",
              attendance_till: "2021-04-19T18:54:40.035095+01:00",
              group: 2,
              start_address: "Wexstraße 19-23, 1200 Wien",
              meeting_point: "Wexstraße 19-23, 1200 Wien",
              role: 0
            },
            {
              name: "Dominik Dolezal",
              shortname: "ddolezal",
              attendance_from: "2021-04-12T18:54:40.035095+01:00",
              attendance_till: "2021-04-19T18:54:40.035095+01:00",
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
            trip_begin_time: "2021-04-12T18:54:40.035095+01:00",
            trip_end_time: "2021-04-19T18:54:40.035095+01:00",
            service_begin_time: "2021-04-12T18:54:40.035095+01:00",
            service_end_time: "2021-04-19T18:54:40.035095+01:00",
            trip_goal: "Karl-Hönck-Heim-Straße 1, 1234 Hönckheimsdorf",
            travel_purpose: "Aus Gesundheitsgründen",
            travel_mode: 2,
            starting_point: 0,
            end_point: 0,
            reasoning: "Weil es näher ist",
            other_participants: ["ddolezal"],
            bonus_mile_confirmation_1: true,
            bonus_mile_confirmation_2: true,
            travel_costs_payed_by_someone: false,
            staying_costs_payed_by_someone: false,
            payed_by_whom: "",
            other_costs: 10,
            estimated_costs: 20,
            date_application_filed: "2021-01-01T18:54:40.035095+01:00",
            date_application_approved: "2021-02-01T18:54:40.035095+01:00",
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
            trip_begin_time: "2021-04-12T18:54:40.035095+01:00",
            trip_end_time: "2021-04-19T18:54:40.035095+01:00",
            service_begin_time: "2021-04-12T18:54:40.035095+01:00",
            service_end_time: "2021-04-19T18:54:40.035095+01:00",
            trip_goal: "Karl-Hönck-Heim-Straße 1, 1234 Hönckheimsdorf",
            travel_purpose: "Aus Gründen, die ich nicht nennen möchte",
            travel_mode: 0,
            starting_point: 0,
            end_point: 0,
            reasoning: "Weil es am nähesten ist von allem",
            other_participants: ["szakall"],
            bonus_mile_confirmation_1: true,
            bonus_mile_confirmation_2: true,
            travel_costs_payed_by_someone: true,
            staying_costs_payed_by_someone: false,
            payed_by_whom: "Firma",
            other_costs: 30,
            estimated_costs: 40,
            date_application_filed: "2021-01-01T18:54:40.035095+01:00",
            date_application_approved: "2021-02-01T18:54:40.035095+01:00",
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
            trip_begin_time: "2021-04-12T18:54:40.035095+01:00",
            trip_end_time: "2021-04-19T18:54:40.035095+01:00",
            staffnr: 12345,
            starting_point: "Wexstraße 19-23, 1200 Wien",
            end_point: "Karl-Hönck-Heim-Straße 1, 1234 Hönckheimsdorf",
            filing_date: "2021-01-01T18:54:40.035095+01:00",
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
                  date: "2021-04-12T18:54:40.035095+01:00",
                  begin: "2021-04-12T08:00:00.035095+01:00",
                  end: "2021-04-12T18:00:00.035095+01:00",
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
                  date: "2021-04-13T18:54:40.035095+01:00",
                  begin: "2021-04-13T08:00:00.035095+01:00",
                  end: "2021-04-13T18:00:00.035095+01:00",
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
                  date: "2021-04-14T08:00:00.035095+01:00",
                  begin: "2021-04-14T08:00:00.035095+01:00",
                  end: "2021-04-14T18:00:00.035095+01:00",
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
                  date: "2021-04-15T08:00:00.035095+01:00",
                  begin: "2021-04-15T08:00:00.035095+01:00",
                  end: "2021-04-15T18:00:00.035095+01:00",
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
                  date: "2021-04-16T08:00:00.035095+01:00",
                  begin: "2021-04-16T08:00:00.035095+01:00",
                  end: "2021-04-16T18:00:00.035095+01:00",
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
                  date: "2021-04-17T08:00:00.035095+01:00",
                  begin: "2021-04-17T08:00:00.035095+01:00",
                  end: "2021-04-17T18:00:00.035095+01:00",
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
                  date: "2021-04-18T08:00:00.035095+01:00",
                  begin: "2021-04-18T08:00:00.035095+01:00",
                  end: "2021-04-18T18:00:00.035095+01:00",
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
                  date: "2021-04-19T08:00:00.035095+01:00",
                  begin: "2021-04-19T08:00:00.035095+01:00",
                  end: "2021-04-19T18:00:00.035095+01:00",
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
            trip_begin_time: "2021-03-01T18:54:40.035095+01:00",
            trip_end_time: "2021-03-03T18:54:40.035095+01:00",
            staffnr: 1234,
            starting_point: "Wexstraße 19-23, 1200 Wien",
            end_point: "Karl-Hönck-Heim-Straße 1, 1234 Hönckheimsdorf",
            filing_date: "2021-01-01T18:54:40.035095+01:00",
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
                  date: "2021-04-12T18:54:40.035095+01:00",
                  begin: "2021-04-12T08:00:00.035095+01:00",
                  end: "2021-04-12T18:00:00.035095+01:00",
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
                  date: "2021-04-13T18:54:40.035095+01:00",
                  begin: "2021-04-13T08:00:00.035095+01:00",
                  end: "2021-04-13T18:00:00.035095+01:00",
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
                  date: "2021-04-14T08:00:00.035095+01:00",
                  begin: "2021-04-14T08:00:00.035095+01:00",
                  end: "2021-04-14T18:00:00.035095+01:00",
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
                  date: "2021-04-15T08:00:00.035095+01:00",
                  begin: "2021-04-15T08:00:00.035095+01:00",
                  end: "2021-04-15T18:00:00.035095+01:00",
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
                  date: "2021-04-16T08:00:00.035095+01:00",
                  begin: "2021-04-16T08:00:00.035095+01:00",
                  end: "2021-04-16T18:00:00.035095+01:00",
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
                  date: "2021-04-17T08:00:00.035095+01:00",
                  begin: "2021-04-17T08:00:00.035095+01:00",
                  end: "2021-04-17T18:00:00.035095+01:00",
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
                  date: "2021-04-18T08:00:00.035095+01:00",
                  begin: "2021-04-18T08:00:00.035095+01:00",
                  end: "2021-04-18T18:00:00.035095+01:00",
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
                  date: "2021-04-19T08:00:00.035095+01:00",
                  begin: "2021-04-19T08:00:00.035095+01:00",
                  end: "2021-04-19T18:00:00.035095+01:00",
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
      };
      this.app = application;
      this.setItems(this.app);
    },
    /**
     * Diese Methode öffnet das Modal, in dem man den Antrag ablehnen kann
     */
    closeAntrag() {
      this.$refs["close-modal"].show();
    },
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
     * Diese Methode setzt die richtigen Items für den Antrag
     * @param app Der gesamte Antrag
     */
    setItems(app) {
      if (app.kind === 0) {
        this.items = [
          {
            title: "Allgemeine Infos",
            form: "SchoolEventDetails",
            teacher: 0
          }
        ];
        for (let i = 0; i < this.app.business_trip_applications.length; i++) {
          this.items.push({
            title:
              "Begleitformular - " +
              app.business_trip_applications[i].surname +
              " " +
              app.business_trip_applications[i].name,
            form: "SchoolEventTeacherDetails",
            teacher: i
          });
        }
        for (let i = 0; i < this.app.business_trip_applications.length; i++) {
          this.items.push({
            title:
              "Reiseformular - " +
              app.business_trip_applications[i].surname +
              " " +
              app.business_trip_applications[i].name,
            form: "BusinessTripApplication",
            teacher: i
          });
        }
        if (this.app.progress >= 5) {
          for (let i = 0; i < this.app.travel_invoices.length; i++) {
            this.items.push({
              title:
                "Reiserechnung - " +
                app.travel_invoices[i].surname +
                " " +
                app.travel_invoices[i].name,
              form: "TravelInvoice",
              teacher: i
            });
          }
        }
      } else {
        if (app.kind === 1) {
          this.items = [
            {
              title: "Fortbildung",
              form: "TrainingDetails",
              teacher: 0
            },
            {
              title: "Reiseformular",
              form: "BusinessTripApplication"
            }
          ];
          if (this.app.progress >= 4) {
            this.items.push({
              title: "Reiserechnung",
              form: "TravelInvoice",
              teacher: 0
            });
          }
        } else {
          if (
            app.other_reason_details.kind === 7 ||
            app.other_reason_details.kind === 9
          ) {
            this.items = [
              {
                title: "Abwesenheitsformular",
                form: "OtherReasonDetails",
                teacher: 0
              }
            ];
          } else {
            this.items = [
              {
                title: "Abwesenheitsformular",
                form: "OtherReasonDetails",
                teacher: 0
              },
              {
                title: "Reiseformular",
                form: "BusinessTripApplication",
                teacher: 0
              }
            ];
            if (this.app.progress >= 4) {
              this.items.push({
                title: "Reiserechnung",
                form: "TravelInvoice",
                teacher: 0
              });
            }
          }
        }
      }
    },
    /**
     * Diese Methode schaut, ob der Admin den Fortschritt des Antrags bearbeiten soll
     */
    isActive() {
      if (this.app.kind === 0) {
        if (this.app.progress === 2 || this.app.progress === 6) {
          return false;
        } else {
          return true;
        }
      } else {
        if (this.app.progress === 1 || this.app.progress === 5) {
          return false;
        } else {
          return true;
        }
      }
    },
    /**
     * TODO
     * Diese Methode lädt die PDF von dem Backend
     * @param item Die erwünschte PDF
     */
    openPDF(item) {
      axios
        .get(this.url + "/getAdminPDF", {
          params: {
            application: this.app.uuid,
            form: item.form,
            teacher: item.teacher,
            token: this.token
          }
        })
        .then(response => {
          var pdf = response.data.pdf;
          this.showPDF(pdf);
        });
    },
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
     * Diese Methode leitet den Benutzer auf das AdminDashboard weiter
     */
    dashboard() {
      if (this.checkClick) {
        this.changeComponent("AdminDashboard");
        this.changeURL("AdminDashboard");
      }
    },
    /**
     * TODO
     * Diese Methode lehnt den Antrag ab
     */
    delAn() {
      if (this.app.kind === 0) {
        if (this.app.progress === 2) {
          this.app.progress === 0;
        }
        if (this.app.progress === 5) {
          for (let i = 0; i < this.app.business_trip_applications.length; i++) {
            this.app.business_trip_applications[i].referee = this.user.longname;
          }
          this.app.progress === 4;
        }
      } else {
        if (this.app.progress === 1) {
          this.app.progress === 0;
        }
        if (this.app.progress === 4) {
          for (let i = 0; i < this.app.travel_invoices.length; i++) {
            this.app.travel_invoices[i].clerk = this.user.longname;
            this.app.travel_invoices[i].reviewer = this.user.longname;
          }
          this.app.progress === 3;
        }
      }
      //If Progress is at 5 it should be thrown back to Progress 4 -SchoolEvent
      //If Progress is at 2 it should be thrown back to Progress 0 -Schoolevent
      //If Progress is at 4 it should be thrown back to Progress 3 -Workshop, etc
      //If Progress is at 1 it should be thrown back to Progress 0 -Workshop, etc
      console.log("Update Antrag");
    },
    /**
     * Erstellt ein neues Datum, welches im richtigen Datenformat ist
     */
    createNewDate() {
      var tmp = new Date();
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
    failedConfirm() {
      this.$bvToast.toast("Es ist ein Fehler aufgetreten!", {
        title: "Änderungen wurden nicht gespeichert",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
    },
    /**
     * TODO
     * Diese Methode akzeptiert den Antrag oder die Kosten
     */
    confirmed() {
      if (this.app.kind === 0) {
        if (this.app.progress === 2) {
          for (let i = 0; i < this.app.business_trip_applications.length; i++) {
            this.app.business_trip_applications[i].referee = this.user.longname;
            this.app.business_trip_applications[
              i
            ].date_application_approved = this.createNewDate();
            this.app.last_changed = this.createNewDate();
            this.app.progress = 3;
          }
        }
        if (this.app.progress === 6) {
          for (let i = 0; i < this.app.travel_invoices.length; i++) {
            // TODO welches ist pek und welches ist av/administration?
            this.app.travel_invoices[i].clerk = this.user.longname;
            this.app.travel_invoices[i].reviewer = this.user.longname;
            this.app.travel_invoices[i].approval_date = this.createNewDate();
            this.app.travel_invoices[i].zi = 1;
          }
          this.app.progress = 7;
          this.app.last_changed = this.createNewDate();
        }
      } else {
        if (this.app.progress === 1) {
          for (let i = 0; i < this.app.business_trip_applications.length; i++) {
            this.app.business_trip_applications[i].referee = this.user.longname;
            this.app.business_trip_applications[
              i
            ].date_application_approved = this.createNewDate();
            this.app.last_changed = this.createNewDate();
          }
        }
        if (this.app.progress === 5) {
          for (let i = 0; i < this.app.travel_invoices.length; i++) {
            // TODO welches ist pek und welches ist av/administration?
            this.app.travel_invoices[i].clerk = this.user.longname;
            this.app.travel_invoices[i].reviewer = this.user.longname;
            this.app.travel_invoices[i].approval_date = this.createNewDate();
            this.app.travel_invoices[i].zi = 1;
          }
          this.app.progress = 6;
          this.app.last_changed = this.createNewDate();
        }
      }
      axios
        .put(
          this.url + "/updateApplication?uuid=" + this.app.uuid,
          {
            headers: {
              Authorization: "Basic " + this.token
            }
          },
          this.app
        )
        .then(response => {
          switch (response.status) {
            case 200:
              this.saveConfirm();
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
                      axios.put(
                        this.url + "/updateApplication?uuid=" + this.app.uuid,
                        {
                          headers: {
                            Authorization: "Basic " + this.token
                          }
                        },
                        this.app
                      ).then(res => {
                        switch(res.status) {
                          case 200:
                            this.saveConfirm();
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
      //Save the nesessary information from current User reviewing the application in the application
      //Progress should be set to Akzeptiert or Fertig
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
