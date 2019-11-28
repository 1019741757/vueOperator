import Vue from 'vue'
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
  state:{
    openlist:[],
    nowName:0,
    // primaryInfo:"minemine",
    primaryInfo:"",
    primaryshow:false,
    everyDayGet:{
    	AgencyName:"",
    	AgencyPhone:"",
    	AgencyId:""
    },
    barbill:{
        AgencyName:"",
        AgencyId:""        
    },
    barbillconsume:{
        AgencyName:"",
        AgencyId:""         
    }    
  }
});