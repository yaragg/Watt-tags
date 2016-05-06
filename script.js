"use strict";

function init(){
	$('#search').on('click', getData);
}

function getData(){
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
		item += "</div>\n";
		list.append(item);
	});
		
}

window.onload = init;