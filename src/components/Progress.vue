<template>
  <b-container
    fluid
    style="padding:0;max-width:100%; overflow-x:hidden;height:fit-content"
  >
    <b-row align-h="center">
      <b-col cols="12">
        <div v-if="kind === 4" class="track">
          <div
            :class="{
              active: progress >= 1
            }"
            class="step"
          >
            <span class="icon">
              <i
                :class="{
                  'fa-check': progress >= 1,
                  'fa-circle': progress < 1 && progress > 0,
                  'fa-exclamation': progress == 0
                }"
                class="fa"
              ></i>
            </span>
            <span class="text text-truncate">Einreichung</span>
          </div>
          <div
            :class="{
              active: progress >= 2
            }"
            class="step"
          >
            <span class="icon">
              <i
                :class="{
                  'fa-check': progress >= 2,
                  'fa-circle': progress < 2 && progress > 0,
                  'fa-exclamation': progress == 0
                }"
                class="fa"
              ></i>
            </span>
            <span class="text text-truncate">In Bearbeitung</span>
          </div>
          <div
            :class="{
              active: progress >= 3
            }"
            class="step"
          >
            <span class="icon">
              <i
                :class="{
                  'fa-check': progress >= 3,
                  'fa-circle': progress < 3 && progress > 0,
                  'fa-exclamation': progress == 0
                }"
                class="fa"
              ></i>
            </span>
            <span class="text text-truncate">Bestätigt</span>
          </div>
          <div
            :class="{
              active: progress >= 4
            }"
            class="step"
          >
            <span class="icon">
              <i
                :class="{
                  'fa-check': progress >= 4,
                  'fa-circle': progress < 4 && progress > 0,
                  'fa-exclamation': progress == 0
                }"
                class="fa"
              ></i>
            </span>
            <span class="text text-truncate">Läuft...</span>
          </div>
          <div
            :class="{
              active: progress >= 5
            }"
            class="step"
          >
            <span class="icon">
              <i
                :class="{
                  'fa-check': progress >= 5,
                  'fa-circle': progress < 5 && progress > 0,
                  'fa-exclamation': progress == 0
                }"
                class="fa"
              ></i>
            </span>
            <span class="text text-truncate">Kosten ausstehend</span>
          </div>
          <div
            :class="{
              active: progress >= 6
            }"
            class="step"
          >
            <span class="icon">
              <i
                :class="{
                  'fa-check': progress >= 6,
                  'fa-circle': progress < 6 && progress > 0,
                  'fa-exclamation': progress == 0
                }"
                class="fa"
              ></i>
            </span>
            <span class="text text-truncate">Kosten in Bearbeitung</span>
          </div>
          <div
            :class="{
              active: progress >= 7
            }"
            class="step"
          >
            <span class="icon">
              <i
                :class="{
                  'fa-check': progress >= 7,
                  'fa-circle': progress < 7 && progress > 0,
                  'fa-exclamation': progress == 0
                }"
                class="fa"
              ></i>
            </span>
            <span class="text text-truncate">Abgeschlossen</span>
          </div>
        </div>
        <div v-if="kind === 0 || kind === 1 || kind === 2 || kind === 3 || kind === 5 || kind === 6 || kind === 7 || kind === 8" class="track">
          <div
            :class="{
              active: progress >= 1
            }"
            class="step"
          >
            <span class="icon">
              <i
                :class="{
                  'fa-check': progress >= 1,
                  'fa-circle': progress < 1 && progress > 0,
                  'fa-exclamation': progress == 0
                }"
                class="fa"
              ></i>
            </span>
            <span class="text text-truncate">In Bearbeitung</span>
          </div>
          <div
            :class="{
              active: progress >= 2
            }"
            class="step"
          >
            <span class="icon">
              <i
                :class="{
                  'fa-check': progress >= 2,
                  'fa-circle': progress < 2 && progress > 0,
                  'fa-exclamation': progress == 0
                }"
                class="fa"
              ></i>
            </span>
            <span class="text text-truncate">Bestätigt</span>
          </div>
          <div
            :class="{
              active: progress >= 3
            }"
            class="step"
          >
            <span class="icon">
              <i
                :class="{
                  'fa-check': progress >= 3,
                  'fa-circle': progress < 3 && progress > 0,
                  'fa-exclamation': progress == 0
                }"
                class="fa"
              ></i>
            </span>
            <span class="text text-truncate">Läuft...</span>
          </div>
          <div
            :class="{
              active: progress >= 4
            }"
            class="step"
          >
            <span class="icon">
              <i
                :class="{
                  'fa-check': progress >= 4,
                  'fa-circle': progress < 4 && progress > 0,
                  'fa-exclamation': progress == 0
                }"
                class="fa"
              ></i>
            </span>
            <span class="text text-truncate">Kosten ausstehend</span>
          </div>
          <div
            :class="{
              active: progress >= 5
            }"
            class="step"
          >
            <span class="icon">
              <i
                :class="{
                  'fa-check': progress >= 5,
                  'fa-circle': progress < 5 && progress > 0,
                  'fa-exclamation': progress == 0
                }"
                class="fa"
              ></i>
            </span>
            <span class="text text-truncate">Kosten in Bearbeitung</span>
          </div>
          <div
            :class="{
              active: progress >= 6
            }"
            class="step"
          >
            <span class="icon">
              <i
                :class="{
                  'fa-check': progress >= 6,
                  'fa-circle': progress < 6 && progress > 0,
                  'fa-exclamation': progress == 0
                }"
                class="fa"
              ></i>
            </span>
            <span class="text text-truncate">Abgeschlossen</span>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  props: ["kind", "progress"]
  /*
    const Schulveranstaltung (
	SERejected = iota   0
	SEInSubmission      1
	SEInProcess         2
	SEConfirmed         3
	SERunning           4
	SECostsPending      5
	SECostsInProcess    6
	SEDone              7
)

const Training (
  TRejected = iota    0
	TInProcess          1
	TConfirmed          2
	TRunning            3
	TCostsPending       4
	TCostsInProcess     5
	TDone               6
)

const Types of applications (
  Training = iota     0
	Careleave           1
	ServiceMandate      2
	MedicalAppointment  3
	SchoolEvent         4
	Seminar             5
	Conference          6
	Course              7
	Miscellaneous       8
)
    */
};
</script>

<style lang="scss" scoped>
.track {
  position: relative;
  background-color: #ddd;
  height: 7px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 60px;
  margin-top: 50px;
}

.track .step {
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  width: 25%;
  margin-top: -18px;
  text-align: center;
  position: relative;
}

.track .step.active:before {
  background: #69e769;
}

.track .step::before {
  height: 7px;
  position: absolute;
  content: "";
  width: 100%;
  left: 0;
  top: 18px;
}

.track .step.active .icon {
  background: #69e769;
  color: #fff;
}

.track .step.fail:before {
  background: #ff3e3e;
}

.track .step.fail .icon {
  background: #ff3e3e;
  color: #fff;
}

.track .icon {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  position: relative;
  border-radius: 100%;
  background: #ddd;
}

.track .step.active .text {
  font-weight: 400;
  color: #000;
}

.track .text {
  display: block;
  margin-top: 7px;
}
</style>
