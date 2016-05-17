(function(){
	"use strict";
	window.WattTags = function(){};

	var selectedSynonyms = [];
	var currentResults = [];
	var term;
	var wattpadResult;
	var currentSynonym;

	var BHTUrl = "https://words.bighugelabs.com/api/2/d5fbbd6e0579ecdd4b7f4309a6bfa262/"
	var wattpadUrl = "https://people.rit.edu/~yxg5358/330/watt-tags/proxy.php?callback=storiesCallback&tag="

	function init(){
		$('#search').on('click', getSynonyms);

		//Trigger event when Enter pressed on text field adapted from http://stackoverflow.com/questions/4418819/submit-form-on-enter-when-in-text-field
		$("#searchterm").on('keyup', function(e){
			if(e.keyCode == 13) {
				getSynonyms();
				return;
			}
		});

		$("#sort").on('change', sortResults);

		$("#searchterm").val(localStorage.getItem("yxg5358_search_term"));
	}

	//Sends request to Big Huge Thesaurus for any related terms to the search term
	function getSynonyms(){
		term = $('#searchterm').val();
		localStorage.setItem("yxg5358_search_term", term);
		selectedSynonyms = [];
		currentResults = [];
		$('#synonyms').empty();
		$('#results').empty();
		$("#sort-by").hide();
		if(term=="") return;

		$.ajax({
			url: BHTUrl + term + "/json?callback=synonymCallback",
			dataType: "jsonp",
			type: 'GET',
			beforeSend: function(){
				$("#spinner").show();
			},
			success: synonymCallback
		});
	}

	function synonymCallback(res){
		$("#spinner").hide();
		showSynonyms(res);
	}

	//Display the word list and add events for adding and removing the synonyms from the search
	function showSynonyms(res){
		var syns = res.noun.syn;
		var list = "<ul>";
		list += "<li class='synonym selected' onclick='WattTags.synonymToggle(this)'>" + term + "</li>";
		addSynonym(term);
		syns.forEach(function(syn){
			var item = "<li class='synonym' onclick='WattTags.synonymToggle(this)'>" + syn + "</li>";
			list += item;
		});
		list += "</ul>";
		$('#synonyms').append(list).hide();
		$('#synonyms').fadeIn();
	}

	//Requests stories from Wattpad that match the given tag
	function getResults(tag){
		$.ajax({
			url: wattpadUrl + tag,
			// url: "proxy.php?callback=storiesCallback&url=test.json",
			dataType: "jsonp",
			type: 'GET',
			beforeSend: function(){
				$("#spinner").show();
			},
			success: storiesCallback
		});
	}

	//Add new results to current list
	function storiesCallback(res){
		$("#spinner").hide();
		var result = { tag : currentSynonym, results : res.stories};
		selectedSynonyms.push(result);
		buildResultList();
		sortResults();
	}

	//Display current story results
	function showResults(){
		var stories = currentResults;
		var list = $("#results");
		list.empty();
		if(stories.length == 0){
			list.append("<div class='story'>No stories found.</div>");
			return;
		}
		$("#sort-by").show();
		stories.forEach(function(story){
			var item = "\n<div class='story'>\n";
			if(story.cover) item += "<a href='"+ story.url + "'><img class='cover' width='64' height='100' src='" + story.cover + "' alt='Cover' /></a>";

			if(story.voteCount){
				item += "<p class='votes'>Votes: " + story.voteCount + "</p>";
			}


			if(story.createDate){
				item += "<p class='createDate'>Date: " + story.createDate.substr(0, 10) + "</p>";
			}

			item += "<span class='title'><a href='"+ story.url + "'>"+story.title+"</a></span>\n";
			item += "<p class='author'>by " + story.user + "</p>";

			if(story.description){
				story.description = story.description.replace(/\n/g, "<br/>");
				item += "\n<p class='description'>";
				item +=  "<span class='short'>" + story.description.substr(0, 300);
				if(story.description.length > 300){
					item += "... <span class='more-less' onclick='WattTags.readMore(this)'>Read more</span></span>";
					item += "<span class='long'>" + story.description + " <span class='more-less' onclick='WattTags.readLess(this)'>Less</span></span>";
				}
				else item +="</span>";
				item += "</p>";
			}
			else{
				item += "\n<p class='description'>No description found.</p>";
			}
			item += "</div>\n";
			list.append(item).hide();
			list.fadeIn();
		});
			
	}

	//Make the entire description visible for the story
	//http://stackoverflow.com/questions/14245716/is-it-possible-to-call-a-javascript-function-inside-an-immediately-invoked-funct
	$.extend(WattTags, {
		readMore : function (e){
			e.parentNode.style.display = "none";
			e.parentNode.parentNode.childNodes[1].style.display = "block";
		}
	});

	//Reduce the visible description for the story
	$.extend(WattTags, {
		readLess : function(e){
			e.parentNode.style.display = "none";
			e.parentNode.parentNode.childNodes[0].style.display = "block";
		}
	});

	//Toggle selected appearance for a synonym
	$.extend(WattTags, {
		synonymToggle : function(e){
			$(e).toggleClass('selected');
			if($(e).hasClass('selected')) addSynonym(e.innerHTML);
			else removeSynonym(e.innerHTML);
		}
	});

	//Add new synonym to the list of words being searched and fetch new results
	function addSynonym(syn){
		currentSynonym = syn;
		getResults(syn);
	}

	//Merge story results to eliminate duplicates in case one story has more than one of the searched tags
	function buildResultList(){
		currentResults = [];
		for(var i=0; i<selectedSynonyms.length; i++){
			for(var j=0; j<selectedSynonyms[i].results.length; j++){
				if(!isInCurrentResults(selectedSynonyms[i].results[j])){
					currentResults.push(selectedSynonyms[i].results[j]);
				}
			}
		}
	}

	//Sort results by the chosen attribute
	function sortResults(){
		var attribute = $("#sort").val();

		if(attribute==null){ //If no attribute chosen, just leave as is
			showResults();
			return;
		}
		if(attribute=='title' || attribute=='user') currentResults.sort(function(a, b){return a[attribute].localeCompare(b[attribute]);});
		else if(attribute=='createDate') currentResults.sort(function(a, b){return -a[attribute].localeCompare(b[attribute]);}); 
		else currentResults.sort(function(a, b){return b[attribute]-a[attribute];}); 
		showResults();
	}

	function isInCurrentResults(result){
		for(var i=0; i<currentResults.length; i++){
			if(currentResults.id == result.id) return true;
		}
		return false;
	}

	//Remove synonym from list of selected words, and remove the stories that were added to the results because of that synonym
	function removeSynonym(syn){
		for(var i=0; i<selectedSynonyms.length; i++){
			if(selectedSynonyms[i].tag == syn){
				selectedSynonyms.splice(i, 1);
				break;
			}
		}
		buildResultList();
		sortResults();
	}

	window.onload = init;
})();