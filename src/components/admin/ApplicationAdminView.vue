<!-- Administrator Ansicht Template -->
<template>
  <b-container fluid>
    <b-row align-v="center" align-h="center">
      <b-col cols="12" md="6">
        <!-- Name des Antrages -->
        <h1 id="new-application-heading">Antrag für {{ app.Name }}</h1>
      </b-col>
      <div class="col-12 col-md-6">
        <!-- Startseite Button -->
        <b-button
          variant="outline-primary"
          class="float-right"
          v-on:click="index"
          v-if="!(pek || administration)"
        >
          <b-icon icon="house" aria-hidden="true"></b-icon> Startseite
        </b-button>
        <!-- Dashoard Button -->
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
    <!-- Progress Bar -->
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
                v-bind:app="app.BusinessTripApplications[0]"
                v-bind:readonly="true"
                v-if="row.item.title == 'Reiseformular'"
              />
              <!-- Reiserechnung -->
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
                <!-- Begleitformular -->
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
                <!-- Reiseantrag für den jeweiligen Lehrer -->
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
                <!-- Reiserechnung für den jeweiligen Lehrer -->
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

    <!-- Funktionen zum annehmen/ablehnen der Anträge -->
    <b-row style="margin-bottom:2rem">
      <b-col cols="12">
        <!-- Antrag ablehnen Button -->
        <b-button
          variant="outline-danger"
          id="show-btn"
          @click="closeAntrag"
          class="float-right"
          ><b-icon icon="file-earmark-excel"></b-icon> Antrag ablehnen</b-button
        >
        <!-- Antrag annehmen Button -->
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
    /**
     * TODO
     * Diese Methode lädt den gewünschte Antrag aus dem Backend
     */
    loadData() {
      axios
        .get(this.url + "/application/getApplication?id=" + this.appid)
        .then(response => {
          this.app = response.data.application;
          this.setItems(this.app);
        });
    },
    /**
     * Diese Methode öffnet das Modal, in dem man den Antrag ablehnen kann
     */
    closeAntrag() {
      this.$refs["close-modal"].show();
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
    /**
     * TODO
     * Diese Methode lädt die PDF von dem Backend
     * @param item Die erwünschte PDF
     */
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
