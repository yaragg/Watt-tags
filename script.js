"use strict";

var selectedSynonyms = [];

function init(){
	$('#search').on('click', getSynonyms);
}

function getSynonyms(){
	var term = $('#searchterm').val();
	// var list = $('#synonyms');
	// var html = "<ul>";
	// synonyms.forEach(function(syn){

	// });
	// $('#synonyms').append(term);
	// $('#synonyms').append("")
	$.ajax({
		url: "syn.json",
		dataType: "json",
		type: 'GET',
		success: function(res){
			showSynonyms(res)
		}
	});
	getResults();
}

function showSynonyms(res){
	var syns = res.noun.syn;
	var list = "<ul>";
	syns.forEach(function(syn){
		var item = "<li class='synonym' onclick='synonymToggle(this)'>" + syn + "</li>";
		list += item;
	});
	list += "</ul>";
	$('#synonyms').append(list);
}

function getResults(){
	$.ajax({
		url: "test.json",
		dataType: "json",
		type: 'GET',
		success: function(res){
			showResults(res)
		}
	});
}

function showResults(res){
	console.log("Inside showResults");
	var stories = res.stories;
	console.log(stories);
	// $("#results").innerHTML = "<ul></ul>";
	var list = $("#results");
	stories.forEach(function(story){
		// $("#results").append("<li>"+story.title+"</li>");
		var item = "\n<div class='story'>\n";
		if(story.cover) item += "<img class='cover' width='64' height='100' src='" + story.cover + "' alt='Cover' />";

		if(story.voteCount){
			item += "<p class='votes'>Votes: " + story.voteCount + "</p>";
		}


		if(story.createDate){
			item += "<p class='createDate'>Date: " + story.createDate.substr(0, 10) + "</p>";
		}

		item += "<span class='title'>"+story.title+"</span>\n";

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
}

function removeSynonym(syn){
	console.log("Remove " + syn);
}

window.onload = init;