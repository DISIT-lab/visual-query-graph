/* Linked Open Graph
   Copyright (C) 2017 DISIT Lab http://www.disit.org - University of Florence

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU Affero General Public License as
   published by the Free Software Foundation, either version 3 of the
   License, or (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU Affero General Public License for more details.

   You should have received a copy of the GNU Affero General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>. */

// applicabile anche a link pattern

// If true, the query mode is active
var hooch_query_mode = false;

// set the drop distance
var hoochDropTollerance = 130;
var hoochGhostEllipseR = hoochDropTollerance / 2;

function hoochAddSparqlMenu(parent4menu){

	// START MAIN SPARQL MENU
	// create the main menu UL
	var hooch_bqeUl = document.createElement("UL");
	// creating the main menu LI
//	var hooch_bqeLi = hoochCreateMenuItemLi("javascript:void(0)","Base Query Elements","images/sparql_buttons/hooch_bqe.jpeg");
	// adding all the LI to the main menu
//	hooch_bqeUl.appendChild(hooch_bqeLi)
	
	// END MAIN SPARQL MENU
	
	// START BQE SUB MENU
	
	// create the BQE subMenu
//	var hooch_bqeSubUl = document.createElement("UL");
	

	
	// making all the LI for the BQE menu
	var hooch_prLi = hoochCreateMenuItemLi("javascript:addNode2force(false)","Pattern Resource","images/sparql_buttons/hooch_resource_pattern.png","HoochPRmenu");
	var hooch_plLi = hoochCreateMenuItemLi("javascript:addNode2force(true)","Pattern Link","images/sparql_buttons/hooch_link_pattern.png","HoochPLmenu");
//	var hooch_ipLi = hoochCreateMenuItemLi("javascript:manageQueryMode()","Enable SPARQL","images/sparql_buttons/hooch_resource.jpeg");
	var hooch_enableSparql = hoochCreateMenuItemLi("javascript:manageQueryMode()","Enable SPARQL","images/sparql_buttons/hooch_bqe.jpeg");
	
//	var hooch_ilLi = hoochCreateMenuItemLi("javascript:hoochLoadClassList()","Instance Link","images/sparql_buttons/hooch_link_istance.png");
	// adding all the LI to the BQE suMenu
//	hooch_bqeSubUl.appendChild(hooch_prLi);
	// adding the PL item to the BQE subMenu
//	hooch_bqeSubUl.appendChild(hooch_plLi);
	// adding the PL item to the BQE subMenu
//	hooch_bqeSubUl.appendChild(hooch_ipLi);
	// adding the PL item to the BQE subMenu
//	hooch_bqeSubUl.appendChild(hooch_ilLi);
	
	// adding the BQE subMenu to the BQE Li
//	hooch_bqeLi.appendChild(hooch_bqeSubUl);
	
	// END BQE SUB MENU
	
	
	
	// query buttons
	var hooch_showOnlySPARQL = hoochCreateMenuItemLi("javascript:hoochToggleShowOnlySparql()","Hide LOG elements","images/sparql_buttons/hideSparql.png","HoochShowSparql");
//	var hooch_hideAllSPARQL = hoochCreateMenuItemLi("javascript:void(0)","Hide SPARQL","images/sparql_buttons/hideSparql.png","HoochHideSpqarl");
	var hooch_playSPARQL = hoochCreateMenuItemLi("javascript:hoochSendQuery()","Play SPARQL","images/sparql_buttons/playSparql.png","HoochPlaySpqarl");
//	var hooch_hideSPARQLresult = hoochCreateMenuItemLi("javascript:void(0)","Hide SPARQL Result","images/sparql_buttons/hooch_link_pattern.png","HoochHideSparqlResult");
	
	
	
	var hooch_showOnlyAXEL = hoochCreateMenuItemLi("javascript:hideAllSparql()","Hide query","images/sparql_buttons/hideSparqlMark.png","HoochHideSparql");
	var hooch_queryPanel = hoochCreateMenuItemLi("javascript:openQueryManager()","Query Panel","images/sparql_buttons/hooch_query_panel.png","HoochQueryPanel");
	
	var hoochHelper = hoochCreateMenuItemLi("javascript:openSparqlHelper()","Predicate Search","images/sparql_buttons/helpSearch.png","HoochHelpSearch");
	
	//clearAllSparqlQuery()
	var hoochClearQuery = hoochCreateMenuItemLi("javascript:clearAllSparqlQuery(true)","Remove Queries","images/buttons/X_icon.png","HoochClearQuery");
	// NAV SET UP AND PARENT NESTING HoochShowSparql HoochHideSpqarl HoochPlaySpqarl HoochHideSparqlResult
	// create the nav
	var hooch_sparqlNav = document.createElement("nav");
	hooch_sparqlNav.id="hooch_sparql_left_side_nav";
	// append the main UL to the nav
//	hooch_sparqlNav.appendChild(hooch_bqeUl);
	// append the nav to the selected parent
	
	hooch_bqeUl.appendChild(hooch_enableSparql);
	hooch_bqeUl.appendChild(hooch_prLi);
	hooch_bqeUl.appendChild(hooch_plLi);
	
	hooch_bqeUl.appendChild(hooch_showOnlySPARQL);
	hooch_bqeUl.appendChild(hooch_showOnlyAXEL);
	hooch_bqeUl.appendChild(hoochClearQuery);
	hooch_bqeUl.appendChild(hooch_queryPanel);
	hooch_bqeUl.appendChild(hooch_playSPARQL);
	hooch_bqeUl.appendChild(hoochHelper);
	
	hooch_sparqlNav.appendChild(hooch_bqeUl)
	
	
	var hooch_graph_cont = d3.select("#"+parent4menu).node().appendChild(hooch_sparqlNav);
	
	
	
}


function removeQueryResource(id,el,query2toggle){
	var node2rem = nodes.filter(function(ds,i){
		if(ds.id == id && ( el.isConst != true || el.cloned == true)){
			nodes.splice(i,1);
			return ds;
		}
	});
	if(node2rem.length > 0){
		var d = node2rem[0];
		var remId = d.id;
		links.filter(function(ls,i){
			if(ls.source.id == remId || ls.target.id == remId){
				links.splice(i,1);
				return ls;
			}
		});
	
		
	}
	for(r in el.predicates){
		removeQueryResource(r,el.predicates[r],query2toggle);
	}
	for(e in el.objIds){
		removeQueryResource(el.objIds[e], query2toggle[el.objIds[e]],query2toggle);
	}
}

function removeQuery(queryId){
	var query2toggle = queryStatuslMap[queryId].jsonQuery;
	
	for(qe in query2toggle){
		var el = query2toggle[qe];
		removeQueryResource(qe,el,query2toggle);
	}
	restart();
}

function addQuery(queryId) {
	var query2add = queryStatuslMap[queryId].jsonQuery;
	// reset temp qeury elements
	queryElementsAlreadyBuilt = {};
	
	for(id2add in query2add) {
		var el2add = query2add[id2add];
		if(el2add.isConst){
			
		}
		
	}
	
	
	for(id2add in query2add) {
		var el2add = query2add[id2add];
		addQueryResource(id2add, el2add,query2add,el2add.isConst);
		
	}
	restart();
}

var queryElementsAlreadyBuilt = {};

function addQueryResource(id,res,query2add,isConst){
	
	if(queryElementsAlreadyBuilt[id]){
		// if already been treated, return
		return queryElementsAlreadyBuilt[id];
	}
	var nodeMatch = searchNodeInGraph(id);
	if(!nodeMatch){
		nodeMatch = hoochBuildSparqlResource(res.value, id,isConst);
		nodeMatch.filters = res.filters;
	}
	nodes.push(nodeMatch);
	
	queryElementsAlreadyBuilt[id] = nodeMatch;
	
	for(predId in res.predicates){
		var currentPred = addQueryLink(predId,res.predicates[predId],query2add,nodeMatch);
		var linkMatches = links.filter(function(l,lid){
			if(l.source.id == id && l.target.id == predId){
				return l;
			}
		});
		if(linkMatches.length > 0){
			// nothing to do
			
		}else{
			if(!nodeMatch.relations){
				nodeMatch.relations = {};
			}
			nodeMatch.relations[predId] = currentPred;
			links.push({source : nodeMatch, target : currentPred, present : true});
		}
	}
	if(nodeMatch.filters){
		restart();
		addFilterIcon(nodeMatch);
	}
	
	return nodeMatch;
}

function addQueryLink(predId,pred,query2add,parentNode){
	
	if(queryElementsAlreadyBuilt[predId]){
		return queryElementsAlreadyBuilt[predId];
	}
	var predMatch = searchNodeInGraph(predId);
	if(! predMatch){
		predMatch = hoochBuildSparqlLink(pred.value,predId,pred.name2show);
		if(pred.uri){
			predMatch.uri = pred.uri;
		}
		predMatch.parentNode = parentNode;
		predMatch.father = parentNode.name; 
		if(pred.inbound == true){
			predMatch.inbound = true;
		}
		if(pred.isConst == true){
			predMatch.isConst = true;
		}else{
			predMatch.isConst = false;
		}
		
		if(pred.cloned == true){
			predMatch.cloned = true;
		}else{
			predMatch.cloned = false;
		}
		
		if(pred.isOptional == true){
			predMatch.isOptional = true;
		}else{
			predMatch.isOptional = false;
		}
		
		
		predMatch.x = (parentNode.x+ 50) / 2;
		predMatch.y = (parentNode.y+ 50) / 2;
		//predMatch.elements.push(predMatch);
		nodes.push(predMatch);
		
	}
	queryElementsAlreadyBuilt[predId] = predMatch;
	
	for(index in pred.objIds){
		var nextElemId = pred.objIds[index];
		var nextElem = query2add[nextElemId];
		var nextRes = addQueryResource(nextElemId, nextElem,query2add);
		
		var linkMatches = links.filter(function(l,lid){
			if(l.source.id == predId && l.target.id == nextElemId){
				return l;
			}
		});
		
		if(linkMatches.length > 0){
			// nothing to do
		}else{
			predMatch.elements.push(nextRes);
			links.push({source : predMatch, target : nextRes, present : true});	
		}
		
	}
	return predMatch;
}


var queryStatuslMap = {};
function toggleRS(resultId){

	if(queryStatuslMap[resultId].resultShow == true){
//		toggle the state
		queryStatuslMap[resultId].resultShow = false;
		// need to cut all nodes
		var allResultlLink = d3.selectAll("line.link").filter(function(l){ 
//			if(l.source.sparqlHoochResult == true || l.target.sparqlHoochResult == true ){
				links.filter(function(ls,i){
					if(ls.source.resultId == resultId && ls.target.resultId == resultId){
						links.splice(i,1);
						return l;
					}else{		
						ls.source.saveMe = true;
						ls.target.saveMe = true;
					}
				});
				
//			}
		});
		
		
		allResultlLink.remove();
		var allResultNode = d3.selectAll("g.node").filter(function(d){ 
			
			if(d.saveMe){
				delete d.saveMe;
			}else{ 
//				if( d.sparqlHoochResult == true) {
				nodes.filter(function(ds,i){
					if(ds.id == d.id){
						nodes.splice(i,1);
						return d;
					}
				});
			}
		});
		allResultNode.remove();
		restart();
	}else{
//		toggle the state
		queryStatuslMap[resultId].resultShow = true;
		rs_parse_query_result(queryStatuslMap[resultId].jsonResponse);		
	}
}


function showRawQuery(resultId){
	var msg;
	if(queryStatuslMap[resultId]){
		if(queryStatuslMap[resultId].rawQuery){
			msg = queryStatuslMap[resultId].rawQuery
		}else{
			msg= 'Query not available';
		}
	}else{
		msg= 'Query not available';
	}
	
	msg = msg.replace(new RegExp("<","g"),"&lt;"); 
	msg = msg.replace(new RegExp(">","g"),"&gt;");
	
	$rawQuery = $("<div id='rawQuery' title='SPARQL'><p>" + msg +  "</p></div>");
	$rawQuery.dialog();
	//alert(msg);
}

