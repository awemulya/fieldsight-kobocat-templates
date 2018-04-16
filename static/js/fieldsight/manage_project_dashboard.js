Vue.use(VueHighcharts);


window.app = new Vue({
  el: '#peoples',
  template: `
    <div class="widget-info widget-scolling-large-list margin-top bg-white padding" data-mh="eq111">
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

		    <a href="#" class="project-item-wrap clearfix" v-for="u in peoples">
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
    searchChange : function (){
        var self = this;
        self.loadDatas();

    },
  },
  created(){
    var self= this;
    self.loadDatas();
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
            if(! self.loading){
                self.loadDatas();
            }
        }
        self.scrolled = window.scrollY > 0;
  },
  },
  created(){
    var self= this;

    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed () {
  window.removeEventListener('scroll', this.handleScroll);
    }

})