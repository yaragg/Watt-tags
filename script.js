"use strict";

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
}

function getSynonyms(){
	term = $('#searchterm').val();
	selectedSynonyms = [];
	currentResults = [];
	$('#synonyms').empty();
	$('#results').empty();
	if(term=="") return;

	$.ajax({
		url: BHTUrl + term + "/json?callback=synonymCallback",
		dataType: "jsonp",
		type: 'GET',
		success: synonymCallback
	});
}

function synonymCallback(res){
	console.log(res);
	showSynonyms(res);
}

function showSynonyms(res){
	var syns = res.noun.syn;
	var list = "<ul>";
	list += "<li class='synonym selected' onclick='synonymToggle(this)'>" + term + "</li>";
	addSynonym(term);
	syns.forEach(function(syn){
		var item = "<li class='synonym' onclick='synonymToggle(this)'>" + syn + "</li>";
		list += item;
	});
	list += "</ul>";
	$('#synonyms').append(list);
}

function getResults(tag){
	$.ajax({
		url: wattpadUrl + tag,
		// url: "proxy.php?callback=storiesCallback&url=test.json",
		dataType: "jsonp",
		type: 'GET',
		success: storiesCallback
	});
}

function storiesCallback(res){
	var result = { tag : currentSynonym, results : res.stories};
	selectedSynonyms.push(result);
	// currentResults = currentResults.concat(result.results);
	currentResults = result.results.concat(currentResults);
	showResults();
}

function showResults(){
	var stories = currentResults;
	var list = $("#results");
	list.empty();
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
				item += "... <span class='more-less' onclick='readMore(this)'>Read more</span></span>";
				item += "<span class='long'>" + story.description + " <span class='more-less' onclick='readLess(this)'>Less</span></span>";
			}
			else item +="</span>";
			item += "</p>";
		}
		item += "</div>\n";
		list.append(item);
	});
		
}

function readMore(e){
	e.parentNode.style.display = "none";
	e.parentNode.parentNode.childNodes[1].style.display = "block";
}

function readLess(e){
	e.parentNode.style.display = "none";
	e.parentNode.parentNode.childNodes[0].style.display = "block";
}

function synonymToggle(e){
	$(e).toggleClass('selected');
	if($(e).hasClass('selected')) addSynonym(e.innerHTML);
	else removeSynonym(e.innerHTML);
}

function addSynonym(syn){
	console.log("Add " + syn);
	currentSynonym = syn;
	getResults(syn);
	

}

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

function isInCurrentResults(result){
	for(var i=0; i<currentResults.length; i++){
		if(currentResults.id == result.id) return true;
	}
	return false;
}

function removeSynonym(syn){
	console.log("Remove " + syn);
	for(var i=0; i<selectedSynonyms.length; i++){
		if(selectedSynonyms[i].tag == syn){
			selectedSynonyms.splice(i, 1);
			break;
		}
	}
	buildResultList();
	showResults();
}

window.onload = init;