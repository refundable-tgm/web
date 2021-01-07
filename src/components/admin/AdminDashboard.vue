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
    <b-button size="sm" @click="clearSelected">Auswahl drucken</b-button>
    <!-- Main table element -->
    <b-table
      striped
      :select-mode="selectMode"
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
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
        <b-badge variant="primary">{{ data.item.kind.toUpperCase() }}</b-badge>
      </template>
      <template #cell(actions)="row">
        <b-button size="sm" @click="row.toggleDetails">
          Antrag betrachten
        </b-button>
      </template>
      <template #cell(status)="data">
        <b-badge variant="info">{{ data.item.status.toUpperCase() }}</b-badge>
      </template>
      <template #cell(from)="data">
        <b-badge variant="secondary">{{
          data.item.from.toUpperCase()
        }}</b-badge>
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
      selectMode: "multi",
      selected: [],
      items: [
        {
          title: "a",
          kind: "Schulveranstaltung",
          status: "Akzeptierungsphase",
          edat: "2020-12-12",
          start: "2021-02-12",
          from: "zaks"
        },
        {
          title: "b",
          kind: "Fortbildung",
          status: "Rechnungsphase",
          edat: "2020-12-13",
          start: "2021-03-13",
          from: "dold"
        },
        {
          title: "c",
          kind: "Dienstauftrag",
          status: "Rechnungsphase",
          edat: "2020-12-14",
          start: "2021-04-22",
          from: "gram"
        },
        {
          title: "d",
          kind: "Krankschreibung",
          status: "Akzeptierungsphase",
          edat: "2020-12-15",
          start: "2021-05-14",
          from: "vitl"
        },
        {
          title: "e",
          kind: "Schulveranstaltung",
          status: "Rechnungsphase",
          edat: "2020-12-16",
          start: "2021-06-15",
          from: "fejw"
        },
        {
          title: "f",
          kind: "Pflegefreistellung",
          status: "Akzeptierungsphase",
          edat: "2020-12-17",
          start: "2021-07-26",
          from: "krah"
        },
        {
          title: "g",
          kind: "Schulveranstaltung",
          status: "Akzeptierungsphase",
          edat: "2020-12-18",
          start: "2021-08-17",
          from: "brah"
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
    // Set the initial number of items
    this.totalRows = this.items.length;
  },
  methods: {
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
    onRowSelected(items) {
      this.selected = items;
    },
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows();
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected();
    },
    normal() {
      if(this.checkClick()) {
        this.changeComponent("Index");
      }
    },
    logout() {
      if(this.checkClick()) {
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
