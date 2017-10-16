
    var data = "";
    var speed = 500;
    var types = {
        0 : type0,
        1 : type1,
        2 : type2,
        3 : type3,
        4 : type4,
        5 : type5,
        6 : type6,
        7 : type7,
        8 : type8,
        9 : type9,
        10 : type10,
        11 : type11,
        12 : type12,
        13 : type13,
        14 : type14,
        15 : type15,
        16 : type16,
        17 : type17,
        18 : type18,
        19 : type19,
        20 : type20,
    }

//notification message list builder with ahref links
    function type0(data){
         content = '<b><a href="'+ data.get_source_url +'">' + data.source_name +'</a></b> joined <b><a href="' +  data.get_event_url + '">' + data.event_name + '</a></b> as an Organization Admin.';
         return content;
    }
    function type1(data){
         content = '<b><a href="'+ data.get_source_url +'">' + data.source_name +'</a></b> joined <b><a href="' +  data.get_event_url + '">' + data.get_event_name + '</a></b> as an Organization Admin.';
         return content;
    }

    function type2(data){
          content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> was added as the Project Manager <b><a href="' +  data.get_event_url + '">' + data.get_event_name + '</a></b> by <b><a href="' +  data.invitor_url + '">' + data.invitor_name + '</a></b>';
              return content;
    }

    function type3(data){
           content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> was added as Reviewer of <b><a href="' +  data.get_event_url + '">' + data.get_event_name + '</a></b> by <b><a href="' +  data.get_invitor_url + '">' + data.invitor_name + '</a></b>';
              return content;

    }
    function type4(data){
          content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> was added as Site Supervisor of <b><a href="' +  data.get_event_url + '">' + data.get_event_name + '</a></b> by <b><a href="' +  data.get_invitor_url + '">' + data.invitor_name + '</a></b>';
                return content;

    }
    function type5(data){
           content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> was assigned as an Organization Admin in <b><a href="' +  data.get_event_url + '">' + data.get_event_name + '</a></b>';
              return content;
    }
    function type6(data){
           content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> was assigned as a Project Manager in <b><a href="' +  data.get_event_url + '">' + data.get_event_name + '</a></b>';
              return content;
    }
    function type7(data){
           content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> was assigned as a Reviewer in <b><a href="' +  data.get_event_url + '">' + data.get_event_name + '</a></b>';
              return content;
    }

    function type8(data){
               content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> was assigned as a Site Supervisor in <b><a href="' +  data.get_event_url + '">' + data.get_event_name + '</a></b>';
                  return content;
        }

    function type9(data){
               content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> created a new organization named <b><a href="' +  data.get_event_url + '">' + data.get_event_name + '</a></b>';
                  return content;
        }


    function type10(data){
               content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> created a new project named <b><a href="' +  data.get_event_url + '">' + data.get_event_name + '</a></b>';
                  return content;
        }


    function type11(data){
               content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> created a new site named <b><a href="' +  data.get_event_url + '">' + data.get_event_name + '</a></b> in  <b><a href="' +  data.get_extraobj_url + '">' + data.get_extraobj_name + '</a></b>';
                  return content;
        }

    function type12(data){
               content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> created <b>'+ title +' in <a href="' +  data.get_event_url + '">' + data.get_event_name + '</a></b>';
                  return content;
        }


    function type13(data){
               content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> changed the details of organization named <b><a href="' +  data.get_event_url + '">' + data.get_event_name + '</a></b>';
                  return content;
        }       
            
    function type14(data){
               content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> changed the details of project named <b><a href="' +  data.get_event_url + '">' + data.get_event_name + '</a></b>';
                  return content;
        } 

    function type15(data){
               content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> changed the details of site named <b><a href="' +  data.get_event_url + '">' + data.get_event_name + '</a></b>';
                  return content;
        }   

    function type16(data){
               content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> submitted a response for <b><a href="' +  data.get_event_url + '">' + data.get_event_name + '</a></b>' + '</a></b> in site <b><a href="' + data.get_extraobj_url+ '">' + data.get_extraobj_name+'</a></b>';
                  return content;
        }   

    function type17(data){
               content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> reviewed a response for <b><a href="' + data.get_event_url+ '">' + data.get_event_name+'</a></b> in site <b><a href="' + data.get_extraobj_url+ '">' + data.get_extraobj_name+'</a></b>';
                  return content;
        }   

    function type18(data){
               content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> assigned a new '+ data.extra_message +' in project <b><a href="' + data.get_event_url+ '">' + data.get_event_name+'</a></b>';
                  return content;
        }   

    function type19(data){
               content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> assigned a new '+ data.extra_message +' in site <b><a href="' + data.get_event_url+ '">' + data.get_event_name+'</a></b>';
                  return content;
        }   


    function type20(data){
               content = '<b><a href="' + data.get_source_url + '">'+ data.source_name +'</a></b> edited <b><a href="' +  data.get_event_url + '">' + data.get_event_name + '</a></b> form.';
                  return content;
        }

function redirect(url){
  window.location = url;
}



function dateparser(date){
   let months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
 
    var d = new Date(date);

    month = d.getMonth();
    time=d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    clean_date = months[month] +', '+ d.getDate() +', '+ d.getFullYear() +', '+ time.toLowerCase()+'.';
    return clean_date;

}
  





