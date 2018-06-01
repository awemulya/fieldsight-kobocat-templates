
window.app = new Vue({
  el: '#logdatas',
  template: `
    <div class="row">
            <div class="col-md-12">
              <div class="widget-info widget-scrolling-large-list margin-top bg-white padding">
                <div class="widget-head">
                  <h4>Site Logs</h4>
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
        site: configure_settings.site_id,
        load_next_url:'/events/api/site_logs/'+configure_settings.site_id+'/',
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
          console.log("new entry");
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



window.app = new Vue({
  el: '#allmetas',

  template: ` <div class="row">
                <div v-for="item in all_metas" class="col-md-6">
                  <div class="meta-item">
                    <p><strong>{{ item['question_name'] }} :</strong> <br><span v-html="item['answer']"></span>  </p>
                  </div>
                </div>
              </div>`,

  data: {
        loading : false,
        all_metas: [],
        load_all_attribs:'/fieldsight/api/siteallmetas/'+configure_settings.site_id+'/',
     },

  methods:{
    loadDatas : function (){
    var self = this;
    self.loading = true;

    function successCallback(response) {
        self.all_metas=response.body;
        self.loading = false;
    }

    function errorCallback() {
        self.loading = false;
        console.log('failed');
    }
    self.$http.get(self.load_all_attribs).then(successCallback, errorCallback);


    }
    
   },
  created(){
    var self= this;
    self.loadDatas();
  },

})