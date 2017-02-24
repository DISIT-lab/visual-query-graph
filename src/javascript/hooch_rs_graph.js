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

/**
 * Handling the sparql query result set
 */

var explored = {};
var lastTheta = 0;
var moreThreshold = 15;
var rootLimit = 20;

/**
 * Entry point for the query result parsing
 * Order : 0
 * @param jsonResponse
 */
function rs_parse_query_result(jsonResponse){
	
	// check if any result has been recived
	if( ! jsonResponse ){
		createDialog('Warning!', 'No response from the server');
		return;
	}else{
	}
	
	
	if( jsonResponse['sessionId'] ){
		sparqlSessionId = jsonResponse['sessionId'];
	}
	
	if( jsonResponse['queryId'] ){
		sparqlCurrentQueryId = jsonResponse['queryId'];
		sparqlCurrentQueryId = Number(sparqlCurrentQueryId) + 1;
	}
	
	// check if an erro has occurred during query processing
	if( jsonResponse['errMsg'] ){
		var msg = "An error occurred : " + jsonResponse['errMsg'];
		createDialog('Error!', msg);
		return;
	}
	
	if(! jsonResponse['res'] ){
		var msg = "No result received from the server."
		createDialog('Warning!', msg);
		return;
	}
	
	if(jsonResponse['res'].length < 1){
		var msg = "The query has produced 0 result elements."
		createDialog('Warning!', msg);
		return;
	}
	
	var resultId = jsonResponse['resultId'];; // states the result set ID
	var queryId = jsonResponse['queryId']; // states the query ID
	
	
//	queryStatuslMap[resultId].resultShow = true;
	
	var rootResponseId = [];
	var cyclicRootResponseId = [];
	var orphanId = [];
	for(currentElementId in jsonResponse['res']){
		var currentElement = jsonResponse['res'][currentElementId];
		if ( currentElement.type == 'resource' ){
			
			if ( ! currentElement.target_of ){
				rootResponseId.push(currentElementId);
			}else if(currentElement.target_of.length == 0){
				rootResponseId.push(currentElementId);
			}else if(currentElement.target && currentElement.target.length > 0){
				cyclicRootResponseId.push(currentElementId);
			}
		}else{
			orphanId.push(currentElement);
		}
		
	}

	
	var alreadyExploredList = {};

	if(rootResponseId.length > 0){
		var maxRootToExplore = Math.min(rootResponseId.length,rootLimit);
		for( var i = 0; i < maxRootToExplore; i++){
			var rootId = rootResponseId[i];
			exploreResource(rootId, alreadyExploredList, jsonResponse['res'],resultId,null,true);
		}	
	}else{
		var maxRootToExplore = Math.min(cyclicRootResponseId.length,rootLimit);
		for( var i = 0; i < maxRootToExplore; i++){
			var rootId = cyclicRootResponseId[i];
			exploreResource(rootId, alreadyExploredList, jsonResponse['res'],resultId,null,true);
		}
	}
	restart();
	hoochPaintResultSet(resultId,getRandomColor());
}

