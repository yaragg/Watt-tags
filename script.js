"use strict";

function init(){
	$('#search').on('click', getData);
}

function getData(){
	var term = $('#searchterm').val();
	$('#synonyms').append(term);
	getResults();
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
		list.append("<div class='story'>");
		list.append(story.title);
		list.append("</div>");
	});
		
}

window.onload = init;