<template>
  <b-container fluid>
    <b-row align-v="center" align-h="center">
      <b-col cols="12" md="6">
        <h1 id="new-application-heading">Aktive Anträge</h1>
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

    <!-- Main table element -->
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
      <template #cell(name)="row">
        {{ row.value.first }} {{ row.value.last }}
      </template>

      <template #cell(actions)="row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-1">
          Schnelle Information
        </b-button>
        <b-button size="sm" @click="info(row.item, row.index, $event.target)">
          Antrag Betrachten
        </b-button>
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
export default {
  data() {
    return {
      items: [
        {
          title: "Sommersportwoche",
          leader: "Stefan Zakall",
          edate: "2019-10-10",
          status: "Abgelehnt",
          active: true,
          _rowVariant: "danger"
        },
        {
          title: "Sprachreise",
          leader: "Stefan Zakall",
          edate: "2020-12-12",
          status: "In Bearbeitung",
          active: true,
          _rowVariant: "warning"
        }
      ],
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
    // Set the initial number of items
    this.loadData();
    this.checkStatus();
  },
  methods: {
    info(item, index, button) {
      index.toString();
      button.toString();
      console.log(item);
      this.viewApplication(item);
      //this.infoModal.title = `Row index: ${index}`;
      //this.infoModal.content = JSON.stringify(item, null, 2);
      //this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    loadData() {
      //TODO: Load Data from Backend
      console.log("data loaded");
      //Sobald geladen dann der Code in der nächsten Zeile:
      this.totalRows = this.items.length;
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
      }
    },
    changeComponent(component, back = true, application = null) {
      this.$emit("change-component", component, back, application);
    },
    checkStatus() {
      //if only one is active, then redirect to specific application
      let actives = 0;
      let currentapp;
      for(let i = 0;i<this.items.length;i++) {
        if(this.items[i].active) {
          actives++;
          currentapp=this.items[i];
        }
      }
      if(actives === 1) {
        history.replaceState(
          "ApplicationView",
          null,
          null
        );
        this.viewApplication(currentapp);
      }
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
      }
    },
    viewApplication(app) {
      // Nur die ID verwenden beim übergeben!
      this.changeComponent("ApplicationView", true, app);
    }
  }
};
</script>