function exploreResultSetPredicate(predList,resultSet,nodeInGraph,newResource,rsId,moreNode,alreadyExploredList){
	// for every predicate specified in the result set, go on and add predicate and target
	for(var j = 0; j < predList.length; j ++ ){
		var resultSetPredicateId = predList[j];

		var resultSetPredicate = resultSet[resultSetPredicateId];
		if(! moreNode){
//			console.log("Explore predicate-"+resultSetPredicateId,resultSetPredicate);
		}
		var resultSetPredicateLabel = resultSetPredicate.label;
		var name2show = resultSetPredicate.shortenLabel;

		// the currentRelElement.uri must match 
		// with the resultSetLabel of predicate in order
		// to determinate if they are the same
		
		
		var matchRelElement = null; // if the result set relation matches an existing predicate
									// this will be populated
									// check for all relation in the node graph
									// in order to find any match with the result set
		if(nodeInGraph){
			if ( nodeInGraph.relations ){
				for( currentRelId in nodeInGraph.relations ){
					// iterating over every single relation present in the graph
					var currentRelElement = nodeInGraph.relations[currentRelId];					
					
//					console.log("Check",currentRelElement);
//					console.log("Against",resultSetPredicate);
					
					if ( resultSetPredicate.inbound == true || currentRelElement.inbound == true){
						if(! currentRelElement.sparqlHooch && currentRelElement.inbound == resultSetPredicate.inbound &&  currentRelElement.uri == resultSetPredicateLabel){
							matchRelElement = currentRelElement;
							break;
						}
					}else{
						if(! currentRelElement.sparqlHooch && currentRelElement.uri == resultSetPredicateLabel){
							matchRelElement = currentRelElement;
							break;
						}
					}
					
				}
			}else{
				nodeInGraph.relations ={};
			}
		}
		
		// start predicate pruning (A)
		// gonna replace the predicate in graph with the onw in the result set

		if(matchRelElement){
			
//			console.log("MatchRel is",matchRelElement);
			
			// found  a predicate to replace with the one in result set
			if(!matchRelElement.inbound){
				matchRelElement.inbound = false;
			}
			
			// delete all match rel element target
			for(var linkIdx=0; linkIdx < links.length; linkIdx ++){
				var cLink = links[linkIdx];
//				console.log("Matching Relation",matchRelElement);
//				if(cLink.source.isRelation == true){
//					console.log('Source',cLink.source);
//				}else{
//					console.log('Target',cLink.target);
//				}
				if( 
					(cLink.source && cLink.target)
					&&
					(
					// if a log node, then just the index is ok
					
					// if a log node, then just the index is ok
					( ! cLink.source.sparqlHooch && ! cLink.source.sparqlHoochResult && cLink.source.father == matchRelElement.father 
					&& cLink.source.uri == matchRelElement.uri
					)
					||
					( ! cLink.target.sparqlHooch && ! cLink.target.sparqlHoochResult && cLink.target.father == matchRelElement.father 
					&& cLink.target.uri == matchRelElement.uri		
					)
					||	
					( ! cLink.source.sparqlHooch && ! cLink.source.sparqlHoochResult && cLink.source.index == matchRelElement.index )
					||
					( ! cLink.target.sparqlHooch && ! cLink.target.sparqlHoochResult && cLink.target.index == matchRelElement.index )
					||
					// if a result set node then  pid,uri,inbound must match
					(cLink.target.sparqlHoochResult == true && cLink.target.uri == matchRelElement.uri && cLink.target.pid == matchRelElement.pid && cLink.target.inbound == matchRelElement.inbound)
					||
					(cLink.source.sparqlHoochResult == true && cLink.source.uri == matchRelElement.uri && cLink.source.pid == matchRelElement.pid && cLink.source.inbound == matchRelElement.inbound)
					||
					(cLink.target.sparqlHoochResult == true && cLink.target.uri == matchRelElement.uri && cLink.target.pid == matchRelElement.pid && !cLink.target.inbound && matchRelElement.inbound==false)
					||
					(cLink.source.sparqlHoochResult == true && cLink.source.uri == matchRelElement.uri && cLink.source.pid == matchRelElement.pid && !cLink.source.inbound && matchRelElement.inbound==false)
					// try with father instead of pid
					||
					(cLink.target.sparqlHoochResult == true && cLink.target.uri == matchRelElement.uri && cLink.target.father == matchRelElement.father && cLink.target.inbound == matchRelElement.inbound)
					||
					(cLink.source.sparqlHoochResult == true && cLink.source.uri == matchRelElement.uri && cLink.source.father == matchRelElement.father && cLink.source.inbound == matchRelElement.inbound)
					||
					(cLink.target.sparqlHoochResult == true && cLink.target.uri == matchRelElement.uri && cLink.target.father == matchRelElement.father && !cLink.target.inbound && matchRelElement.inbound==false)
					||
					(cLink.source.sparqlHoochResult == true && cLink.source.uri == matchRelElement.uri && cLink.source.father == matchRelElement.father && !cLink.source.inbound && matchRelElement.inbound==false)
					)
				){
						links.splice(linkIdx,1);
						linkIdx --;
//					}
				}else{
					// avoid to prune
				}
			}
			
			// prune the matchRelEment
			for(var nodeIdx = 0; nodeIdx < nodes.length; nodeIdx ++){
				var checkNode = nodes[nodeIdx];
				if(checkNode.isRelation == true){
//					console.log('CheckNode',checkNode);
//					console.log('Matcher',matchRelElement);
					// 
					
					if( ! checkNode.sparqlHooch && ! checkNode.sparqlHoochResult){

						if(! checkNode.inbound && ! matchRelElement.inbound){

							if( checkNode.uri == matchRelElement.uri && checkNode.father == matchRelElement.father) {
								nodes.splice(nodeIdx,1);
								break;
							}
						}else if(checkNode.inbound && matchRelElement.inbound){

							if(checkNode.inbound == matchRelElement.inbound && checkNode.uri == matchRelElement.uri && checkNode.father == matchRelElement.father) {
								nodes.splice(nodeIdx,1);
								break;
							}
						}else if(
								(
								checkNode.inbound && !matchRelElement.inbound && checkNode.inbound == false
								)
								||
								(
								!checkNode.inbound && matchRelElement.inbound && matchRelElement.inbound == false
								)
						){
							if( checkNode.uri == matchRelElement.uri && checkNode.father == matchRelElement.father) {
								nodes.splice(nodeIdx,1);
								break;
							}
						}
					} else if(checkNode.sparqlHoochResult == true ){
						
//						console.log('CheckNode',checkNode);
//						console.log('Matcher',matchRelElement);
						
						
						if( checkNode.uri == matchRelElement.uri && checkNode.father == matchRelElement.father) {
							nodes.splice(nodeIdx,1);
							break;
						}
					}
				}
			}
			// [B] Some target node, found before may be cut'd
			hoochPruningResultSet(rsId);
//			axrelations_graph_finder();//Removes the nodes connected with the target.			
		}else{
//			console.log("No matcher element");
			
		}
		// end of predicate pruning (A)
		
		// either the predicate existed or not now it is created
		// adding the new predicate to the graph
		
		// setting the right parent resource to the new predicate
		var parentRes = null;
		if(newResource ){
			parentRes = newResource;
		}else{
			parentRes = nodeInGraph;
		}
		
		var pred4graph = rs_hoochBuildLink4graph(resultSetPredicateLabel, rsId, resultSetPredicate.inbound,parentRes,resultSetPredicate.id,resultSetPredicate.pid,name2show,resultSetPredicateId);
		if(newResource){
			
			var inverse = newResource.relations[pred4graph.uri+"Inv"]; 
			var straight = newResource.relations[pred4graph.uri];
			
			if( ! straight ) {
				newResource.relations[pred4graph.uri]=pred4graph;
			} else if(straight.inbound == true && pred4graph.inbound == true){
				newResource.relations[pred4graph.uri]=pred4graph
			} else if( (straight.inbound == false || ! straight.inbound  ) && (pred4graph.inbound == false || ! pred4graph.inbound)){
				newResource.relations[pred4graph.uri]=pred4graph
			} else {
				newResource.relations[pred4graph.uri+"Inv"]=pred4graph;
			}
		}else{
			var inverse = nodeInGraph.relations[pred4graph.uri+"Inv"]; 
			var straight = nodeInGraph.relations[pred4graph.uri];
			
			if( ! straight ) {
				nodeInGraph.relations[pred4graph.uri]=pred4graph;
			} else if(straight.inbound == true && pred4graph.inbound == true){
				nodeInGraph.relations[pred4graph.uri]=pred4graph
			} else if( (straight.inbound == false || ! straight.inbound  ) && (pred4graph.inbound == false || ! pred4graph.inbound)){
				nodeInGraph.relations[pred4graph.uri]=pred4graph
			} else {
				nodeInGraph.relations[pred4graph.uri+"Inv"]=pred4graph;
			}
		}
		
		if(! moreNode){
			nodes.push(pred4graph);
			var res2predLink = null;
			if(newResource){
				// TODO test me
//				newResource.explored = true;
				res2predLink = {source : newResource, target : pred4graph, present : true };
				links.push(res2predLink);
			}else{
//				nodeInGraph.explored = true;
				res2predLink = {source : nodeInGraph, target : pred4graph, present : true };
				links.push(res2predLink);
			}
		}else{
			
//			http://localhost/log-edit/index.php?graph=48f2bd405de13c0a9673ca47531e5efa&sparql_session_id=75&sparql_session_next_query_id=2
//			console.log("Something to do here!", moreNode);
			
			
		}
		
		
		// then add all the resources target of the predicate
		var moreCounter = 0;
		for ( var z = 0; z < resultSetPredicate.target.length ; z ++){
			var nextToExploreId = resultSetPredicate.target[z];
			
			if(moreCounter < moreThreshold){
				// standard exploration
				var targetNodeInGraph = exploreResource(nextToExploreId, alreadyExploredList, resultSet, rsId, moreNode);
				// must check if targetNodeInGraph node is in a more!
				moreCounter ++;
				if(! moreNode ){
					if( targetNodeInGraph.moreNodeRef) {
						// the target node is in a more node
						// need to extract
						extractFromMoreNode(targetNodeInGraph.moreNodeRef, nextToExploreId);
					}
					var pred2trgLink = {source : pred4graph, target : targetNodeInGraph, present : true };
					pred4graph.elements.push(targetNodeInGraph);
					links.push(pred2trgLink);
					
				}else{
					
					pred4graph.elements.push(targetNodeInGraph);
				}
			}else{
				
				// handle the more node branch
				if( alreadyExploredList[nextToExploreId] ){
					// if the target node has already been explored, it can't go inside a more node
					// so nothing to do.
					// just skip to the next target
				}else{
					// if the target node has not been explored
					// check if the more node need to be created
					if(! pred4graph.moreNode){
						// if the more node does not exits yet, then create it
						pred4graph.moreNode = rs_buildMoreNode(pred4graph, resultSetPredicateLabel,rsId);
						// push the more node in the graph
						if( ! moreNode ) {
							nodes.push(pred4graph.moreNode);
							// create the link between the predicate and the moreNode
							var pred2moreLink = {source : pred4graph, target : pred4graph.moreNode, present : true };
							links.push(pred2moreLink);
						}
						// push the moreNode in the elementes of the predicate
						pred4graph.elements.push(pred4graph.moreNode);
					}
					// either way explore the node that has finished in the more node
					exploreResource(nextToExploreId, alreadyExploredList, resultSet, rsId, pred4graph.moreNode);
				}
			}
		}
		
		if(! moreNode){
//			console.log("END Explore predicate-"+resultSetPredicateId,resultSetPredicate);
		}
		
	}
	
}