//////////// SEACRH HELPER \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
var hoochSparqlHelper = function(){
	var 
	method = {},
	$overlay,
	$main,
	$content,
	$classLabel,
	$close;
		
		    
	$overlay = $('<div class="sparqlHoochOverlay"></div>');
	$main = $('<div id="sparqlQueryManager"></div>');
	$content = $('<div id="sparqlQueryPromptContent"></div>');
	$classLabel = $("<label for='classList'>Select a class to get it's properties</label></br>");

	$close = $('<a id="sparqlQueryPromptClose" href="#"><img src="images/buttons/X_icon.png"  style="width:24px;height:27px;border:0"></a>');
	$close.click(function(e){
		e.preventDefault();
		e.stopPropagation();
		method.close();
	});
		    
	$main.append($content,$close);
	//$content.append($classLabel).append($classList);	
	
	$(document).ready(function(){
		$('body').append($overlay, $main);
		$main.hide();
		$overlay.hide();
	});
		    
		    
		    // Center the modal in the viewport
	method.center = function () {
		var top, left;
		
		top = Math.max($(window).height() - $main.outerHeight(), 0) / 2;
		left = Math.max($(window).width() - $main.outerWidth(), 0) / 2;
		
		$main.css({
			top:top + $(window).scrollTop(), 
		    left:left + $(window).scrollLeft()
		});
	};
		
		    // Open the modal
	method.open = function (classData,externalCallback,patternRes,dropTarget) {
		
		$classList = $("<select>").attr('id','classList')
		$propLabel = $("<br><label for = 'propList'>Select a property</label><br>")
		$propList = $("<select>").attr('id','propList');	
		$o = $('<option>').attr('value',"None").text("Select a class");
	    $classList.append($o);
		
		for(x in classData){
			var p = classData[x].label;
			var s = classData[x].shortenLabel;
			$o = $('<option>').attr('value',p).text(s);
		    $classList.append($o);
		}
		  
		$classList.change(function(){
			$propList.empty();
			var value = this.value;
			var callback = function(obj){
				if(!obj.errMsg){
					
					for(x in obj.res){
						var p = obj.res[x].label;
						var s = obj.res[x].shortenLabel;
						$o = $('<option>').attr('value',p).text(s);
						$propList.append($o);
					}
				}else{
					alert(obj.errMsg)
				}
			}
			$.post("request.php",
				{'hoochHelperGetPropertiesForClass' : 'true', 'hoochSparqlEndpoint' : endpoint, 'targetClass' : value},
				callback,
				'json');
			
			
		});
		
		
		$btnEnd = $('<br><br><input id="propertySelBtn" type="button" value="Add selected property to query" />').click(function(e){
    		e.preventDefault();
    		e.stopPropagation();
    		
    		var id = $propList.val();
    		var shortName = $('#propList option:selected').text();
    		if(!id){
    			alert('Select a property to add.');
    		}else{
	    		addPropertyFromSearch(shortName, id,externalCallback,patternRes,dropTarget);
	    		method.close();
    		}
		});
		
		
		$content.empty().append($classLabel).append($classList).append("<br>").append($propLabel).append($propList).append($btnEnd);
		    	
		$main.css({
			width:  'auto', 
		    height: 'auto'
		})
		
		method.center();
		
		$(window).bind('resize.main', method.center);
		
			$main.show();
		    $overlay.show();
		};
		
		// Close the modal
		method.close = function () {
			$main.hide();
		    $overlay.hide();
		    $content.empty();
		    $(window).unbind('resize.main');
		};
		return method;
	}
();


function openSparqlHelper(externalCallback,patternRes,dropTarget){
	
	var callback = function (obj) {
		classLoadPost = null;
		$('#loadOverlay').remove();
		if(!obj.errMsg) {
			hoochSparqlHelper.open(obj.res,externalCallback,patternRes,dropTarget);
		} else {
			alert(obj.errMsg)
		}
	}
	
	
	var loading = '<div id="loadOverlay">'
		+'<img id="loadingImage" src="images/ajax-loader-big.gif">'
		+ '<a style="position:absolute;top:55%;left:50%;" href="javascript:cancelFilterSearch()"><img src="images/buttons/X_icon.png"  style="width:24px;height:27px;border:0"></a>'
		+'</div>';
	$(loading).appendTo('body');
	
	
	classLoadPost = $.post("request.php",
			{'hoochHelperGetClassList' : 'true',hoochSparqlEndpoint : endpoint},
			callback,
			'json');
}





//////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


// modal window for query handling
var quryManager = (
	function(){
	    var 
	    method = {},
	    $overlay,
	    $main,
	    $content,
	    
	    $tableWrapper,
	    $table,
	    $tableHeader,
	    $close;
	
	    
	    $overlay = $('<div class="sparqlHoochOverlay"></div>');
	    
	    $tableWrapper = $('<div class="hoochSparqlTableWrapper"></div>');
	    $table = $('<table class="hoochSparqlTable"></table>');
	    $tableHeader = $('<tr><th>QueryId</th><th>Status</th><th>Start</th><th>End</th><th>Functions</th></tr>');
	    
	    $main = $('<div id="sparqlQueryManager"></div>');
	    $content = $('<div id="sparqlQueryPromptContent"></div>');
	    $close = $('<a id="sparqlQueryPromptClose" href="#"><img src="images/buttons/X_icon.png"  style="width:24px;height:27px;border:0"></a>');
	    
	    
	    $dataList = $('<dataList id="enumList" />');
	   
	    $tableWrapper.append($table);
	    
	    $close.click(function(e){
	        e.preventDefault();
	        e.stopPropagation();
	        method.close();
	    });
	
	   
	    
	    $main.append($content, $close);
	
	    $(document).ready(function(){
	        $('body').append($overlay, $main);
	        $main.hide();
		    $overlay.hide();
	    });
	    
	    
	    // Center the modal in the viewport
	    method.center = function () {
	        var top, left;
	
	        top = Math.max($(window).height() - $main.outerHeight(), 0) / 2;
	        left = Math.max($(window).width() - $main.outerWidth(), 0) / 2;
	
	        $main.css({
	            top:top + $(window).scrollTop(), 
	            left:left + $(window).scrollLeft()
	        });
	        $main.draggable();
	    };
	
	    // Open the modal
	    method.open = function (queryMap) {
	
	    	$table.empty();
	    	$table.append($tableHeader);
	    	if(queryMap){
		    	for (index in queryMap){
		    		var row = queryMap[index]; 
			    	$r = $('<tr><td>' + row.queryid + '</td><td>' + row.Status + '</td>' +
			    			'<td>' + row.launchTime + '</td>' +
			    			'<td>' + row.endTime + '</td>' +
			    			'<td><a href="javascript:toggleRS(&#39;' + row.sessionid + "-" + row.queryid + '&#39;);">'
			    			+ '<img src="images/sparql_buttons/toggle_resultSet.png" title="Toggle Result Set"  height="16" width="16">' +
			    			'</a> ' + 
			    			//'<a href="javascript:removeQuery(&#39;' + row.sessionid + "-" +row.queryid + '&#39;);">'
			    			//+ '<img src="images/sparql_buttons/query_rem.png" title="Remove Query"  height="16" width="16">' +
			    			//'</a> ' + 
			    			'<a href="javascript:addQuery(&#39;' + row.sessionid + "-" +row.queryid + '&#39;);">'
			    			+ '<img src="images/sparql_buttons/query_add.png" title="Add Query"  height="16" width="16">' +
			    			'</a> ' +
			    			'<a href="javascript:showRawQuery(&#39;' + row.sessionid + "-" +row.queryid + '&#39;);">'
			    			+ '<img src="images/sparql_buttons/raw_query_show.png" title="Show Raw Query"  height="16" width="16">' +
			    			'</a> ' +
			    			'</td></tr>');
					$table.append($r);
					
					
					if(!queryStatuslMap[row.sessionid + "-" + row.queryid]){
						queryStatuslMap[row.sessionid + "-" + row.queryid] = {};
					}
					if(row.jsonResult){
						queryStatuslMap[row.sessionid + "-" + row.queryid].jsonResponse = JSON.parse(row.jsonResult);
					}
					queryStatuslMap[row.sessionid + "-" + row.queryid].jsonQuery = JSON.parse(row.jsonQuery);
//					queryStatuslMap[row.sessionid + "-" + row.queryid].resultShow = true;
					queryStatuslMap[row.sessionid + "-" + row.queryid].rawQuery = row.sparqlQuery;
					
		    	}
	    	}
	    	$r = $("<tr style='height:100%;'></tr>");
	    	$table.append($r);
	    	$content.empty().append($tableWrapper);
	
	    	$main.css({
	            width:  'auto', 
	            height: 'auto'
	        })
	
	        method.center();
	
	        $(window).bind('resize.main', method.center);
	
	        $main.show();
	        $overlay.show();
	    };
	
	    // Close the modal
	    method.close = function () {
	    	$main.hide();
	        $overlay.hide();
	        $content.empty();
	        
	        $(window).unbind('resize.main');
	    };
	
	   
	    return method;
}());


function openQueryManager(){
	var callback = function (obj){
		quryManager.open(obj.queries);
	}
	console.log("sparqlSessionId -> " + sparqlSessionId);
	if(sparqlSessionId < 0){
		console.log("No session yet");
		$.post("request.php",
				{'hoochGetSessionId' : 'true'},
				function(resp){
					
					if(resp){
						if(resp['session']){ 
							sparqlSessionId = resp['session'];
							console.log("GET sparqlSessionId -> " + sparqlSessionId);
						}
					}
					console.log("Requesting the panel");
					$.post("request.php",
							{'loadSparqlPanel' : 'true',loadSparqlPanelEP : endpoint,loadSparqlPanelSession : sparqlSessionId},
							callback,
							'json');
				},
				'json');
	}else{
		console.log("Session already there");
		$.post("request.php",
				{'loadSparqlPanel' : 'true',loadSparqlPanelEP : endpoint,loadSparqlPanelSession : sparqlSessionId},
				callback,
				'json');
	}
	
	
}


/**
 * Given a query json, check for the CC
 * @param json2check
 */
function checkUniqueCCinQuery(json2check){
	var label = 0;
	var cc = {};
	for(nodeId in json2check){
		var node = json2check[nodeId];
		if(!node.ccLabel){
			label ++;
			cc[label] = [];
			cc[label].push(nodeId);
			node.ccLabel = label;
		}
		if(node.predicates){
			for(predId in node.predicates){
				var pred = node.predicates[predId];
				if(pred.objIds){
					for(objIndex in pred.objIds){
						var objId = pred.objIds[objIndex];
						var obj = json2check[objId];
						if(obj.ccLabel && obj.ccLabel != label){
							var copyLabel = cc[obj.ccLabel];
							cc[label] = cc[label].concat(copyLabel);
							delete cc[obj.ccLabel];
							for(tmpIdx in copyLabel){
								var tmpId = copyLabel[tmpIdx];
								json2check[tmpId].ccLabel = label;
							}
						}else{
							obj.ccLabel = label;
							cc[label].push(objId);
						}
					}
				}else{
				}
			}
			
		}else{
		}
	}
	var ccCount = 0;
	for(dummy in cc){
		ccCount ++;
	}
	if(ccCount > 1){
		
		d3.selectAll("g.node").filter(function(d){
			
			if(d.isRelation == true){
				var pid = null;
				var eid = null;
				var pFound = false;
				if(d.parentNode){
					pId = d.parentNode.id;
					for(x in cc){
		            	if(cc[x].indexOf(eid) > -1){
		            		pFound = true;
		            		break;
		            	}
		            }
				}
				var eFound = false;
				if(d.elements){
					for(tmpEidx in d.elements){
						var e = d.elements[tmpEidx];
						eid = e.id;
						for(x in cc){
			            	if(cc[x].indexOf(eid) > -1){
			            		eFound = true;
			            		break;
			            	}
			            }
					}
				}
				if(eFound == false || pFound == false){
					return d;
				}
				
			}else{
				var nodeId = d.id;
				var found = false;
				for(x in cc){
	            	if(cc[x].indexOf(nodeId) > -1){
	            		found = true;
	            		break;
	            	}
	            }
				if(found == false){
					return d;
				}
			}
		}).style("opacity", 0.1);
			
		var loading = '<div id="loadOverlay"><a style="font-size:20px;position:absolute;top:50%;left:35%;" href="javascript:clearAll()">Query is not connected. Please build a connected query.</a></div>';
		$(loading).appendTo('body');
		return false;
	}else if (ccCount == 1){
		return true;
	}else{
		alert("KO, no CC in the query");
		return false;
	}
	
	
}

