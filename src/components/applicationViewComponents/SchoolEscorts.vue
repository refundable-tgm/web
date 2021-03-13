<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12">
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
            :disabled="readonly"
            :options="options"
            v-on:change="updateRadio"
            class="mb-3"
            value-field="item"
            text-field="name"
            disabled-field="notEnabled"
          ></b-form-radio-group>
        </b-form-group>
        <b-form-group
          id="ziel"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie Ihre Startadresse für diese Schulveranstaltung ein."
          label="Startaddresse"
          label-for="za"
        >
          <b-form-input
            id="za"
            placeholder="Straße & Nr., Postleitzahl & Ort, Land"
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
          description="Geben Sie den Treffpunkt für diese Schulveranstaltung ein."
          label="Treffpunkt"
          label-for="za"
        >
          <b-form-input
            id="za"
            placeholder="Straße & Nr., Postleitzahl & Ort, Land"
            v-model="data.MeetingPoint"
            :readonly="readonly"
            v-on:input="updateData"
          >
          </b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: ["data", "readonly"],
  methods: {
    updateData() {
      this.$emit("update", this.data);
    },
    updateRadio() {
      this.data.Group = this.selected;
      this.updateData();
    },
    updateTime() {
      var start = new Date(this.startDate);
      start.setHours(this.startTime.split(":")[0]);
      start.setMinutes(this.startTime.split(":")[1]);
      var end = new Date(this.endDate);
      end.setHours(this.endTime.split(":")[0]);
      end.setMinutes(this.endTime.split(":")[1]);
      this.data.AttendanceFrom = start;
      this.data.AttendanceTill = end;
      this.updateData();
    }
  },
  mounted() {
    this.selected = this.data.Group;
    var start = new Date(this.data.AttendanceFrom);
    var end = new Date(this.data.AttendanceTill);
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
        { item: 1, name: "L1" },
        { item: 2, name: "L2" },
        { item: 3, name: "L3" }
      ],
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: ""
    };
  }
};
</script>
