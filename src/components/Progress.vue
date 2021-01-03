<template>
  <b-container fluid style="padding:0">
    <b-card class="shadow-lg" style="margin:0">
      <b-row align-h="center">
        <b-col cols="12" style="height: fit-content">
          <ul id="progressbar" class="text-center">
            <li class="active step0"></li>
            <li class="active step0"></li>
            <li class="fail step0"></li>
            <li class=" step0"></li>
          </ul>
        </b-col>
      </b-row>
      <b-row align-h="center" align-v="center" class="text-center">
        <b-col cols="12" sm="6" md="3">Begleiter</b-col>
        <b-col cols="12" sm="6" md="3">AV</b-col>
        <b-col cols="12" sm="6" md="3">Rechnungen eingereicht</b-col>
        <b-col cols="12" sm="6" md="3">Rechnungsstelle</b-col>
      </b-row>
    </b-card>
  </b-container>
</template>
<style lang="scss" scoped>


.card {
  z-index: 0;
  background-color: #eceff1;
  padding-bottom: 20px;
  margin-top: 90px;
  margin-bottom: 90px;
  border-radius: 10px;
}

.top {
  padding-top: 40px;
  padding-left: 13% !important;
  padding-right: 13% !important;
}

#progressbar {
  margin-bottom: 30px;
  overflow: hidden;
  color: #455a64;
  padding-left: 0px;
  margin-top: 30px;
}

#progressbar li {
  list-style-type: none;
  font-size: 13px;
  width: 25%;
  float: left;
  position: relative;
  font-weight: 400;
}

#progressbar .step0:before {
  font-family: FontAwesome;
  content: "\f10c";
  color: #fff;
}

#progressbar li:before {
  width: 40px;
  height: 40px;
  line-height: 45px;
  display: block;
  font-size: 20px;
  background: #c5cae9;
  border-radius: 50%;
  margin: auto;
  padding: 0px;
}

#progressbar li:after {
  content: "";
  width: 100%;
  height: 12px;
  background: #c5cae9;
  position: absolute;
  left: 0;
  top: 16px;
  z-index: -1;
}

#progressbar li:last-child:after {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  position: absolute;
  left: -50%;
}

#progressbar li:nth-child(2):after,
#progressbar li:nth-child(3):after {
  left: -50%;
}

#progressbar li:first-child:after {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  position: absolute;
  left: 50%;
}

#progressbar li:last-child:after {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

#progressbar li:first-child:after {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

#progressbar li.active:before,
#progressbar li.active:after {
  background: #63ceff;
}

#progressbar li.active:before {
  font-family: FontAwesome;
  content: "\f00c";
}
#progressbar li.fail:before,
#progressbar li.fail:after {
  background: #ff6363;
}

#progressbar li.fail:before {
  font-family: FontAwesome;
  content: "\f06a";
}

.icon {
  width: 60px;
  height: 60px;
  margin-right: 15px;
}

.icon-content {
  padding-bottom: 20px;
}

@media screen and (max-width: 992px) {
  .icon-content {
    width: 50%;
  }
}
</style>
