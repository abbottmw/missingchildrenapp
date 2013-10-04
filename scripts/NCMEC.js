var NCMEC = (function() {
	var _BASEURL = "http://www.missingkids.com/missingkids/servlet/XmlServlet?act=rss";
	var _URL = _BASEURL;
	var _BASE = _BASEURL;
   
	var xml = "";
	//simple cache to hold state XML data.
	var cache={};

	
	// private functions
    var getData = function( state ) {
	  if(typeof state != 'undefined' && $.trim(state).length > 0){
	  	_URL = _BASEURL + '&LanguageCountry=en_US&orgPrefix=NCMC&state=' + state;
	  }else{
	  	_URL = _BASE;
	  }	  
		
	  var api = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=" + encodeURIComponent(_URL);
	  api += "&output=xml&num=-1&callback=?"	
		
	  //check if state is in cache object, else retrieve data via ajax.	
	  if( cache.hasOwnProperty( state )){
	  	
		//setup Deferred 
	  	var def = $.Deferred();
		var res = cache[state];
		
		def.resolve(res);
		
		return def;
		
	  }else{
	  	 
		 return $.ajax({
			asynch: true,
			type:'GET',
			dataType: 'json',
			url: api,
			data: {},
			success: function(data, textStatus){
				cache[state] = data;
				xml = $.parseXML(data.responseData.xmlString);
			}
		});
		
	  }
		
     
		
	 
   };
   
   
    var parseRecord = function(entry){
		//phone regex
		var regex = "(([0-9]{1})?[\-\.\(\)]+[0-9]{3,4}[\-\.\(\) ]+[0-9]{3}\-[0-9]{4})";
		
		//missing since regex
		var dateregex = "^.*Missing: ([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}).*$";
		var re = new RegExp(regex,"gi");
		var reDate = new RegExp(dateregex,"gi");
		var result = {
			title: "",
			type: "",
			link: "",
			description: "",
			pubDate: "",
			img: "",
			imgBig: "",
			phone:[],
			missingSince:"",
			caseId:""
		};
		
		
		result.title = $(entry).find("title").text().split(':')[1];
		result.type = $(entry).find("title").text().split(':')[0];
		result.link = $(entry).find("link").text();
		result.description = $.trim($(entry).find("description").text());
		result.pubDate = $(entry).find("pubDate").text();
		result.img = $(entry).find("enclosure").attr('url');
		result.imgBig = result.img.replace(new RegExp( "(.*)[tT](\..*)$", "gi" ),"$1$2");
		
	
		
		
		
		if (re.test($.trim(result.description))) {
			result.phone = result.description.match(re);
		}
		
		result.phone.push('1-800-843-5678');

		if (reDate.test(result.description)) {
			result.missingSince = "Missing since " + result.description.replace(reDate,"$1");
		}
		
		return result;
	};
	
	// initialization *******
   ( function init () {
     //initialize stuff here
   } ) ();
		
	
	
	return {
     getData : function (state) {
		var s = '';

		  if (typeof state != 'undefined') {
    		  s = state;
	  	  }

		

         return getData(s);
      },
	  
	 parseRecord : function (entry) {
	 	
		  if (typeof entry === 'undefined') {
    		entry = '';
	  	  }
		
         return parseRecord(entry);
      }					
			
   }
	
})();