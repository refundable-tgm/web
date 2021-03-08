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
          <b-form-checkbox-group id="zud" v-model="data.selected" stacked>
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
            <b-form-checkbox value="a6">Mitfahrer</b-form-checkbox>
            <b-form-checkbox value="a7"
              >Angeführte andere Reisekosten (Belege
              anschließen)</b-form-checkbox
            >
            <b-form-checkbox value="a8">Keine Reisekosten</b-form-checkbox>
            <b-form-checkbox value="a9"
              >Tagesgebühr nach Tarif I</b-form-checkbox
            >
            <b-form-checkbox value="a10"
              >Tagesgebühr nach Tarif II</b-form-checkbox
            >
            <b-form-checkbox value="a11"
              >Tagesgebühr gemäß §17 zu kürzen</b-form-checkbox
            >
            <b-form-checkbox value="a12"
              >Nächtigungsgebühr Nächtigungen Nachweis</b-form-checkbox
            >
            <b-form-checkbox value="a13"
              >Nächtigungen ohne Nachweis</b-form-checkbox
            >
            <b-form-checkbox value="a14"
              >Keinen Anspruch auf Nächtigungsgebühr</b-form-checkbox
            >
          </b-form-checkbox-group>
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
            <b-form-input id="km-pkw" type="number"> </b-form-input>
          </b-input-group>
        </b-form-group>
        <b-form-group
          id="mit-numg"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die Anzahl der Mitfahrer an"
          label="Mitfahrer Anzahl"
          label-for="mit-num"
          v-if="data.selected.includes('a6')"
        >
          <b-input-group>
            <b-input-group-text id="mitfahrer-addon-1" slot="append"
              ><span>Mitfahrer</span></b-input-group-text
            >
            <b-form-input
              id="mit-num"
              type="number"
              v-model="data.anzahl"
              v-on:change="createMitfahrer"
            >
            </b-form-input>
          </b-input-group>
        </b-form-group>

        <div v-for="fahr in data.mitfahrer" v-bind:key="fahr.index">
          <b-form-group
            id="mit-namg-x"
            label-cols-sm="4"
            label-cols-lg="3"
            content-cols-sm
            content-cols-lg="7"
            :description="
              'Geben Sie den Namen des ' + fahr.index + '. Mitfahrers an'
            "
            :label="'Mitfahrer ' + fahr.index + ' Name'"
            label-for="mit-nam-x"
          >
            <b-form-input id="mit-nam-x" type="text"> </b-form-input>
          </b-form-group>
        </div>

        <b-form-group
          id="tag-kuerzg"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Tagesgebür gemäß §17 zu kürzen um (Anzahl)"
          label="Zu kürzende Tagesgebühr"
          label-for="tag-kuerz"
          v-if="data.selected.includes('a11')"
        >
          <b-form-input id="tag-kuerz" type="number"> </b-form-input>
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
            <b-form-input id="frueh" type="number"> </b-form-input>
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
            <b-form-input id="mittag" type="number"> </b-form-input>
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
            <b-form-input id="abend" type="number"> </b-form-input>
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
          <b-form-file multiple id="bel">
            <template slot="file-name" slot-scope="{ names }">
              <b-badge variant="dark">{{ names[0] }}</b-badge>
              <b-badge v-if="names.length > 1" variant="dark" class="ml-1">
                + {{ names.length - 1 }} More files
              </b-badge>
            </template>
          </b-form-file>
        </b-form-group>

        <b-table striped :items="items" stacked="md" show-empty small>
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
            ></b-form-timepicker>
          </template>

          <template #cell(end)="data">
            <b-form-timepicker
              style="min-width: 100px;"
              id="end"
              locale="de"
              placeholder="Zeit"
              v-model="data.item.end"
            ></b-form-timepicker>
          </template>

          <template #cell(kind)="data">
            {{ data.item.kind }}
          </template>
          <template #cell(km)="data">
            <b-form-input :id="'0'" v-model="data.item.km" type="number">
            </b-form-input>
          </template>
          <template #cell(travelcosts)="data">
            <b-form-input
              :id="'0'"
              v-model="data.item.travelcosts"
              v-on:change="calcSum(data.item)"
            >
            </b-form-input>
          </template>
          <template #cell(daycharge)="data">
            <b-form-input :id="'1'" v-model="data.item.daycharge">
            </b-form-input>
          </template>
          <template #cell(sleepcharge)="data">
            <b-form-input :id="'2'" v-model="data.item.sleepcharge">
            </b-form-input>
          </template>
          <template #cell(othercosts)="data">
            <b-form-input :id="'3'" v-model="data.item.othercosts">
            </b-form-input>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: ["start", "end"],
  data() {
    return {
      fields: [
        "index",
        { key: "num", label: "Laufnummer" },
        { key: "date", label: "Tag" },
        { key: "start", label: "Beginn", tdClass: "zeit" },
        { key: "end", label: "Ende", class: "zeit" },
        { key: "kind", label: "Art des Gebührenanspruches" },
        { key: "km", label: "Gesamtkilometer" },
        { key: "travelcosts", label: "Reisekosten" },
        { key: "daycharge", label: "Tagesgebühr" },
        { key: "sleepcharge", label: "Nächtigungsgebühr" },
        { key: "othercosts", label: "Sonstige Nebenkosten" },
        { key: "sum", label: "Summe" }
      ],
      items: [],
      data: {
        selected: [],
        anzahl: null,
        mitfahrer: []
      }
    };
  },
  methods: {
    update() {
      this.$emit("update", this.index, this.data);
    },
    output() {
      console.log(this.items);
    },
    calcSum(item) {
      item.sum =
        Number(item.travelcosts) +
        Number(item.daycharge) +
        Number(item.sleepcharge) +
        Number(item.othercosts);
    },
    createMitfahrer() {
      if (this.data.mitfahrer.length === 0) {
        for (let i = 0; i < Number(this.data.anzahl); i++) {
          this.data.mitfahrer.push({
            name: "",
            index: i + 1
          });
        }
      } else {
        if (this.data.mitfahrer.length >= Number(this.data.anzahl)) {
          this.data.mitfahrer.splice(
            this.data.anzahl,
            this.data.mitfahrer.length - Number(this.data.anzahl)
          );
        } else {
          var tmp = this.data.mitfahrer[this.data.mitfahrer.length - 1];
          var length = Number(this.data.anzahl) - tmp.index;
          for (let i = 0; i < length; i++) {
            this.data.mitfahrer.push({
              name: "",
              index: tmp.index + i + 1
            });
          }
        }
      }
    },
    calculateLength() {
      let diff = new Date(this.end).getTime() - new Date(this.start).getTime();
      let days = diff / (1000 * 3600 * 24);
      return Math.ceil(days);
    }
  },
  mounted() {
    for (let i = 0; i <= this.calculateLength(); i++) {
      var tmp = new Date(this.start);
      tmp.setDate(tmp.getDate() + i);
      this.items.push({
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
        km: "",
        travelcosts: "",
        daycharge: "",
        sleepcharge: "",
        othercosts: "",
        sum: ""
      });
    }
  }
};
</script>
<style>
.zeit {
  min-width: 100px;
}
</style>