/**
 * Richiamata per esplorare una risorsa
 * Order : 1
 */
function exploreResource(resourceId,alreadyExploredList,resultSet,rsId,moreNode,setRoot){
	
	if( alreadyExploredList[resourceId] ){
		// the element has already been explored 
		// safety for loop 
		return alreadyExploredList[resourceId];
	}
	if(! moreNode){
		
//		console.log("Explore-"+resourceId,resultSet[resourceId]);
		
	}
	var nodeInGraph = searchNodeInGraph(resourceId); // [A] Some target node may be found here
	var newResource = null;
	if( nodeInGraph ){
		
//		console.log('Node in graph',nodeInGraph);
		nodeInGraph.resultId = rsId;
		alreadyExploredList[resourceId] = nodeInGraph;			
		// the node is already in graph
		// check if the predicate in the result set are present in the graph
		// if not then add them
		// if yes then edit the target elements accordingly to the result set
	}else{
		// the node is not in the graph
		// draw it if and only if the parent predicate has not reached the more cap
		// either way it must be created and eventually added to the relative moreNode
		newResource = rs_hoochBuildResource4graph(resourceId, resultSet[resourceId].label, resultSet[resourceId].image, rsId);
		
//		console.log('New Resource',newResource);
		
		if(setRoot){
			newResource.root = true;
		}
		alreadyExploredList[resourceId] = newResource;
		if( ! moreNode ){
			nodes.push(newResource);
		}else{
			newResource.moreNodeRef = moreNode;
			moreNode.count = moreNode.count + 1;
			moreNode.name = "more " + moreNode.count + " of " + moreNode.sourceLabel;
			moreNode.targetNodes[resourceId]=newResource;
		}
	}
	// first of all, check if any predicate is specified in the result set
	if (resultSet[resourceId].target ){
		exploreResultSetPredicate(resultSet[resourceId].target,resultSet,nodeInGraph,newResource,rsId,moreNode,alreadyExploredList);
	}
	
	
	if(! moreNode){	
//		console.log("END Explore-"+resourceId,resultSet[resourceId])
	}
	
	return alreadyExploredList[resourceId];
}

