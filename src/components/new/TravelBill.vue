<template>
  <b-container fluid>
    <b-row align-h="center">
      <b-col cols="12">
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

        <b-table striped :items="data.items" stacked="md" show-empty small>
          <template #cell(index)="data">
            {{ data.index + 1 }}
          </template>
          <!-- A custom formatted column -->
          <template #cell(date)="data">
            {{ data.item.date }}
          </template>

          <template #cell(start)="data">
            <b-form-timepicker
              style="min-width: 100px;"
              id="begin"
              locale="de"
              placeholder="Zeit"
              v-model="data.item.start"
              :readonly="readonly"
              v-on:input="update()"
            ></b-form-timepicker>
          </template>

          <template #cell(end)="data">
            <b-form-timepicker
              style="min-width: 100px;"
              id="end"
              locale="de"
              placeholder="Zeit"
              v-model="data.item.end"
              :readonly="readonly"
              v-on:input="update()"
            ></b-form-timepicker>
          </template>

          <template #cell(kind)="data">
            {{ data.item.kind }}
          </template>
          <template #cell(km)="data">
            <b-form-input
              :id="'0'"
              v-model="data.item.km"
              :readonly="readonly"
              v-on:input="update()"
              type="number"
            >
            </b-form-input>
          </template>
          <template #cell(travelcosts)="data">
            <b-form-input
              :id="'0'"
              v-model="data.item.travelcosts"
              v-on:change="
                calcSum(data.item);
                update();
              "
              :readonly="readonly"
            >
            </b-form-input>
          </template>
          <template #cell(daycharge)="data">
            <b-form-input
              :id="'1'"
              v-model="data.item.daycharge"
              v-on:change="
                calcSum(data.item);
                update();
              "
              :readonly="readonly"
            >
            </b-form-input>
          </template>
          <template #cell(sleepcharge)="data">
            <b-form-input
              :id="'2'"
              v-model="data.item.sleepcharge"
              v-on:change="
                calcSum(data.item);
                update();
              "
              :readonly="readonly"
            >
            </b-form-input>
          </template>
          <template #cell(othercosts)="data">
            <b-form-input
              :id="'3'"
              v-model="data.item.othercosts"
              v-on:change="
                calcSum(data.item);
                update();
              "
              :readonly="readonly"
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
        "index",
        { key: "num", label: "Laufnummer" },
        { key: "date", label: "Tag" },
        { key: "start", label: "Beginn" },
        { key: "end", label: "Ende" },
        { key: "kind", label: "Art des Gebührenanspruches" },
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
        dcm: null,
        ncm: null,
        km: null,
        breakfast: null,
        lunch: null,
        dinner: null,
        short: null,
        beleg: [],
        items: [],
        SumTravelCosts: 0,
        SumDailyCharges: 0,
        SumNightlyCharges: 0,
        SumAdditionalCosts: 0,
        SumOfSums: 0
      }
    };
  },
  methods: {
    update() {
      this.calcRows();
      this.$emit("update", this.index, this.data);
    },
    calcSum(item) {
      item.sum =
        Number(item.travelcosts) +
        Number(item.daycharge) +
        Number(item.sleepcharge) +
        Number(item.othercosts);
      this.calcRows();
    },
    async convert() {
      var imgs = [];
      const toBase64 = file =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      for (let i = 0; i < this.invoices.length; i++) {
        imgs[i] = await toBase64(this.invoices[i]);
      }
      this.data.beleg = imgs;
      this.update();
    },
    calcRows() {
      var stc = 0;
      var sdc = 0;
      var snc = 0;
      var sac = 0;
      var sos = 0;
      for (let i = 0; i < this.data.items.length; i++) {
        if (!isNaN(Number(this.data.items[i].travelcosts))) {
          stc += Number(this.data.items[i].travelcosts);
        }
        if (!isNaN(Number(this.data.items[i].daycharge))) {
          sdc += Number(this.data.items[i].daycharge);
        }
        if (!isNaN(Number(this.data.items[i].sleepcharge))) {
          snc += Number(this.data.items[i].sleepcharge);
        }
        if (!isNaN(Number(this.data.items[i].othercosts))) {
          sac += Number(this.data.items[i].othercosts);
        }
        if (!isNaN(Number(this.data.items[i].sum))) {
          sos += Number(this.data.items[i].sum);
        }
      }
      this.data.SumTravelCosts = Number(stc);
      this.data.SumDailyCharges = Number(sdc);
      this.data.SumNightlyCharges = Number(snc);
      this.data.SumAdditionalCosts = Number(sac);
      this.data.SumOfSums = Number(sos);
    },
    calculateLength() {
      let diff = new Date(this.end).getTime() - new Date(this.start).getTime();
      let days = diff / (1000 * 3600 * 24);
      return Math.ceil(days);
    },
    getTimeOfDate(datum) {
      var tmp = new Date(datum);
      return tmp.getHours() + ":" + tmp.getMinutes();
    },
    loadData() {
      for (let i = 0; i <= this.calculateLength(); i++) {
        var tmp = new Date(this.start);
        tmp.setDate(tmp.getDate() + i);
        this.data.items.push({
          index: i,
          date:
            tmp.getUTCDate() +
            "." +
            (tmp.getUTCMonth() + 1) +
            "." +
            tmp.getUTCFullYear(),
          start: this.getTimeOfDate(this.app.Calculation.Rows[i].Begin),
          end: this.getTimeOfDate(this.app.Calculation.Rows[i].End),
          kind: "Tagesgebühr",
          km: this.app.Calculation.Rows[i].Kilometres,
          travelcosts: this.app.Calculation.Rows[i].TravelCosts,
          daycharge: this.app.Calculation.Rows[i].DailyCharges,
          sleepcharge: this.app.Calculation.Rows[i].NightlyCharges,
          othercosts: this.app.Calculation.Rows[i].AdditionalCosts,
          sum: this.app.Calculation.Rows[i].Sum
        });
      }
      this.data.km = this.app.KilometreAmount;
      this.data.breakfast = this.app.Breakfasts;
      this.data.lunch = this.app.Lunches;
      this.data.dinner = this.app.Dinners;
      this.data.short = this.app.ShortenedAmount;
      switch (this.app.DailyChargesMode) {
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
      switch (this.app.NightlyChargesMode) {
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
      if (this.app.OfficialBusinessCardGot) this.data.selected.push("a1");
      if (this.app.TravelGrant) this.data.selected.push("a2");
      if (this.app.ReplacementForAdvantageCard) this.data.selected.push("a3");
      if (this.app.ReplacementForTrainCardClass2) this.data.selected.push("a4");
      if (this.app.KilometreAllowance) this.data.selected.push("a5");
      if (this.app.NRAndIdicationsOfParticipants) this.data.selected.push("a6");
      if (this.app.TravelCostsCited) this.data.selected.push("a7");
      if (this.app.NoTravelCosts) this.data.selected.push("a8");
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
    if (this.app !== undefined) {
      this.loadData();
    } else {
      for (let i = 0; i <= this.calculateLength(); i++) {
        var tmp = new Date(this.start);
        tmp.setDate(tmp.getDate() + i);
        this.data.items.push({
          index: i,
          date:
            tmp.getUTCDate() +
            "." +
            (tmp.getUTCMonth() + 1) +
            "." +
            tmp.getUTCFullYear(),
          start: "",
          end: "",
          kind: "Tagesgebühr",
          km: 0,
          travelcosts: 0,
          daycharge: 0,
          sleepcharge: 0,
          othercosts: 0,
          sum: 0
        });
      }
    }
  }
};
</script>
