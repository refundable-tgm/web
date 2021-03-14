<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row align-v="center" align-h="center">
      <b-col cols="12" md="6">
        <h1 id="new-application-heading">Alle Anträge</h1>
      </b-col>
      <div class="col-12 col-md-6">
        <b-button
          variant="outline-danger"
          class="float-right"
          v-on:click="logout"
        >
          Abmelden
        </b-button>
        <b-button
          variant="outline-primary"
          class="float-right"
          v-on:click="normal"
          style="margin-right:20px"
          v-if="!(pek || administration)"
        >
          Normale Ansicht
        </b-button>
      </div>
    </b-row>

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
    <b-button size="sm" @click="selectAllRows" style="margin-right:1rem"
      >Alle auswählen</b-button
    >
    <b-button size="sm" @click="clearSelected" style="margin-right:1rem"
      >Auswahl löschen</b-button
    >
    <b-button size="sm" @click="printSelected">Auswahl drucken</b-button>
    <!-- Main table element -->
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

      <template #cell(kind)="data">
        <b-badge :variant="getKindVariant(data.item.kind)">{{
          loadKind(data.item.kind)
        }}</b-badge>
      </template>
      <template #cell(actions)="row">
        <b-button size="sm" @click="info(row.item)">
          Antrag betrachten
        </b-button>
      </template>
      <template #cell(status)="data">
        <b-badge :variant="getStateVariant(data.item.status)">{{
          data.item.status.toUpperCase()
        }}</b-badge>
      </template>
      <template #cell(from)="data">
        <b-badge variant="secondary">{{ data.item.from }}</b-badge>
      </template>
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
export default {
  props: ["url", "user", "token", "pek", "administration"],
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
        { key: "status", label: "Status", sortable: true },
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
    loadKind(kind) {
      switch (kind) {
        case 4:
          return "Schulveranstaltung";
        case 0:
          return "Fortbildung";
        case 2:
          return "Dienstauftrag";
        case 3:
          return "Arzttermin";
        case 1:
          return "Pflegefreistellung";
        case 5:
          return "Seminar";
        case 6:
          return "Tagung";
        case 7:
          return "Lehrgang";
        case 8:
          return "Sonstiges";
        default:
          return "Fehler!";
      }
    },
    loadStatus(kind, progress) {
      if (kind === 4) {
        switch (progress) {
          case 0:
            return "Abgelehnt";
          case 1:
            return "Akzeptierungsphase";
          case 2:
            return "Akzeptierungsphase";
          case 3:
            return "Akzeptierungsphase";
          case 4:
            return "Akzeptierungsphase";
          case 5:
            return "Rechnungsphase";
          case 6:
            return "Rechnungsphase";
          case 7:
            return "Rechnungsphase";
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
            return "Akzeptierungsphase";
          case 3:
            return "Akzeptierungsphase";
          case 4:
            return "Rechnungsphase";
          case 5:
            return "Rechnungsphase";
          case 6:
            return "Rechnungsphase";
          default:
            return "Abgelehnt";
        }
      }
    },
    loadData() {
      axios
        .get(this.url + "/getAllAdminApplications?user=" + this.user, {
          params: {
            token: this.token
          }
        })
        .then(response => {
          var apps = response.data.applications;
          for (let i = 0; i < apps.length; i++) {
            apps[i].title = apps[i].Name;
            apps[i].status = this.loadStatus(apps[i].Kind, apps[i].Progress);
            apps[i].edate = this.formatDate(
              apps[i].BusinessTripApplications[0].DateApplicationFiled
            );
            apps[i].start = this.formatDate(apps[i].StartTime);
            apps[i].from = apps[i].Staffnr;
          }
          this.items = apps;
          // Set the initial number of items
          this.totalRows = this.items.length;
        });
    },
    info(item) {
      this.viewApplication(item.UUID);
    },
    formatDate(datum) {
      return (
        datum.getUTCFullYear() +
        "-" +
        datum.getUTCMonth() +
        1 +
        "-" +
        datum.getUTCDate()
      );
    },
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
    getKindVariant(kind) {
      switch (kind) {
        case 4:
          return "secondary";
        case 0:
          return "info";
        case 2:
          return "warning";
        case 3:
          return "warning";
        case 1:
          return "warning";
        case 5:
          return "dark";
        case 6:
          return "dark";
        case 7:
          return "dark";
        case 8:
          return "success";
        default:
          return "primary";
      }
    },
    viewApplication(app) {
      this.changeComponent("ApplicationAdminView", true, app);
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
    onRowSelected(items) {
      this.selected = items;
    },
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
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows();
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected();
    },
    normal() {
      if (this.checkClick()) {
        this.changeComponent("Index");
      }
    },
    logout() {
      if (this.checkClick()) {
        /*
      Implement the logout function with the backend
      */
        this.changeComponent("Login");
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
    }
  }
};
</script>
