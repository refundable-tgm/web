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
          v-if="!(pek || administration)"
        >
          Normale Ansicht
        </b-button>
        <!-- Rechte verwalten Button -->
        <b-button
          variant="outline-primary"
          class="float-right"
          v-on:click="rights"
          style="margin-right:20px"
          v-if="admin"
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
      <template #cell(status)="data">
        <b-badge :variant="getStateVariant(data.item.status)">{{
          data.item.status.toUpperCase()
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
  props: ["url", "user", "token", "pek", "administration", "admin", "av"],
  data() {
    return {
      selectMode: "multi",
      selected: [],
      items: [
        {
          title: "Sommersportwoche",
          edat: "14-01-2021",
          begin: "14-06-2021",
          kind: 4,
          from: "szakall",
          status: "Akzeptierungsphase"
        },
        {
          title: "Pflegefreistellung",
          edat: "28-02-2021",
          begin: "1-03-2021",
          kind: 8,
          from: "szakall",
          status: "Rechnungsphase"
        },
        {
          title: "Urlaub",
          edat: "01-01-2021",
          begin: "31-12-2021",
          kind: 8,
          from: "szakall",
          status: "Abgelehnt"
        }
      ],
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
    /**
     * Diese Methode lädt die Daten aus dem Backend für das AdminDashboard und fügt die notwendigen Variablen hinzu
     */
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
            apps[i].title = apps[i].name;
            apps[i].status = this.loadStatus(apps[i].kind, apps[i].progress);
            apps[i].edate = this.formatDate(
              apps[i].business_trip_applications[0].date_application_filed
            );
            apps[i].start = this.formatDate(apps[i].start_time);
            apps[i].from = apps[i].staffnr;
            if (this.pek) {
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
            if (this.av || this.administration) {
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
        });
    },
    /**
     * Diese Methode sorgt dafür, dass die richtige ID an die viewApplication-Methode weitergegeben wird
     */
    info(item) {
      this.viewApplication(item.uuid);
    },
    /**
     * Diese Methode formatiert das Datum um korrekt angezeigt zu werden
     * @param datum Das Datum
     * @returns Das Datum in einfacher Form
     */
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
        this.changeComponent("Login");
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
