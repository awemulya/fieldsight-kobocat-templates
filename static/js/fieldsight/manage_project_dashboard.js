Vue.use(VueHighcharts);


window.app = new Vue({
  el: '#peoples',
  template: `
    <div class="widget-info widget-scrolling-large-list margin-top bg-white padding" data-mh="eq111">
        <div class="widget-head">
            <h4> People </h4>
            <a class="btn btn-xs btn-primary" :href="new_people_url"><i class="la la-plus"></i></a>

            <a class="btn btn-xs btn-primary" data-toggle="collapse" href="#searchProjectManager" aria-expanded="false" aria-controls="searchProjectManager"><i class="la la-search"></i></a>
        </div>
        <div class="widget-body">
            <div class="collapse margin-bottom" id="searchProjectManager">
			<form>
				<div class="input-group input-group-sm">
					<input type="text"  v-model="search_key" @change="searchChange()" class="form-control" placeholder="Search for..." aria-label="Search for...">
					<span class="input-group-btn">
						<button class="btn btn-primary" type="button"><i class="la la-search"></i>Search</button>
					</span>
				</div>
			</form>
		    </div>

		    <a href="#" class="project-item-wrap margin-top clearfix" v-for="u in peoples">
			<div class="project-logo">
				<img :src="u.image" alt="" width="50" height="50">
			</div>
			<div class="project-basic-info">
				<h4>{{u.name}}</h4>
				<p>{{ u.email }}</p>
                <p>{{ u.phone }}</p>
			</div>
		    </a>

        </div>

    </div> `,
  data: {
        peoples: [],
        new_people_url :'',
        search_key :'',
        loading: false,
        project_id: configure_settings.project_id,
  },

  methods:{
    loadDatas : function (){
    var self = this;

    var self = this;
    self.loading = true;
    if(self.search_key){
        var options = {'name':self.search_key};

    }else{
        var options = {};

    }

    function successCallback(response) {
        self.new_people_url = response.body.new_people_url;
        self.peoples = response.body.peoples;
        self.loading = false;
    }

    function errorCallback() {
        self.loading = false;
        console.log('failed');
    }
    self.$http.get('/fieldsight/api/project_peoples/'+self.project_id+'/', {
        params: options
    }).then(successCallback, errorCallback);

    },
    heightLevel: function(){
      var self = this;
      Vue.nextTick(function () {
              $(".widget-scrolling-large-list > .widget-body, .widget-scrolling-list > .widget-body").
              niceScroll({cursorborder:"",cursorcolor:"#00628e"});
            }.bind(self));
      },
    searchChange : function (){
        var self = this;
        self.loadDatas();

    },
  },
  created(){
    var self= this;
    self.loadDatas();
    self.heightLevel();
  },

})

