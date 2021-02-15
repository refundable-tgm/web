<template>
  <b-container
    fluid
    style="padding:0;max-width:100%; overflow-x:hidden;height:fit-content"
  >
    <b-row align-h="center">
      <b-col cols="12">
        <div v-if="type==='sl'" class="track">
          <div :class="{'active':dataprogress>=1&&excla!=1,'fail':excla==1}" class="step">
            <span class="icon"> <i :class="{'fa-check': dataprogress>=1&&excla!=1, 'fa-circle':dataprogress<1&&excla!=1, 'fa-exclamation':excla==1}" class="fa"></i> </span>
            <span class="text text-truncate">Dienstreiseantrag eingereicht</span>
          </div>
          <div :class="{'active':dataprogress>=2&&excla!=2,'fail':excla==2}" class="step">
            <span class="icon"> <i :class="{'fa-check': dataprogress>=2&&excla!=2, 'fa-circle':dataprogress<2&&excla!=2, 'fa-exclamation':excla==2}" class="fa"></i> </span>
            <span class="text text-truncate">Von Begleitern bestätigt</span>
          </div>
          <div :class="{'active':dataprogress>=3&&excla!=3,'fail':excla==3}" class="step">
            <span class="icon"> <i :class="{'fa-check': dataprogress>=3&&excla!=3, 'fa-circle':dataprogress<3&&excla!=3, 'fa-exclamation':excla==3}" class="fa"></i> </span>
            <span class="text text-truncate">Von AV akzeptiert</span>
          </div>
          <div :class="{'active':dataprogress>=4&&excla!=4,'fail':excla==4}" class="step">
            <span class="icon"> <i :class="{'fa-check': dataprogress>=4&&excla!=4, 'fa-circle':dataprogress<4&&excla!=4, 'fa-exclamation':excla==4}" class="fa"></i> </span>
            <span class="text text-truncate">Rechnungen eingereicht</span>
          </div>
          <div :class="{'active':dataprogress>=5&&excla!=5,'fail':excla==5}" class="step">
            <span class="icon"> <i :class="{'fa-check': dataprogress>=5&&excla!=5, 'fa-circle':dataprogress<5&&excla!=5, 'fa-exclamation':excla==5}" class="fa"></i> </span>
            <span class="text text-truncate">Von Rechnungsstelle akzeptiert</span>
          </div>
        </div>
        <div v-if="type==='se'" class="track">
          <div :class="{'active':dataprogress>=1&&excla!=1,'fail':excla==1}" class="step">
            <span class="icon"> <i :class="{'fa-check': dataprogress>=1&&excla!=1, 'fa-circle':dataprogress<1&&excla!=1, 'fa-exclamation':excla==1}" class="fa"></i> </span>
            <span class="text text-truncate">Von Ihnen bestätigt</span>
          </div>
          <div :class="{'active':dataprogress>=2&&excla!=2,'fail':excla==2}" class="step">
            <span class="icon"> <i :class="{'fa-check': dataprogress>=2&&excla!=2, 'fa-circle':dataprogress<2&&excla!=2, 'fa-exclamation':excla==2}" class="fa"></i> </span>
            <span class="text text-truncate">Anträge eingereicht</span>
          </div>
          <div :class="{'active':dataprogress>=3&&excla!=3,'fail':excla==3}" class="step">
            <span class="icon"> <i :class="{'fa-check': dataprogress>=3&&excla!=3, 'fa-circle':dataprogress<3&&excla!=3, 'fa-exclamation':excla==3}" class="fa"></i> </span>
            <span class="text text-truncate">Von AV akzeptiert</span>
          </div>
          <div :class="{'active':dataprogress>=4&&excla!=4,'fail':excla==4}" class="step">
            <span class="icon"> <i :class="{'fa-check': dataprogress>=4&&excla!=4, 'fa-circle':dataprogress<4&&excla!=4, 'fa-exclamation':excla==4}" class="fa"></i> </span>
            <span class="text text-truncate">Rechnungen eingereicht</span>
          </div>
          <div :class="{'active':dataprogress>=5&&excla!=5,'fail':excla==5}" class="step">
            <span class="icon"> <i :class="{'fa-check': dataprogress>=5&&excla!=5, 'fa-circle':dataprogress<5&&excla!=5, 'fa-exclamation':excla==5}" class="fa"></i> </span>
            <span class="text text-truncate">Von Rechnungsstelle akzeptiert</span>
          </div>
        </div>
        <div v-if="type==='ws'" class="track">
          <div :class="{'active':dataprogress>=1&&excla!=1,'fail':excla==1}" class="step">
            <span class="icon"> <i :class="{'fa-check': dataprogress>=1&&excla!=1, 'fa-circle':dataprogress<1&&excla!=1, 'fa-exclamation':excla==1}" class="fa"></i> </span>
            <span class="text text-truncate">Anträge eingereicht</span>
          </div>
          <div :class="{'active':dataprogress>=2&&excla!=2,'fail':excla==2}" class="step">
            <span class="icon"> <i :class="{'fa-check': dataprogress>=2&&excla!=2, 'fa-circle':dataprogress<2&&excla!=2, 'fa-exclamation':excla==2}" class="fa"></i> </span>
            <span class="text text-truncate">Von AV akzeptiert</span>
          </div>
          <div :class="{'active':dataprogress>=3&&excla!=3,'fail':excla==3}" class="step">
            <span class="icon"> <i :class="{'fa-check': dataprogress>=3&&excla!=3, 'fa-circle':dataprogress<3&&excla!=3, 'fa-exclamation':excla==3}" class="fa"></i> </span>
            <span class="text text-truncate">Rechnungen eingereicht</span>
          </div>
          <div :class="{'active':dataprogress>=4&&excla!=4,'fail':excla==4}" class="step">
            <span class="icon"> <i :class="{'fa-check': dataprogress>=4&&excla!=4, 'fa-circle':dataprogress<4&&excla!=4, 'fa-exclamation':excla==4}" class="fa"></i> </span>
            <span class="text text-truncate"> Von Rechnungsstelle akzeptiert</span>
          </div>
        </div>
        <div v-if="type==='af'" class="track">
          <div :class="{'active':dataprogress>=1&&excla!=1,'fail':excla==1}" class="step">
            <span class="icon"> <i :class="{'fa-check': dataprogress>=1&&excla!=1, 'fa-circle':dataprogress<1&&excla!=1, 'fa-exclamation':excla==1}" class="fa"></i> </span>
            <span class="text text-truncate">Anträge eingereicht</span>
          </div>
          <div :class="{'active':dataprogress>=2&&excla!=2,'fail':excla==2}" class="step">
            <span class="icon"> <i :class="{'fa-check': dataprogress>=2&&excla!=2, 'fa-circle':dataprogress<2&&excla!=2, 'fa-exclamation':excla==2}" class="fa"></i> </span>
            <span class="text text-truncate">Von AV akzeptiert</span>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  props: ["progress"],
  data() {
    return {
      type: null,
      dataprogress: -1,
      excla:-1
    }
  },
  methods: {
    loadProgress() {
      console.log(this.progress);
      this.type=this.progress.type;
      this.dataprogress=this.progress.data;
      this.excla=this.progress.current;
    }
  },
  mounted() {
    this.loadProgress();
  }
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
