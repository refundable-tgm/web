<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12">
        <center>
          <h2>{{ escort.name }}</h2>
        </center>

        <b-form-group
          :id="index + 'sdg'"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie das Startdatum der Schulveranstaltung ein."
          label="Startdatum"
          label-for="std"
        >
          <b-form-datepicker
            :id="index + 'sdp'"
            v-model="escort.startDate"
            v-on:input="changeStartDate"
            :state="validTime"
            class="mb-2"
            placeholder="Datum auswählen"
          ></b-form-datepicker>
          <b-form-invalid-feedback :id="index + 'sdp-feedback'">
            <a v-if="outBaseTime">
              Die Daten müssen zwischen Start und Ende der Exkursion sein!</a
            ><br />
            <a v-if="negTime">
              Das Startdatum darf nicht nach dem Enddatum sein!
            </a>
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
          :id="index + 'stg'"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die Startzeit der Schulveranstaltung ein."
          label="Startzeit"
          label-for="stz"
        >
          <b-form-timepicker
            :id="index + 'stp'"
            v-model="escort.startTime"
            v-on:input="changeStartTime"
            :state="validTime"
            locale="de"
            placeholder="Zeit auswählen"
          ></b-form-timepicker>
          <b-form-invalid-feedback :id="index + 'stp-feedback'">
            <a v-if="outBaseTime">
              Die Daten müssen zwischen Start und Ende der Exkursion sein!</a
            ><br />
            <a v-if="negTime">
              Das Startdatum darf nicht nach dem Enddatum sein!
            </a>
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
          :id="index + 'edg'"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie das Enddatum der Schulveranstaltung ein."
          label="Enddatum"
          label-for="end"
        >
          <b-form-datepicker
            :id="index + 'edp'"
            v-model="escort.endDate"
            v-on:input="changeEndDate"
            :state="validTime"
            class="mb-2"
            placeholder="Datum auswählen"
          ></b-form-datepicker>
          <b-form-invalid-feedback :id="index + 'edp-feedback'">
            <a v-if="outBaseTime">
              Die Daten müssen zwischen Start und Ende der Exkursion sein!</a
            ><br />
            <a v-if="negTime">
              Das Startdatum darf nicht nach dem Enddatum sein!
            </a>
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
          :id="index + 'etg'"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die Endzeit der Schulveranstaltung ein."
          label="Endzeit"
          label-for="enz"
        >
          <b-form-timepicker
            :id="index + 'etp'"
            v-model="escort.endTime"
            v-on:input="changeEndTime"
            :state="validTime"
            locale="de"
            placeholder="Zeit auswählen"
          ></b-form-timepicker>
          <b-form-invalid-feedback :id="index + 'etp-feedback'">
            <a v-if="outBaseTime">
              Die Daten müssen zwischen Start und Ende der Exkursion sein!</a
            ><br />
            <a v-if="negTime">
              Das Startdatum darf nicht nach dem Enddatum sein!
            </a>
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
          :id="index + 'gruppe'"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Wählen Sie die Gruppe der Begleitperson"
          label="Gruppe"
          label-for="gr"
        >
          <b-form-radio-group
            :id="index + 'rg'"
            v-model="escort.selected"
            v-on:change="changeSelected"
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
  props: ["escort", "index", "bsd", "bst", "bed", "bet"],
  data() {
    return {
      selected: "",
      validTime: null,
      outBaseTime: true,
      negTime: true,
      options: [
        {item:"A", name:"L1"},
        {item:"B", name:"L2"},
        {item:"C", name:"L3"}
      ]
    };
  },
  methods: {
    changeStartTime() {
      this.checkInputs();
      this.$emit("startTime", this.index, this.escort.startTime);
    },
    changeStartDate() {
      this.checkInputs();
      this.$emit("startDate", this.index, this.escort.startDate);
    },
    changeEndDate() {
      this.checkInputs();
      this.$emit("endDate", this.index, this.escort.endDate);
    },
    changeEndTime() {
      this.checkInputs();
      this.$emit("endTime", this.index, this.escort.endTime);
    },
    changeSelected() {
      this.$emit("selected", this.index, this.escort.selected);
    },
    checkInputs() {
      if (
        this.escort.startDate !== "" &&
        this.escort.startTime !== "" &&
        this.escort.endDate !== "" &&
        this.escort.endTime !== ""
      ) {
        let start = new Date(
          this.escort.startDate + "T" + this.escort.startTime
        );
        let end = new Date(this.escort.endDate + "T" + this.escort.endTime);
        let baseStart = new Date(this.bsd + "T" + this.bst);
        let baseEnd = new Date(this.bed + "T" + this.bet);
        if (start >= baseStart && end <= baseEnd) {
          this.outBaseTime = false;
          if (end - start <= 0) {
            this.negTime = true;
            this.validTime = false;
          } else {
            this.negTime = false;
            this.validTime = true;
          }
        } else {
          this.outBaseTime = true;
          this.validTime = false;
        }
      } else {
        this.validTime = null;
      }
      this.$emit("validTime", this.validTime);
    }
  },
  mounted() {
    this.checkInputs();
  }
};
</script>
