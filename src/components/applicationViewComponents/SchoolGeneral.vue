<!-- Template für Schulveranstaltungsanträge -->
<template>
  <b-container fluid>
    <b-row align-h="center">
      <b-col cols="12">
        <b-container fluid>
          <b-row align-h="center">
            <b-col cols="12" md="8">
              <!-- Input für den Namen der Schulveranstaltung -->
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
                  v-model="data.name"
                  :readonly="readonly"
                  @input="updateData"
                ></b-form-input>
              </b-form-group>
              <!-- Input für das Startdatum -->
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
              <!-- Input für die Startzeit -->
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
              <!-- Input für das Enddatum -->
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
              <!-- Input für die Endzeit -->
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
              <!-- Input für die Startadresse der SV -->
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
                  v-model="data.start_address"
                  :readonly="readonly"
                  v-on:input="updateData"
                >
                </b-form-input>
              </b-form-group>
              <!-- Input für die Zieladresse der SV -->
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
                  v-model="data.destination_address"
                  :readonly="readonly"
                  v-on:input="updateData"
                >
                </b-form-input>
              </b-form-group>
              <!-- Namen der Begleitpersonen -->
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
              <!-- Bezeichnungen der teilnehmenden Klassen -->
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
                  v-model="data.school_event_details.classes"
                  :disabled="readonly"
                  @input="updateData"
                  tag-variant="primary"
                  tag-pills
                  separator=" "
                  placeholder="Einträge durch Leerzeichen trennen"
                ></b-form-tags>
              </b-form-group>
              <!-- Anzahl der teilnehmenden Schüler -->
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
                  v-model="data.school_event_details.amount_male_students"
                  @input="updateData"
                  type="number"
                  min="0"
                  max="3000"
                ></b-form-input>
              </b-form-group>
              <!-- Anzahl der teilnehmenden Schülerinnen -->
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
                  v-model="data.school_event_details.amount_female_students"
                  :readonly="readonly"
                  @input="updateData"
                  type="number"
                  min="0"
                  max="3000"
                ></b-form-input>
              </b-form-group>
              <!-- Zusätzliche Anmerkungen -->
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
                  v-model="data.notes"
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
  props: ["data", "readonly", "url", "token", "refresh_token"],
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
    /**
     * Diese Methode sendet die aktuellen Daten an den Parent
     */
    updateData() {
      this.$emit("update", this.data);
    },
    /**
     * Diese Methode erstellt die Begleitlehrer-Objekte für die neu erstellen Begleiter
     */
    updateBeg() {
      var teach = [];
      teach.push(this.data.school_event_details.teachers[0]);
      var found = -1;
      for (let i = 0; i < this.beg.length; i++) {
        for (
          let j = 0;
          j < this.data.school_event_details.teachers.length;
          j++
        ) {
          found = -1;
          if (
            this.beg[i] === this.data.school_event_details.teachers[j].shortname
          ) {
            found = j;
          }
        }
        if (found !== -1) {
          teach.push(this.data.school_event_details.teachers[found]);
        } else {
          var l = this.getFullName(this.beg[i]);
          if (l.uuid === undefined) {
            return false;
          }
          teach.push({
            name: l.long,
            shortname: this.beg[i],
            attendance_from: this.data.start_time,
            attendance_till: this.data.end_time,
            group: "",
            start_address: this.data.start_address,
            meeting_point: this.data.start_address,
            role: 0
          });
        }
      }
      this.data.school_event_details.teachers = teach;
      this.updateData();
    },
    /**
     * Diese Methode gibt das Kürzel des Lehreres zurück
     * @param shortName Der Kürzel des Lehrers
     * @returns Der ausgeschriebene Name des Lehrers
     */
    getFullName(shortName) {
      axios
        .get(this.url + "/getLongName?name=" + shortName, {
          headers: {
            Authorization: "Basic " + this.token
          }
        })
        .then(response => {
          return response.data;
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
                    .get(this.url + "/getLongName?name=" + shortName, {
                      headers: {
                        Authorization: "Basic " + resp.data.access_token
                      }
                    })
                    .then(res => {
                      return res.data;
                    })
                    .catch(e => {
                      e.toString();
                      this.addFailed();
                    });
                })
                .catch(err => {
                  err.toString();
                  this.$emit("logout");
                });
              break;
            default:
              this.addFailed();
              return false;
          }
        });
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass ein Lehrer nicht hinzugefügt werden konnte
     */
    addFailed() {
      this.$bvToast.toast("Einer der Lehrer wurde nicht gefunden!", {
        title: "Ein Fehler ist aufgetreten!",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
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
      this.data.start_time = this.setTimezone(start);
      this.data.end_time = this.setTimezone(end);
      this.updateData();
    },
    /**
     * Diese Methode setzt die verwendete Zeitzone von dem übergebenen Datum
     * @param datum Das Datum, welches angepasst werden soll
     * @returns Das angepasste Datum
     */
    setTimezone(datum) {
      datum.setHours(datum.getHours() + 1);
      return datum.toISOString().replace("Z", "") + "+01:00";
    }
  },
  mounted() {
    var start = new Date(this.data.start_time);
    var end = new Date(this.data.end_time);
    start.setHours(start.getHours() - 1);
    end.setHours(end.getHours() - 1);
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
    for (
      let i = 0;
      i < this.data.school_event_details.teachers.length - 1;
      i++
    ) {
      this.beg.push(this.data.school_event_details.teachers[i + 1].shortname);
    }
  }
};
</script>
