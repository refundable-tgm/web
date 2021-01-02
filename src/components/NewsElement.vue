<template>
  <b-container>
    <b-row
      align-v="center"
      v-on:click="linkToApplication(snews.application)"
      class="shadow-lg news-elem-row"
    >
      <b-col cols="12">
        <b-container>
          <b-row align-v="center">
            <b-col cols="2">
              <b-container style="height: 100%">
                <b-row align-v="center" align-h="center" style="height: 100%">
                  <img
                    src="@/assets/accepted_1.svg"
                    class="align-middle news-status"
                    style="height: 50px; width: auto"
                    alt="Illustration von arbeitenden Personen"
                  />
                </b-row>
              </b-container>
            </b-col>
            <b-col cols="10">
              <b-container>
                <b-row align-h="center" align-v="center">
                  <b-col cols="12">
                    <h3 class="news-elem-heading">{{ snews.title }}</h3>
                  </b-col>
                </b-row>
                <b-row align-h="center" class="d-none d-md-block">
                  <b-col cols="12">
                    <h4 class="news-elem-heading">{{ snews.description }}</h4>
                  </b-col>
                </b-row>
              </b-container>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  name: "NewsElement",
  props: ["snews"],
  methods: {
    linkToApplication(application) {
      if (this.checkClick()) {
        this.$emit("change-component", "ApplicationView", true, application);
      }
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
    }
  }
};
</script>
