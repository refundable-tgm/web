<template>
  <b-container fluid>
    <b-row align-v="center" align-h="center">
      <b-col cols="12" md="6">
        <h1 id="new-application-heading">Antrag Suchen</h1>
      </b-col>
      <div class="col-12 col-md-6">
        <b-button
          variant="outline-primary"
          class="float-right"
          v-on:click="index()"
        >
          <b-icon icon="house" aria-hidden="true"></b-icon> Startseite
        </b-button>
        <b-button
          variant="outline-primary"
          class="float-right"
          v-on:click="index()"
          style="margin-right:20px"
        >
          <b-icon icon="plus" aria-hidden="true"></b-icon> Neuer Antrag
        </b-button>
      </div>
    </b-row>
    <b-row align-h="center" align-v="center" style="margin-top:3rem">
      <b-col>
        <b-form-group
          id="search-application"
          label-cols-sm="4"
          label-cols-lg="3"
          content-cols-sm
          content-cols-lg="7"
          description="Geben Sie die ID des gewünschten Antrags ein."
          label-for="search"
        >
          <b-input-group id="search" prepend="Antrags ID" class="mt-3">
            <b-form-input></b-form-input>
            <b-input-group-append>
              <b-button variant="info">Suchen</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>