var entries = [];
var selectedEntry = "";



	//Listen for main page
	$(document).on("pageinit", "#main", function() {
	
		//Set the title
		$("h1", this).text('Missing Children Alert Cases');
		//$('.ui-li-thumb').one('error', function() { this.src = 'images/pnf.png'; });
		
		getData('');
	
	});



	$.ajaxSetup({
		beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //Show spinner
            complete: function() { $.mobile.hidePageLoadingMsg() }, //Hide spinner
		error:function(x,e,errorThrown) {
			//console.log(x.getStatusCode());
			$("#status").prepend("Error!");		
		}
	});
	
	
	//listen for detail links
	$(document).on("click", ".contentLink", function() {
		selectedEntry = $(this).data("entryid");
	});


      //listen for state clicks
	$(document).on("click", ".stateLink", function(e) {
			var item = $(this);
			var state = $(item).data("state");
			//console.log(state);
			getData($.trim(state));
			
	});


	$(document).on("pagebeforeshow", "#contentPage", function(prepage) {
		var entry = entries[selectedEntry];
		var phone = entry.phone;
		$("h1", this).text(entry.title);
		$('#imgWrapper #largeImg',this).attr({'src':entry.imgBig});
		$('#entryData h3').text(entry.type);
		$('#entryData span#description').text(entry.description);
		
		//replace broken image with not found image
		$('#imgWrapper #largeImg',this).one('error', function() { this.src = 'images/pnf.png'; });
		
		//build phone list and website
		
		$("#infoList").empty();
		
		for (var p in phone) {
			var li = $(document.createElement('li')).attr({'data-icon':'mcphone'});
			li.addClass("ui-icon-nodisc");
			li.html('<a href="tel:'+phone[p]+'">' + phone[p] + '</a>');
			li.appendTo($("#infoList"));
		}
		
		//add web address
		var li = $(document.createElement('li')).attr({'data-icon':'mcworld'});
		li.html('<a href="'+entry.link+'" target="_NCMEC">Visit Website</a>');
		li.appendTo($("#infoList"));
		
		$("#infoList").listview("refresh");
		
	});

	$(document).on("pageshow", "#contentPage", function(prepage) {
		//console.log(selectedEntry);
	});
	

 




	//get Data function	
	function getData( state ){
		var data = NCMEC.getData( state );
		
		
		data.done(function(res){
			var xml = $.parseXML(res.responseData.xmlString);
			var head_title = $(xml).find("channel>title").text();
			$("h1", '#main').text(head_title);
			var items = $(xml).find("item");
			var s = "";
			//clean out entries
			entries = [];
			$.each(items, function(i, v) {
				var record = NCMEC.parseRecord(v);
				
				entries.push(record);
				
				//build list
				s += '<li>';
				s += '<a href="#contentPage" class="ui-link-inherit contentLink" data-entryid="'+i+'">';
				s += '<img src="' + record.img + '" class="ui-li-thumb">';
				s += '<h3 class="ui-li-heading">' + record.title + '</h3>';
				s += '<div class="ui-li-desc">'+record.pubDate+'<br/><span class="ui-li-missingdate">'+record.missingSince+'</span></div>';
				s += '</a>'
				s += '</li>';
					
			});
			
			
			
			$("#linksList").html(s);
			
			
			$('img.ui-li-thumb').error(function() {
				$(this).attr({
					src: 'images/pnf.png',
					alt: 'Sorry!  This image is not available!'
				});
			});
			
			
			$("#linksList").listview("refresh");
			
			
			
			
			
			
			$( "#statesPanel" ).panel( "close" );
		});	
		
		
	}
		
	
		
		
		
		
		
		



