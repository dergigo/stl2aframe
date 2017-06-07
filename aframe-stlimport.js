function Stl2Aframe(containerId) {
	this.containerEntity = document.getElementById(containerId);
	
	this.removeAllEntities = function() {
		var els = this.containerEntity.querySelectorAll('*');
		for (var i = 0; i < els.length; i++) {
			this.containerEntity.removeChild(els[i]);
		}
	}
	
	this.generateTestEntities = function() {
		var testEntity;
		testEntity = this.generateTriangle(1,0,0,0,1,0,0,0,1);
		this.containerEntity.append(testEntity);
		testEntity = this.generateTriangle(1,2,0,2,1,0,0,1,1);
		this.containerEntity.append(testEntity);
		testEntity = this.generateTriangle(1,2,0,0,1,0,0,1,1);
		this.containerEntity.append(testEntity);
	}
	
	this.generateTriangle = function(x1,y1,z1, x2, y2, z2, x3, y3, z3) {
		myTriangle = document.createElement('a-entity');
		
		myTriangle.setAttribute('geometry', {
			primitive: 'triangle',
			vertexA: ''+x1+' '+y1+' '+z1,
			vertexB: ''+x2+' '+y2+' '+z2,
			vertexC: ''+x3+' '+y3+' '+z3
		});
		
		myTriangle.setAttribute('material', {
			color: '#D0D0D0',
			side: 'double',
			metalness:0.8,
			roughness:0.8
		});
		
		return myTriangle;
	}
	

	this.importStlFile = function(url) {
		$.get(url, function(data) {
	   		stl.parseStlFile(data);
		}, 'text');	
	}

	this.parseStlFile = function(stlFileContent) {
		//console.log(stlFileContent);
		var facets = stlFileContent.split("endfacet");
		for (var i = 0; i<facets.length; i++) {
			facets[i] = facets[i].replace(/^\s+/gm, ""); 
			facets[i] = facets[i].replace(/^.*solid.*$/gm, "");
			facets[i] = facets[i].replace(/^facet.*$/gm, "");
			facets[i] = facets[i].replace(/^.*loop.*$/gm, "");
			facets[i] = facets[i].replace(/^vertex /gm, "");
			facets[i] = facets[i].replace(/^\n/gm, "");
			facets[i] = facets[i].replace(/\n$/, "");
			
			var a = Array();
			
			var points = facets[i].split(/\n/);
			if (points.length == 3) {
				var coordsOfAPoint = Array();
				coordsOfAPoint[0]= points[0].split(" ");
				coordsOfAPoint[1]= points[1].split(" ");
				coordsOfAPoint[2]= points[2].split(" ");
				
				if (coordsOfAPoint[0].length == 3 && coordsOfAPoint[1].length == 3 && coordsOfAPoint[1].length == 3) {
					for (var p = 0; p < 3; p++) {
						for (var c = 0; c < 3; c++) {
							a.push(coordsOfAPoint[p][c]/1000);
						}
					}
					this.containerEntity.append(this.generateTriangle(a[0],a[2],a[1],a[3],a[5],a[4],a[6],a[8],a[7]));
				}
			}
			
			
			
			
			
		}

		//console.log(facets[4]);
	}

}

var stl;

$(function() {
	stl = new Stl2Aframe('stlobject');
	console.log("stl-import started");
	stl.removeAllEntities();
	stl.importStlFile("simple.stl");
	console.log("stl-import completed");


});
