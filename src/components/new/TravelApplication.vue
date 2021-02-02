<template>
  <b-container fluid>
    <b-row align-h="center">
      <b-col cols="12">
        <b-form-group
          id="pnum"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die Personalnummer der Begleitperson ein."
          label="Personalnummer"
          label-for="pn"
        >
          <b-form-input
            id="pn"
            type="number"
            v-model="data.description"
            :state="Desc"
            v-on:input="checkDesc"
          >
          </b-form-input>
          <b-form-invalid-feedback id="bezeichnung-feedback">
            Keine Bezeichnung angegeben!
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die Fortbewegungsart an."
          label="Fortbewegungsart"
          label-for="tp"
          id="transport"
        >
          <b-form-checkbox-group
            id="tp"
            v-model="selected"
            :aria-describedby="ariaDescribedby"
            name="flavour-2"
            stacked
          >
            <b-form-checkbox value="a1"
              >Amtl. Buisnesskarte 2. Kl.</b-form-checkbox
            >
            <b-form-checkbox value="a2">Beförderungszuschuss</b-form-checkbox>
            <b-form-checkbox value="a3"
              >Bahn 2. Kl. - gegen Beleg</b-form-checkbox
            >
            <b-form-checkbox value="a4">Schlafwagen</b-form-checkbox>
            <b-form-checkbox value="a5">MitfahrerInnen</b-form-checkbox>
            <b-form-checkbox value="a6">Flug</b-form-checkbox>
            <b-form-checkbox value="a7">Billigflug</b-form-checkbox>
            <b-form-checkbox value="a8">Bus - gengen Beleg</b-form-checkbox>
            <b-form-checkbox value="a9"
              >Amtl. Buisnesskarte / Bahnverrechnung 1. Kl.</b-form-checkbox
            >
            <b-form-checkbox value="a10">Eigener PKW</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="*nur wenn dadurch niedrigere Kosten anfallen"
          label="Ausgangspunkt"
          label-for="ap"
          id="ausg"
        >
          <b-form-radio-group
            id="ap"
            v-model="selected"
            :aria-describedby="ariaDescribedby"
            name="radio-sub-component"
          >
            <b-form-radio value="first">Dienststelle</b-form-radio>
            <b-form-radio value="second">Wohnung*</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="*nur wenn dadurch niedrigere Kosten anfallen"
          label="Endpunkt"
          label-for="ep"
          id="endp"
        >
          <b-form-radio-group
            id="ep"
            v-model="selected"
            :aria-describedby="ariaDescribedby"
            name="radio-sub-component"
          >
            <b-form-radio value="first">Dienstselle</b-form-radio>
            <b-form-radio value="second">Wohnung*</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  name: "NewApplication",
  methods: {
    changeComponent(
      component,
      back = true,
      application = null,
      escortsdata = null
    ) {
      this.$emit("change-component", component, back, application, escortsdata);
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
    },
    index() {
      if (this.checkClick()) {
        this.changeComponent("Index");
      }
    },
    makeToast() {
      this.$bvToast.toast("Es wurden nicht alle Felder richtig ausgefüllt!", {
        title: "Ein Fehler ist aufgetreten!",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
    },
    next() {
      if (this.checkClick()) {
        if (this.validInputs) {
          this.calculateLength();
          // Daten an Michi senden und so formatieren, dass Michi was damit anfangen kann
          this.changeComponent("Escorts", true, null, this.data);
        } else {
          this.makeToast();
          if (this.Time === null) this.Time = false;
          if (this.Desc === null) this.Desc = false;
          if (this.Teacher === null) this.Teacher = false;
          if (this.Students === null) this.Students = false;
          if (this.Class === null) this.Class = false;
        }
      }
    },
    calculateLength() {
      let start = new Date(this.data.startDate + "T" + this.data.startTime);
      let end = new Date(this.data.endDate + "T" + this.data.endTime);
      let diff = end.getTime() - start.getTime();
      let days = diff / (1000 * 3600 * 24);
      if (days <= 1) {
        this.exkursLength = "1";
      } else {
        if (days > 1 && days <= 3) {
          this.exkursLength = "2-3";
        } else {
          this.exkursLength = ">3";
        }
      }
    },
    checkDesc() {
      if (this.data.description === "") {
        this.Desc = false;
      } else {
        this.Desc = true;
      }
      this.checkInputs();
    },
    checkTeacher() {
      if (this.data.teacher.length === 0) {
        this.Teacher = false;
      } else {
        this.Teacher = true;
      }
      this.checkInputs();
    },
    checkClass() {
      if (this.data.class.length === 0) {
        this.Class = false;
      } else {
        this.Class = true;
      }
      this.checkInputs();
    },
    checkStudents() {
      if (this.data.count_student_male + this.data.count_student_female <= 0) {
        this.Students = false;
      } else {
        this.Students = true;
      }
      this.checkInputs();
    },
    checkTime() {
      if (
        this.data.startDate !== "" &&
        this.data.startTime !== "" &&
        this.data.endDate !== "" &&
        this.data.endTime !== ""
      ) {
        let start = new Date(this.data.startDate + "T" + this.data.startTime);
        let end = new Date(this.data.endDate + "T" + this.data.endTime);
        if (end - start <= 0) {
          this.Time = false;
        } else {
          this.Time = true;
        }
        this.checkInputs();
      }
    },
    checkInputs() {
      if (
        this.Time === true &&
        this.Desc === true &&
        this.Teacher === true &&
        this.Class === true &&
        this.Students === true
      ) {
        this.validInputs = true;
      } else {
        this.validInputs = false;
      }
    }
  },
  data() {
    return {
      data: {
        description: "",
        teacher: [],
        class: [],
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        count_student_male: 0,
        count_student_female: 0,
        notes: "",
        exkursLength: 0
      },
      validInputs: false,
      Time: null,
      Desc: null,
      Teacher: null,
      Class: null,
      Students: null
    };
  }
};
</script>