function searchNodeInGraph(nodeId){
	var result = nodes.filter( 
		function( d ) {
			if(d){
				var id2compare = "";
				if(d.sparqlHoochResult){
					id2compare = d.idForExplore;
				}else{
					id2compare = d.id;
				}
				if(id2compare == nodeId){
					return d;
				}
			}
		} 
	);
	
	if(result && result.length > 0){
		return result[0];
	}else{
		return null;
	}
}

function searchPredicateInGraph(parseId){
	var result = nodes.filter( 
		function( d ) {
			if(d){
				if(d.sparqlHoochResult && d.parseId && d.parseId == parseId && d.isRelation == true){
					return d;
				}
			}
		} 
	);
	
	if(result && result.length > 0){
		return result[0];
	}else{
		return null;
	}
}


function extractFromMoreNode(more,node2extractId){
	var nodeExtracted = more.targetNodes[node2extractId];
	var sourcePredicate = more.sourcePredicateRef;
	if(nodeExtracted){
		nodes.push(nodeExtracted);
		more.count = more.count - 1;
		delete more.targetNodes[node2extractId];
	}else{
		// the node is in the graph
		nodeExtracted = searchNodeInGraph(node2extractId);
		var id4match = sourcePredicate.parseId;
		sourcePredicate = searchPredicateInGraph(id4match);
	}
	// if the parent of source predicate is hidden then must extract it too
	
//	var predParent = sourcePredicate.parentNode;
//	if(predParent){
//		if( predParent.moreNodeRef ) {
//			// must extract it too
//			nodes.push(sourcePredicate);
//			var id2ex = predParent.id;
//			if(predParent.sparqlHoochResult == true){
//				id2ex = predParent.idForExplore
//			}
//			extractFromMoreNode(predParent.moreNodeRef, id2ex)
//			
//		}
//	}
	sourcePredicate.elements.push(nodeExtracted);
	links.push({source : sourcePredicate, target : nodeExtracted, present : true});
}

