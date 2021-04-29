<!-- Template für Reiserechnungen -->
<template>
  <b-container fluid>
    <b-row align-h="center">
      <b-col cols="12">
        <!-- Zusätzliche Daten -->
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Bitte geben Sie die zutreffenden zusätzlichen Daten an"
          label="Zusätzliche Daten"
          label-for="zud"
          id="zu"
        >
          <b-form-checkbox-group
            id="zud"
            v-model="data.selected"
            v-on:input="update"
            :disabled="readonly"
            stacked
          >
            <b-form-checkbox value="a1"
              >Amtl. Buisnesskarte erhalten</b-form-checkbox
            >
            <b-form-checkbox value="a2">Beförderungszuschuss</b-form-checkbox>
            <b-form-checkbox value="a3"
              >Ersatz für Vorteilscard (Beleg anschließen)</b-form-checkbox
            >
            <b-form-checkbox value="a4"
              >Ersatz für Bahnfahrt 2. KL. (Beleg anschließen)</b-form-checkbox
            >
            <b-form-checkbox value="a5"
              >Amtl. Kilometergeld für eigenen PKW</b-form-checkbox
            >
            <b-form-checkbox value="a7"
              >Angeführte andere Reisekosten (Belege
              anschließen)</b-form-checkbox
            >
            <b-form-checkbox value="a8">Keine Reisekosten</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
        <!-- Beförderungszuschuss Menge in € -->
        <b-form-group
          id="tg"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die Beförderungszuschussmenge an."
          label="Beförderungszuschuss"
          label-for="geschk"
          v-if="data.selected.includes('a2')"
        >
          <b-input-group>
            <b-input-group-text :id="index + 'eur-addon-2'" slot="append"
              ><span>€</span></b-input-group-text
            >
            <b-form-input
              v-model="data.travel_grant"
              :readonly="readonly"
              v-on:input="update"
              :id="index + 'geschk'"
              type="number"
            >
            </b-form-input>
          </b-input-group>
        </b-form-group>
        <!-- Gefahrene km mit eigenem PKW -->
        <b-form-group
          id="km-pkwg"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die Anzahl der gefahrenen km mit dem eigenen PKW an"
          label="Eigener PKW km"
          label-for="km-pkw"
          v-if="data.selected.includes('a5')"
        >
          <b-input-group>
            <b-input-group-text id="km-addon-1" slot="append"
              ><span>km</span></b-input-group-text
            >
            <b-form-input
              :readonly="readonly"
              v-model="data.km"
              v-on:input="update"
              id="km-pkw"
              type="number"
            >
            </b-form-input>
          </b-input-group>
        </b-form-group>
        <!-- Tagesgebühr Art -->
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die Art der Tagesgebühr an"
          label="Tagesgebühr"
          label-for="ttg"
          id="tg"
        >
          <b-form-radio-group
            v-model="data.dcm"
            v-on:change="update"
            :disabled="readonly"
          >
            <b-form-radio value="a1">Tagesgebühr nach Tarif I</b-form-radio>
            <b-form-radio value="a2">Tagesgebühr nach Tarif II</b-form-radio>
            <b-form-radio value="a3"
              >Tagesgebühr gemäß §17 zu kürzen</b-form-radio
            >
          </b-form-radio-group>
        </b-form-group>
        <!-- Tagesgebühr Kürzungen -->
        <b-form-group
          id="tag-kuerzg"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Tagesgebür gemäß §17 zu kürzen um (Anzahl)"
          label="Zu kürzende Tagesgebühr"
          label-for="tag-kuerz"
          v-if="data.dcm === 'a3'"
        >
          <b-form-input
            :readonly="readonly"
            v-model="data.short"
            v-on:input="update"
            id="tag-kuerz"
            type="number"
          >
          </b-form-input>
        </b-form-group>
        <!-- Art der Nächtigungsgebühr -->
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die Art der Nächtigungsgebühren an"
          label="Nächtigungsgebühr"
          label-for="tng"
          id="ng"
        >
          <b-form-radio-group
            v-model="data.ncm"
            v-on:change="update"
            :disabled="readonly"
          >
            <b-form-radio value="a1"
              >Nächtigungsgebühr Nächtigungen Nachweis</b-form-radio
            >
            <b-form-radio value="a2">Nächtigungen ohne Nachweis</b-form-radio>
            <b-form-radio value="a3"
              >Keinen Anspruch auf Nächtigungsgebühr</b-form-radio
            >
          </b-form-radio-group>
        </b-form-group>
        <!-- Anzahl Frühstücke -->
        <b-form-group
          id="freuhg"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die Stückzahl der Frühstücke an"
          label="Frühstücke Anzahl"
          label-for="frueh"
        >
          <b-input-group>
            <b-input-group-text id="stk-addon-1" slot="append"
              ><span>Stück</span></b-input-group-text
            >
            <b-form-input
              :readonly="readonly"
              v-model="data.breakfast"
              v-on:input="update"
              id="frueh"
              type="number"
            >
            </b-form-input>
          </b-input-group>
        </b-form-group>
        <!-- Anzahl Mittagessen -->
        <b-form-group
          id="mittagg"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die Stückzahl der Mittagessen an"
          label="Mittagessen Anzahl"
          label-for="mittag"
        >
          <b-input-group>
            <b-input-group-text id="stk-addon-2" slot="append"
              ><span>Stück</span></b-input-group-text
            >
            <b-form-input
              :readonly="readonly"
              v-model="data.lunch"
              v-on:input="update"
              id="mittag"
              type="number"
            >
            </b-form-input>
          </b-input-group>
        </b-form-group>
        <!-- Anzahl Abendessen -->
        <b-form-group
          id="abendg"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die Stückzahl der Abendessen an"
          label="Abendessen Anzahl"
          label-for="abend"
        >
          <b-input-group>
            <b-input-group-text id="stk-addon-3" slot="append"
              ><span>Stück</span></b-input-group-text
            >
            <b-form-input
              :readonly="readonly"
              v-model="data.dinner"
              v-on:input="update"
              id="abend"
              type="number"
            >
            </b-form-input>
          </b-input-group>
        </b-form-group>
        <!-- Belege Input -->
        <b-form-group
          id="belg"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Fügen Sie Belege per Klick oder Drag and Drop hinzu"
          label="Belege"
          label-for="bel"
        >
          <b-form-file
            multiple
            id="bel"
            accept=".pdf"
            v-model="invoices"
            v-on:input="convert"
            :disabled="readonly"
          >
            <template slot="file-name" slot-scope="{ names }">
              <b-badge variant="dark">{{ names[0] }}</b-badge>
              <b-badge v-if="names.length > 1" variant="dark" class="ml-1">
                + {{ names.length - 1 }} More files
              </b-badge>
            </template>
          </b-form-file>
        </b-form-group>

        <!-- Berechnungstabelle -->
        <b-table
          striped
          :items="data.items"
          :fields="fields"
          stacked="md"
          show-empty
          small
        >
          <template #cell(num)="data">
            {{ data.index + 1 }}
          </template>
          <!-- Datumsspalte -->
          <template #cell(date)="data">
            {{ data.item.date }}
          </template>

          <!-- Startzeit Spalte -->
          <template #cell(start)="data">
            <b-form-timepicker
              style="min-width: 100px;"
              :id="data.index + 'begin'"
              locale="de"
              placeholder="Zeit"
              v-model="data.item.start"
              :readonly="readonly"
              v-on:input="update()"
            ></b-form-timepicker>
          </template>

          <!-- Endzeit Spalte -->
          <template #cell(end)="data">
            <b-form-timepicker
              style="min-width: 100px;"
              :id="data.index + 'end'"
              locale="de"
              placeholder="Zeit"
              v-model="data.item.end"
              :readonly="readonly"
              v-on:input="update()"
            ></b-form-timepicker>
          </template>
          <!-- Art Spalte -->
          <template #cell(kind_of_cost)="data">
            <b-form-checkbox-group
              :id="data.index + '5'"
              v-model="data.item.kind_of_cost"
              v-on:input="update()"
              :disabled="readonly"
              stacked
            >
              <b-form-checkbox value="0">Reisegebühr</b-form-checkbox>
              <b-form-checkbox value="1">Tagesgebühr</b-form-checkbox>
              <b-form-checkbox value="2">Nächtigungsgebühr</b-form-checkbox>
              <b-form-checkbox value="3">Zusätzliche Kosten</b-form-checkbox>
            </b-form-checkbox-group>
          </template>
          <!-- KM Spalte -->
          <template #cell(km)="data">
            <b-form-input
              :id="data.index + '4'"
              v-model="data.item.km"
              :readonly="
                readonly || data.item.kind_of_cost.includes('0') === false
              "
              v-on:input="update()"
              type="number"
            >
            </b-form-input>
          </template>
          <!-- Reisekosten Spalte -->
          <template #cell(travelcosts)="data">
            <b-form-input
              :id="data.index + '0'"
              v-model="data.item.travelcosts"
              v-on:change="update()"
              :readonly="
                readonly || data.item.kind_of_cost.includes('0') === false
              "
            >
            </b-form-input>
          </template>
          <!-- Tagesgebühr Spalte -->
          <template #cell(daycharge)="data">
            <b-form-input
              :id="data.index + '1'"
              v-model="data.item.daycharge"
              v-on:change="update()"
              :readonly="
                readonly || data.item.kind_of_cost.includes('1') === false
              "
            >
            </b-form-input>
          </template>
          <!-- Nächtigungsgebühr Spalte -->
          <template #cell(sleepcharge)="data">
            <b-form-input
              :id="data.index + '2'"
              v-model="data.item.sleepcharge"
              v-on:change="update()"
              :readonly="
                readonly || data.item.kind_of_cost.includes('2') === false
              "
            >
            </b-form-input>
          </template>
          <!-- Andere Kosten Spalte -->
          <template #cell(othercosts)="data">
            <b-form-input
              :id="data.index + '3'"
              v-model="data.item.othercosts"
              v-on:change="update()"
              :readonly="
                readonly || data.item.kind_of_cost.includes('3') === false
              "
            >
            </b-form-input>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: ["start", "end", "index", "readonly", "app"],
  data() {
    return {
      fields: [
        { key: "num", label: "Laufnummer" },
        { key: "date", label: "Tag" },
        { key: "start", label: "Beginn" },
        { key: "end", label: "Ende" },
        { key: "kind_of_cost", label: "Art des Gebührenanspruches" },
        { key: "km", label: "Gesamtkilometer" },
        { key: "travelcosts", label: "Reisekosten" },
        { key: "daycharge", label: "Tagesgebühr" },
        { key: "sleepcharge", label: "Nächtigungsgebühr" },
        { key: "othercosts", label: "Sonstige Nebenkosten" },
        { key: "sum", label: "Summe" }
      ],
      invoices: [],
      data: {
        selected: [],
        travel_grant: 0,
        dcm: null,
        ncm: null,
        km: null,
        breakfast: null,
        lunch: null,
        dinner: null,
        short: null,
        beleg: [],
        items: [],
        sum_travel_costs: 0,
        sum_daily_charges: 0,
        sum_nightly_charges: 0,
        sum_additional_costs: 0,
        sum_of_sums: 0
      }
    };
  },
  methods: {
    /**
     * Diese Methode sendet alle Daten an den Parent (Können mehrere Komponenten sein)
     */
    update() {
      this.calcSum();
      this.$emit("update", this.index, this.data);
    },
    /**
     * Diese Methode rechnet die Summe aller Reihen des tables aus und setzt diese
     */
    calcSum() {
      for (let i = 0; i < this.data.items.length; i++) {
        this.data.items[i].sum = 0;
        if (this.data.items[i].kind_of_cost.includes("0")) {
          this.data.items[i].sum += Number(this.data.items[i].travelcosts);
        }
        if (this.data.items[i].kind_of_cost.includes("1")) {
          this.data.items[i].sum += Number(this.data.items[i].daycharge);
        }
        if (this.data.items[i].kind_of_cost.includes("2")) {
          this.data.items[i].sum += Number(this.data.items[i].sleepcharge);
        }
        if (this.data.items[i].kind_of_cost.includes("3")) {
          this.data.items[i].sum += Number(this.data.items[i].othercosts);
        }
      }
      this.calcRows();
    },
    /**
     * Diese Methode convertiert die hochgeladenen Datein in Base64 und sendet diese an das Backend
     */
    async convert() {
      var imgs = [];
      this.data.beleg = {
        files: []
      };
      const toBase64 = file =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      for (let i = 0; i < this.invoices.length; i++) {
        imgs[i] = await toBase64(this.invoices[i]);
        this.data.beleg.files.push({ pdf: imgs[i].substring(28) });
      }
      this.update();
    },
    /**
     * Diese Methode rechnet die Summen der einzelnen Spalten aus und setzt diese
     */
    calcRows() {
      var stc = 0;
      var sdc = 0;
      var snc = 0;
      var sac = 0;
      var sos = 0;
      for (let i = 0; i < this.data.items.length; i++) {
        if (this.data.items[i].kind_of_cost.includes("0")) {
          if (!isNaN(Number(this.data.items[i].travelcosts))) {
            stc += Number(this.data.items[i].travelcosts);
          }
        }
        if (this.data.items[i].kind_of_cost.includes("1")) {
          if (!isNaN(Number(this.data.items[i].daycharge))) {
            sdc += Number(this.data.items[i].daycharge);
          }
        }
        if (this.data.items[i].kind_of_cost.includes("2")) {
          if (!isNaN(Number(this.data.items[i].sleepcharge))) {
            snc += Number(this.data.items[i].sleepcharge);
          }
        }
        if (this.data.items[i].kind_of_cost.includes("3")) {
          if (!isNaN(Number(this.data.items[i].othercosts))) {
            sac += Number(this.data.items[i].othercosts);
          }
        }
        if (!isNaN(Number(this.data.items[i].sum))) {
          sos += Number(this.data.items[i].sum);
        }
      }
      this.data.sum_travelcosts = Number(stc);
      this.data.sum_daily_charges = Number(sdc);
      this.data.sum_nightly_charges = Number(snc);
      this.data.sum_additional_costs = Number(sac);
      this.data.sum_of_sums = Number(sos);
    },
    /**
     * Diese Methode rechnet die Dauer des Antrags aus
     * @returns Die Dauer des Antrags
     */
    calculateLength() {
      var ende = new Date(this.end);
      var starten = new Date(this.start);
      ende.setHours(10);
      starten.setHours(12);
      let diff = ende.getTime() - starten.getTime();
      let days = diff / (1000 * 3600 * 24);
      return Math.ceil(days);
    },
    /**
     * Diese Methode gibt die Uhrzeit eines Datums zurück
     * @param datum Das übergebene Datum
     * @returns Die Uhrzeit des Datums
     */
    getTimeOfDate(datum) {
      var tmp = new Date(datum);
      return tmp.getHours() + ":" + tmp.getMinutes();
    },
    /**
     * Diese Methode setzt alle wichtigen Daten für diese Komponente
     */
    loadData() {
      for (let i = 0; i <= this.calculateLength() - 1; i++) {
        var tmp = new Date(this.start);
        tmp.setDate(tmp.getDate() + i);
        let tmp_kind = [];
        if (this.app.calculation.rows[i].kind_of_cost.includes(0)) {
          tmp_kind.push("0");
        }
        if (this.app.calculation.rows[i].kind_of_cost.includes(1)) {
          tmp_kind.push("1");
        }
        if (this.app.calculation.rows[i].kind_of_cost.includes(2)) {
          tmp_kind.push("2");
        }
        if (this.app.calculation.rows[i].kind_of_cost.includes(3)) {
          tmp_kind.push("3");
        }
        this.data.items.push({
          index: i + 1,
          date:
            tmp.getUTCDate() +
            "." +
            (tmp.getUTCMonth() + 1) +
            "." +
            tmp.getUTCFullYear(),
          start: this.getTimeOfDate(this.app.calculation.rows[i].begin),
          end: this.getTimeOfDate(this.app.calculation.rows[i].end),
          kind_of_cost: tmp_kind,
          km: this.app.calculation.rows[i].kilometres,
          travelcosts: this.app.calculation.rows[i].travel_costs,
          daycharge: this.app.calculation.rows[i].daily_charges,
          sleepcharge: this.app.calculation.rows[i].nightly_charges,
          othercosts: this.app.calculation.rows[i].additional_costs,
          sum: this.app.calculation.rows[i].sum
        });
      }
      this.data.travel_grant = this.app.travel_costs_pre_grant;
      this.data.km = this.app.kilometre_amount;
      this.data.breakfast = this.app.breakfasts;
      this.data.lunch = this.app.lunches;
      this.data.dinner = this.app.dinners;
      this.data.short = this.app.shortened_amount;
      switch (this.app.daily_charges_mode) {
        case 0:
          this.data.dcm = "a1";
          break;
        case 1:
          this.data.dcm = "a2";
          break;
        case 2:
          this.data.dcm = "a3";
          break;
      }
      switch (this.app.nightly_charges_mode) {
        case 0:
          this.data.ncm = "a1";
          break;
        case 1:
          this.data.ncm = "a2";
          break;
        case 2:
          this.data.ncm = "a3";
          break;
      }
      if (this.app.official_business_card_got) this.data.selected.push("a1");
      if (this.app.travel_grant) this.data.selected.push("a2");
      if (this.app.replacement_for_advantage_card)
        this.data.selected.push("a3");
      if (this.app.replacement_for_train_card_class_2)
        this.data.selected.push("a4");
      if (this.app.kilometre_allowance) this.data.selected.push("a5");
      if (this.app.nr_and_idications_of_participants)
        this.data.selected.push("a6");
      if (this.app.travel_costs_cited) this.data.selected.push("a7");
      if (this.app.no_travel_costs) this.data.selected.push("a8");
    }
  },
  mounted() {
    if (
      this.readonly == null ||
      this.readonly == "" ||
      this.readonly == undefined
    ) {
      this.readonly = false;
    }
    if (
      this.app.calculation.rows !== null &&
      this.app.calculation.rows !== []
    ) {
      this.loadData();
    } else {
      for (let i = 0; i <= this.calculateLength() - 1; i++) {
        var tmp = new Date(this.start);
        tmp.setDate(tmp.getDate() + i);
        this.data.items.push({
          index: i + 1,
          date:
            tmp.getUTCDate() +
            "." +
            (tmp.getUTCMonth() + 1) +
            "." +
            tmp.getUTCFullYear(),
          start: "",
          end: "",
          km: 0,
          kind_of_cost: [],
          travelcosts: 0,
          daycharge: 0,
          sleepcharge: 0,
          othercosts: 0,
          sum: 0
        });
      }
    }
    this.calcSum();
  }
};
</script>
