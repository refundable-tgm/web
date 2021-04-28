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
          v-if="
            !(
              (user.pek === true &&
                user.av === false &&
                user.admin === false) ||
              (user.administration === true &&
                user.av === false &&
                user.admin === false)
            )
          "
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
    /**
     * Diese Methode berechnet alle wichtigen Daten, um die Anträge richtig anzuzeigen
     */
    loadView(applications) {
      var apps = applications;
      for (let i = 0; i < apps.length; i++) {
        apps[i].title = apps[i].name;
        apps[i].stat = this.loadStatus(apps[i].kind, apps[i].progress);
        apps[i].edat = this.formatDate(
          apps[i].business_trip_applications[0].date_application_filed
        );
        apps[i].start = this.formatDate(apps[i].start_time);
        switch (apps[i].kind) {
          case 0:
            apps[i].from = apps[i].school_event_details.teachers[0].name;
            break;
          case 1:
            apps[i].from = apps[i].training_details.filer;
            break;
          case 6:
            apps[i].from = apps[i].other_reason_details.filer;
            break;
        }

        if (
          this.user.pek === true &&
          this.user.av === false &&
          this.user.admin === false
        ) {
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
        if (
          this.user.administration === true &&
          this.user.av === false &&
          this.user.admin === false
        ) {
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
                    .get(this.url + "/getAdminApplications", {
                      headers: {
                        Authorization: "Basic " + resp.data.access_token
                      }
                    })
                    .then(res => {
                      this.loadView(res.data);
                    })
                    .catch(err => {
                      err.toString();
                      this.failedLoading();
                    });
                })
                .catch(e => {
                  e.toString();
                  this.$emit("logout");
                });
              break;
            default:
              this.failedLoading();
              break;
          }
        });
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
    failedLoading() {
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
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
      );
    },
    /**
     * Diese Methode gibt die "Farbe" der verschiedenen Phasen zurück
     * @param status Die Phase eines Antrags
     * @returns Die Farbe, welche zur Phase des Antrags passt
     */
    getStateVariant(status) {
      switch (status.toLowerCase()) {
        case "akzeptierungsphase":
          return "secondary";
        case "rechnungsphase":
          return "primary";
        case "abgelehnt":
          return "danger";
        case "abgeschlossen":
          return "success";
        case "einreichung":
          return "secondary";
        case "läuft...":
          return "secondary";
        case "bestätigt":
          return "secondary";
        case "kosten ausstehend":
          return "primary";
        default:
          return "primary";
      }
    },
    /**
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
        case 6:
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
     * Diese Methode lädt die Abwesenheitsformulare der Klassen herunter
     */
    getClassesPDF(uuid, klassen) {
      axios
        .get(
          this.url +
            "/getAbsenceFormForClasses?uuid=" +
            uuid +
            "&classes=" +
            klassen,
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
                      this.url +
                        "/getAbsenceFormForClasses?uuid=" +
                        uuid +
                        "&classes=" +
                        klassen,
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
     * Diese Methode öffnet die PDF des übergebenen Lehrers
     */
    getTeacherPDF(uuid, short) {
      axios
        .get(
          this.url +
            "/getAbsenceFormForTeacher?uuid=" +
            uuid +
            "&teacher=" +
            short,
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
                          this.url +
                            "/getAbsenceFormForTeacher?uuid=" +
                            uuid +
                            "&teacher=" +
                            short,
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
    },
    /**
     * Diese Methode öffnet die Rückerstattung für Lehrkräfte PDF
     */
    getCompensation(uuid) {
      axios
        .get(
          this.url + "/getCompensationForEducationalSupportForm?uuid=" + uuid,
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
          switch (error.response) {
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
                      this.url +
                        "/getCompensationForEducationalSupportForm?uuid=" +
                        uuid,
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
     * Diese Methode zeigt das Reiseformular eines Lehrers an als PDF
     */
    getBusiness(uuid, short, id) {
      axios
        .get(
          this.url +
            "/getBusinessTripApplicationForm?uuid=" +
            uuid +
            "&short=" +
            short +
            "&bta_id=" +
            id,
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
                      this.url +
                        "/getBusinessTripApplicationForm?uuid=" +
                        uuid +
                        "&short=" +
                        short +
                        "&bta_id=" +
                        id,
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
     * Diese Methode zeigt die Reiserechnung eines Lehrers an als PDF
     */
    getInvoice(uuid, short, id) {
      axios
        .get(
          this.url +
            "/getTravelInvoiceForm?uuid=" +
            uuid +
            "&short=" +
            short +
            "&ti_id=" +
            id,
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
                      this.url +
                        "/getTravelInvoiceForm?uuid=" +
                        uuid +
                        "&short=" +
                        short +
                        "&ti_id=" +
                        id,
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
     * Diese Methode zeigt das Reiseformular eines Lehrers an als PDF
     */
    getBusinessExcel(uuid, short, id) {
      axios
        .get(
          this.url +
            "/getBusinessTripApplicationExcel?uuid=" +
            uuid +
            "&short=" +
            short +
            "&bta_id=" +
            id,
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
                      this.url +
                        "/getBusinessTripApplicationExcel?uuid=" +
                        uuid +
                        "&short=" +
                        short +
                        "&bta_id=" +
                        id,
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
     * Diese Methode zeigt die Reiserechnung eines Lehrers an als PDF
     */
    getInvoiceExcel(uuid, short, id) {
      axios
        .get(
          this.url +
            "/getTravelInvoiceExcel?uuid=" +
            uuid +
            "&short=" +
            short +
            "&ti_id=" +
            id,
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
                      this.url +
                        "/getTravelInvoiceExcel?uuid=" +
                        uuid +
                        "&short=" +
                        short +
                        "&ti_id=" +
                        id,
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
      for (let i = 0; i < this.selected.length; i++) {
        if (this.selected[i].kind === 0) {
          this.getClassesPDF(
            this.selected[i].uuid,
            this.selected[i].school_event_details.classes
          );
          this.getCompensation(this.selected[i].uuid);
          for (
            let j = 0;
            j < this.selected[i].school_event_details.teachers.length;
            j++
          ) {
            var abre = this.selected[i].school_event_details.teachers[j]
              .shortname;
            this.getTeacherPDF(this.selected[i].uuid, abre);
            this.getBusiness(this.selected[i].uuid, abre, j);
            this.getBusinessExcel(this.selected[i].uuid, abre, j);
            this.getInvoice(this.selected[i].uuid, abre, j);
            this.getInvoiceExcel(this.selected[i].uuid, abre, j);
          }
        } else {
          var kurz = this.generateShortname(
            this.selected[i].business_trip_applications[0].name,
            this.selected[i].business_trip_applications[0].surname
          );
          this.getTeacherPDF(this.selected[i].uuid, kurz);
          if (
            this.selected[i].other_reason_details.kind !== 7 &&
            this.selected[i].other_reason_details.kind !== 9
          ) {
            this.getBusiness(this.selected[i].uuid, kurz, 0);
            this.getBusinessExcel(this.selected[i].uuid, kurz, 0);
            this.getInvoice(this.selected[i].uuid, kurz, 0);
            this.getInvoiceExcel(this.selected[i].uuid, kurz, 0);
          }
        }
      }
    },
    /**
     * Diese Methode generiert aus dem Namen einer Person, dass Kürzel
     */
    generateShortname(name, surname) {
      return name.substring(0, 1).toLowerCase() + surname.toLowerCase();
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
          encodeURI(pdf.pdf) +
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
