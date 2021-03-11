<template>
  <b-container fluid>
    <b-row align-v="center" align-h="center">
      <b-col cols="12" md="6">
        <h1 id="new-application-heading">Antrag für {{ title }}</h1>
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
        <Progress v-bind:progress="progress" v-bind:kind="kind" />
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
                v-bind:readonly="readonly"
                v-bind:data="sgdata"
                v-on:update="updateSG"
                v-if="isLeader"
              />
              <SchoolEscorts
                v-bind:readonly="readonly"
                v-bind:data="sedata"
                v-on:update="updateSE"
                v-if="row.item.title == 'Begleitformular'"
              />
              <Others
                v-bind:readonly="readonly"
                v-bind:data="odata"
                v-on:update="updateO"
                v-if="row.item.title == 'Abwesenheitsformular'"
              />
              <Workshop
                v-bind:readonly="readonly"
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
export default {
  components: {
    Others,
    Workshop,
    SchoolEscorts,
    SchoolGeneral,
    Progress
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
      readonly: false,
      title: "",
      progress: null,
      kind: null,
      app: Object,
      isLeader: null
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
        .get(this.url + "/application/getApplication?id=" + this.appid, {
          params: {
            token: this.token
          }
        })
        .then(response => {
          var application = response.data;
          if (application.Kind === 4) {
            if (
              application.SchoolEventDetails.Teachers[0].Shortname ===
              this.getCurrentTeacher()
            ) {
              this.isLeader = true;
            } else {
              this.isLeader = false;
            }
          } else {
            application.toString();
          }
        });
    },
    closeAntrag() {
      this.$refs["close-modal"].show();
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
    },
    openPDF(item) {
      console.log(item);
    },
    updateSG(data) {
      console.log("UPDATE SG");
      this.sgdata = data;
    },
    updateSE(data) {
      console.log("UPDATE SE");
      this.sedata = data;
    },
    updateO(data) {
      console.log("UPDATE O");
      this.odata = data;
    },
    updateW(data) {
      console.log("UPDATE W");
      this.wdata = data;
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