window.app = new Vue({
  el: '#graphs',
  template: `
    <div class="row">
        <div class="col-md-6">
							<div class="widget-info margin-top bg-white padding">
								<div class="widget-head">
									<h4>Form Submissions</h4>
								</div>
								<div class="widget-body">
									 <highcharts :options="submissions_data" ref="highcharts"></highcharts>
                                       <!-- <button @click="updateCredits">update credits</button> -->
								</div>
							</div>
						</div>
						<div class="col-md-6">
							<div class="widget-info margin-top bg-white padding">
								<div class="widget-head">
									<h4>Site Progress</h4>
								</div>
								<div class="widget-body">
									 <highcharts :options="progress_data" ref="highcharts"></highcharts>
                                        <!-- <button @click="updateCredits">update credits</button> -->
								</div>
							</div>
						</div>

    </div> `,
  data: {
        progress_data: {},
        submissions_data :{},
        loading: false,
        project_id: configure_settings.project_id,
        scrolled: false,
  },

  methods:{
    loadDatas : function (){
    var self = this;

    var self = this;
    self.loading = true;
    var options = {};



    function successCallback(response) {
        self.progress_data = {
                chart: {
                    type: 'column'
                },
              title: {
                text: 'Site Progress',
                x: -20 //center
              },
              subtitle: {
                text: '',
                x: -20
              },
              xAxis: {
                categories: response.body.pl
              },
              yAxis: {
                title: {
                  text: 'Progress'
                },
                plotLines: [{
                  value: 0,
                  width: 1,
                  color: '#808080'
                }]
              },
              tooltip: {
                valueSuffix: ' Site(s)'
              },
              credits: {
                enabled : false
                },
              legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0,
                enabled: false,
              },
              series: [{
                name: 'Progress',
                data: response.body.pd,
              },]
            };

        self.submissions_data = {
              title: {
                text: 'Form Submissions',
                x: -20 //center
              },
              subtitle: {
                text: 'Number of form submissions in different timeline',
                x: -20
              },
              xAxis: {
                categories: response.body.sl
              },
              yAxis: {
                title: {
                  text: 'Submissions'
                },
                plotLines: [{
                  value: 0,
                  width: 1,
                  color: '#808080'
                }]
              },
              credits: {
                enabled : false
                },
              tooltip: {
            //    valueSuffix: '°C'
              },
              legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0,
                enabled: false,
              },
              series: [{
                name: 'No OF Submissions',
                data: response.body.sd,
              }]
            };
        self.loading = false;
    }

    function errorCallback(errorResponse) {
        self.loading = false;
        console.log(errorResponse);
    }
    self.$http.get('/fieldsight/api/project_graphs/'+self.project_id+'/', {
        params: options
    }).then(successCallback, errorCallback);

    },
    updateCredits: function() {
    	var chart = this.$refs.highcharts.chart;
      chart.credits.update({
        style: {
          color: '#' + (Math.random() * 0xffffff | 0).toString(16)
        }
      });
    },
    handleScroll: function () {
        var self = this;
        if(window.scrollY>500){
//            console.log(window.scrollY);
            if(!self.loading && !self.submissions_data.hasOwnProperty("title")){
                self.loadDatas();
            }
        }
        self.scrolled = window.scrollY > 0;
  },
  heightLevel: function(){
      var self = this;
      Vue.nextTick(function () {
              $(".widget-scrolling-large-list > .widget-body, .widget-scrolling-list > .widget-body").
              niceScroll({cursorborder:"",cursorcolor:"#00628e"});
            }.bind(self));
      },
  },
  created(){
    var self= this;

    window.addEventListener('scroll', this.handleScroll);
    self.heightLevel();
  },
  destroyed () {
  window.removeEventListener('scroll', this.handleScroll);
    }

})


window.app = new Vue({
  el: '#stagedatas',
  template: `
    <div class="row"><div class="col-md-12">
              <div class="widget-info margin-top bg-white padding">
                <div class="widget-head">
                  <h4>Tabular Report</h4>
                  
                </div>
                <div class="widget-body">
                  <template v-if="sub_headers.length > 0 && rows.length > 0 ">
                  <div class="table-responsive">
                      <table class="table table-bordered table-hover tabular-report">
                        <thead class="thead-default">
                          <tr>
                          <template v-for="header in headers">
                            <th v-if="header['stage_order']" scope="col" :colspan="header['colspan']" :rowspan="header['rowspan']">{{ header['name'] }}</th>
                            <th v-else scope="col" :colspan="header['colspan']" :rowspan="header['rowspan']">{{ header['name'] }}</th>
                          </template>
                          </tr>
                          <tr>
                          <template v-for="sub_header in sub_headers">
                            <th scope="col">{{ sub_header[1] }}</th>
                          </template>
                          </tr>
                        </thead>
                        <tbody>

                          <tr v-for="row in rows">
                          <template v-for="cell in row">
                            <template v-if="typeof cell === 'string'">
                              <th class="cell-inactive" v-html="cell"></th>
                            </template>
                            <template v-else>
                              <th :class="cell[2]">{{ cell[1] }}</th>
                            </template>
                          </template>
                          </tr>
                        
                        </tbody>
                      </table>
                      <div class="container-fluid">
                        <div class="row justify-content-center">
                          <div class="col-md-6 col-lg-4">
                            <button v-if="load_next_url" v-on:click="loadDatas" class="btn btn-sm btn-block btn-primary margin-top">Load more</button>
                          </div>
                        </div>
                      </div>
                  </div>
                  </template>
                  <template v-else>
                    <span>No Data</span>
                  </template>
                </div>
              </div>
            </div>
            </div>`,
  data: {
        headers: [],
        sub_headers :[],
        rows :[],
        loading: false,
        project_id: configure_settings.project_id,
        load_next_url : '/fieldsight/ProjectDashboardStageResponsesStatus/'+self.project_id+'/',
        
     },

  methods:{
    loadDatas : function (){
    var self = this;

    var self = this;
    self.loading = true;
    if(self.search_key){
        var options = {'name':self.search_key};

    }else{
        var options = {};

    }

    function successCallback(response) {
        self.headers = response.body.content.head_cols;
        self.sub_headers = response.body.content.sub_stages;
        self.rows = rows.concat(response.body.content.rows);
        self.load_next_url = response.body.next_page;
        self.loading = false;
    }

    function errorCallback() {
        self.loading = false;
        console.log('failed');
    }

    self.$http.get(self.load_next_url, {
        params: options
    }).then(successCallback, errorCallback);

    },
    heightLevel: function(){
      var self = this;
      Vue.nextTick(function () {
              $(".widget-scrolling-large-list > .widget-body, .widget-scrolling-list > .widget-body").
              niceScroll({cursorborder:"",cursorcolor:"#00628e"});
            }.bind(self));
      },
    searchChange : function (){
        var self = this;
        self.loadDatas();

    },
  },
  created(){
    var self= this;
    self.loadDatas();
    self.heightLevel();
  },

})

