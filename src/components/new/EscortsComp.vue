<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12">
        <center><h2>Ganzer Name</h2></center>

        <b-form-group
          id="startd"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie das Startdatum der Schulveranstaltung ein."
          label="Startdatum"
          label-for="std"
        >
          <b-form-datepicker
            id="std"
            v-model="value"
            class="mb-2"
            placeholder="Datum auswählen"
          ></b-form-datepicker>
        </b-form-group>
        <b-form-group
          id="startz"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die Startzeit der Schulveranstaltung ein."
          label="Startzeit"
          label-for="stz"
        >
          <b-form-timepicker
            id="stz"
            v-model="value"
            locale="de"
            placeholder="Zeit auswählen"
          ></b-form-timepicker>
        </b-form-group>
        <b-form-group
          id="endd"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie das Enddatum der Schulveranstaltung ein."
          label="Enddatum"
          label-for="end"
        >
          <b-form-datepicker
            id="end"
            v-model="value"
            class="mb-2"
            placeholder="Datum auswählen"
          ></b-form-datepicker>
        </b-form-group>
        <b-form-group
          id="endz"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die Endzeit der Schulveranstaltung ein."
          label="Endzeit"
          label-for="enz"
        >
          <b-form-timepicker
            id="enz"
            v-model="value"
            locale="de"
            placeholder="Zeit auswählen"
          ></b-form-timepicker>
        </b-form-group>
        <b-form-group
          id="gruppe"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Wählen Sie die Gruppe der Begleitperson"
          label="Gruppe"
          label-for="gr"
        >
          <b-form-radio-group
            id="gr"
            v-model="selected"
            :options="options"
            class="mb-3"
            value-field="item"
            text-field="name"
            disabled-field="notEnabled"
          ></b-form-radio-group>
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      selected: "B",
      options: [
        { item: "A", name: "L1" },
        { item: "B", name: "L2" },
        { item: "D", name: "L3" },
      ],
    };
  },
};
</script>