function rs_buildMoreNode(sourceRel, sourceRelLabel,resultId){
	var more=new Object();
	more.resultId = resultId;
	more.sourcePredicateRef = sourceRel;
	more.index = "HoochIndex_"+sparqlCount;
	more.id = "hoochSparqlCount-"+sparqlCount + hoochGuid();
	more.img = "images/icons/more.png";
	more.sourceLabel = sourceRelLabel;
	more.name = "empty more of " + sourceRelLabel;
	more.type = "moreResultSet";
	more.sparqlHoochResult=true;
	more.EP = [];
	more.EP.push(endpoint);
	more.root = false;
	more.fixed = false;
	more.isRelation=false;
	more.explored=false;
	more.count = 0;
	more.targetNodes = {};
	more.x = Math.floor($("#axrelations_graph_container").width()/2);
	more.y = 140;
	sparqlCount ++;
	return more;
}

/**
 * Build a predicate to put in graph
 * @param nodeName
 * @param resultId
 * @param inbound
 * @returns {___anonymous189_195}
 */
function rs_hoochBuildLink4graph(nodeName,resultId,inbound,parentResource,index,pid,name2show,parseId){
	var element=new Object();
	element.parseId = parseId;
	element.pid = pid;
	element.index = index; 
	element.resultId = resultId;
	element.moreNode = null;
	element.isRelation=true;
	element.explored=true;
	element.elements=[];
	element.root=false;
	element.name=name2show;
	element.label=nodeName;
	element.type="patternLink";
	element.uri=nodeName;
	element.father = parentResource.name;
	element.parentNode = parentResource;
	element.id= "hoochSparqlCount-"+sparqlCount + hoochGuid();
	element.img='images/buttons/minus.png';
	element.sparqlHoochResult=true;
	element.inbound=inbound;
	element.isConst = true;
	element.optional = false; // is used for the optional in the query
	var r = 180;
	var theta = lastTheta + Math.random() * 2 * Math.PI ;
	lastTheta = theta;
	element.fixed = false;
	sparqlCount ++;
	return element;
}