window.app = new Vue({
  el: '#logdatas',
  template: `
    <div class="row">
            <div class="col-md-12">
              <div class="widget-info widget-scrolling-large-list margin-top bg-white padding">
                <div class="widget-head">
                  <h4>Project Logs</h4>
                </div>
                <div id="logbody" class="widget-body">

                <div v-for="(value, key, index) in processed_data" v-bind:key="key" class="log-wrap">
                    <h6>{{ value.date }}</h6>
                    <ul class="log-list">
                     <li v-for="log in value.logs"  v-bind:key="log.id">
                        <span class="time">{{ log.datetime.time }}</span>
                        <img v-bind:src= "log.source_img" alt="Profile Pic">
                        <span v-html="log.content"></span>
                      </li>
                    </ul>
                  </div>
                  <div class="container-fluid">
                  <div class="row justify-content-center">
                    <div class="col-md-6 col-lg-4">
                      <button v-if="load_next_url" v-on:click="loadDatas" class="btn btn-sm btn-block btn-primary margin-top">Load more</button>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`,
  data: {
        raw_data: [],
        processed_data: [],
        dates:[],
        project_id: configure_settings.project_id,
        load_next_url:'/events/api/project_logs/'+configure_settings.project_id+'/',
     },

  methods:{
    loadDatas : function (){
    var self = this;

    self.loading = true;
    if(self.search_key){
        var options = {'name':self.search_key};

    }else{
        var options = {};

    }

    function successCallback(response) {
        self.raw_data = response.body.results;
        self.loading = false;
        self.load_next_url = response.body.next;
        self.processData();
    }

    function errorCallback() {
        self.loading = false;
        console.log('failed');
    }

    

    self.$http.get(self.load_next_url, {
        params: options
    }).then(successCallback, errorCallback);

    },
    datelogger: function(item, index){
      var self = this;

      // function parseDate(str_date) {
      //   return new Date(Date.parse(str_date));
      // }

     
      datetime = dateTimeParser(item.date);
      item.datetime =datetime;

      item.content=types[item.type](item);
      // item.localtime=date_local;
      date_str = datetime.date;
      
      if (!self.dates.includes(date_str)){
          
          self.dates.push(date_str);
          var index = self.dates.indexOf(date_str);
          self.processed_data.splice(index, 0, {'date':item.datetime.date, 'logs':[item]});

        }
      else{
          var index = self.dates.indexOf(date_str);
          log_list = self.processed_data[index];
          
          log_list.logs.push(item);
          self.processed_data[index]=log_list; 
          //console.log(log_list.logs);

        }
      },

    processData : function (){
        var self = this;
        self.raw_data.forEach(self.datelogger);
        $(".widget-scrolling-large-list > .widget-body, .widget-scrolling-list > .widget-body").getNiceScroll().resize();  
        //console.log(self.processed_data);
        // console.log(self.dates);

    },


  },
  created(){
    var self= this;
    self.loadDatas();
  },

})