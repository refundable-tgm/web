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
                v-if="row.item.title == 'Reiseformular'"
                v-on:update="updateTA"
              />
              <TravelBill
                v-bind:readonly="tbreadonly"
                v-if="row.item.title == 'Reiserechnung'"
                v-bind:index="0"
                v-bind:start="start"
                v-bind:end="end"
                v-on:update="updateTB"
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
      items: [
        {
          title: "Allgemeine Infos"
        },
        {
          title: "Begleitformular"
        },
        {
          title: "Fortbildung"
        },
        {
          title: "Abwesenheitsformular"
        },
        {
          title: "Reiseformular"
        },
        {
          title: "Reiserechnung"
        }
      ],
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
      progress: 0,
      kind: 0,
      app: Object,
      isLeader: false,
      sgdata: {},
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
    updateSG(data) {
      this.app = data;
    },
    updateSE(sedata) {
      this.sedata = sedata;
    },
    updateO(odata) {
      this.odata = odata;
    },
    updateW(wdata) {
      this.wdata = wdata;
    },
    updateTB(index, data) {
      index.toString();
      data.toString();
    },
    updateTA(index, data) {
      index.toString();
      data.toString();
    },
    loadData() {
      axios
        .get(this.url + "/application/getApplication?id=" + this.appid, {
          params: {
            token: this.token
          }
        })
        .then(response => {
          var application = response.data;
          this.start = application.StartTime;
          this.end = application.EndTime;
          this.progress = application.Progress;
          this.title = application.Name;
          this.kind = application.Kind;
          if (application.Kind === 4) {
            if (
              application.SchoolEventDetails.Teachers[0].Shortname ===
              this.getCurrentTeacher()
            ) {
              this.isLeader = true;
            } else {
              this.isLeader = false;
            }
          }
          this.setItems(application);
          this.setReads(application);
        });
      var application = {
        UUID: "3ae8ec07-1ef5-4e13-ace9-c3e9ea3d3b51",
        Name: "Sommersportwoche",
        Kind: 4,
        MiscellaneousReason: "",
        Progress: 3,
        StartTime: "2021-03-01T18:54:40.035095+01:00",
        EndTime: "2021-03-03T18:54:40.035095+01:00",
        Notes: "Sommersportwoche ist cool",
        StartAddress: "Wexstraße 19-23, 1200 Wien",
        DestinationAddress: "Karl-Hönck-Heim-Straße 1, 1234 Hönckheimsdorf",
        LastChanged: "2021-03-01T18:54:40.035096+01:00",
        SchoolEventDetails: {
          Classes: ["5BHIT"],
          AmountMaleStudents: 22,
          AmountFemaleStudents: 1,
          DurationInDays: 3,
          Teachers: [
            {
              Name: "Stefan Zakall",
              Shortname: "szakall",
              AttendanceFrom: "2021-03-01T19:00:40.035095+01:00",
              AttendanceTill: "2021-03-03T17:00:40.035095+01:00",
              Group: 2,
              StartAddress: "Wexstraße 19-23, 1200 Wien",
              MeetingPoint: "Wexstraße 19-23, 1200 Wien",
              Role: 1
            },
            {
              Name: "Dominik Dolezal",
              Shortname: "ddolezal",
              AttendanceFrom: "2021-03-01T19:00:40.035095+01:00",
              AttendanceTill: "2021-03-03T17:00:40.035095+01:00",
              Group: 2,
              StartAddress: "Wexstraße 19-23, 1200 Wien",
              MeetingPoint: "Wexstraße 19-23, 1200 Wien",
              Role: 0
            }
          ]
        },
        TrainingDetails: {
          Kind: 0,
          MiscellaneousReason: "",
          PH: 0,
          Organizer: ""
        },
        OtherReasonDetails: {
          Kind: 0,
          ServiceMandateTitle: "",
          ServiceMandateGZ: 0,
          MiscellaneousReason: ""
        },
        BusinessTripApplications: [
          {
            ID: 0,
            Staffnr: 0,
            TripBeginTime: "0001-01-01T00:00:00Z",
            TripEndTime: "0001-01-01T00:00:00Z",
            ServiceBeginTime: "0001-01-01T00:00:00Z",
            ServiceEndTime: "0001-01-01T00:00:00Z",
            TripGoal: "",
            TravelPurpose: "",
            TravelMode: 0,
            StartingPoint: 0,
            EndPoint: 0,
            Reasoning: "",
            OtherParticipants: null,
            BonusMileConfirmation1: false,
            BonusMileConfirmation2: false,
            TravelCostsPayedBySomeone: false,
            StayingCostsPayedBySomeone: false,
            PayedByWhom: "",
            OtherCosts: 0,
            EstimatedCosts: 0,
            DateApplicationFiled: "0001-01-01T00:00:00Z",
            DateApplicationApproved: "0001-01-01T00:00:00Z",
            Referee: "",
            BusinessCardEmittedOutward: false,
            BusinessCardEmittedReturn: false
          }
        ],
        TravelInvoices: [
          {
            ID: 0,
            TripBeginTime: "0001-01-01T00:00:00Z",
            TripEndTime: "0001-01-01T00:00:00Z",
            Staffnr: 0,
            StartingPoint: "",
            EndPoint: "",
            Clerk: "",
            Reviewer: "",
            TravelMode: 0,
            ZI: 0,
            FilingDate: "0001-01-01T00:00:00Z",
            ApprovalDate: "0001-01-01T00:00:00Z",
            DailyChargesMode: 0,
            ShortenedAmount: 0,
            NightlyChargesMode: 0,
            Breakfasts: 0,
            Lunches: 0,
            Dinners: 0,
            OfficialBusinessCardGot: false,
            TravelGrant: false,
            ReplacementForAdvantageCard: false,
            ReplacementForTrainCardClass2: false,
            KilometreAllowance: false,
            KilometreAmount: 0,
            NRAndIdicationsOfParticipants: false,
            TravelCostsCited: false,
            NoTravelCosts: false,
            Calculation: {
              ID: 0,
              Rows: null,
              SumTravelCosts: 0,
              SumDailyCharges: 0,
              SumNightlyCharges: 0,
              SumAdditionalCosts: 0,
              SumOfSums: 0
            }
          }
        ]
      };
      this.app = application;
      this.start = application.StartTime;
      this.end = application.EndTime;
      this.progress = application.Progress;
      this.title = application.Name;
      this.kind = application.Kind;
      this.currentTeacher = this.getCurrentTeacher();
      if (application.Kind === 4) {
        if (
          this.currentTeacher ===
          this.app.SchoolEventDetails.Teachers[0].Shortname
        ) {
          this.isLeader = true;
        } else {
          this.isLeader = false;
        }
        for (let i = 0; i < this.app.SchoolEventDetails.Teachers.length; i++) {
          if (
            this.currentTeacher ===
            this.app.SchoolEventDetails.Teachers[i].Shortname
          ) {
            this.currentTeacherIndex = i;
          }
        }
      }
      this.setItems(application);
      this.setReads(application);
    },
    save() {
      console.log(this.sgreadonly);
      console.log(this.sereadonly);
      console.log(this.wreadonly);
      console.log(this.oreadonly);
      console.log(this.tareadonly);
      console.log(this.tbreadonly);
      console.log("Save");
    },
    closeAntrag() {
      this.$refs["close-modal"].show();
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
              title: "Allgemeine Infos"
            },
            {
              title: "Begleitformular"
            },
            {
              title: "Reiseformular"
            },
            {
              title: "Reiserechnung"
            }
          ];
        } else {
          this.items = [
            {
              title: "Begleitformular"
            },
            {
              title: "Reiseformular"
            },
            {
              title: "Reiserechnung"
            }
          ];
        }
      } else {
        if (app.Kind === 0) {
          this.items = [
            {
              title: "Fortbildung"
            },
            {
              title: "Reiseformular"
            },
            {
              title: "Reiserechnung"
            }
          ];
        } else {
          this.items = [
            {
              title: "Abwesenheitsformular"
            },
            {
              title: "Reiseformular"
            },
            {
              title: "Reiserechnung"
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
      return "szakall";
    },
    openPDF(item) {
      console.log(item);
    },
    hideClose() {
      this.$refs["close-modal"].hide();
    },
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
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
      console.log("INDEX!");
      if (this.checkClick) {
        this.changeComponent("Index");
        this.changeURL("Index");
      }
    },
    delAn() {
      console.log("Delete this Antrag!");
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