/**
 * Build a resource to put in graph
 * @param nodeId
 * @param nodeLabel
 * @param image
 * @param resultId
 * @returns {___anonymous1234_1240}
 */
function rs_hoochBuildResource4graph(nodeId,nodeLabel,image,resultId){
	var element=new Object();
	element.isConst = true;
	element.resultId = resultId;
	element.explored=false;
	element.EP = [];
	element.EP.push(endpoint);
	element.isRelation=false;
	element.relations={};
	element.root=false;
	if(nodeLabel){
		element.name=nodeLabel;
	}else{
		element.name=nodeId;
	}
	element.index = "HoochIndex_"+sparqlCount;
	element.type="patternResource";
	element.id= nodeId;
	element.idForExplore = nodeId;
	element.img= image;
	element.sparqlHoochResult=true;
	element.fixed = false;

	sparqlCount ++;
	return element;
}


function createDialog(title, text) {
    return $("<div class='dialog' title='" + title + "'><p>" + text + "</p></div>")
    .dialog({
        resizable: false,
        height:140,
        modal: true,
        buttons: {
            "Ok": function() {
                $( this ).dialog( "close" );
            }
        }
    });
}

function hoochPruningResultSet(resultSetId){
	
	var stack_of_nodes=Array();
	for(var i=0;i<nodes.length;i++){
		if(! nodes[i]){
			continue;
		}
		if(nodes[i].root==true){
			nodes[i].reached=true;//Starts the labelling from the root. For more roots more pushes!
			stack_of_nodes.push(nodes[i]);		
		}else if(nodes[i].resultId && nodes[i].resultId == resultSetId ){
			nodes[i].reached=true;
			stack_of_nodes.push(nodes[i]);	
		}else{ 
			nodes[i].reached=false;	
		}
	}
	
	while(stack_of_nodes.length!=0){
		var node_reached=stack_of_nodes.pop();			
		for(var i=0;i<links.length;i++){
			if(! node_reached.sparqlHoochResult){
				if(links[i].source.index==node_reached.index && links[i].target.reached==false){
					links[i].target.reached=true;
					stack_of_nodes.push(links[i].target);
				}
			}else{
				var cLink = links[i];
				var matchRelElement = node_reached;
				if(links[i].source && links[i].target){
					if(links[i].source.index==node_reached.index && links[i].target.reached==false){
						links[i].target.reached=true;
						stack_of_nodes.push(links[i].target);
					}else if(links[i].target.index==node_reached.index && links[i].source.reached==false){
						links[i].source.reached=true;
						stack_of_nodes.push(links[i].source);
					}
				}
			}
		}
	}
	
	for(var i=0;i<nodes.length;i++){
		if(! nodes[i]){
			continue;
		}
		if(nodes[i].reached==false){//For the nodes not reached.
			for(var j=0;j<links.length;j++){
				if(nodes[i].index && links[j].source.index==nodes[i].index){//Deletes the edges.
					links.splice(j,1);
					j=j-1;
				}
			}
			nodes.splice(i,1);
			i=i-1;
		}
	}
	
}

function hoochRemovePaintResultSet(resultSetid){
	// paint the last result-set
	d3.selectAll("g.node").each(function(curNode) {
		if(curNode.resultId == resultSetid) {
			d3.select(this).select("ellipse.resultSetPaint").remove();
		}
	});
}

function hoochPaintResultSet(resultSetid,color) {
	// paint the last result set
	d3.selectAll("g.node").each(function(curNode) {
		if(curNode.resultId == resultSetid){
			d3.select(this).append("ellipse")
			.attr("class","resultSetPaint")
			.attr("rx",30)
			.attr("ry",30)
			.attr("fill",color)
			.attr("opacity","0.3")
			.attr("display","block");
		}
	});
	window.setTimeout(function (){
		d3.selectAll("g.node").each(function(curNode) {
			if(curNode.resultId == resultSetid){
				d3.select(this).select("ellipse.resultSetPaint").remove();
			}
		});
	},10000);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
