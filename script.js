"use strict";

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
		var item = "<li>" + syn + "</li>";
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
		item += "<span class='title'>"+story.title+"</span>\n";
		if(story.cover) item += "<img class='cover' width='64' height='100' src='" + story.cover + "' alt='Cover' />";
		if(story.description){
			item += "\n<p class='description'>";
			item += "<span class='short'>" + story.description.substr(0, 100) + "... <span onclick='readMore(this)'>Read more</span></span>";
			item += "<span class='long'>" + story.description + "</span>";
			item += "</p>";
		}
		item += "</div>\n";
		list.append(item);
	});
		
}

function readMore(e){
	e.parentNode.style.display = "none";
	console.log(e);
	console.log(e.parentNode);
	console.log(e.parentNode.parentNode);
	console.log(e.parentNode.parentNode.children);
	console.log(e.parentNode.parentNode.childNodes);
	e.parentNode.parentNode.childNodes[1].style.display = "block";
}

window.onload = init;