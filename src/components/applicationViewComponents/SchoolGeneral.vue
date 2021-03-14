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
                description="Geben Sie das Startdatum der Schulveranstaltung ein."
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
                description="Geben Sie die Startzeit der Schulveranstaltung ein."
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
                description="Geben Sie das Enddatum der Schulveranstaltung ein."
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
                description="Geben Sie die Endzeit der Schulveranstaltung ein."
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
                id="treff"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die genaue Startadresse der Schulveranstaltung ein."
                label="Startadresse"
                label-for="ta"
              >
                <b-form-input
                  id="ta"
                  placeholder="Wexstraße 19-23, 1200 Wien, Österreich"
                  v-model="data.StartAddress"
                  :readonly="readonly"
                  v-on:input="updateData"
                >
                </b-form-input>
              </b-form-group>
              <b-form-group
                id="ziel"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Geben Sie die genaue Zieladresse der Schulveranstaltung ein."
                label="Zieladresse"
                label-for="za"
              >
                <b-form-input
                  id="za"
                  placeholder="Straße & Nr., Postleitzahl & Ort, Land"
                  v-model="data.DestinationAddress"
                  :readonly="readonly"
                  v-on:input="updateData"
                >
                </b-form-input>
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
                  v-model="beg"
                  :disabled="readonly"
                  @input="updateBeg"
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
                  v-model="data.SchoolEventDetails.Classes"
                  :disabled="readonly"
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
                  v-model="data.SchoolEventDetails.AmountMaleStudents"
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
                  v-model="data.SchoolEventDetails.AmountFemaleStudents"
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
import axios from "axios";
export default {
  name: "NewApplication",
  props: ["data", "readonly", "url", "token"],
  data() {
    return {
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      beg: []
    };
  },
  methods: {
    updateData() {
      this.$emit("update", this.data);
    },
    updateBeg() {
      var teach = [];
      teach.push(this.data.SchoolEventDetails.Teachers[0]);
      var found = -1;
      for (let i = 0; i < this.beg.length; i++) {
        for (let j = 0; j < this.data.SchoolEventDetails.Teachers.length; j++) {
          found = -1;
          if (
            this.beg[i] === this.data.SchoolEventDetails.Teachers[j].Shortname
          ) {
            found = j;
          }
        }
        if (found !== -1) {
          teach.push(this.data.SchoolEventDetails.Teachers[found]);
        } else {
          var l = this.getFullName(this.beg[i]);
          teach.push({
            Name: l,
            Shortname: this.beg[i],
            AttendanceFrom: "",
            AttendanceTill: "",
            Group: "",
            StartAddress: this.data.StartAddress,
            MeetingPoint: this.data.StartAddress,
            Role: 0
          });
        }
      }
      this.data.SchoolEventDetails.Teachers = teach;
      this.updateData();
    },
    getFullName(shortName) {
      axios
        .get(this.url + "/getLongName?name=" + shortName, {
          params: {
            token: this.token
          }
        })
        .then(response => {
          return response.data.long;
        });
      return shortName;
    },
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
    setTimezone(datum) {
      datum.setHours(datum.getHours() + 1);
      return datum.toISOString() + "+01:00";
    }
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
    for (let i = 0; i < this.data.SchoolEventDetails.Teachers.length - 1; i++) {
      this.beg.push(this.data.SchoolEventDetails.Teachers[i + 1].Shortname);
    }
  }
};
</script>
