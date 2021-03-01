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
              >Amtl. Kilometergelf für eigenen PKW</b-form-checkbox
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
        >
          <b-input-group>
            <b-input-group-text id="km-addon-1" slot="append"
              ><span>km</span></b-input-group-text
            >
            <b-form-input  id="km-pkw" type="number">
            </b-form-input>
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
        >
          <b-input-group>
            <b-input-group-text id="mitfahrer-addon-1" slot="append"
              ><span>Mitfahrer</span></b-input-group-text
            >
            <b-form-input  id="mit-num" type="number">
            </b-form-input>
          </b-input-group>
        </b-form-group>

        <b-form-group
          id="mit-namg-x"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie den Namen des X. Mitfahrers an"
          label="Mitfahrer X Name"
          label-for="mit-nam-x"
        >
          <b-form-input  id="mit-nam-x" type="text">
          </b-form-input>
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
        >
          <b-form-input  id="tag-kuerz" type="number">
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
            <b-form-input  id="frueh" type="number">
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
            <b-form-input  id="mittag" type="number">
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
            <b-form-input  id="abend" type="number">
            </b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>
