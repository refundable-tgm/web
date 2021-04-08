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
    /**
     * Diese Methode schaut, ob die geladenen Anträge aktiv oder unaktiv sind
     * @param kind Die Art des Antrags
     * @param progress Der Fortschritt des Antrags
     * @returns Boolean-Wert, ob der Antrag aktiv ist oder nicht
     */
    isActive(kind, progress) {
      if (kind === 4) {
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
      if (kind === 4) {
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
        .get(this.url + "/getAllApplications?user=" + this.user, {
          params: {
            token: this.token
          }
        })
        .then((response, status) => {
          var data = response.data;
          status.toString();
          for (let i = 0; i < data.length; i++) {
            if (data[i].kind === 4) {
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
              axios
                .get(this.url + "/getTeacher?id=" + this.user, {
                  params: {
                    token: this.token
                  }
                })
                .then(response => {
                  let daten = response.data;
                  data[i].leader = daten.Longname;
                });
            }
            data[i].status = this.loadStatus(data[i].kind, data[i].progress);
            data[i].active = this.isActive(data[i].kind, data[i].progress);
            data[i].title = data[i].name;
            data[i].edate =
              data[i].business_trip_applications[0].date_application_filed;
            if (data[i].kind === 4) {
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