function clearAll(){
	$('#loadOverlay').remove();
	d3.selectAll("g.node").style("opacity",1);
}

function clearAllAfterQuery(){
	$('#loadOverlay').remove();
}

var sparqlSessionId = -1;
var sparqlCurrentQueryId;
function hoochSendQuery(){
	var queryId = sparqlCurrentQueryId;//"HoochQuery_" + hoochGuid();
	avoidDuplicationCounter = 0 ;
	var json2send = buildGoodJson(queryId);
	
	if ( json2send == null ){
		return;
	}

	$("#HoochPlaySpqarl").children('a').children('img').attr('src', 'images/sparql_buttons/hourglass.png');
	
	var loading = 
		'<div id="loadOverlay">'
		+'<a style="font-size:20px;position:absolute;top:55%;left:50%;" href="javascript:clearAllAfterQuery()">'
		+'<img id="loadingImage" src="images/ajax-loader-big.gif"/>'
		+'</a>'
		+'</div>';
	$(loading).appendTo('body');
	
	
	$.ajax({
		  type: "POST",
		  url: "request.php",
		  dataType : "json",
		  data: {'hoochSparqlNew' : 'true','hoochSparqlEndpoint' : endpoint , 'jsonQ' : json2send, 'queryId' : queryId , 'clientSession' : sparqlSessionId },
		  success:
			  function (json){
			  	clearAllAfterQuery();
				$("#HoochPlaySpqarl").children('a').children('img').attr('src', 'images/sparql_buttons/playSparql.png');
				rs_parse_query_result(json);
			}
			  
			  ,
		  error: function(){
			  	clearAllAfterQuery();
				alert("We are sorry, an internal server error has occurred. Please contact the system administrator.");
				$("#HoochPlaySpqarl").children('a').children('img').attr('src', 'images/sparql_buttons/playSparql.png');
			}
		});
	alert('Query sent to the server. Response will be available soon');
	
	
}

// parameters
var maximunResult = 10;

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


function hoochBuildSparqlRes(id){
	var idx2cut = id.lastIndexOf("/");
	if(idx2cut < 0){
		idx2cut = id.lastIndexOf("#");
	}
	var nodeName = id.substring(idx2cut+1,id.length);
	var element=new Object();
	element.isRelation=false;
	element.relations=[];
	element.root=true;
	element.name=nodeName;
	element.index = "HoochIndex_"+sparqlCount;
	element.type="patternResource";
	element.id= id;
	element.img='images/sparql_buttons/hooch_resource_pattern.png';
	element.sparqlHooch=false;
	element.x = Math.floor($("#axrelations_graph_container").width()/2);
	element.y = 140;
	element.fixed = false;
	sparqlCount ++;
	return element;
	
	
}

var sparqlHidden = false;

function hideAllSparql(){
	
	var visbleStr = "";
	if(sparqlHidden == true){
		visbleStr = "hidden"
		sparqlHidden = false;
		$("#HoochHideSparql").children("a").children("img").attr("src","images/sparql_buttons/showSparqlMark.png");
		$("#HoochHideSparql").children("a").children("img").attr("title","Show query");
	}else{
		sparqlHidden = true;
		visbleStr = "visible";
		$("#HoochHideSparql").children("a").children("img").attr("src","images/sparql_buttons/hideSparqlMark.png");
		$("#HoochHideSparql").children("a").children("img").attr("title","Hide query");
	}
	
	var allSparqlLink = d3.selectAll("line.link").filter(function(l){ 
		if(l.source.sparqlHooch == true || l.target.sparqlHooch == true){
			return l;
		}
	});
	allSparqlLink.attr("visibility", visbleStr);
	
	var allNotSparqlLinkArray = [];
	var allNotSparqlLink = d3.selectAll("line.link").filter(function(l){ 
		if(l.source.sparqlHooch != true &&  l.target.sparqlHooch != true){
			allNotSparqlLinkArray.push(l);
			return l;
		}
	});
	

	var allSparqlNode = d3.selectAll("g.node").filter(function(d){ 
		if(d.sparqlHooch == true){
			// need to check if appears in a link
			if(d.isRelation != true){
				// if is a resource need to check in the elements
				var takeIt = false;
				for (var y =0; y < allNotSparqlLinkArray.length ; y++){
					if(allNotSparqlLinkArray[y].source.id == d.id || allNotSparqlLinkArray[y].target.id == d.id){
						takeIt = true;
					}
				}
				if(takeIt != true){
					return d;
				}
			}else{
				return d;
			}
		}
	});
	allSparqlNode.attr("visibility", visbleStr);
	
}



var sparqlVisible = true;




function hoochToggleShowOnlySparql(){
	
	
	var visbleStr = "";
	if(sparqlVisible == true){
		visbleStr = "hidden"
		sparqlVisible = false;
		$("#HoochShowSparql").children("a").children("img").attr("src","images/sparql_buttons/showSparql.png");
		$("#HoochShowSparql").children("a").children("img").attr("title","Show LOG elements");
	}else{
		sparqlVisible = true;
		visbleStr = "visible";
		$("#HoochShowSparql").children("a").children("img").attr("src","images/sparql_buttons/hideSparql.png");
		$("#HoochShowSparql").children("a").children("img").attr("title","Hide LOG elements");
	}
	
	var allNotSparqlLink = d3.selectAll("line.link").filter(function(l){ 
		if(l.source.sparqlHooch != true && l.target.sparqlHooch != true){
			return l;
		}
	});
	allNotSparqlLink.attr("visibility", visbleStr);
	
	var allSparqlLinkArray = [];
	var allSparqlLink = d3.selectAll("line.link").filter(function(l){ 
		if(l.source.sparqlHooch == true ||  l.target.sparqlHooch == true){
			allSparqlLinkArray.push(l);
			return l;
		}
	});
	
	var allNotSparqlNode = d3.selectAll("g.node").filter(function(d){ 
		if(d.sparqlHooch != true){
			// need to check if appears in a link
			if(d.isRelation != true){
				// if is a resource need to check in the elements
				var takeIt = false;
				for (var y =0; y < allSparqlLinkArray.length ; y++){
					if(allSparqlLinkArray[y].source.id == d.id || allSparqlLinkArray[y].target.id == d.id){
						takeIt = true;
					}
				}
				if(takeIt != true){
					return d;
				}
			}else{
				return d;
			}
		}
	});
	allNotSparqlNode.attr("visibility", visbleStr);
	
}



function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
    	return pair[1];
    }
  }
  return -1;
}

/**
 * This function swap the query mode state: on or off
 */
function manageQueryMode(){
	if(hooch_query_mode == false){
		hooch_query_mode = true;
		sparqlSessionId = getQueryVariable("sparql_session_id");
		sparqlCurrentQueryId = getQueryVariable("sparql_session_next_query_id");
		var makeQueryZero = confirm('Sparql Mode Is Now Active.\nDo you want to apply a sample query to the root node?');
		if(makeQueryZero == true){
			nodes.filter(function (d,i){
				if(d != null){
					if(d.root == true){
						queryZero(d);
					}
				}
			});
		}
		d3.select("#HoochPRmenu").transition().duration(500).style("display","block");
		d3.select("#HoochPLmenu").transition().duration(500).style("display","block");
		
		d3.select("#HoochShowSparql").transition().duration(500).style("display","block");
		d3.select("#HoochHideSpqarl").transition().duration(500).style("display","block");
		d3.select("#HoochPlaySpqarl").transition().duration(500).style("display","block");
		
		d3.select("#HoochHideSparql").transition().duration(500).style("display","block");
		d3.select("#HoochQueryPanel").transition().duration(500).style("display","block");
		d3.select("#HoochHelpSearch").transition().duration(500).style("display","block");
		
		d3.select("#HoochClearQuery").transition().duration(500).style("display","block");
		
		
		
		
	}else{
		
		if(!confirm('Turning off sparql mode will delete all unsaved queries. Are you sure the exit sparql mode?')){
			return;
		}
		
		hooch_query_mode = false;
		d3.select("#HoochPLmenu").transition().duration(500).style("display","none");
		d3.select("#HoochPRmenu").transition().duration(500).style("display","none");
		
		d3.select("#HoochShowSparql").transition().duration(500).style("display","none");
		d3.select("#HoochHideSpqarl").transition().duration(500).style("display","none");
		d3.select("#HoochPlaySpqarl").transition().duration(500).style("display","none");
		d3.select("#HoochQueryPanel").transition().duration(500).style("display","none");
		d3.select("#HoochHideSparql").transition().duration(500).style("display","none");
		d3.select("#HoochHelpSearch").transition().duration(500).style("display","none");
		
		d3.select("#HoochClearQuery").transition().duration(500).style("display","none");
		

		clearAllSparqlQuery(false);
		

	}
	
}

/**
 * Check if query mode is enabled
 * @returns {Boolean}
 */
function isQueryModeEnabled(){
	if(hooch_query_mode == true){
		return true;
	}else{
		return false;
	}
	
}

function hoochCreateMenuItemLi(li_action,li_title,li_img_path,li_id){
	// this function creates an 
	//	<li>
	//		<a>
	//			<img>
	//			</img>
	//		</a>
	//	</li> 
	// structure
	// li_action, is href for the A
	// li_litle is the title for the A
	// li_img_path is the src for the IMG
	
	var hooch_menuItem = document.createElement("A");
	hooch_menuItem.href=li_action;
	hooch_menuItem.title=li_title;
	// create the image for the BQE menu
	var hooch_img = document.createElement("IMG");
	hooch_img.src = li_img_path;
	// adding the image in the BQE menuItem
	hooch_menuItem.appendChild(hooch_img);
	// create the Li for the BQE
	var hooch_li = document.createElement("LI");
	// adding the menuItem to the BQE li
	hooch_li.appendChild(hooch_menuItem);
	if(li_id != null){
		hooch_li.id=li_id;
		hooch_li.style.display="none";
	}
	
	return hooch_li;
}

// functions to add new elements to the graph

function addNode2force(isRelation){
	
	var element = null;
	if(isRelation == false){
		element = hoochGetNewResourcePattern();
	}else{
		element = hoochGetNewLinkPattern();
	}
	if(element != null){
		nodes.push(element);
		hoochSetUndo(makeHoochUndoAddPatternNode(element));
		restart();
	}
	
}
// Utility Functions
var sparqlCount = 0;
var lastThetaQuery = 0;


