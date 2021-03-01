<template>
  <b-container fluid>
    <b-row align-h="center">
      <b-col cols="12">
        <b-form-group
          c
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die Personalnummer der Begleitperson ein."
          label="Personalnummer"
          label-for="pn"
        >
          <b-form-input
            :id="index + 'pn'"
            type="number"
            v-model="data.personalnummer"
            v-on:input="update"
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
          :id="index + 'transport'"
        >
          <b-form-checkbox-group
            :id="index + 'tp'"
            v-model="data.transport"
            v-on:change="update"
            :name="index + 'tp'"
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
          :id="index + 'ausg'"
        >
          <b-form-radio-group
            :id="index + 'ap'"
            v-on:change="update"
            v-model="data.ausgangspunkt"
            :name="index + 'ap'"
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
          :id="index + 'endp'"
        >
          <b-form-radio-group
            :id="index + 'ep'"
            v-on:change="update"
            v-model="data.endpunkt"
            :name="index + 'ep'"
          >
            <b-form-radio value="first">Dienstselle</b-form-radio>
            <b-form-radio value="second">Wohnung*</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Begründung der obigen Faktoren"
          label="Begründung"
          label-for="beg"
          :id="index + 'bega'"
        >
          <b-form-textarea
            :id="index + 'beg'"
            v-model="data.reason"
            v-on:input="update"
            placeholder="Begründung"
            rows="3"
            no-resize
          ></b-form-textarea>
        </b-form-group>
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
            v-on:change="update"
            :name="index + 'bonus'"
            stacked
          >
            <b-form-checkbox value="a1"
              >Ich bestätige, dass ich anlässlich von Dienstreisen im Rahmen
              personenbezogener Bonusprogramme erworbene Prämien nicht privat in
              Anspruch nehme</b-form-checkbox
            >
            <b-form-checkbox value="a2"
              >Für die Dienstreise verwende ich auf meinem Meilenkonto
              gutgeschriebene, dienstlich erworbene Meilen</b-form-checkbox
            >
          </b-form-checkbox-group>
        </b-form-group>
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
            :name="index + 'reis'"
          >
            <b-form-radio value="first">Nein</b-form-radio>
            <b-form-radio value="second">Ja</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
        <b-form-group
          v-if="data.reisekosten === 'second'"
          :id="index + 'vonreisa'"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Von welcher Stelle werden die Reisekosten getragen?"
          label="Von"
          label-for="vonreis"
        >
          <b-form-input
            v-model="data.reisekosten_von"
            v-on:input="update"
            :id="index + 'vonreis'"
            type="text"
          >
          </b-form-input>
        </b-form-group>
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
            v-on:change="update"
            :name="index + 'auf'"
          >
            <b-form-radio value="first">Nein</b-form-radio>
            <b-form-radio value="second">Ja</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
        <b-form-group
          v-if="data.aufenthaltskosten === 'second'"
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
            v-model="data.aufenthaltskosten_von"
            :id="index + 'vonauf'"
            type="text"
          >
          </b-form-input>
        </b-form-group>
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
              :id="index + 'sonstk'"
              type="number"
            >
            </b-form-input>
          </b-input-group>
        </b-form-group>
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
              v-on:input="update"
              :id="index + 'geschk'"
              type="number"
            >
            </b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  name: "NewApplication",
  props: ["escort", "index"],
  methods: {
    update() {
      this.$emit("update", this.index, this.data);
    }
  },
  data() {
    return {
      data: {
        personalnummer: null,
        transport: [],
        ausgangspunkt: "",
        endpunkt: "",
        reason: "",
        bonus_meilen: [],
        reisekosten: null,
        reisekosten_von: "",
        aufenthaltskosten: null,
        aufenthaltskosten_von: "",
        sonstige_kosten: null,
        geschaetzte_kosten: null
      }
    };
  }
};
</script>
