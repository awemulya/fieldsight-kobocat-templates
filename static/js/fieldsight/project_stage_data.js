function StageViewModel(url) {
  var self=this;
  self.allRows = ko.observableArray();
  self.rows = ko.observableArray();
  self.headers = ko.observableArray();
  self.subHeaders = ko.observable();
  self.next_page = null;
  self.search_key_region = ko.observable();
  self.show_next_page_region = ko.observable(false);
  self.show_search_region_button = ko.observable(false);
  self.is_searching_regions = ko.observable(false);


  self.loadData = function(url){
      App.showProcessing();
          $.ajax({
              url: url,
              method: 'GET',
              dataType: 'json',
              

              success: function (response) {

                var Headers =response.content.head_cols;


                var Sub_headers = response.content.sub_stages;

                var list_rows = response.content.rows;
                


                self.headers(Headers);
                self.subHeaders(Sub_headers);
                self.rows(list_rows);

  //for next page
                  
                  self.next_page = response.next_page;

                  if (self.next_page != null){ 
                    self.show_next_page_region(true);
                     }
                  else{ 
                    self.show_next_page_region(false);
                     }
                     console.log(self.headers());
                App.hideProcessing();
                },
              error: function (errorThrown) {
                  App.hideProcessing();
                  console.log(errorThrown);
              }
          });
    };

  loadMoreDatas = function(){
    self.loadData(next_page);
  }; 

  self.loadData(url);
}


