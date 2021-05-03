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
                  placeholder="Straße & Nr., Postleitzahl & Ort, Land"
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
                description="Die Begleitpersonen anwesend bei der Schulveranstaltung"
                label="Begleitpersonen"
                label-for="begl"
              >
                <b-form-tags
                  id="begl"
                  input-id="tags-pills1"
                  v-model="beg"
                  :disabled="true"
                  tag-variant="primary"
                  tag-pills
                  separator=" "
                  placeholder=""
                ></b-form-tags>
              </b-form-group>
              <!-- Bezeichnungen der teilnehmenden Klassen -->
              <b-form-group
                id="klassen"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Die Jahrgänge anwesend bei der Schulveranstaltung"
                label="Jahrgänge"
                label-for="kl"
              >
                <b-form-tags
                  id="kl"
                  input-id="tags-pills2"
                  v-model="data.school_event_details.classes"
                  :disabled="true"
                  @input="updateData"
                  tag-variant="primary"
                  tag-pills
                  separator=" "
                  placeholder=""
                ></b-form-tags>
              </b-form-group>
              <div
                v-for="(clas, index) in data.school_event_details.classes"
                v-bind:key="clas"
              >
                <!-- Anzahl der teilnehmenden Schüler -->
                <b-form-group
                  id="schueler"
                  label-cols-sm="4"
                  label-cols-lg="3"
                  content-cols-sm
                  content-cols-lg="7"
                  :description="
                    'Geben Sie die Anzahl der Schüler der ' + clas + ' ein.'
                  "
                  :label="'Anzahl Schüler ' + clas"
                  label-for="aschueler"
                >
                  <b-form-input
                    id="aschueler"
                    :readonly="readonly"
                    v-model="
                      data.school_event_details.amount_male_students[index]
                    "
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
                  :description="
                    'Geben Sie die Anzahl der Schülerinnen der ' +
                      clas +
                      ' ein.'
                  "
                  :label="'Anzahl Schülerinnen ' + clas"
                  label-for="aschuelerin"
                >
                  <b-form-input
                    id="aschuelerin"
                    v-model="
                      data.school_event_details.amount_female_students[index]
                    "
                    :readonly="readonly"
                    @input="updateData"
                    type="number"
                    min="0"
                    max="3000"
                  ></b-form-input>
                </b-form-group>
              </div>
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
              <!-- Fehlende Lehrkräfte -->
              <b-form-group
                id="waiting"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                description="Die Lehrkräfte, die noch nicht die Daten angegeben haben"
                label="Fehlende Informationen"
                label-for="fl"
              >
                <b-form-tags
                  id="fl"
                  input-id="tags-pills3"
                  v-model="waiting"
                  :disabled="true"
                  tag-variant="primary"
                  tag-pills
                  placeholder=""
                ></b-form-tags>
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
  props: ["data", "readonly", "url", "token", "refresh_token"],
  data() {
    return {
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      beg: [],
      waiting: []
    };
  },
  methods: {
    /**
     * Diese Methode wandelt die Inputs der Schüler in Zahlen um
     */
    makeNumber() {
      for (
        let i = 0;
        i < this.data.school_event_details.amount_male_students.length;
        i++
      ) {
        this.data.school_event_details.amount_male_students[i] = Number(
          this.data.school_event_details.amount_male_students[i]
        );
        this.data.school_event_details.amount_female_students[i] = Number(
          this.data.school_event_details.amount_female_students[i]
        );
      }
    },
    /**
     * Diese Methode sendet die aktuellen Daten an den Parent
     */
    updateData() {
      this.makeNumber();
      this.$emit("update", this.data);
    },
    /**
     * Diese Methode berechnet, welcher Lehrer noch nicht seine Informationen eingegeben hat
     */
    checkFinished(index) {
      if (this.data.progress < 5) {
        var allInput = true;
        if (
          this.data.school_event_details.teachers[index].attendance_from !==
            "" &&
          this.data.school_event_details.teachers[index].attendance_from !==
            undefined &&
          this.data.school_event_details.teachers[index].attendance_from !==
            null
        ) {
          if (
            this.data.school_event_details.teachers[index].attendance_till !==
              "" &&
            this.data.school_event_details.teachers[index].attendance_till !==
              undefined &&
            this.data.school_event_details.teachers[index].attendance_till !==
              null
          ) {
            if (
              this.data.school_event_details.teachers[index].group === 1 ||
              this.data.school_event_details.teachers[index].group === 2 ||
              this.data.school_event_details.teachers[index].group === 3
            ) {
              if (
                this.data.school_event_details.teachers[index].start_address !==
                  "" &&
                this.data.school_event_details.teachers[index].start_address !==
                  undefined &&
                this.data.school_event_details.teachers[index].start_address !==
                  null
              ) {
                if (
                  this.data.school_event_details.teachers[index]
                    .meeting_point !== "" &&
                  this.data.school_event_details.teachers[index]
                    .meeting_point !== undefined &&
                  this.data.school_event_details.teachers[index]
                    .meeting_point !== null
                ) {
                  if (
                    this.data.business_trip_applications[index].staffnr !==
                      "" &&
                    this.data.business_trip_applications[index].staffnr !==
                      undefined &&
                    this.data.business_trip_applications[index].staffnr !==
                      null &&
                    ("" + this.data.business_trip_applications[index].staffnr)
                      .length === 8
                  ) {
                    if (
                      this.data.business_trip_applications[index]
                        .travel_mode !== "" &&
                      this.data.business_trip_applications[index]
                        .travel_mode !== undefined &&
                      this.data.business_trip_applications[index]
                        .travel_mode !== null
                    ) {
                      allInput = true;
                    } else {
                      return false;
                    }
                  } else {
                    return false;
                  }
                } else {
                  return false;
                }
              } else {
                return false;
              }
            } else {
              return false;
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
      if (allInput) {
        return true;
      }
      if (this.data.progress >= 5) {
        if (
          this.data.travel_invoices[index].daily_charges_mode === 0 ||
          this.data.travel_invoices[index].daily_charges_mode === 1 ||
          this.data.travel_invoices[index].daily_charges_mode === 2
        ) {
          if (this.data.travel_invoices[index].daily_charges_mode === 2) {
            if (
              this.data.travel_invoices[index].shortened_amount === "" ||
              isNaN(this.data.travel_invoices[index].shortened_amount) ||
              this.data.travel_invoices[index].shortened_amount === undefined ||
              this.data.travel_invoices[index].shortened_amount === null
            ) {
              return false;
            }
          }
          if (
            this.data.travel_invoices[index].nightly_charges_mode === 0 ||
            this.data.travel_invoices[index].nightly_charges_mode === 1 ||
            this.data.travel_invoices[index].nightly_charges_mode === 2
          ) {
            if (
              this.data.travel_invoices[index].breakfasts !== "" &&
              this.data.travel_invoices[index].breakfasts !== undefined &&
              this.data.travel_invoices[index].breakfasts !== null
            ) {
              if (
                this.data.travel_invoices[index].lunches !== "" &&
                this.data.travel_invoices[index].lunches !== undefined &&
                this.data.travel_invoices[index].lunches !== null
              ) {
                if (
                  this.data.travel_invoices[index].dinners !== "" &&
                  this.data.travel_invoices[index].dinners !== undefined &&
                  this.data.travel_invoices[index].dinners !== null
                ) {
                  if (this.data.travel_invoices[index].kilometre_allowance) {
                    if (
                      this.data.travel_invoices[index].kilometre_amount ===
                        "" ||
                      this.data.travel_invoices[index].kilometre_amount ===
                        undefined ||
                      this.data.travel_invoices[index].kilometre_amount === null
                    ) {
                      return false;
                    }
                  }
                  if (
                    this.data.travel_invoices[index].calculation
                      .sum_travel_costs !== "" &&
                    this.data.travel_invoices[index].calculation
                      .sum_travel_costs !== undefined &&
                    this.data.travel_invoices[index].calculation
                      .sum_travel_costs !== null
                  ) {
                    if (
                      this.data.travel_invoices[index].calculation
                        .sum_daily_charges !== "" &&
                      this.data.travel_invoices[index].calculation
                        .sum_daily_charges !== undefined &&
                      this.data.travel_invoices[index].calculation
                        .sum_daily_charges !== null
                    ) {
                      if (
                        this.data.travel_invoices[index].calculation
                          .sum_nightly_charges !== "" &&
                        this.data.travel_invoices[index].calculation
                          .sum_nightly_charges !== undefined &&
                        this.data.travel_invoices[index].calculation
                          .sum_nightly_charges !== null
                      ) {
                        if (
                          this.data.travel_invoices[index].calculation
                            .sum_additional_costs !== "" &&
                          this.data.travel_invoices[index].calculation
                            .sum_additional_costs !== undefined &&
                          this.data.travel_invoices[index].calculation
                            .sum_additional_costs !== null
                        ) {
                          if (
                            this.data.travel_invoices[index].calculation
                              .sum_of_sums !== "" &&
                            this.data.travel_invoices[index].calculation
                              .sum_of_sums !== undefined &&
                            this.data.travel_invoices[index].calculation
                              .sum_of_sums !== null
                          ) {
                            if (
                              this.data.travel_invoices[index].calculation
                                .rows !== null
                            ) {
                              return true;
                            } else {
                              return false;
                            }
                          } else {
                            return false;
                          }
                        } else {
                          return false;
                        }
                      } else {
                        return false;
                      }
                    } else {
                      return false;
                    }
                  } else {
                    return false;
                  }
                } else {
                  return false;
                }
              } else {
                return false;
              }
            } else {
              return false;
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
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
    for (
      let i = 0;
      i < this.data.school_event_details.teachers.length - 1;
      i++
    ) {
      this.beg.push(this.data.school_event_details.teachers[i + 1].shortname);
    }
    this.waiting = [];
    for (let i = 0; i < this.data.school_event_details.teachers.length; i++) {
      if (!this.checkFinished(i)) {
        this.waiting.push(this.data.school_event_details.teachers[i].shortname);
      }
    }
  }
};
</script>
