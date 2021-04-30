<!-- Template für Reiseanträge -->
<template>
  <b-container fluid>
    <b-row align-h="center">
      <b-col cols="12">
        <!-- Titel der Begleitperson -->
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie den amtlichen Titel an."
          label="Amtlicher Titel"
          label-for="pn"
        >
          <b-form-input
            :id="index + 'tit'"
            v-model="data.title"
            v-on:input="update"
            :readonly="readonly"
          >
          </b-form-input>
          <b-form-invalid-feedback id="bezeichnung-feedback">
            Keine Bezeichnung angegeben!
          </b-form-invalid-feedback>
        </b-form-group>
        <!-- Akademischer Grad der Begleitperson -->
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie den Akademischen Grad an."
          label="Akademischer Grad"
          label-for="pn"
        >
          <b-form-input
            :id="index + 'deg'"
            v-model="data.degree"
            v-on:input="update"
            :readonly="readonly"
          >
          </b-form-input>
          <b-form-invalid-feedback id="bezeichnung-feedback">
            Keine Bezeichnung angegeben!
          </b-form-invalid-feedback>
        </b-form-group>
        <!-- Personalnummer der Begleitperson -->
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die Personalnummer ein."
          label="Personalnummer"
          label-for="pn"
        >
          <b-form-input
            :id="index + 'pn'"
            type="number"
            v-model="data.personalnummer"
            v-on:input="update"
            :readonly="readonly"
          >
          </b-form-input>
          <b-form-invalid-feedback id="bezeichnung-feedback">
            Keine Bezeichnung angegeben!
          </b-form-invalid-feedback>
        </b-form-group>
        <!-- Fortbewegungsart -->
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die Fortbewegungsart an."
          label="Fortbewegungsart"
          label-for="tp"
          :id="index + 'transport'"
        >
          <b-form-radio-group
            :id="index + 'tp'"
            v-model="data.transport"
            :disabled="readonly"
            v-on:change="update"
            :name="index + 'tp'"
            stacked
          >
            <b-form-radio value="0">Amtl. Buisnesskarte 2. Kl.</b-form-radio>
            <b-form-radio value="3">Beförderungszuschuss</b-form-radio>
            <b-form-radio value="6">Bahn 2. Kl. - gegen Beleg</b-form-radio>
            <b-form-radio value="8">Schlafwagen</b-form-radio>
            <b-form-radio value="1">MitfahrerInnen</b-form-radio>
            <b-form-radio value="4">Flug</b-form-radio>
            <b-form-radio value="5">Billigflug</b-form-radio>
            <b-form-radio value="9">Bus - gegen Beleg</b-form-radio>
            <b-form-radio value="2"
              >Amtl. Buisnesskarte / Bahnverrechnung 1. Kl.</b-form-radio
            >
            <b-form-radio value="7">Eigener PKW</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
        <!-- Begründung der Fortbewegungsart -->
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Reisezweck und Begründung der Notwendigkeit"
          label="Reisezweck"
          label-for="beg1"
          :id="index + 'bega1'"
        >
          <b-form-textarea
            :id="index + 'beg1'"
            v-model="data.reason1"
            :readonly="readonly"
            v-on:input="update"
            placeholder="Begründung"
            rows="3"
            no-resize
          ></b-form-textarea>
        </b-form-group>
        <!-- Ausgangspunkt -->
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="*nur wenn dadurch niedrigere Kosten anfallen"
          label="Ausgangspunkt"
          label-for="ap"
          :id="index + 'ausg'"
        >
          <b-form-radio-group
            :id="index + 'ap'"
            v-on:change="update"
            v-model="data.ausgangspunkt"
            :disabled="readonly"
            :name="index + 'ap'"
          >
            <b-form-radio value="1">Dienststelle</b-form-radio>
            <b-form-radio value="0">Wohnung*</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
        <!-- Zielpunkt -->
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="*nur wenn dadurch niedrigere Kosten anfallen"
          label="Endpunkt"
          label-for="ep"
          :id="index + 'endp'"
        >
          <b-form-radio-group
            :id="index + 'ep'"
            v-on:change="update"
            v-model="data.endpunkt"
            :disabled="readonly"
            :name="index + 'ep'"
          >
            <b-form-radio value="1">Dienstselle</b-form-radio>
            <b-form-radio value="0">Wohnung*</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
        <!-- Begründung -->
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Begründung des Antrags"
          label="Begründung"
          label-for="beg"
          :id="index + 'bega'"
        >
          <b-form-textarea
            :id="index + 'beg'"
            v-model="data.reason"
            :readonly="readonly"
            v-on:input="update"
            placeholder="Begründung"
            rows="3"
            no-resize
          ></b-form-textarea>
        </b-form-group>
        <!-- Bonusmeilen Bedingungen -->
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Akzeptieren Sie ggf. die Bedingungen für die Bonus-Meilen"
          label="Bonus-Meilen"
          label-for="bonus"
          :id="index + 'bonusm'"
        >
          <b-form-checkbox-group
            :id="index + 'bonus'"
            v-model="data.bonus_meilen"
            :disabled="readonly"
            v-on:change="update"
            :name="index + 'bonus'"
            stacked
          >
            <b-form-checkbox value="0"
              >Ich bestätige, dass ich anlässlich von Dienstreisen im Rahmen
              personenbezogener Bonusprogramme erworbene Prämien nicht privat in
              Anspruch nehme</b-form-checkbox
            >
            <b-form-checkbox value="1"
              >Für die Dienstreise verwende ich auf meinem Meilenkonto
              gutgeschriebene, dienstlich erworbene Meilen</b-form-checkbox
            >
          </b-form-checkbox-group>
        </b-form-group>
        <!-- Reisekosten andere Stellen -->
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Werden Reisekosten von anderen Stellen getragen?"
          label="Reisekosten - andere Stellen"
          label-for="reis"
          :id="index + 'reisa'"
        >
          <b-form-radio-group
            :id="index + 'reis'"
            v-on:change="update"
            v-model="data.reisekosten"
            :disabled="readonly"
            :name="index + 'reis'"
          >
            <b-form-radio value="false">Nein</b-form-radio>
            <b-form-radio value="true">Ja</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
        <!-- Aufenthaltskosten andere Stellen -->
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Werden Aufenthaltskosten von anderen Stellen getragen?"
          label="Aufenthaltskosten - andere Stellen"
          label-for="auf"
          :id="index + 'aufk'"
        >
          <b-form-radio-group
            :id="index + 'auf'"
            v-model="data.aufenthaltskosten"
            :disabled="readonly"
            v-on:change="update"
            :name="index + 'auf'"
          >
            <b-form-radio value="false">Nein</b-form-radio>
            <b-form-radio value="true">Ja</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
        <!-- Bezeichnung der anderen Stelle -->
        <b-form-group
          v-if="
            data.aufenthaltskosten === 'true' || data.reisekosten === 'true'
          "
          :id="index + 'vonaufk'"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Von welcher Stelle werden die Aufenthaltskosten getragen?"
          label="Von"
          label-for="vonauf"
        >
          <b-form-input
            v-on:input="update"
            v-model="data.von"
            :readonly="readonly"
            :id="index + 'vonauf'"
            type="text"
          >
          </b-form-input>
        </b-form-group>
        <!-- Sonstige Kosten -->
        <b-form-group
          :id="index + 'sonstkg'"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie sonstige Kosten an."
          label="Sonstige Kosten"
          label-for="sonstk"
        >
          <b-input-group>
            <b-input-group-text :id="index + 'eur-addon-1'" slot="append"
              ><span>€</span></b-input-group-text
            >
            <b-form-input
              v-on:input="update"
              v-model="data.sonstige_kosten"
              :readonly="readonly"
              :id="index + 'sonstk'"
              type="number"
            >
            </b-form-input>
          </b-input-group>
        </b-form-group>
        <!-- Geschätzte Kosten -->
        <b-form-group
          :id="index + 'geschkg'"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die geschätzten Kosten an."
          label="Geschätzte Kosten"
          label-for="geschk"
        >
          <b-input-group>
            <b-input-group-text :id="index + 'eur-addon-2'" slot="append"
              ><span>€</span></b-input-group-text
            >
            <b-form-input
              v-model="data.geschaetzte_kosten"
              :readonly="readonly"
              v-on:input="update"
              :id="index + 'geschk'"
              type="number"
            >
            </b-form-input>
          </b-input-group>
        </b-form-group>
        <!-- Businesskarte ausgefolgt -->
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Businesskarte ausgefolgt?"
          label="Businesskarte"
          label-for="reis"
          :id="index + 'reisa'"
        >
          <b-form-checkbox-group
            :id="index + 'bk'"
            v-on:change="update"
            v-model="data.business_karte"
            :disabled="readonly"
            :name="index + 'bk'"
          >
            <b-form-checkbox value="too">Hinfahrt</b-form-checkbox>
            <b-form-checkbox value="back">Rückfahrt</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  name: "NewApplication",
  props: ["escort", "index", "readonly", "app"],
  methods: {
    /**
     * Diese Methode sendet die Daten dieser Komponente an seinen Parent (Können mehrere Komponenten sein)
     */
    update() {
      this.$emit("update", this.index, this.data);
    }
  },
  data() {
    return {
      data: {
        degree: "",
        title: "",
        personalnummer: 0,
        transport: [],
        ausgangspunkt: 1,
        endpunkt: 1,
        reason1: "",
        reason: "",
        bonus_meilen: [],
        reisekosten: "false",
        aufenthaltskosten: "false",
        von: "",
        sonstige_kosten: 0,
        geschaetzte_kosten: 0,
        business_karte: []
      }
    };
  },
  mounted() {
    if (this.app !== undefined) {
      this.data.title = this.app.title;
      this.data.degree = this.app.degree;
      this.data.personalnummer = this.app.staffnr;
      this.data.transport = this.app.travel_mode;
      this.data.ausgangspunkt = this.app.starting_point;
      this.data.endpunkt = this.app.end_point;
      this.data.reason = this.app.reasoning;
      this.data.reason1 = this.app.travel_purpose;
      if (this.app.business_card_emitted_outward) {
        this.data.business_karte.push("too");
      }
      if (this.app.business_card_emitted_return) {
        this.data.business_karte.push("back");
      }
      var bm = [];
      if (this.app.bonus_mile_confirmation_1) {
        bm.push("0");
      }
      if (this.app.bonus_mile_confirmation_2) {
        bm.push("1");
      }
      this.data.bonus_meilen = bm;
      this.data.reisekosten = "" + this.app.travel_costs_paid_by_someone;
      this.data.aufenthaltskosten = "" + this.app.staying_costs_paid_by_someone;
      this.data.von = this.app.paid_by_whom;
      this.data.sonstige_kosten = this.app.other_costs;
      this.data.geschaetzte_kosten = this.app.estimated_costs;
    }
    this.update();
  }
};
</script>
