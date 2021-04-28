<!-- Template für Fortbildungen -->
<template>
  <b-container fluid>
    <b-row align-h="center">
      <b-col cols="12">
        <b-container fluid>
          <b-row align-h="center">
            <b-col cols="12" md="8">
              <!-- Input für das Startdatum -->
              <b-form-group
                id="startd"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie das Startdatum des Termins ein."
                label="Startdatum"
                label-for="std"
              >
                <b-form-datepicker
                  id="std"
                  v-model="startDate"
                  :readonly="readonly"
                  @input="updateTime"
                  class="mb-2"
                  placeholder="Datum auswählen"
                ></b-form-datepicker>
              </b-form-group>
              <!-- Input für die Startzeit -->
              <b-form-group
                id="startz"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die Startzeit des Termins ein."
                label="Startzeit"
                label-for="stz"
              >
                <b-form-timepicker
                  id="stz"
                  v-model="startTime"
                  :readonly="readonly"
                  @input="updateTime"
                  locale="de"
                  placeholder="Zeit auswählen"
                ></b-form-timepicker>
              </b-form-group>
              <!-- Input für das Enddatum -->
              <b-form-group
                id="endd"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie das Enddatum des Termins ein."
                label="Enddatum"
                label-for="end"
              >
                <b-form-datepicker
                  id="end"
                  v-model="endDate"
                  :readonly="readonly"
                  @input="updateTime"
                  class="mb-2"
                  placeholder="Datum auswählen"
                ></b-form-datepicker>
              </b-form-group>
              <!-- Input für die Endzeit -->
              <b-form-group
                id="endz"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die Endzeit des Termins ein."
                label="Endzeit"
                label-for="enz"
              >
                <b-form-timepicker
                  id="enz"
                  v-model="endTime"
                  :readonly="readonly"
                  @input="updateTime"
                  locale="de"
                  placeholder="Zeit auswählen"
                ></b-form-timepicker>
              </b-form-group>
              <!-- Grund für die Abwesenheit -->
              <b-form-group
                id="grund"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Wählen Sie Ihren Grund aus."
                label="Gründe"
                label-for="gr"
              >
                <b-form-radio-group
                  id="gr"
                  v-model="data.other_reason_details.kind"
                  @input="updateData"
                  :options="options"
                  :disabled="readonly"
                  class="mb-3"
                  value-field="item"
                  text-field="name"
                  disabled-field="notEnabled"
                ></b-form-radio-group>
              </b-form-group>
              <!-- Input zur Eingabe des benutzerdefinierten Grundes -->
              <b-form-group
                id="sonst"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie den Grund an."
                label="Sonstiger Grund"
                label-for="son"
                v-if="data.other_reason_details.kind === 10"
              >
                <b-form-input
                  id="son"
                  @input="updateData"
                  v-model="data.other_reason_details.miscellaneous_reason"
                  :readonly="readonly"
                >
                </b-form-input>
              </b-form-group>
              <!-- Titel des Dienstauftrages, falls er als Grund ausgewählt wurde -->
              <b-form-group
                id="titel"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie den Titel des Dienstauftrages ein."
                label="Titel"
                label-for="tit"
                v-if="data.other_reason_details.kind === 8"
              >
                <b-form-input
                  id="tit"
                  v-model="data.other_reason_details.service_mandate_title"
                  :readonly="readonly"
                  @input="updateData"
                ></b-form-input>
              </b-form-group>
              <!-- GZ des Dienstauftrages, falls er als Grund ausgewählt wurde -->
              <b-form-group
                id="gz"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die GZ des Dienstauftrages ein."
                label="GZ"
                label-for="gzn"
                v-if="data.other_reason_details.kind === 8"
              >
                <b-form-input
                  id="gzn"
                  type="number"
                  v-model="data.other_reason_details.service_mandate_gz"
                  :readonly="readonly"
                  @input="updateData"
                ></b-form-input>
              </b-form-group>
              <!-- Input für Anmerkungen -->
              <b-form-group
                id="anmerkung"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie zusätzliche Anmerkungen an."
                label="Anmerkungen"
                label-for="an"
              >
                <b-form-textarea
                  id="an"
                  placeholder="Anmerkungen"
                  rows="3"
                  no-resize
                  v-model="data.notes"
                  :readonly="readonly"
                  @input="updateData"
                ></b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  name: "NewApplication",
  props: ["data", "readonly"],
  methods: {
    /**
     * Diese Methode sendet die aktuellen Daten an den Parent
     */
    updateData() {
      this.$emit("update", this.data);
    },
    /**
     * Diese Methode wandelt die Zeiteingaben in ein valides Datum um und ruft die updateData-Methode
     */
    updateTime() {
      var start = new Date(this.startDate);
      start.setHours(this.startTime.split(":")[0]);
      start.setMinutes(this.startTime.split(":")[1]);
      var end = new Date(this.endDate);
      end.setHours(this.endTime.split(":")[0]);
      end.setMinutes(this.endTime.split(":")[1]);
      this.data.start_time = start;
      this.data.end_time = end;
      this.updateData();
    }
  },
  mounted() {
    var start = new Date(this.data.start_time);
    var end = new Date(this.data.end_time);
    this.startDate =
      start.getUTCFullYear() +
      "-" +
      (start.getUTCMonth() + 1) +
      "-" +
      start.getDate();
    this.endDate =
      end.getUTCFullYear() +
      "-" +
      (end.getUTCMonth() + 1) +
      "-" +
      end.getDate();
    this.startTime = start.getHours() + ":" + start.getMinutes();
    this.endTime = end.getHours() + ":" + end.getMinutes();
  },
  data() {
    return {
      selected: "",
      options: [
        { item: 7, name: "Pflegefreistellung" },
        { item: 8, name: "Dienstauftrag" },
        { item: 9, name: "Arzttermin" },
        { item: 10, name: "Sonstiges" }
      ],
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: ""
    };
  }
};
</script>
