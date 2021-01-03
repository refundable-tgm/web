<template>
  <b-container
    fluid
    style="padding:0;max-width:100%; overflow-x:hidden;height:fit-content"
  >
    <b-row align-h="center">
      <b-col cols="12">
        <div class="track">
          <div class="step active">
            <span class="icon"> <i class="fa fa-check"></i> </span>
            <span class="text text-truncate">Von Begleitern bestätigt</span>
          </div>
          <div class="step active">
            <span class="icon"> <i class="fa fa-check"></i> </span>
            <span class="text text-truncate">Von AV bestätigt</span>
          </div>
          <div class="step fail">
            <span class="icon"> <i class="fa fa-exclamation"></i> </span>
            <span class="text text-truncate">Rechnungen eingereicht</span>
          </div>
          <div class="step">
            <span class="icon"> <i class="fa fa-circle"></i> </span>
            <span class="text text-truncate">Rechnungsstelle bestätigt</span>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
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
