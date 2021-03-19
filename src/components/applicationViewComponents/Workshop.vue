<template>
  <b-container fluid>
    <b-row align-h="center">
      <b-col cols="12">
        <b-container fluid>
          <b-row align-h="center">
            <b-col cols="12" md="8">
              <b-form-group
                id="titel"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie den Titel der Fortbildung ein."
                label="Titel"
                label-for="tit"
              >
                <b-form-input
                  id="tit"
                  v-model="data.Name"
                  :readonly="readonly"
                  @input="updateData"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="startd"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie das Startdatum der Fortbildung ein."
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
              <b-form-group
                id="startz"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die Startzeit der Fortbildung ein."
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
              <b-form-group
                id="endd"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie das Enddatum der Fortbildung ein."
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
              <b-form-group
                id="endz"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die Endzeit der Fortbildung ein."
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
              <b-form-group
                id="phzahl"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie Ihre PH-Zahl ein."
                label="PH-Zahl"
                label-for="phz"
              >
                <b-form-input
                  id="phz"
                  v-model="data.TrainingDetails.PH"
                  :readonly="readonly"
                  @input="updateData"
                  type="number"
                  min="1"
                  max="3000"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="veran"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie den Namen des Veranstalters ein."
                label="Veranstalter"
                label-for="ver"
              >
                <b-form-input
                  id="ver"
                  v-model="data.TrainingDetails.Organizer"
                  :readonly="readonly"
                  @input="updateData"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="art"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Wählen Sie die Art der Fortbildung."
                label="Art"
                label-for="ar"
              >
                <b-form-radio-group
                  id="ar"
                  v-model="data.TrainingDetails.Kind"
                  @input="updateData"
                  :disabled="readonly"
                  :options="options"
                  class="mb-3"
                  value-field="item"
                  text-field="name"
                  disabled-field="notEnabled"
                ></b-form-radio-group>
              </b-form-group>
              <b-form-group
                id="sonst"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie Sonstige Art ein."
                label="Sonstige Art"
                label-for="son"
                v-if="data.TrainingDetails.Kind === 8"
              >
                <b-form-input
                  id="son"
                  v-model="data.TrainingDetails.MiscellaneousReason"
                  @input="updateData"
                  :readonly="readonly"
                ></b-form-input>
              </b-form-group>
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
                  :readonly="readonly"
                  v-model="data.Notes"
                  @input="updateData"
                  placeholder="Anmerkungen"
                  rows="3"
                  no-resize
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
  data() {
    return {
      selected: "",
      options: [
        { item: 5, name: "Seminar" },
        { item: 6, name: "Tagung" },
        { item: 7, name: "Lehrgang" },
        { item: 8, name: "Sonstiges" }
      ],
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: ""
    };
  },
  mounted() {
    var start = new Date(this.data.StartTime);
    var end = new Date(this.data.EndTime);
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
      this.data.StartTime = this.setTimezone(start);
      this.data.EndTime = this.setTimezone(end);
      this.updateData();
    },
    /**
     * Diese Methode setzt die verwendete Zeitzone von dem übergebenen Datum
     * @param datum Das Datum, welches angepasst werden soll
     * @returns Das angepasste Datum
     */
    setTimezone(datum) {
      datum.setHours(datum.getHours() + 1);
      return datum.toISOString() + "+01:00";
    }
  }
};
</script>
