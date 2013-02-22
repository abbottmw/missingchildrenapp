
	$.ajaxSetup({
		error:function(x,e,errorThrown) {
			//console.log(x.getStatusCode());
			$("#status").prepend("Error!");		
		}
	});
	
	//EDIT THESE LINES
	
	var url = 'http://www.missingkids.com/missingkids/servlet/XmlServlet?act=rss';
	var s = '';
	var api = "//ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=" + encodeURIComponent(url);
	api += "&output=xml&num=-1&callback=?"
	
	
	//Title of the blog
	var TITLE = "Missing Children";
	//RSS url
	var RSS = api;
	//Stores entries
	var entries = [];
	var selectedEntry = "";
	
	//listen for detail links
	$(document).on("touchend", ".contentLink", function() {
		selectedEntry = $(this).data("entryid");
	});
	
	//Listen for main page
	$(document).on("pageinit", "#mainPage", function() {
		//Set the title
		$("#head", this).text(TITLE);
	
		$.getJSON(RSS, {}, function(res, code) {
			entries = [];
			var xml = $.parseXML(res.responseData.xmlString);
			var items = $(xml).find("item");
			var imgUrl = "";
			$.each(items, function(i, v) {
				//alert($(v).find("enclosure").attr('url'));
				entry = { 
					title:$(v).find("title").text().split(':')[1],
					type:$(v).find("title").text().split(':')[0],  
					link:$(v).find("link").text(), 
					description:$.trim($(v).find("description").text()),
					pubDate:$(v).find("pubDate").text(),
					img:$(v).find("enclosure").attr('url'),
					//look for img without the 't' appended to it. large image not included in rss feed.
					imgBig:$(v).find("enclosure").attr('url').replace(new RegExp( "(.*)[tT](\..*)$", "gi" ),"$1$2")
					
					//imgBig:imgUrl.replace('/(.*)[tT](\..*)$/')
					
					
					
				};
				entries.push(entry);
			});
	
			//now draw the list
			var s = '';
			$.each(entries, function(i, v) {
				//s += '<li><a href="#contentPage" class="contentLink" data-entryid="'+i+'">' + v.title + '</a></li>';
					s += '<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-up-c ui-li-has-arrow ui-li ui-li-has-thumb">';
					s += '<div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#contentPage" class="ui-link-inherit contentLink" data-entryid="'+i+'">';
					s += '<img src="' + v.img + '" class="ui-li-thumb">';
					s += '<h3 class="ui-li-heading">' + v.title + '</h3>';
					s += '<p class="ui-li-desc">'+v.pubDate+'</p>';
					s += '</a></div>'
					s+= '</li>';
			});
			$("#linksList").html(s);
			$("#linksList").listview("refresh");
		});
	
	});
	
	$(document).on("pagebeforeload", "#contentPage", function(prepage) {
		$("#imgWrapper").html("");			
	});
	
	//Listen for the content page to load
	$(document).on("pageshow", "#contentPage", function(prepage) {
		//Set the title
		//$("h1", this).text(entries[selectedEntry].title);
		var contentHTML = "";
		var desc = "";
		
		
		var regex = "(([0-1]{1})?[\-\. ]?)(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}";
		var matches = [];
		var re = new RegExp(regex,"gi");
		$('#infoList').empty();
		desc = entries[selectedEntry].description;
		
		  if (re.test(desc)) {
		   	var matches = desc.match(re);
			var infoList = $('#infoList');
			
			$(infoList).empty();

			for (m in matches){
				
				var li = $(document.createElement('li')).attr({'data-icon':'mc-phone'});
				li.html('<a href="tel:'+matches[m]+'">' + matches[m] + '</a>');
				li.appendTo(infoList);
				
			}
			
		   
		  } else {
		    console.log("No match");
		  }
		
		console.log(desc.match(re));
		contentHTML += '<div id="imgWrapper">';
		contentHTML += '<img id="largeImg" src="' + entries[selectedEntry].imgBig +'" width="256" height="320">';
		contentHTML += '</div>';
		
		contentHTML += '<div id="entryData">';
		contentHTML += '<h3>' + entries[selectedEntry].type + '</h3>' + desc;
		contentHTML += '</div>';
	
		
		$("#entryInfo",this).html(contentHTML);
		
		contentHTML = "";
		var li = $(document.createElement('li')).attr({'data-icon':'mc-world'}).html('<a href="'+entries[selectedEntry].link+'">View Website</a></li>');
		li.appendTo(infoList);
		//contentHTML += '<li data-icon="mc-phone"><a href="'+entries[selectedEntry].link+'">Visit Me Now</a></li>';
		
		//$("#infoList").html(contentHTML);
		$(infoList).listview("refresh");
	});
		
	