function hoochBuildSparqlResource(nodeName,nodeId,isConst){
	var element=new Object();
	

	element.isRelation=false;
	element.relations=[];
	element.root=true;
	if(isConst){
		element.name=nodeId;
	}else{
		element.name=sanitizeSparqlName(nodeName);
	}
	element.index = "HoochIndex_"+sparqlCount;
	element.type="patternResource";
	if(!nodeId){
		element.id="hoochSparqlCount-"+sparqlCount + hoochGuid();
	}else{
		element.id= nodeId;
	}
	element.img='images/sparql_buttons/hooch_resource_pattern.png';
	if(isConst){
		element.isConst=true;
		element.EP = [];
		element.EP.push(endpoint);
	}else{
		element.sparqlHooch=true;
	}
	var r = 280;
	var theta = lastThetaQuery + Math.random() * 2 * Math.PI ;
	lastThetaQuery = theta;	
	element.x = Math.floor($("#axrelations_graph_container").width()/2) + Math.sin(theta) + Math.floor(Math.random() * 200) + 40;
	element.y = 140 + Math.cos(theta) + Math.floor(Math.random() * 200) + 40;
	element.fixed = true;
	sparqlCount ++;
	
	if(isConst == true){
		element.explored=false;
		element.name=nodeId;
		element.id=nodeId;		
	}
	
	

	
	return element;
}



function makeHoochUndoExpandMore(moreNode,poppedNode,moreParent,moreTarget){
	var operation=new Object();
	operation.type="HoochSparqlExpandResultMore"
	operation.moreNode= moreNode;
	operation.popped= poppedNode;
	operation.moreParent= moreParent;
	operation.moreTarget= moreTarget;
	return operation;
}

function hoochRevertExpandMore(operation){ 
	var moreNode = operation.moreNode;
	var nodeToPush = operation.popped;
	var moreT = operation.moreTarget;
	var moreP = operation.moreParent;
	
	if(moreT){
		links.filter(function (d,i){
			if( ( d.source.id == nodeToPush.id && d.target.id == moreT.id)){
				links.splice(i,1);
			}
		});
	}
	if(moreP){
		links.filter(function (d,i){
			if( ( d.source.id == moreP.id && d.target.id == nodeToPush.id)){
				links.splice(i,1);
			}
		});
	}
	
	nodes.filter(function (d,i){
		if( d.id == nodeToPush.id ){
			nodes.splice(i,1);
		}
	});
	
	moreNode.mores.push(nodeToPush);
	hoochUpdateNodeView(moreNode, null);

	
}



function hoochExpandMoreResult(node_to_explore){
	
	if(!node_to_explore.targetNodes && node_to_explore.count > 0){
		node_to_explore.targetNodes = {};
		if(node_to_explore.resultId){
			var queryId = node_to_explore.resultId.split('-')[1];
			
			var callback = function (obj){
				for (q in obj.queries){
					var query = obj.queries[q];
					if(query.queryid == queryId){
						var result = JSON.parse(query.jsonResult);
						if(result.res){
							var predId = node_to_explore.sourcePredicateRefId;
							var pred = nodes.filter(function(n){
								if(n.id == predId){
									return n;
								}
							});
							node_to_explore.sourcePredicateRef = pred[0];
							for(index in node_to_explore.targetNodesId){
								var resultsetNodeId =node_to_explore.targetNodesId[index];
								var rsGetNode =rs_hoochBuildResource4graph(resultsetNodeId, result.res[resultsetNodeId].label, result.res[resultsetNodeId].image,  node_to_explore.resultId);
								node_to_explore.targetNodes[resultsetNodeId] = rsGetNode;
							}
						}
					}else{
					}
				}
				universalLoadMoreNodes(node_to_explore);

			}
			if(sparqlSessionId < 0){
				sparqlSessionId = getQueryVariable("sparql_session_id");
			}
			$.post("request.php",
					{'loadSparqlPanel' : 'true',loadSparqlPanelEP : endpoint,loadSparqlPanelSession : sparqlSessionId},
					callback,
					'json');
			
			
		}
//		for(i in node_to_explore.targetNodesId){
//			var newId = node_to_explore.targetNodesId[i];
//			var res4more = rs_hoochBuildResource4graph(newId, resultSet[newId].label, resultSet[newId].image, rsId);
//			node_to_explore.targetNodes[newId] = res4more;
//		}
	}else{
		universalLoadMoreNodes(node_to_explore);
	}
	
}


function universalLoadMoreNodes(node_to_explore){
	nodes.filter(function (d,i){
		if( d.id == node_to_explore.id ){
			nodes.splice(i,1);
		}
	});
	restart();
	
	var maxMore2Explore = 5;
	var counter = 0;
	for ( id2extract in node_to_explore.targetNodes){
		if(counter < 5){
			counter ++;
			extractFromMoreNode(node_to_explore,id2extract);
			node_to_explore.name = "More " + node_to_explore.count + " of " + node_to_explore.sourceLabel;
		}else{
			break;
		}
	}
	if(node_to_explore.count > 0){
		nodes.push(node_to_explore);
	}else{
		// also cut the link
		links.filter(function (d,i){
			if( ( d.source.id == node_to_explore.id || d.target.id == node_to_explore.id)){
				links.splice(i,1);
			}
		});
		
		// and remove the moreNode form the predicate
		nodes.filter(function (d,i){
			
			var id2compare = null;
			if(node_to_explore.sourcePredicateRef){
				id2compare = node_to_explore.sourcePredicateRef.id
			}else{
				id2compare = node_to_explore.sourcePredicateRefId;
			}
			
			if( d.id ==  id2compare){
				for( index in d.elements){
					if(d.elements[index].id == node_to_explore.id){
						d.elements.splice(index,1);
					}
				}
				delete d.moreNode;
			}
		});
		
		
		if(node_to_explore.sourcePredicateRef){
			delete node_to_explore.sourcePredicateRef.moreNode
		}
		
		
	}
	restart();
}



// every sparql element is set to root, 'cause otherwise it will be pruned on the reduction
function hoochGetNewResourcePattern(){
	
	var nodeName = prompt("Insert the Resource Pattern Name.","Resource Pattern "+sparqlCount);
	if(nodeName != null){
		return  hoochBuildSparqlResource(nodeName);
	}else{
		return null;
	}
	
	
}

function hoochGetNewLinkPattern(){

	var nodeName = prompt("Insert the Link Pattern Name.","Pattern Link "+sparqlCount);
	if(nodeName != null){
		return hoochBuildSparqlLink(nodeName);
	}else{
		return null;
	}
}

