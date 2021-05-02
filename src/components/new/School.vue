<!-- Template für einen Antrag einer Schulveranstaltung -->
<template>
  <b-container fluid>
    <b-row align-h="center">
      <b-col cols="12">
        <b-container fluid>
          <b-row align-v="center" align-h="center">
            <b-col cols="12" md="6">
              <h1 id="new-application-heading">Neuen Antrag erstellen</h1>
            </b-col>
            <div class="col-12 col-md-6">
              <!-- Home Button -->
              <b-button
                variant="outline-primary"
                class="float-right"
                v-on:click="index"
              >
                <b-icon icon="house" aria-hidden="true"></b-icon> Startseite
              </b-button>
            </div>
          </b-row>
          <b-row>
            <b-col cols="12">
              <!-- Verzeichnisanzeige -->
              <b-breadcrumb style="background-color: white">
                <b-breadcrumb-item v-on:click="uebersicht"
                  >Antrag Übersicht</b-breadcrumb-item
                >
                <b-breadcrumb-item active
                  >Schulveranstaltung - Allg. Infos</b-breadcrumb-item
                >
              </b-breadcrumb>
            </b-col>
          </b-row>
          <b-row align-h="center">
            <b-col cols="12" md="8">
              <!-- Name der SV -->
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
                  v-model="data.description"
                  :state="Desc"
                  v-on:input="checkDesc"
                >
                </b-form-input>
                <b-form-invalid-feedback id="bezeichnung-feedback">
                  Keine Bezeichnung angegeben!
                </b-form-invalid-feedback>
              </b-form-group>
              <!-- Startdatum -->
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
                  :state="Time"
                  v-on:input="checkTime"
                  class="mb-2"
                  placeholder="Datum auswählen"
                ></b-form-datepicker>
                <b-form-invalid-feedback id="std-feedback">
                  Start der Exkursion muss vor dem Ende der Exkursion sein!
                </b-form-invalid-feedback>
              </b-form-group>
              <!-- Startzeit -->
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
                  :state="Time"
                  v-on:input="checkTime"
                  locale="de"
                  placeholder="Zeit auswählen"
                ></b-form-timepicker>
                <b-form-invalid-feedback id="stz-feedback">
                  Start der Exkursion muss vor dem Ende der Exkursion sein!
                </b-form-invalid-feedback>
              </b-form-group>
              <!-- Enddatum -->
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
                  :state="Time"
                  v-on:input="checkTime"
                  class="mb-2"
                  placeholder="Datum auswählen"
                ></b-form-datepicker>
                <b-form-invalid-feedback id="end-feedback">
                  Start der Exkursion muss vor dem Ende der Exkursion sein!
                </b-form-invalid-feedback>
              </b-form-group>
              <!-- Endzeit -->
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
                  :state="Time"
                  v-on:input="checkTime"
                  locale="de"
                  placeholder="Zeit auswählen"
                ></b-form-timepicker>
                <b-form-invalid-feedback id="enz-feedback">
                  Start der Exkursion muss vor dem Ende der Exkursion sein!
                </b-form-invalid-feedback>
              </b-form-group>
              <!-- Treffpunkt -->
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
                  v-model="data.start"
                  :state="Start"
                  v-on:input="checkStart"
                  list="startadd"
                >
                </b-form-input>
                <datalist id="startadd">
                  <option>Wexstraße 19-23, 1200 Wien, Österreich</option>
                </datalist>
                <b-form-invalid-feedback id="bezeichnung-feedback">
                  Keine Startadresse angegeben!
                </b-form-invalid-feedback>
              </b-form-group>
              <!-- Zieladresse -->
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
                  v-model="data.ziel"
                  :state="Ziel"
                  v-on:input="checkZiel"
                >
                </b-form-input>
                <b-form-invalid-feedback id="bezeichnung-feedback">
                  Keine Zieladresse angegeben!
                </b-form-invalid-feedback>
              </b-form-group>
              <!-- Kürzel der Begleitpersonen -->
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
                  input-id="tags-pills1"
                  v-model="data.teacher"
                  tag-variant="primary"
                  tag-pills
                  separator=" "
                  placeholder="Einträge durch Leerzeichen trennen"
                ></b-form-tags>
              </b-form-group>
              <!-- Bezeichnungen der Klassen -->
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
                  input-id="tags-pills2"
                  v-model="data.class"
                  :state="Class"
                  v-on:input="checkClass"
                  tag-variant="primary"
                  tag-pills
                  separator=" "
                  placeholder="Einträge durch Leerzeichen trennen"
                ></b-form-tags>
                <b-form-invalid-feedback id="kl-feedback">
                  Keine Jahrgänge angegeben!
                </b-form-invalid-feedback>
              </b-form-group>
              <div v-for="(clas, index) in data.class" v-bind:key="index">
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
                    type="number"
                    min="0"
                    max="3000"
                    v-model="data.count_student_male[index]"
                    :state="Students[index]"
                    v-on:input="checkStudents"
                  ></b-form-input>
                  <b-form-invalid-feedback id="aschueler-feedback">
                    Keine Schüler/Schülerinnen angegeben!
                  </b-form-invalid-feedback>
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
                    type="number"
                    min="0"
                    max="3000"
                    v-model="data.count_student_female[index]"
                    :state="Students[index]"
                    v-on:input="checkStudents"
                  ></b-form-input>
                  <b-form-invalid-feedback id="aschuelerin-feedback">
                    Keine Schüler/Schülerinnen angegeben!
                  </b-form-invalid-feedback>
                </b-form-group>
              </div>
              <!-- Anmerkungen -->
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
                ></b-form-textarea>
              </b-form-group>
              <center>
                <!-- Button um zu den Begleitformularen zu kommen -->
                <button v-on:click="next" class="blueish-gradiant">
                  weiter
                </button>
              </center>
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
  methods: {
    /**
     * Diese Methode ändert die angezeigte Komponente
     * @param component Die neue Komponente, welche angezeigt werden soll
     * @param back Boolean-Wert, ob die neue Komponente in die History des Browsers gespeichert werden soll
     * @param application Die ID des Antrags, welcher angezeigt werden soll
     * @param escortsdata Die Daten der Schulveranstaltung
     */
    changeComponent(
      component,
      back = true,
      application = null,
      escortsdata = null
    ) {
      this.$emit("change-component", component, back, application, escortsdata);
    },
    /**
     * Diese Methode sorgt dafür, dass nicht unnötigerweise geclickt wird, falls nur makiert worden ist
     */
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
    /**
     * Diese Methode leitet den Benutzer auf die Startseite weiter
     */
    index() {
      if (this.checkClick()) {
        this.changeComponent("Index");
      }
    },
    /**
     * Diese Methode zeigt dem Benutzer an, dass nicht alle Felder richtig ausgefüllt worden sind
     */
    makeToast() {
      this.$bvToast.toast("Es wurden nicht alle Felder richtig ausgefüllt!", {
        title: "Ein Fehler ist aufgetreten!",
        autoHideDelay: 2500,
        appendToast: false,
        variant: "danger"
      });
    },
    /**
     * Diese Methode leitet den Benutzer weiter, sofern alle Daten richtig gesetzt worden sind
     */
    next() {
      if (this.checkClick()) {
        if (this.validInputs) {
          this.makeUpper();
          this.calculateLength();
          this.changeComponent("Escorts", true, null, this.data);
        } else {
          this.makeToast();
          if (this.Time === null) this.Time = false;
          if (this.Desc === null) this.Desc = false;
          if (this.Students === null) this.Students = false;
          if (this.Class === null) this.Class = false;
          if (this.Start === null) this.Start = false;
          if (this.Ziel === null) this.Ziel = false;
        }
      }
    },
    /**
     * Diese Methode schreibt alle Klassen richtig an
     */
    makeUpper() {
      for (let i = 0; i < this.data.class.length; i++) {
        this.data.class[i] = this.data.class[i].toUpperCase();
      }
    },
    /**
     * Diese Methode berechnet die Dauer der Schulveranstaltung
     */
    calculateLength() {
      let start = new Date(this.data.startDate + "T" + this.data.startTime);
      let end = new Date(this.data.endDate + "T" + this.data.endTime);
      let diff = end.getTime() - start.getTime();
      let days = diff / (1000 * 3600 * 24);
      this.data.exkursLength = Math.ceil(days);
    },
    /**
     * Diese Methode überprüft, ob die Bezeichnung der Schulveranstaltung angegeben worden ist
     */
    checkDesc() {
      if (this.data.description === "") {
        this.Desc = false;
      } else {
        this.Desc = true;
      }
      this.checkInputs();
    },
    /**
     * Diese Methode überprüft, ob Klassen angegeben worden sind
     */
    checkClass() {
      for (let i = 0; i < this.data.class.length; i++) {
        this.data.class[i] = ("" + this.data.class[i]).toUpperCase();
      }
      if (this.data.class.length === 0) {
        this.Class = false;
      } else {
        this.Class = true;
      }
      this.checkInputs();
    },
    /**
     * Diese Methode überprüft, ob SchülerInnen angegeben worden sind
     */
    checkStudents() {
      for (let i = 0; i < this.data.count_student_male.length; i++) {
        if (
          this.data.count_student_male[i] + this.data.count_student_female[i] <=
          0
        ) {
          this.Students[i] = false;
        } else {
          this.Students[i] = true;
        }
      }
      this.checkInputs();
    },
    /**
     * Diese Methode überprüft die eingegebenen Daten, ob diese einen sinnvollen Wert haben
     */
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
    /**
     * Diese Methode überprüft, ob die Startadresse eingegeben worden ist
     */
    checkStart() {
      if (this.data.start === "") {
        this.Start = false;
      } else {
        this.Start = true;
      }
    },
    /**
     * Diese Methode überprüft, ob die Zieladresse eingegeben worden ist
     */
    checkZiel() {
      if (this.data.ziel === "") {
        this.Ziel = false;
      } else {
        this.Ziel = true;
      }
    },
    /**
     * Diese Methode leitet den Benutzer auf die NewApplication-Seite weiter
     */
    uebersicht() {
      if (this.checkClick()) {
        this.changeComponent("NewApplication");
      }
    },
    /**
     * Diese Methode überprüft, ob die Eingaben valide sind
     */
    checkInputs() {
      if (
        this.Time === true &&
        this.Desc === true &&
        this.Class === true &&
        this.Students === true &&
        this.Start === true &&
        this.Ziel === true
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
        start: "",
        ziel: "",
        count_student_male: [],
        count_student_female: [],
        notes: "",
        exkursLength: 0
      },
      validInputs: false,
      Time: null,
      Desc: null,
      Class: null,
      Students: [],
      Start: null,
      Ziel: null
    };
  }
};
</script>
