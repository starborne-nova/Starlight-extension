var unsaved = false;
var box_off = "fa fa-square-o fa-1x fa-fw";
var box_on = "fa fa-check-square-o fa-1x fa-fw";
var audio_off = "fa fa-volume-off fa-1x fa-fw";
var audio_on = "fa fa-volume-up fa-1x fa-fw";

$(function(){
	$("#options").click(function(){
		chrome.tabs.create({'url': "/options.html" } );
	});
	chrome.storage.sync.get("vinesauce-variables", function(vars) {
		chrome.storage.sync.get("vinesauce-settings", function(sets) {
			init_popout(vars["vinesauce-variables"],sets["vinesauce-settings"]);
		});
	});
		
		
	
	
	
});

function init_popout(variables, settings){
	var inner_html = "";
	var onLast = 0;
	$.each(variables, function(i,v) {
		if(v["online"] == true && settings["streamers"][v["_id"]]["notify"] == true){
			inner_html += "<a class='stream_link' href='https://www.twitch.tv/"+v["name"]+"'>";
			inner_html += "<div class='stream_box' name='"+v["name"]+"'>";
			inner_html += "<div class='name'>"+v["display"]+"</div><div class='game'>"+v["game"]+"</div>";
			
			inner_html += "</div>";
			inner_html += "</a>";
		}
		onLast += 1;
		if(i == (variables.length-1)){
			$("#inner_text").html(inner_html);
			changeTheme(settings);
			$("a").click(function(){return false;})
			$(".stream_box").click(function(){
				url = "https://www.twitch.tv/"+$(this).attr('name');
				chrome.tabs.create({'url': url } );
			});
			
			
		}
	});
	
	
	
	
}


function changeTheme(settings){
	$('body ,#title ,#inner_text ,#options ,.stream_box').removeClass( "light");
	$('body ,#title ,#inner_text ,#options ,.stream_box').removeClass( "dark");
	$('body ,#title ,#inner_text ,#options ,.stream_box').removeClass( "vinesauce");
	$('body ,#title ,#inner_text ,#options ,.stream_box').addClass(settings["theme"]);

}