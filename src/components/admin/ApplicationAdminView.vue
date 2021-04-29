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
          <b-icon icon="house" aria-hidden="true"></b-icon> Startseite
        </b-button>
        <!-- Dashoard Button -->
        <b-button
          variant="outline-primary"
          class="float-right"
          v-on:click="dashboard"
          v-if="
            (user.pek === true && user.av === false && user.admin === false) ||
              (user.administration === true &&
                user.av === false &&
                user.admin === false)
          "
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
            <!-- Excel herunterladen -->
            <b-button
              v-if="
                row.item.form === 'BusinessTripApplication' ||
                  row.item.form === 'TravelInvoice'
              "
              variant="outline-secondary"
              size="sm"
              @click="downloadExcel(row.item)"
              style="margin-right:1rem"
            >
              <b-icon variant="success" icon="file-earmark-text"></b-icon> Excel
              herunterladen
            </b-button>
            <!-- Abgeltung PDF öffnen Button -->
            <b-button
              v-if="row.item.form === 'Compensation'"
              variant="outline-secondary"
              size="sm"
              @click="openAbgeltung()"
            >
              <b-icon variant="danger" icon="file-earmark-text"></b-icon> PDF
              öffnen
            </b-button>
            <!-- PDF öffnen Button -->
            <b-button
              v-if="row.item.form !== 'Compensation'"
              variant="outline-secondary"
              size="sm"
              @click="openPDF(row.item)"
              style="margin-right:1rem"
            >
              <b-icon variant="danger" icon="file-earmark-text"></b-icon> PDF
              öffnen
            </b-button>
            <!-- Details anschauen Button -->
            <b-button
              v-if="row.item.form !== 'Compensation'"
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
                v-bind:token="token"
                v-bind:refresh_token="refresh_token"
                v-on:updateToken="updateToken"
                v-on:logout="logout"
                v-if="
                  row.item.title ==
                    'Allgemeine Infos - Abwesenheitsformulare der Klassen'
                "
              />
              <!-- Abwesenheitsformular -->
              <Others
                v-bind:data="app"
                v-bind:readonly="true"
                v-if="
                  row.item.title == 'Sonstiger Antrag - Abwesenheitsformular'
                "
              />
              <!-- Fortbildung -->
              <Workshop
                v-bind:data="app"
                v-bind:readonly="true"
                v-if="row.item.title == 'Fortbildung - Abwesenheitsformular'"
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
                      'Begleitformular - Abwesenheitsformular - ' +
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
    <!-- Auswahl Klassen -->
    <b-modal ref="class-modal" hide-footer title="Klassen auswählen">
      <b-container fluid>
        <b-row
          ><b-col cols="12">
            <div class="d-block text-center">
              <p>
                Bitte wählen Sie aus, welche Klassen in der Datei inkludiert
                sein sollen:
              </p>
              <!-- Klassen Auswählen -->
              <b-form-group
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                label-for="zud"
                id="zu"
              >
                <b-form-checkbox-group
                  id="zud"
                  v-model="auswahl"
                  stacked
                  v-for="c in klassen"
                  v-bind:key="c"
                >
                  <b-form-checkbox :value="c">{{ c }}</b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>
            </div>
          </b-col></b-row
        >
        <b-row>
          <b-col cols="6">
            <!-- Antrag schließen bestätigung -->
            <b-button
              class="mt-2"
              variant="outline-success"
              block
              @click="generallPDF"
              >Bestätigen</b-button
            >
          </b-col>
          <b-col cols="6">
            <!-- Abbrechen Button --><b-button
              class="mt-2"
              variant="outline-danger"
              block
              @click="hideClass"
              >Abbrechen</b-button
            ></b-col
          >
        </b-row>
      </b-container>
    </b-modal>
    <!-- Klassen modal -->
    <b-modal
      :id="classModal.id"
      :title="classModal.title"
      ok-only
      @hide="resetClassModal"
    >
      <pre>{{ classModal.content }}</pre>
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
  props: ["url", "token", "refresh_token", "user", "appid"],
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
      classModal: {
        id: "info-modal",
        title: "",
        content: ""
      },
      app: Object,
      klassen: [],
      auswahl: []
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
     * Diese Methode lädt den gewünschte Antrag aus dem Backend
     */
    loadData() {
      axios
        .get(this.url + "/getApplication?uuid=" + this.appid, {
          headers: {
            Authorization: "Basic " + this.token
          }
        })
        .then(response => {
          this.app = response.data;
          if (this.app.kind === 0) {
            this.klassen = this.app.school_event_details.classes;
            this.auswahl = this.klassen;
          }
          this.setItems(this.app);
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
                    .get(this.url + "/getApplication?uuid=" + this.appid, {
                      headers: {
                        Authorization: "Basic " + resp.data.access_token
                      }
                    })
                    .then(res => {
                      this.app = res.data;
                      if (this.app.kind === 0) {
                        this.klassen = this.app.school_event_details.classes;
                        this.auswahl = this.klassen;
                      }
                      this.setItems(this.app);
                    })
                    .catch(e => {
                      e.toString();
                      this.failedLoad();
                    });
                })
                .catch(err => {
                  err.toString();
                  this.$emit("logout");
                });
              break;
            default:
              this.failedLoad();
              break;
          }
        });
    },
    /**
     * Diese Methode öffnet das Modal, in dem man den Antrag ablehnen kann
     */
    closeAntrag() {
      this.$refs["close-modal"].show();
    },
    /**
     * Diese Methode schließt das Modal zum Antrag schließen
     */
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
          "</title><style>body{margin: 0px;padding:0px;}iframe{border-width: 0px;}</style></head>"
      );
      pdfWindow.document.write(
        "<body><embed width='100%' height='99%' src='data:application/pdf;base64, " +
          encodeURI(pdf.pdf) +
          "#toolbar=0&navpanes=0&scrollbar=0'></embed></body></html>"
      );
    },
    /**
     * Diese Methode lädt die Abgeltung für Lehrer herunter und zeigt diese an
     */
    openAbgeltung() {
      axios
        .get(
          this.url +
            "/getCompensationForEducationalSupportForm?uuid=" +
            this.app.uuid,
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
                        "/getCompensationForEducationalSupportForm?uuid=" +
                        this.app.uuid,
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
     * Diese Methode generiert aus dem Namen einer Person, dass Kürzel
     */
    generateShortname(name, surname) {
      return name.substring(0, 1).toLowerCase() + surname.toLowerCase();
    },
    /**
     * Diese Methode lädt das Abwesenheitsformular des Lehers aus dem Backend und öffnet es
     */
    applicationPDF(index) {
      axios
        .get(
          this.url +
            "/getAbsenceFormForTeacher?uuid=" +
            this.app.uuid +
            "&teacher=" +
            this.generateShortname(
              this.app.business_trip_applications[index].name,
              this.app.business_trip_applications[index].surname
            ),
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
                        "/getAbsenceFormForTeacher?uuid=" +
                        this.app.uuid +
                        "&teacher=" +
                        this.generateShortname(
                          this.app.business_trip_applications[index].name,
                          this.app.business_trip_applications[index].surname
                        ),
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
     * Lädt die PDF für die Klassen herunter
     */
    generallPDF() {
      this.classForm();
      var classes = "";
      for (let i = 0; i < this.auswahl.length; i++) {
        classes += "&classes=" + this.auswahl[i];
      }
      axios
        .get(
          this.url +
            "/getAbsenceFormForClasses?uuid=" +
            this.app.uuid +
            classes,
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
                        this.app.uuid +
                        classes,
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
     * Diese Methode lädt das Excel-File von dem Backend und lädt diese dem Benutzer herunter
     */
    downloadExcel(item) {
      switch (item.form) {
        case "BusinessTripApplication":
          axios
            .get(
              this.url +
                "/getBusinessTripApplicationExcel?uuid=" +
                this.app.uuid +
                "&short=" +
                this.generateShortname(
                  this.app.business_trip_applications[item.teacher].name,
                  this.app.business_trip_applications[item.teacher].surname
                ) +
                "&bta_id=" +
                item.teacher,
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
                            this.app.uuid +
                            "&short=" +
                            this.generateShortname(
                              this.app.business_trip_applications[item.teacher]
                                .name,
                              this.app.business_trip_applications[item.teacher]
                                .surname
                            ) +
                            "&bta_id=" +
                            item.teacher,
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
          break;
        case "TravelInvoice":
          axios
            .get(
              this.url +
                "/getTravelInvoiceExcel?uuid=" +
                this.app.uuid +
                "&short=" +
                this.generateShortname(
                  this.app.business_trip_applications[item.teacher].name,
                  this.app.business_trip_applications[item.teacher].surname
                ) +
                "&ti_id=" +
                item.teacher,
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
                            this.app.uuid +
                            "&short=" +
                            this.generateShortname(
                              this.app.business_trip_applications[item.teacher]
                                .name,
                              this.app.business_trip_applications[item.teacher]
                                .surname
                            ) +
                            "&ti_id=" +
                            item.teacher,
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

          break;
        default:
          this.failedExcel();
          break;
      }
    },
    /**
     * Code aus https://codepen.io/DanIgnatov/pen/RvbeeB
     * Diese Funktion downloaded das Excel-File beim Benutzer
     */
    excelDownload(excel) {
      var anchor_href =
        "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
        excel.excel;
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
     * Diese Methode setzt die richtigen Items für den Antrag
     * @param app Der gesamte Antrag
     */
    setItems(app) {
      if (app.kind === 0) {
        this.items = [
          {
            title: "Allgemeine Infos - Abwesenheitsformulare der Klassen",
            form: "SchoolEventDetails",
            teacher: 0
          },
          {
            title: "Abgeltung für pädagogische Betreuung",
            form: "Compensation",
            teacher: 0
          }
        ];
        for (let i = 0; i < this.app.business_trip_applications.length; i++) {
          this.items.push({
            title:
              "Begleitformular - Abwesenheitsformular - " +
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
              title: "Fortbildung - Abwesenheitsformular",
              form: "TrainingDetails",
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
        } else {
          if (
            app.other_reason_details.kind === 7 ||
            app.other_reason_details.kind === 9
          ) {
            this.items = [
              {
                title: "Sonstiger Antrag - Abwesenheitsformular",
                form: "OtherReasonDetails",
                teacher: 0
              }
            ];
          } else {
            this.items = [
              {
                title: "Sonstiger Antrag - Abwesenheitsformular",
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
     * Diese Methode filtert den Table
     */
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
     * Diese Methode leert das Klassen-Modal
     */
    resetClassModal() {
      this.classModal.title = "";
      this.classModal.content = "";
    },
    /**
     * Diese Methode versteckt das Klassen-Modal
     */
    hideClass() {
      this.$refs["class-modal"].hide();
    },
    /**
     * Diese Methode lädt die PDF von dem Backend
     */
    openPDF(item) {
      switch (item.form) {
        case "SchoolEventDetails":
          this.classForm();
          break;
        case "SchoolEventTeacherDetails":
          this.applicationPDF(item.teacher);
          break;
        case "TrainingDetails":
          this.applicationPDF(item.teacher);
          break;
        case "OtherReasonDetails":
          this.applicationPDF(item.teacher);
          break;
        case "BusinessTripApplication":
          axios
            .get(
              this.url +
                "/getBusinessTripApplicationForm?uuid=" +
                this.app.uuid +
                "&short=" +
                this.generateShortname(
                  this.app.business_trip_applications[item.teacher].name,
                  this.app.business_trip_applications[item.teacher].surname
                ) +
                "&bta_id=" +
                item.teacher,
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
                            this.app.uuid +
                            "&short=" +
                            this.generateShortname(
                              this.app.business_trip_applications[item.teacher]
                                .name,
                              this.app.business_trip_applications[item.teacher]
                                .surname
                            ) +
                            "&bta_id=" +
                            item.teacher,
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
          break;
        case "TravelInvoice":
          axios
            .get(
              this.url +
                "/getTravelInvoiceForm?uuid=" +
                this.app.uuid +
                "&short=" +
                this.generateShortname(
                  this.app.business_trip_applications[item.teacher].name,
                  this.app.business_trip_applications[item.teacher].surname
                ) +
                "&ti_id=" +
                item.teacher +
                "&receipts=true",
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
                            this.app.uuid +
                            "&short=" +
                            this.generateShortname(
                              this.app.business_trip_applications[item.teacher]
                                .name,
                              this.app.business_trip_applications[item.teacher]
                                .surname
                            ) +
                            "&ti_id=" +
                            item.teacher +
                            "&receipts=true",
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
          break;
        default:
          this.failedPDF();
          break;
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
     * Diese Methode lehnt den Antrag ab
     */
    delAn() {
      if (this.app.kind === 0) {
        if (this.app.progress === 2) {
          for (let i = 0; i < this.app.business_trip_applications.length; i++) {
            this.app.business_trip_applications[i].referee = this.user.longname;
          }
          this.app.progress = 0;
        }
        if (this.app.progress === 6) {
          this.app.progress = 5;
        }
      } else {
        if (this.app.progress === 1) {
          for (let i = 0; i < this.app.business_trip_applications.length; i++) {
            this.app.business_trip_applications[i].referee = this.user.longname;
          }
          this.app.progress = 0;
        }
        if (this.app.progress === 5) {
          this.app.progress = 4;
        }
      }
      this.app.last_changed = this.createNewDate();
      this.save();
    },
    /**
     * Erstellt ein neues Datum, welches im richtigen Datenformat ist
     */
    createNewDate() {
      var tmp = new Date();
      return tmp.toISOString();
    },
    /**
     * Diese Methode öffnet das Modal, in dem man den die Klassen definieren kann
     */
    classForm() {
      this.$refs["class-modal"].show();
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
     * Diese Methode zeigt dem Benutzer an, dass der Antrag einen Fehler beim Laden hatte
     */
    failedLoad() {
      this.$bvToast.toast("Es ist ein Fehler aufgetreten!", {
        title: "Antrag konnte nicht geladen werden",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
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
            this.deleteApproval();
          }
        }
        if (this.app.progress === 6) {
          for (let i = 0; i < this.app.travel_invoices.length; i++) {
            this.app.travel_invoices[i].approval_date = this.createNewDate();
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
            this.app.progress = 2;
            this.app.last_changed = this.createNewDate();
            this.deleteApproval();
          }
        }
        if (this.app.progress === 5) {
          for (let i = 0; i < this.app.travel_invoices.length; i++) {
            this.app.travel_invoices[i].approval_date = this.createNewDate();
          }
          this.app.progress = 6;
          this.app.last_changed = this.createNewDate();
        }
      }
      this.save();
      //Save the nesessary information from current User reviewing the application in the application
      //Progress should be set to Akzeptiert or Fertig
    },
    /**
     * Diese Methode speichert den derzeitigen Antrag
     */
    save() {
      axios
        .put(this.url + "/updateApplication?uuid=" + this.app.uuid, this.app, {
          headers: {
            Authorization: "Basic " + this.token
          }
        })
        .then(response => {
          response.toString();
          this.saveConfirm();
          return true;
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
                    .put(
                      this.url + "/updateApplication?uuid=" + this.app.uuid,
                      this.app,
                      {
                        headers: {
                          Authorization: "Basic " + resp.data.access_token
                        }
                      }
                    )
                    .then(res => {
                      res.toString();
                      this.saveConfirm();
                      return true;
                    })
                    .catch(e => {
                      e.toString();
                      this.failedConfirm();
                      return false;
                    });
                })
                .catch(err => {
                  err.toString();
                  this.$emit("logout");
                });
              break;
            default:
              this.failedConfirm();
              return false;
          }
        });
    },
    /**
     * Diese Methode löscht das application_approved attribut des Antrags, welches fälschlicherweise gesetzt wird
     */
    deleteApproval() {
      for (let i = 0; i < this.app.travel_invoices.length; i++) {
        this.app.travel_invoices[i].approval_date = "";
      }
    },
    /**
     * Diese methode sendet ein Signal an die Eltern-Componente
     */
    updateToken(access, refresh) {
      this.$emit("updateToken", access, refresh);
    },
    /**
     * Diese Methode sendet das Signal zum ausloggen an den Manager
     */
    logout() {
      this.$emit("logout");
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
