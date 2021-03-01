<template>
  <b-container fluid>
    <b-row align-h="center">
      <b-col cols="12">
        <b-container fluid>
          <b-row align-h="center">
            <b-col cols="12" md="8">
              <b-form-group
                id="bez"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die Bezeichnung der Schulveranstaltung ein."
                label="Bezeichnung"
                label-for="bezeichnung"
              >
                <b-form-input
                  id="bezeichnung"
                  v-model="data.bez"
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
                description="Geben Sie das Startdatum der Schulveranstaltung ein."
                label="Startdatum"
                label-for="std"
              >
                <b-form-datepicker
                  id="std"
                  v-model="data.startDate"
                  :readonly="readonly"
                  @input="updateData"
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
                  v-model="data.startTime"
                  :readonly="readonly"
                  @input="updateData"
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
                  v-model="data.endDate"
                  :readonly="readonly"
                  @input="updateData"
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
                  v-model="data.endTime"
                  :readonly="readonly"
                  @input="updateData"
                  locale="de"
                  placeholder="Zeit auswählen"
                ></b-form-timepicker>
              </b-form-group>
              <b-form-group
                id="begleit"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die Kürzel der Begleitpersonen im Format ''mmuster'' für z.B.: Max Muster ein."
                label="Begleitpersonen"
                label-for="begl"
              >
                <b-form-tags
                  id="begl"
                  input-id="tags-pills"
                  v-model="data.beg"
                  :readonly="readonly"
                  @input="updateData"
                  tag-variant="primary"
                  tag-pills
                  separator=" "
                  placeholder="Einträge durch Leerzeichen trennen"
                ></b-form-tags>
              </b-form-group>
              <b-form-group
                id="klassen"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die Kürzel der Klassen ein z.B.: ''5BHIT''"
                label="Jahrgänge"
                label-for="kl"
              >
                <b-form-tags
                  id="kl"
                  input-id="tags-pills"
                  v-model="data.kla"
                  :readonly="readonly"
                  @input="updateData"
                  tag-variant="primary"
                  tag-pills
                  separator=" "
                  placeholder="Einträge durch Leerzeichen trennen"
                ></b-form-tags>
              </b-form-group>
              <b-form-group
                id="schueler"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die anzahl der Schüler ein."
                label="Anzahl Schüler"
                label-for="aschueler"
              >
                <b-form-input
                  id="aschueler"
                  :readonly="readonly"
                  v-model="data.schueler"
                  @input="updateData"
                  type="number"
                  min="0"
                  max="3000"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="schuelerinnen"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die anzahl der Schülerinnen ein."
                label="Anzahl Schülerinnen"
                label-for="aschuelerin"
              >
                <b-form-input
                  id="aschuelerin"
                  v-model="data.schuelerinnen"
                  :readonly="readonly"
                  @input="updateData"
                  type="number"
                  min="0"
                  max="3000"
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
                  v-model="data.an"
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
  props: ["data","readonly"],
  methods: {
    updateData() {
      this.$emit('update', this.data);
    }
  }
};
</script>