function sanitizeSparqlName(varName){
	varName = varName.replace(/-/g,'_');
	varName = varName.replace(/ /g,'');
	varName = varName.replace(/:/g,'');
	varName = varName.replace(/\./g,'_');
	varName = varName.replace(/\(/g,'');
	varName = varName.replace(/\)/g,'');
	
	varName = varName.replace(/\//g,'');
	varName = varName.replace(/\//g,'');
	
	varName = varName.replace(/\?/g,'');
	
	varName = varName.replace(/!/g,'_');
	
	varName = varName.replace(/,/g,'_');
	varName = varName.replace(/;/g,'_');
	return varName;
}


function hoochBuildSparqlLink(nodeName,predId,name2show){	
	var element=new Object();
	element.isRelation=true;
	element.explored=false;
	element.elements=[];
	element.root=true;
	
	element.name= sanitizeSparqlName(nodeName);
	if(name2show){
		element.name= sanitizeSparqlName(name2show);
	}
	element.type="patternLink";
	element.uri= sanitizeSparqlName(nodeName);
	element.father = null;
	element.parentNode = null;
	if(!predId){
		element.id= "hoochSparqlCount-"+sparqlCount + hoochGuid();
	}else{
		element.id= predId;
	}
	element.img='images/sparql_buttons/hooch_link_pattern.png';
	element.sparqlHooch=true;
	element.optional = false; // is used for the optional in the query
	element.x = Math.floor($("#axrelations_graph_container").width()/2);
	element.y = 140;		
	element.fixed = true;
	sparqlCount ++;
	return element;
}


function queryZero(node){
	var hasInbound = false;
	var hasOutbund = false;
	// edit: now query 0 is a What You See Is What You Get
	links.filter(function(l){
		if( ( l.source.id == node.id && l.target.inbound != true) || (l.source.inbound == true && l.target.id == node.id) ){
			hasOutbund = true;
		}
		if((l.source.id == node.id && l.target.inbound == true) || (l.target.id == node.id && l.source.inbound != true)){
			hasInbound = true;
		}
	});
	var outRel = null;
	var dummyObject = null;
	if(hasOutbund == true) {
		outRel = hoochBuildSparqlLink("Out_Rel_for_" + node.name); 
		nodes.push(outRel);
		outRel.inbound = false;
		outRel.parentNode = node;
		outRel.father = node.name; 
		dummyObject = hoochBuildSparqlResource("Dummy_Obj_for_" + node.name );
		nodes.push(dummyObject);
		// set the drop target resource as target of the new relation
		dummyObject.x = node.x + 130;
		dummyObject.y = node.y + 130;
		// settings new pattern link coordinate
		outRel.x = (dummyObject.x + node.x) / 2;
		outRel.y = (dummyObject.y + node.y) / 2;
		outRel.elements.push(dummyObject);
		dummyObject.relations[""+outRel.id] = outRel;
		links.push({source: node, target: outRel,present:true});
		links.push({source: outRel, target: dummyObject,present:true});
	}
	
	var inRel = null;
	var dummySubject = null;
	
	if(hasInbound == true){
		inRel =  hoochBuildSparqlLink("In_Rel_for_" + node.name); 
		nodes.push(inRel);
		
		dummySubject = hoochBuildSparqlResource("Dummy_Subj_for_" + node.name );
		nodes.push(dummySubject);
		
		inRel.parentNode = node;
		inRel.father = node.name; 
		inRel.inbound = true;
		
		
		// set dummy subkect position
		dummySubject.x = node.x - 130;
		dummySubject.y = node.y - 130;

		// settings new pattern link coordinate
		inRel.x = (dummySubject.x + node.x) / 2;
		inRel.y = (dummySubject.y + node.y) / 2;
		inRel.elements.push(dummySubject);
	//	dummySubject.relations[""+inRel.id] = inRel;

		links.push({source: node, target:inRel ,present:true});
		links.push({source: inRel, target: dummySubject ,present:true});
	
	}
	// save the status for undo
	hoochSetUndo(makeHoochUndoQueryZero(node,dummySubject,dummyObject,inRel,outRel));
	
	restart();
	
}

/**
 * Perform the revert for the query zero operator. Strictly coupled with makeHoochUndoQueryZero
 * @param operation
 */
function revertQueryZero(operation){
	// OK
	
	var mainNode = operation.node;
	var dummySubject = operation.subject;
	var dummyObject = operation.object;
	
	var subjectLink = operation.subjectLink;
	var objectLink = operation.objectLink;
	
	if(subjectLink && dummySubject){
		// pruning the subject link
		links.filter(function (d,i){
			if( ( d.source.id == subjectLink.id && d.target.id ==  dummySubject.id)){
				links.splice(i,1);
			}
		});
		links.filter(function (d,i){
			if( (d.source.id == mainNode.id && d.target.id == subjectLink.id )){
				links.splice(i,1);
			}
		});
		nodes.filter(function (d,i){
			if(d.id == dummySubject.id){
				nodes.splice(i,1);
			}
		});
		
		nodes.filter(function (d,i){
			if(d.id == subjectLink.id){
				nodes.splice(i,1);
			}
		});
	}
	if(objectLink && dummyObject){
		// pruning the object link
		links.filter(function (d,i){
			if( ( d.source.id == mainNode.id && d.target.id == objectLink.id)){
				links.splice(i,1);
			}
		});
		links.filter(function (d,i){
			if( (d.source.id == objectLink.id && d.target.id == dummyObject.id)){
				links.splice(i,1);
			}
		});
		nodes.filter(function (d,i){
			if(d.id == objectLink.id){
				nodes.splice(i,1);
			}
		});
		
		// clearing nodes
		nodes.filter(function (d,i){
			if(d.id == dummyObject.id){
				nodes.splice(i,1);
			}
		});
	}
	
	
	
	
}



/**
 * Build the operation for the queryzero function
 * Strictly coupled with revertQueryZero
 * @param rootNode
 * @param dummySubject
 * @param dummyObject
 * @param subjectLink
 * @param objectLink
 * @returns {___anonymous10349_10357}
 */
function makeHoochUndoQueryZero(rootNode,dummySubject,dummyObject, subjectLink, objectLink){
	
	var operation=new Object();
	operation.type="HoochSparqlQueryZero"
	operation.node= rootNode;
	operation.subject= dummySubject;
	operation.object= dummyObject;
	
	operation.subjectLink= subjectLink;
	operation.objectLink= objectLink;
	
	return operation;
	
}


// Function for DnD behaviors

/**
 * Take in input the element wich is being dragged
 * This function put around every node eligible as drop target a yellow circle
 * This is only a visual AID for DnD
 * @param d
 */
function hoochDragStart(d){
	
	if(isQueryModeEnabled() == false){
		return;
	}else if(d.type=="more" || d.type=="more_LD"){
		// not possible to drop over more node!
		return;
	}
	
	if(d.sparqlHooch == true){
		// if the dragged element is a sparql, then all node (except link istance) are good as drop target	
		d3.selectAll("g.node").each(function(curNode){
		
			if(curNode.sparqlHooch == true || d == curNode || curNode.isRelation == false ){	
				if(curNode.type=="more" || curNode.type=="more_LD"){
					// more node are no draggable
				}else{
					d3.select(this).append("ellipse")
					.attr("class","ghostDnD")
					.attr("rx",hoochGhostEllipseR)
					.attr("ry",hoochGhostEllipseR)
					.attr("fill","yellow")
					.attr("opacity","0.6")
					.attr("display","block");
				}
			}
		});
	}else{
		// if the dragged element is a resoruce istance, then only sparql elements are good as drop target
		if(d.isRelation == false){
			d3.selectAll("g.node").each(function(curNode){
				if(curNode.sparqlHooch == true || d == curNode){
					d3.select(this).append("ellipse")
					.attr("class","ghostDnD")
					.attr("rx",hoochGhostEllipseR)
					.attr("ry",hoochGhostEllipseR)
					.attr("fill","yellow")
					.attr("opacity","0.6")
					.attr("display","block");
				}
			});
		}
	}
}

/**
 * On drag end, manage the update of the graph and the query.
 * Drag end does not trigger for link istance
 * This function is effective only if at least one of the element (Drag source or Drop target) is a Sparql node
 * @param d
 */
function hoochDragEnd(d){
	
	if(isQueryModeEnabled() == false){
		return;
	}else if(d.type=="more" || d.type=="more_LD"){
		// not possible to drop more node!
		return;
	}
	
	if(d.isRelation == true && !d.sparqlHooch ==true){
		// if the current element is a link istance, don't trigger the function
		return;
	}
	
	// remove all yellow circle. (Visual aid for DnD)
	d3.selectAll("ellipse.ghostDnD").remove();
	
	// compute the current location ofr the drag source
	var intX = Math.floor( d.x );
	var intY = Math.floor( d.y );
	
	// select all node
	var Xselected = d3.selectAll("g").selectAll("[class=node]");
		
	// for each node check if the drag source has been dropped over
	// further action will trigger only if at least one of the elements is a Sparql node 
	Xselected.each(function(dropTarget){
		
		if(dropTarget.sparqlHooch == true || d.sparqlHooch == true){
			
			// compute the possible drop target location
			var curX = Math.floor( dropTarget.x );
			var curY = Math.floor( dropTarget.y );
			
			// check if the drag source has been dropped over the current node in the graph
			var distance = Math.sqrt(  Math.pow(curX - intX , 2) + Math.pow(curY - intY,2) );
			if(distance < hoochDropTollerance && dropTarget.id != d.id){			
				// if the source has been dropped over the current node
				if(d.isRelation == false){
					// if the drop target is a resource then handle drop on resource
					handlePatternResourceDrop(d,dropTarget);
				}else if (d.isRelation == true){
					// if the drop target is a relation handle drop on relation
					handlePatternLinkDrop(d,dropTarget);
				}else{
					// unexpectd element!
					return true;
				}
				return false;
			}else{
				return true;
			}
		}else{
			return true;
			// we are not dropping on a SPARQL element, so nothing to do
		}
	});

	
	
}


/**
 * If the drag source is a resource, then the drop is managed accrodingly.
 * 1) If the drop target is an istance link then no action will be taken
 * 2) If the drop target is a pattern link then the link is added as property of the drag source. Off course a link can have only one father!
 * 3) If the drop target is a resource (no matter the type) a new pattern link will be created and the target is added as value of the new property 
 * @param patternRes
 * @param dropTarget
 */
function handlePatternResourceDrop(patternRes,dropTarget){
	if(dropTarget.isRelation == true && dropTarget.sparqlHooch == true) {
		
		var oldParent;
		// if the drop target is a pattern link (sparql)
		// check that the target is free from parent
		if(dropTarget.father != null || dropTarget.parentNode !=null){
			//alert('Forbidden, this link already has a father');
			// check if the link is effective
			var effective = links.filter(function(d,i){
				if(d.source.id == patternRes.id && d.target.id == dropTarget.id){
					// link is true return null;
					return d;
				}
				if(dropTarget.parentNode){
					if(d.source.id == dropTarget.parentNode.id && d.target.id == dropTarget.id){
						links.splice(i,1);
						i --;
						if(dropTarget.elements){
							var resIndex = dropTarget.elements.indexOf(dropTarget.parentNode);
							if(resIndex > -1){
								dropTarget.elements.splice(resIndex,1);
							}
						}
					}
				}
				
				
				
			});
			
//			console.log("Effective",effective);
			
			if(effective.length > 0){
				return;
			}
			// TODO check me
			
		}
		// check if the two resource are already linked
		var alreadyLinked =hoochAlreadyLinked(patternRes,dropTarget); ; 
		
		if(alreadyLinked == false){
			// if the resoruce are not already linked, then add the link as property of the resource drag source
			// save the status for the undo
			hoochSetUndo(makeHoochUndoDropResOverPl(patternRes,dropTarget));
			buildGraphDropResOverPl(patternRes,dropTarget);
			// updating the view and the graph
			hoochUpdateNodeView(patternRes,dropTarget);
			restart();
		}else{
			// resource already linked, nothing to do
		}
	}else if(dropTarget.type=="more" || dropTarget.type=="more_LD"){
		// not possible to drop over more node!
		return;
	}else if(dropTarget.isRelation == false){
		// if the drop target is a resource (no matter the type)
		buildGraphDropResOverRes(patternRes,dropTarget);
		// updating the view and the graph
		hoochUpdateNodeView(patternRes,dropTarget);
		restart();
		
	}else{
		// unexpected elements
	}
}

/**
 * If the drag source is a pattern link, then the drop is managed accordingly
 * 1) if the drop target is a link (no matter the type) no action will be taken
 * 2) if the drop target is a resource (no matter the type), the drop resource will be added as target of the the source link. If the link is already present no action will be tacken
 * @param patternLink
 * @param dropTarget
 */
function handlePatternLinkDrop(patternLink,dropTarget){

	if(dropTarget.isRelation == true){
		// if the drop target is relation, nothing to do
		return;
	}else if(dropTarget.type=="more" || dropTarget.type=="more_LD"){
		// not possible to drop over more node!
		return;
	}else if(dropTarget.isRelation == false){
		// if the drop target is a resoruce
		// check if the link already exists
		var alreadyLinked =hoochAlreadyLinked(patternLink,dropTarget); 
		if(alreadyLinked == false){
			// if the link does not exist create it
			buildGraphDropPloverRes(patternLink,dropTarget);
			// update graph and view
			hoochUpdateNodeView(dropTarget,null);
			restart();
		}else{
//			link already exists, nothing to do
		}
	}else{
//		unexpected drop target, nothing to do
	}
}

/**
 * Check if 2 nodes are already linked
 * @param patternLink
 * @param dropTarget
 * @returns {Boolean}
 */
function hoochAlreadyLinked(patternLink,dropTarget){
	var result = false;
	links.filter(function(d){
		if(d.source == patternLink && d.target == dropTarget){
			result = true;
			return null;
		}else if(d.source == dropTarget && d.target == patternLink){
			result = true;
			return null;
		}else{
			return null;
		}
			
	});
	return result;
	
}


/**
 * Rimuove del grado il node2update in modo da evitare duplicati.
 * @param node2update
 * @param predicate2update
 */
function hoochUpdateNodeView(node2update,predicate2update){
	nodes.filter(function (d,i){
		if(node2update != null){
			if(d.id == node2update.id){
				nodes.splice(i,1);
				nodes.push(node2update);
			}
		}
		if(predicate2update != null){
			if(d.id == predicate2update.id && !predicate2update.inbound == true){
				nodes.splice(i,1);
				nodes.push(predicate2update);
			}
		}
	});
}





function hoochLoadClassList(){
	
	var request_url="request.php?hoochSparql=true";
	d3.json(request_url, function(json) { 
		
	});
		
}

/**
 * This function generates a GUID for the sparql node
 * @returns {String}
 */
function hoochGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


/**
 * Delete a single node form the view. restart must be called afterward!
 * @param node2remove
 */
function hoochDeleteSparqlNodeFromView(node2remove){
	nodes.filter(function (d,i){
		if(node2remove != null){
			if(d.id == node2remove.id){
				nodes.splice(i,1);
			}
		}
	});
}

/**
 * Utility function that push the operation in the undo stack
 * @param operation
 */
function hoochSetUndo(operation){
	
	// axel logic is preserved here
	if(stack_lifo.length==0){ //active the button
		d3.select("input#axrelations_undo").attr("disabled",null)
		.attr("src",buttons[0]);
	}
	if(stack_lifo.length<50){
		stack_lifo.push(operation);
	}else{
		stack_lifo.splice(0,1);
		stack_lifo.push(operation);
	}
	
	
}

function makeHoochUndoToggle(predicate2toggle){
	var operation=new Object();
	operation.type="HoochSparqlTogglePredicate"
	operation.predicate= predicate2toggle;
	return operation;
}
function hoochRevertToggle(operation){
	hoochToggleInbounPatternLink(operation.predicate,true);
}


/**
 * Should be called every time an hoochsparql element is added (as single) to the graph
 * This function builds an operation Object that can be used to revert the just added node
 * @param patternNode
 * @returns an operation to remove the added node with the undo button
 */
function makeHoochUndoAddPatternNode(patternNode){
	
	var operation=new Object();
	operation.type="HoochSparqlAddPatternNode"
	operation.node= patternNode;
	return operation;
}


/**
 * Set the link optional state to prevState
 * @param patternLink
 * @param prevState
 * @returns {___anonymous16263_16271}
 */
function makeHoochUndoOptional(patternLink,prevState){
	var operation=new Object();
	operation.type="HoochSparqlSetOptionalLink"
	operation.node= patternLink;
	operation.previousState= prevState;
	return operation;
}




/**
 * Should be called every time a pattern link is dropped over a resource
 * Build the operation that can be used to revert the drop action with the undo button
 * @param patternLinkSource
 * @param resourceTarget
 * @returns {___anonymous20705_20713}
 */
function makeHoochUndoDropPLoverRes(patternLinkSource, resourceTarget){
	
	var operation=new Object();
	operation.type="HoochSparqlDropLinkOverRes"
	operation.source= patternLinkSource;
	operation.target= resourceTarget;
	return operation;
	
}




/**
 * Associate in the graph view a patternLink and a Resource after the drop.
 * This is strictly coupled with hoochRevertDropPLoverRes
 * @param patternLinkSource
 * @param resourceTarget
 */
function buildGraphDropPloverRes(patternLink, resourceTarget){
	
	// save the status for undo
	hoochSetUndo(makeHoochUndoDropPLoverRes(patternLink,resourceTarget));
	// set the resource target as property of the source link
	
	if(resourceTarget.relations == null){
		resourceTarget.relations = new Object();
	}
	resourceTarget.relations[""+patternLink.id] = patternLink;
	patternLink.elements.push(resourceTarget);
	links.push({source: patternLink, target:resourceTarget,present:true});
}


/**
 * Given the "makeHoochUndoDropPLoverRes" operation, perform the relative revert
 * Restart must be called afterward in order for the operation to take effect
 * This is strictly coupled with buildGraphDropPloverRes
 * @param operation
 */
function hoochRevertDropPLoverRes(operation){

	var pl = operation.source;
	var res = operation.target;
		
	var resIndex = pl.elements.indexOf(res);
	if(resIndex > -1){
		pl.elements.splice(resIndex,1);
	}
	delete res.relations[""+pl.id];
	
	hoochUpdateNodeView(res,pl);
	links.filter(function (d,i){
		
		if(d.source.id == pl.id && d.target.id == res.id){
			links.splice(i,1);
		}
		
	});	
}


/**
 * Build the operation to revert a resource drop pver pattern link
 * @param resSource
 * @param plTarget
 * @returns {___anonymous19438_19446}
 */
function makeHoochUndoDropResOverPl(resSource, plTarget){
	
	var operation=new Object();
	operation.type="HoochSparqlDropResOverPL"
	operation.source= resSource;
	operation.target= plTarget;
	return operation;
	
}


/**
 * Perform all the operations needed to draw resource drop over pattern link
 * Stricly coupled with hoochRevertDropResOverPl
 * @param patternRes
 * @param dropTarget
 */
function buildGraphDropResOverPl(patternRes,dropTarget){
	
	
	dropTarget.elements.push(patternRes);
	dropTarget.father = patternRes.name;
	dropTarget.parentNode = patternRes;

	if(patternRes.relations == null){
		patternRes.relations = new Object();
	}
	patternRes.relations[""+dropTarget.id] = dropTarget;
	links.push({source: patternRes, target: dropTarget,present:true});
	
}


/**
 * Perform the revert operation for the undo of resource drop over pattern link
 * Stricly coupled with hoochRevertDropResOverPl
 * @param operation
 */
function hoochRevertDropResOverPl(operation){
	
	// TODO previous father
	
	var pl = operation.target;
	var res = operation.source;
	
	var resIndex = pl.elements.indexOf(res);
	if(resIndex > -1){
		pl.elements.splice(resIndex,1);
	}
	pl.father = null;
	pl.parentNode = null;
	
	delete res.relations[""+pl.id];
	
	hoochUpdateNodeView(res,pl);
	
	links.filter(function (d,i){
		
		if(d.source.id == res.id && d.target.id == pl.id){
			links.splice(i,1);
		}
		
	});	
	
}


// handle drop Resource over Resource

function newIstanceLinkSearchAfetrDrop(newRelation,patternRes,dropTarget){
	
	//var newRelation = hoochGetNewLinkPattern();
	
	if(dropTarget.relations == null){
		dropTarget.relations = new Object();
	}
	// set the drag source resource as father of the pattern link
	newRelation.parentNode = patternRes;
	newRelation.father = patternRes.name; 
	// set the drop target resource as target of the new relation
	// settings new pattern link coordinate
	newRelation.x = (dropTarget.x + patternRes.x) / 2;
	newRelation.y = (dropTarget.y + patternRes.y) / 2;
	
	newRelation.elements.push(dropTarget);
	links.push({source: patternRes, target: newRelation,present:true});
	links.push({source: newRelation, target: dropTarget,present:true});
	dropTarget.relations[""+newRelation.id] = newRelation;
	
	// build the undo operation
	hoochSetUndo(makeHoochUndoDropResOverRes(patternRes,dropTarget,newRelation));
	// update graph and views
	nodes.push(newRelation);
}


/**
 * Perform all the operation needed to draw a drop between resources.
 * It's stricly coupled with hoochRevertDropResOverRes
 */
function buildGraphDropResOverRes(patternRes, dropTarget){
	
	// spawn a new pattern link
	openSparqlHelper(newIstanceLinkSearchAfetrDrop,patternRes,dropTarget);
}

/**
 * Perform all the operations neede to revert a drop between resources.
 * It's stricly coupled with buildGraphDropResOverRes.
 * @param operation
 */
function hoochRevertDropResOverRes(operation) {
	
	var resSource = operation.source;
	var resTarget = operation.target;
	var link2prune = operation.relation;
	
	var indexOfRel2prune = nodes.indexOf(link2prune);
	// pruning relation from link
	if(indexOfRel2prune > -1){
		nodes.splice(indexOfRel2prune,1);
	}else{
	}
	// deleting link form dropTarget relations
	delete resTarget.relations[""+link2prune.id];
	
	// pruning from link
	links.filter(function (d,i){
		if( ( d.source.id == link2prune.id && d.target.id == resTarget.id)){
			links.splice(i,1);
		}
	});
	links.filter(function (d,i){
		if( (d.source.id == resSource.id && d.target.id == link2prune.id)){
			links.splice(i,1);
		}
	});
}

/**
 * Make the operation used in axrelation.js to undo the drop res over res with UNDO
 * @param resSource
 * @param resTarget
 * @param newRelation
 * @returns {___anonymous22911_22919}
 */
function makeHoochUndoDropResOverRes(resSource, resTarget, newRelation){
	
	var operation=new Object();
	operation.type="HoochSparqlDropResOverRes"
	operation.source= resSource;
	operation.target= resTarget;
	operation.relation= newRelation;
	return operation;
	
}


function makeHoochUndoCloneRelation(newRelation, parent, dummyTarget, inbound){
	
	var operation=new Object();
	operation.type = "HoochSparqlCloneRelation"
	operation.parent = parent;
	operation.target = dummyTarget;
	operation.relation = newRelation;
	operation.inbound = inbound;
	return operation;
	
}

function hoochRevertCloneRelation(operation){
	var parent = operation.parent;
	var target = operation.target;
	var relation = operation.relation;
	var inbound = operation.inbound;
	
	// deleting predicate node
	var indexOfRel2prune = nodes.indexOf(relation);
	if(indexOfRel2prune > -1){
		nodes.splice(indexOfRel2prune,1);
	}else{
	}
	
	// deleting dummy node
	var indexOfDummy2prune = nodes.indexOf(target);
	if(indexOfDummy2prune > -1){
		nodes.splice(indexOfDummy2prune,1);
	}else{
	}
	
	// pruning form the link
	links.filter(function (d,i){ // remove parent rel
		if( ( d.source.id == parent.id && d.target.id == relation.id)){
			links.splice(i,1);
		}
	});
	links.filter(function (d,i){ // remove  rel dummy
		if( (d.source.id == relation.id && d.target.id == target.id)){
			links.splice(i,1);
		}
	});

}


function addPropertyFromSearch(label,uri,externalCallback,patternRes,dropTarget){
	var newRelation = hoochBuildSparqlLink(label); 
	newRelation.uri = uri;
	newRelation.cloned = true;
	newRelation.img='images/sparql_buttons/cloned.png';
	if(!externalCallback) {
		nodes.push(newRelation);
	} else {
		externalCallback(newRelation,patternRes,dropTarget);
	}
	restart();

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Context menu functions
function hoochCloneIstanceLink(istanceLink){
	
	// predicate are always like this <mainResource> -> <predicate in=false> -> <object>
	//								  <mainResource> <- <predicate in=true> <- <object>
	// parent in predicate is always the subject of the relations, all the other things are just rendering
	
	var newRelation = hoochBuildSparqlLink(istanceLink.name); 
	newRelation.uri = istanceLink.uri;
	newRelation.cloned = true;
	newRelation.inbound = istanceLink.inbound;
	
	newRelation.img='images/sparql_buttons/cloned.png';
	
	var parent = null;
	// searching for istanceLink parent
	for(var l = 0; l <links.length; l++){
		var d = links[l];
		// searching the parent via link. No information for the parent is stored in classic log
		if(d.target.id == istanceLink.id){
			parent = d.source;	
		}
	}
	
	// create a dummy object for the relations. 
	// it may be drawed as subject but in the information it is stored as target
	var dummyObject = null;
	if(istanceLink.inbound != true){
		dummyObject = hoochBuildSparqlResource("Cloned_Std_" +sparqlCount);//hoochBuildSparqlResource("Cloned_Std_" + istanceLink.name+"_4_"+parent.name);
	}else{
		dummyObject = hoochBuildSparqlResource("Cloned_Inbound_" + sparqlCount);//istanceLink.name+"_of_"+parent.name);		
	}
	sparqlCount ++;
	newRelation.parentNode = parent;
	newRelation.father = parent.name;
	
	newRelation.elements.push(dummyObject);
	if(!dummyObject.relations){
		dummyObject.relations = {};
	}
	dummyObject.relations[""+newRelation.id] = newRelation;
	
	
	links.push({source: parent, target: newRelation,present:true});
	links.push({source: newRelation, target: dummyObject,present:true});
	
	
	dummyObject.x = istanceLink.x + 30;
	dummyObject.y = istanceLink.y + 30;
	
	// settings new pattern link coordinate
	newRelation.x = (dummyObject.x + parent.x) / 2;
	newRelation.y = (dummyObject.y + parent.y) / 2;
	
	
	nodes.push(newRelation);
	nodes.push(dummyObject);
	
	hoochSetUndo(makeHoochUndoCloneRelation(newRelation,parent,dummyObject,newRelation.inbound));
	restart();
}

function hoochOptionalPatternLink(patternLink){
	
	hoochSetUndo(makeHoochUndoOptional(patternLink,patternLink.optional));
	
	
	var filteredNodes = d3.selectAll("g.node").filter( function( d ) { 
		if( d.id == patternLink.id ) {
			// need to check if appears in a link
			return d;
		}
	});
	var checkFilterImage = filteredNodes.selectAll("image#"+patternLink.id+"_optional");
	if(patternLink.optional != true){
		
		// add filter image
    	if(checkFilterImage.empty() == true){
        	filteredNodes.append("svg:image")
            .attr("id",patternLink.id+"_optional")
        	.attr("xlink:href","images/sparql_buttons/hooch_optional.png")
            .attr("x", -8)
            .attr("y", -8)
            .attr("width","16px")                  
            .attr("height","12px")
            .attr("display","inherit"); 
    	}else{
    		checkFilterImage.attr("display","inherit"); 
    	}
		
		patternLink.optional = true;
	}else{
		if( checkFilterImage.empty() == false ){
    		checkFilterImage.attr("display","none"); 
    	}
		patternLink.optional = false;
	}
	hoochUpdateNodeView(null,patternLink);
	restart();
	
}

/**
 * Revert optional status,
 * Stricly coupled with hoochOptionalPatternLink
 * @param operation
 */
function hoochRevertLinkOptionalStatus(operation){
	var pl = operation.node;
	pl.optional = operation.previousState;
	hoochUpdateNodeView(null,pl);
}

// MODAL FILTER
var modal = (function(){
    var 
    method = {},
    cnode,
    $overlay,
    $modal,
    $content,
    $select,
    $labelSel,
    $dataList,
    $labelOp,
    $opSelect,
    $labelVal,
    $valInput,
    $btnEnd,
    $tableWrapper,
    $table,
    $tableHeader,
    $close;

    
    $overlay = $('<div id="sparqlFilterOverlay"></div>');
    
    $tableWrapper = $('<div id="hoochFiltersTableWrapper"></div>');
    $table = $('<table id="hoochFiltersTable"></table>');
    $tableHeader = $("<tr>"+
    		"<th>Property</th>"+
    		"<th>Operator</th>"+
    		"<th>Filter</th>"+
    		"<th>Func.</th>"+
    		"</tr>");
    
    $modal = $('<div id="sparqlFilterPrompt"></div>');
    $content = $('<div id="sparqlFilterPromptContent"></div>');
    $close = $('<a id="sparqlFilterPromptClose" href="#"><img src="images/buttons/X_icon.png"  style="width:24px;height:27px;border:0"></a>');
    $labelSel = $('<label>Select the property to filter:</label><br>');
    $select = $('<input id="modalFilterPredicate" type="text" list="enumList" style="width:400px;"/>');
    
    $dataList = $('<dataList id="enumList" />');
    
    $labelOp = $('<br><label style="float:left">Filter operation:</label>');
    $comparisonLabel = $('<label style="float:right;margin-right:7px;">Comparison:</label><br>');
    
    $opSelect = $('<select id="modalFilterOp" style="width:75%;">'+
    			'<option value="regex">REGEX</option>' +
    			'<option value="math">MATH</option>'+
    			'<option value="datetime">DATETIME</option>'+
    			'</select>');
    $comparisonSelect = $('<select id="modalFilterComp" style="width:20%;float:right;margin-right:7px;">'+
    		'<option value="no"> N/A </option>' +
			'<option value=">"> &gt </option>' +
			'<option value=">="> &gt= </option>'+
			'<option value="="> = </option>'   +
			'<option value="<="> &lt= </option>'+
			'<option value="<"> &lt </option>' +
			'</select>');
    
    
    $labelVal = $('<br><label>Type filter value:</label><br>');
    $valInput = $('<input id="modalFilterValue" type="text" style="width:400px;" />');
    
    $btnEnd = $('<br><input id="modalFilterEndButton" type="button" value="Apply Filter" />');
    
    $select.append($dataList);
    
    $tableWrapper.append($table);
    
    $close.click(function(e){
        e.preventDefault();
        e.stopPropagation();
        method.close();
    });

    
    
    $modal.append($content, $close);

    $(document).ready(function(){
        $('body').append($overlay, $modal);
        $modal.hide();
        $overlay.hide();
    });
    
    
    // Center the modal in the viewport
    method.center = function () {
        var top, left;

        top = Math.max($(window).height() - $modal.outerHeight(), 0) / 2;
        left = Math.max($(window).width() - $modal.outerWidth(), 0) / 2;

        $modal.css({
            top:top + $(window).scrollTop(), 
            left:left + $(window).scrollLeft()
        });
    };

    // Open the modal
    method.open = function (node2filter,data) {
	    cnode = node2filter;
    	$dataList.empty();
    	
    	method.redrawGrid(node2filter);
    	
    	for(var val in data) {
    	    $o = $('<option value="' + data[val] + '" >'); //+ data[val] + '</option>');
    	    $dataList.append($o);
    	}
    	
    	$content.empty()
    	.append($labelSel)
    	.append($select)
    	.append($labelOp)
    	.append($comparisonLabel)
    	.append($opSelect)
    	.append($comparisonSelect)
    	.append($labelVal)
    	.append($valInput)
    	.append($btnEnd)
    	.append($tableWrapper);
        
    	$("#modalFilterEndButton").unbind('click').click(function(e){//Specifies another trigger.
    		e.preventDefault();
    		e.stopPropagation();
    		var newFilter = new Object();
			newFilter.op= $('#modalFilterOp').val();
			newFilter.value = $('#modalFilterValue').val();
			newFilter.predicate = $('#modalFilterPredicate').val();
			newFilter.comparison = $('#modalFilterComp').val();
			
			if(! node2filter.filters){
				node2filter.filters = [];
			}
			node2filter.filters.push(newFilter);
			method.redrawGrid(node2filter);

		});
    	
    	
		$modal.css({
            width:  'auto', 
            height: 'auto'
        })

        method.center();

        $(window).bind('resize.modal', method.center);

        $modal.show();
        $overlay.show();
    };

    // Close the modal
    method.close = function () {
        $modal.hide();
        $overlay.hide();
        $content.empty();
        
        
        addFilterIcon(cnode);
        
        $(window).unbind('resize.modal');
    };

    method.redrawGrid = function(node){
    	$table.empty();
    	$table.append($tableHeader);
    	
    	for(var fil in node.filters){
//    		comparison
    		$r = $('<tr><td>' + 
    				node.filters[fil]['predicate'] + 
    				'</td><td>' +
    				node.filters[fil]['comparison'] + 
    				'</td><td>' +
    				node.filters[fil]['value'] + 
    				'</td><td><a href="javascript:modal.removeFilter(' + fil + ');">Remove</a></td></tr>');
    		$table.append($r);
    	}
    	$r = $("<tr style='height:100%;'></tr>");
    	$table.append($r);
    }
    
    method.removeFilter = function(id){
    	cnode.filters.splice(id,1);
    	method.redrawGrid(cnode);
    }
    
    
    return method;
}());


function addFilterIcon(cnode){
	if(cnode.isConst == true){
		return;
	}
	var filteredNodes = d3.selectAll("g.node").filter( function( d ) { 
		if( d.id == cnode.id ) {
			// need to check if appears in a link
			return d;
		}
	});
	var checkFilterImage = filteredNodes.selectAll("image#"+cnode.id+"_filter");
    if(cnode.filters && cnode.filters.length > 0){
    	// add filter image
    	if(checkFilterImage.empty() == true){
        	filteredNodes.append("svg:image")
            .attr("id",cnode.id+"_filter")
        	.attr("xlink:href","images/sparql_buttons/hooch_filter.png")
            .attr("x", -8)
            .attr("y", -8)
            .attr("width","16px")                  
            .attr("height","12px")
            .attr("display","inherit"); 
    	}else{
    		checkFilterImage.attr("display","inherit"); 
    	}
	
   }else{
	   // hiding filter
	   checkFilterImage.attr("display","none"); 
   }
	
}


function cancelFilterSearch(){
	if(filterPost){
		filterPost.abort();
		$('#loadOverlay').remove();
		filterPost = null;
	}
	if(classLoadPost){
		classLoadPost.abort();
		$('#loadOverlay').remove();
		classLoadPost = null;
	}
}

var classLoadPost = null;
var filterPost = null;

function hoochFilterPatternLink(patternLink){
	
	var loading = '<div id="loadOverlay">'
					+'<img id="loadingImage" src="images/ajax-loader-big.gif">'
					+ '<a style="position:absolute;top:55%;left:50%;" href="javascript:cancelFilterSearch()"><img src="images/buttons/X_icon.png"  style="width:24px;height:27px;border:0"></a>'
					+'</div>';
	$(loading).appendTo('body');
	
	var callback = function (json){
		filterPost = null;
		$('#loadOverlay').remove();
		if(json){
			if(json.res){
				var data = {};
				var count = 0;
				for (d in json.res.rows){
					count ++;
					data[d] = json.res.rows[d].p.value;
				}
				if(count > 0){
					modal.open(patternLink,data);
				}else{
					alert("No compatible filters found for " + patternLink.name);
				}
			}else{
				alert('No data in response');
			}
		}else{
			alert('No response from server');
		}
	}
	
	
	//var queryId = "HoochQueryLiteral_" + hoochGuid();
	//var json2send = buildGoodJson(queryId);
	
	var json2send = buildGoodJson(sparqlCurrentQueryId);
	
	if ( json2send == null ){
		return;
	}

	var testJson = JSON.parse(json2send);
	filterPost = $.post("request.php",
	{'hoochGetLiterals' : 'true','hoochSparqlEndpoint' : endpoint, 'whereClause' : json2send, 'resName':testJson[patternLink.id].value.replace("?","") },
	callback,
	'json');
		

	
	
}

function makeHoochUndoSwapPatternLink(patternLink, newParent, oldParent){
	var operation=new Object();
	operation.type = "HoochSparqlSwapPatterniLink"
	operation.relation = patternLink;
	return operation;
}

function hoochRevertSwapPatterniLink(operation){
	var patternLink = operation.relation;
	hoochSwapPatternLink(patternLink,false);	
}

function hoochSwapPatternLink(patternLink,pushUndo){
	if(patternLink.elements != null){
		
		var newParent = null;
		var oldParent = patternLink.parentNode;
		if(!oldParent){
			alert("Can't swap an uncomplete predicate");
			return;
		}
		for(var i = 0; i < patternLink.elements.length; i ++){
			var current = patternLink.elements[i];
			
			if(current && current.id !=oldParent.id){
				patternLink.elements.splice(i,1);
				patternLink.elements.splice(i,0,oldParent);
				newParent = current;
				break;
			}
		}
		
		if(newParent){
			patternLink.parentNode = newParent;
			patternLink.father = newParent.name;
			
			
			links.filter(function (d,i){
				
				if(d.source.id == oldParent.id && d.target.id == patternLink.id){
					links.splice(i,1);
				}
				
			});	
			
			links.filter(function (d,i){
				
				if(d.source.id == patternLink.id && d.target.id == newParent.id){
					links.splice(i,1);
				}
				
			});	
			
			links.push({source: newParent, target: patternLink,present:true});
			links.push({source: patternLink, target: oldParent,present:true});
			if(pushUndo == true){
				hoochSetUndo(makeHoochUndoSwapPatternLink(patternLink));
			}
			restart();
		}else{
			alert("Can't swap an uncomplete predicate");
		}
		
	}else{
		alert("Warning! Only a relation with one subject and one object can be swapped!");
	}
	
	
}

// Function for handling cut of relations

// CUT TARGET HANDLING
//HANDLING TARGETS CUT



function makeHoochUndoCutTargetPatternLink(patternLink,elements,target2cut){
//	target2cut may be null. If passed only target2cut will be restored
	var operation=new Object();
	operation.type = "HoochSparqlCutTargetPatterniLink"
	operation.relation = patternLink;
	operation.targets = elements;
	operation.singleTarget = target2cut;
	return operation;
	
}

//handle the revert of a pattern link full cut
function revertHoochCutTargetPatternLink(operation){
//	target2cut may be null. If passed only target2cut will be restored
	var pl = operation.relation;
	var elems = operation.targets;
	var target2restore = operation.singleTarget;
	// reverting targets
	if(elems){
		pl.elements = elems;
		for(idx in elems){
			var is2restore = true;
			if(target2restore){
				if(elems[idx].id == target2restore.id){
					is2restore = true;
				}else{
					is2restore = false;
				}
			}
			if(is2restore == true){
				links.push({source : pl, target : elems[idx] , present : true});
				elems[idx].relations[""+pl.id] = pl;
				hoochUpdateNodeView(elems[idx],null);
			}
		}
	}
	
	hoochUpdateNodeView(null,pl);
}


/**
 * Remove all target links witha given pattern link element
 */
function hoochCutTargetFromPatternLink(patternLink,target2cut){
	
	hoochSetUndo(makeHoochUndoCutTargetPatternLink(patternLink,patternLink.elements.slice(),target2cut));
	hoochCutTargetsPL(patternLink,target2cut);
	restart();
}

function hoochCutTargetsPL(patternLink,target2cut){
	// target2cut may be null. If passed only the target2cut will be removed
	for ( tIdx in patternLink.elements ){
		var target2remove = patternLink.elements[tIdx];
		links.filter(function (d,i){
			if(d.source.id == patternLink.id && d.target.id == target2remove.id){
				var is2cut = true;
				if(target2cut){
					if( d.target.id == target2cut.id ){
						is2cut = true;
						patternLink.elements.splice(tIdx,1);
					}else{
						is2cut = false;
					}
				}
				if(is2cut == true){
					links.splice(i,1);
					delete target2remove.relations[""+patternLink.id];
					hoochUpdateNodeView(target2remove,null);
				}
			}
		});
	}
	if(target2cut){
		// nothing to do, already spliced
	}else{
		patternLink.elements = [];
	}
	hoochUpdateNodeView(null,patternLink);
}




// CUT PARENT HANDLING

//Function for handling cut of parent form relations
function makeHoochUndoCutParentPatternLink(patternLink,parent){
	
	var operation=new Object();
	operation.type = "HoochSparqlCutParentPatterniLink"
	operation.relation = patternLink;
	operation.parent= parent;
	return operation;
	
}


//handle the revert of a pattern link full cut
function revertHoochCutParentPatternLink(operation){
	var pl = operation.relation;
	var parent = operation.parent;
	// reverting parent
	if(parent){
		pl.parentNode = parent;
		links.push({source :parent, target : pl, present : true});
	}
	// reverting pattern link itself
	hoochUpdateNodeView(null,pl);
}


function hoochCutSinglePatternLink(d3linkElement){
	
	if(d3linkElement.target.isRelation == true){
//		if the target of the link is a patternLink then a cut parent will be performed
		hoochCutParentFromPatternLink(d3linkElement.target);
	}else{
//		if the target of the relation is not a relation then only the single relation must be cutted so...
		hoochCutTargetFromPatternLink(d3linkElement.source,d3linkElement.target);
	}
	
}



/**
 * Remove the parent node link from a patternLink element
 */
function hoochCutParentFromPatternLink(patternLink){
	
	if(patternLink.parentNode){
		hoochSetUndo(makeHoochUndoCutParentPatternLink(patternLink,patternLink.parentNode));
		hoochCutParentPL(patternLink);
		restart();
	}else{
	}
}


// FULL CUT HANDLING for handling a full cut
function makeHoochUndoCutPatternLink(patternLink,parent,elements){
	
	var operation=new Object();
	operation.type = "HoochSparqlCutPatterniLink"
	operation.relation = patternLink;
	operation.targets = elements;
	operation.parent= parent;
	return operation;
	
}

// handle the revert of a pattern link full cut
function revertHoochCutPatternLink(operation){
	
	var pl = operation.relation;
	var parent = operation.parent;
	var elems = operation.targets;
	
	// reverting parent
	if(parent){
		pl.parentNode = parent;
		links.push({source :parent, target : pl, present : true});
	}
	// reverting targets
	if(elems){
		pl.elements = elems;
		for(idx in elems){
			links.push({source : pl, target : elems[idx] , present : true});
			elems[idx].relations[""+pl.id] = pl;
			hoochUpdateNodeView(elems[idx],null);
		}
	}
	// reverting pattern link itself
	nodes.push(pl);
	
}



function hoochCutParentPL(patternLink){
	if(patternLink.parentNode){
		links.filter(function (d,i){
			if(d.source.id == patternLink.parentNode.id && d.target.id == patternLink.id){
				links.splice(i,1);
			}
		});
		patternLink.parentNode= null;
		patternLink.father=null;
		hoochUpdateNodeView(null,patternLink);
	}else{
	}
}


/**
 * Remove the pattern link and cut every links with it
 */
function hoochCutPatternLink(patternLink){
		
	hoochSetUndo(makeHoochUndoCutPatternLink(patternLink,patternLink.parentNode,patternLink.elements));

	hoochCutParentPL(patternLink);
	
	hoochCutTargetsPL(patternLink);
	
	hoochDeleteSparqlNodeFromView(patternLink);
	
	restart();
}

////////////////////////////////////////////////////////////////////////////////////
var avoidDuplicationCounter = 0;

function buildNewPredicate(value,isConst,isOptional,inbound,parent,isCloned,uri,name2show){
	var pred = new Object();
	pred.type = 'predicate';
	if(isConst != true){
		pred.value = value + "_" + avoidDuplicationCounter;
		avoidDuplicationCounter ++;
	}else{
		pred.value = value;
		pred.name2show = name2show;
	}
	
	pred.uri = uri;
	pred.isOptional = isOptional;
	pred.objIds = [];
	pred.inbound = inbound;
	if(parent.sparqlHooch == true ||  parent.sparqlHoochResult == true){
		pred.parentId = parent.name;
	}else{
		pred.parentId = parent.id;
	}
	pred.cloned = isCloned;
	pred.isConst = isConst;
	return pred;
}


function buildNewResource(value,isConst,filters){
	var subj = new Object();
	if(filters){
		subj.filters = filters;
	}else{
		subj.filters = [];
	}
	subj.type = 'resource';
	if(isConst != true){
		subj.value = value + "_" + avoidDuplicationCounter;
		avoidDuplicationCounter ++;
	}else{
		subj.value = value;
	}
	subj.predicates = {};
	subj.isConst = isConst;
	return subj;
	
}







function buildGoodJson(queryId){
	
	var elems = {}; // is the json to send
	
	// visits every node
	for( var i = 0 ; i < nodes.length ; i ++){
		var current = nodes[i];
		// some completion check
		// check only sparql predicates 
		if(    current.isRelation == true 
			&& current.sparqlHoochHidden != true 
			&& current.sparqlHooch == true 
			&& current.parentNode 
			&& current.elements.length >0
		) {
			
			var mainNode = current.parentNode;
			var isConst = false;
			if(current.cloned == true){
				isConst = true;
			}
			var inbound = current.inbound;
			// on the server side the predicate is identified by the triple <parent,predicate,inbound>
			var predicate = buildNewPredicate(makeQueryElement(current,queryId),isConst,current.optional,inbound,current.parentNode,current.cloned,current.uri,current.name);
			for (var t=0 ; t < current.elements.length; t ++ ){
				var target = current.elements[t];
				if(target){
					// check if target node is already in the json to send
					
					// check if the target node is already in the predicate targets
					if(target.id != mainNode.id){
						
						
						
						
						if ( $.inArray(target.id, predicate.objIds) > -1 ){
							// nothing to do
						}else{
							// add id to array
							predicate.objIds.push(target.id);
						}
						if( ! elems[target.id] ){
							// if not create it
							isConst = true;
							if(target.sparqlHooch == true){
								isConst = false;
							}
							elems[target.id] = buildNewResource(makeQueryElement(target,queryId),isConst,target.filters);
						}
						
						
						
					}
				}
			}	
			// adding main node to the elements to send
			// get the parent node
			if( ! elems[mainNode.id] ) {
				// if not create it
				isConst = true;
				if( (mainNode.sparqlHooch == true || mainNode.sparqlHoochResult == true) && mainNode.isConst != true){
					isConst = false;
				}
				elems[mainNode.id] = buildNewResource(makeQueryElement(mainNode,queryId),isConst,mainNode.filters);
			}
			if(elems[mainNode.id].isConst != true) {
				predicate.parentId = elems[mainNode.id].value;
			}
			elems[mainNode.id].predicates[current.id] = predicate;
		} else {
			// Sure this is not leaving out something? No because even constat predicate must be set as sparql
			// for query purpose
		}
	}
	var continueQuery = checkUniqueCCinQuery(elems);
	if(continueQuery != true){
		return null;
	}else{
		var json = JSON.stringify(elems);
		return json;
	}
}


function makeQueryElement(element,queryId){
	if(element.sparqlHooch == true){
		element.queryId = queryId;
	}
	if(element.sparqlHooch == true &&  element.cloned != true && element.isConst != true ){
		return "?" + element.name.replace(/ /g,'').replace(/:/g,'_');
	}else if(element.cloned == true){
		return "<" +  element.uri.replace(/ /g,'') + ">";
	}else{
		return "<" + element.id.replace(/ /g,'') + ">";
	}
}


// DELETION FUNCTIONS
function makeHoochUndoDeletePatternResource(patternResource, targetRels){
	var operation=new Object();
	operation.type = "HoochSparqlDeletePatterniResource"
	operation.node = patternResource;
	operation.targetRels = targetRels;
	return operation;
}

function revertDeletePatternResource(operation){
	
	var patternRes = operation.node; 
	patternRes.root=true;
	var targetRels = operation.targetRels;
	nodes.push(patternRes);
	// A restoring all the target Rels for the resource
	for(var trC = 0; trC < targetRels.length; trC ++){
		var currentRel = targetRels[trC];
		currentRel.parentNode = patternRes;
		currentRel.father = patternRes.name;
		links.push({source : patternRes, target : currentRel , present : true});
		hoochUpdateNodeView(null,currentRel);
	}
	
	// B restoring all the relations wich point to the resource
	for(var nodeRel in patternRes.relations){
		var curRel = patternRes.relations[nodeRel];
		curRel.elements.push(patternRes);
		links.push({source : curRel, target : patternRes , present : true});
		hoochUpdateNodeView(null,curRel);
	}
	
}

function deleteResourceFromGraph(source){
	
	// sparql hooch is going to be removed
	var targetRels = [];
	// if it is a resource then we have 2 cases
	// A the resource is parent of one or more relations
	// B the resource is target of one or more relations
	
	// A searching every relation and check if it is the parent
	for( var nCount = 0 ; nCount < nodes.length ; nCount ++){	
		var d = nodes[nCount];
		if(d.sparqlHooch == true && d.isRelation == true){
			if(d.parentNode && d.parentNode.id == source.id){
				targetRels.push(d); // saving targetRel Id for undo
				delete d.parentNode;
				delete d.father;
			}else{
			}
		}
		
	}
	
	// B should search for every relation pointing to it
	// and remove from the relation targets
	for(var nodeRel in source.relations){
		var curRel = source.relations[nodeRel];
		for(relEl in curRel.elements){
			if(curRel.elements[relEl].id == source.id){
				curRel.elements.splice(relEl,1);
			}else{
				
			}	
		}
		hoochUpdateNodeView(null,curRel);
	}
	hoochSetUndo(makeHoochUndoDeletePatternResource(source,targetRels));
	
}


function clearAllSparqlQuery(ask){
	
	var proceed = true;
	if(ask){
		proceed = confirm("Clear all the query?")
	}
	
	if(proceed){
		for( var nCount = 0 ; nCount < nodes.length ; nCount ++){	
			var d = nodes[nCount];
			if(d.sparqlHooch == true){
				nodes.splice(nCount,1);
				nCount --;
			}	
		}
		for( var i = 0 ; i < links.length ; i ++){	
			var l = links[i];
			if(l.source.sparqlHooch == true || l.target.sparqlHooch == true){
				links.splice(i,1);
				i --;
			}	
		}
		restart();
	}
}


function hoochToggleInbounPatternLink(p,revert){
	
	if(!p.elements){
		alert("Can't toggle an uncomplete predicate");
		return;
	}
	var newParent = null;
	var oldParent = p.parentNode;
	if(!oldParent){
		alert("Can't toggle an uncomplete predicate");
		return;
	}
	for(var i = 0; i < p.elements.length; i ++){
		var current = p.elements[i];
		if(current && current.id !=oldParent.id){
			p.elements.splice(i,1);
			p.elements.splice(i,0,oldParent);
			newParent = current;
			break;
		}
	}
	if(newParent){
		
		var srcN = links.filter(function (d,i){
			if(d.source && d.source.id == p.id){
				links.splice(i,1);
				return d;
			}
		});
		
		
		var trgN = links.filter(function (d,i){
			if(d.target && d.target.id == p.id){
				links.splice(i,1);
				return d;
			}
		});
		
		
		nodes.filter(function(ds,i){
			if(ds && ds.id == p.id){
				nodes.splice(i,1);
			}
		});
		
		if(p.inbound == true){
			p.inbound = false;
		}else{
			p.inbound = true;
		}
		p.parentNode = newParent;
		p.father = newParent.name;
		nodes.push(p);
		links.push({source : srcN[0].target , target : p , present : true});
		links.push({source : p, target : trgN[0].source, present : true});
		
		if(revert != true){
			hoochSetUndo(makeHoochUndoToggle(p));
		}
		restart();
	}else{
		alert("Can't toggle a predicate without subject");
	}
	
}


function hoochDeleteSparqlLink(link){
	
	if( confirm("Delete this relation?") ){
		
	}else{
		
	}
}