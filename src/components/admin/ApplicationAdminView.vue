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
          v-if="!(pek || administration)"
        >
          <b-icon icon="house" aria-hidden="true"></b-icon> Startseite
        </b-button>
        <b-button
          variant="outline-primary"
          class="float-right"
          v-on:click="dashboard"
          v-if="pek || administration"
        >
          <b-icon icon="house" aria-hidden="true"></b-icon> Startseite
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
              <b-icon icon="pencil-square"></b-icon> Infos
              {{ row.detailsShowing ? "schließen" : "öffnen" }}
            </b-button>
          </template>

          <template #row-details="row">
            <b-card>
              <SchoolGeneral
                v-bind:data="app"
                v-bind:readonly="true"
                v-if="row.item.title == 'Allgemeine Infos'"
              />
              <Others
                v-bind:data="app"
                v-bind:readonly="true"
                v-if="row.item.title == 'Abwesenheitsformular'"
              />
              <Workshop
                v-bind:data="app"
                v-bind:readonly="true"
                v-if="row.item.title == 'Fortbildung'"
              />
              <TravelApplication
                v-bind:index="index"
                v-bind:app="app.BusinessTripApplications[0]"
                v-bind:readonly="true"
                v-if="row.item.title == 'Reiseformular'"
              />
              <TravelBill
                v-bind:index="index"
                v-bind:start="app.StartTime"
                v-bind:end="app.EndTime"
                v-bind:app="app.TravelInvoices[0]"
                v-bind:readonly="true"
                v-if="row.item.title == 'Reiserechnung'"
              />
              <div
                v-for="(teach, index) in app.SchoolEventDetails.Teachers"
                v-bind:key="teach.Shortname"
              >
                <SchoolEscorts
                  v-bind:readonly="true"
                  v-bind:data="app.SchoolEventDetails.Teachers[index]"
                  v-if="
                    row.item.title ==
                      'Begleitformular - ' +
                        app.SchoolEventDetails.Teachers[index].Shortname
                  "
                />
              </div>
              <div
                v-for="(busi, index) in app.BusinessTripApplications"
                v-bind:key="busi.Staffnr"
              >
                <TravelApplication
                  v-bind:index="index"
                  v-bind:app="busi"
                  v-bind:readonly="true"
                  v-if="
                    row.item.title ==
                      'Reiseformular - ' +
                        app.SchoolEventDetails.Teachers[index].Shortname
                  "
                />
              </div>
              <div
                v-for="(bill, index) in app.TravelInvoices"
                v-bind:key="bill.ID"
              >
                <TravelBill
                  v-bind:index="index"
                  v-bind:start="
                    app.SchoolEventDetails.Teachers[index].AttendanceFrom
                  "
                  v-bind:end="
                    app.SchoolEventDetails.Teachers[index].AttendanceTill
                  "
                  v-bind:app="bill"
                  v-bind:readonly="true"
                  v-if="
                    row.item.title ==
                      'Reiserechnung - ' +
                        app.SchoolEventDetails.Teachers[index].Shortname
                  "
                />
              </div>
            </b-card>
          </template>
        </b-table>
      </b-col>
    </b-row>

    <b-row style="margin-bottom:2rem">
      <b-col cols="12">
        <b-button
          variant="outline-danger"
          id="show-btn"
          @click="closeAntrag"
          class="float-right"
          ><b-icon icon="file-earmark-excel"></b-icon> Antrag ablehnen</b-button
        >
        <b-button
          variant="outline-success"
          id="show-btn"
          style="margin-right: 1rem"
          class="float-right"
          @click="confirmed"
          ><b-icon icon="file-earmark-check"></b-icon> Antrag annehmen</b-button
        >
      </b-col>
    </b-row>

    <b-modal ref="close-modal" hide-footer title="Antrag ablehnen">
      <b-container fluid>
        <b-row
          ><b-col cols="12">
            <div class="d-block text-center">
              <p>
                Sind Sie sich sicher, dass Sie den Antrag ablehnen wollen?
              </p>
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
            <b-button class="mt-2" variant="outline-danger" block @click="delAn"
              >Antrag ablehnen <b-spinner small type="grow"></b-spinner
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
  props: ["url", "token", "user", "pek", "administration", "appid"],
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
    loadData() {
      axios
        .get(this.url + "/application/getApplication?id=" + this.appid)
        .then(response => {
          this.app = response.data.application;
          this.setItems(this.app);
        });
    },
    closeAntrag() {
      this.$refs["close-modal"].show();
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
    setItems(app) {
      if (app.Kind === 4) {
        this.items = [
          {
            title: "Allgemeine Infos",
            form: "SchoolEventDetails",
            teacher: 0
          }
        ];
        for (let i = 0; i < this.app.SchoolEventDetails.Teachers.length; i++) {
          this.items.push({
            title:
              "Begleitformular - " +
              this.app.SchoolEventDetails.Teachers[i].Shortname,
            form: "SchoolEventTeacherDetails",
            teacher: i
          });
        }
        for (let i = 0; i < this.app.SchoolEventDetails.Teachers.length; i++) {
          this.items.push({
            title:
              "Reiseformular - " +
              this.app.SchoolEventDetails.Teachers[i].Shortname,
            form: "BusinessTripApplication",
            teacher: i
          });
        }
        if (this.app.Progress >= 5) {
          for (
            let i = 0;
            i < this.app.SchoolEventDetails.Teachers.length;
            i++
          ) {
            this.items.push({
              title:
                "Reiserechnung - " +
                this.app.SchoolEventDetails.Teachers[i].Shortname,
              form: "TravelInvoice",
              teacher: i
            });
          }
        }
      } else {
        if (app.Kind === 0) {
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
          if (this.app.Progress >= 4) {
            this.items.push({
              title: "Reiserechnung",
              form: "TravelInvoice",
              teacher: 0
            });
          }
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
          if (this.app.Progress >= 4) {
            this.items.push({
              title: "Reiserechnung",
              form: "TravelInvoice",
              teacher: 0
            });
          }
        }
      }
    },
    openPDF(item) {
      axios
        .get(this.url + "/getAdminPDF", {
          params: {
            application: this.app.UUID,
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
      if (this.checkClick) {
        this.changeComponent("Index");
        this.changeURL("Index");
      }
    },
    dashboard() {
      if (this.checkClick) {
        this.changeComponent("AdminDashboard");
        this.changeURL("AdminDashboard");
      }
    },
    delAn() {
      //If Progress is at 5 it should be thrown back to Progress 4 -SchoolEvent
      //If Progress is at 2 it should be thrown back to Progress 0 -Schoolevent
      //If Progress is at 4 it should be thrown back to Progress 3 -Workshop, etc
      //If Progress is at 1 it should be thrown back to Progress 0 -Workshop, etc
      console.log("Delete this Antrag!");
    },
    confirmed() {
      //Save the nesessary information from current User reviewing the application in the application
      //Progress should be counted up => Michi macht das vielleicht?
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
