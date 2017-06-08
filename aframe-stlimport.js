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

	this.importBinaryStlFile = function(myUrl) {
		var typeSet = {
		 'jBinary.littleEndian': true,
		  header: ['array', 'uint8', 80],
		  number: 'uint32',
		  triangle: ['array', 'float32', 12],
		  choord: 'float32',
		  fnord: 'uint16'
		};
		
		jBinary.load(myUrl, typeSet, function (err, binary) {
		  
		  binary.read('header');
		  
		  var numberOfTriangles = binary.read('number');
		  for (var i = 0; i < numberOfTriangles; i++) {
		    var a = binary.read('triangle');	
   		    stl.containerEntity.append(stl.generateTriangle(a[3]/1000,a[5]/1000,a[4]/1000,a[6]/1000,a[8]/1000,a[7]/1000,a[9]/1000,a[11]/1000,a[10]/1000));
   		    binary.read('fnord');
		  }
		 
		  
		});	
	}

	this.splitStlFileContentToArrayOfStrings = function(stlFileContent) {
		var resultArrayOfStrings = Array();
		var facets = stlFileContent.split("endfacet");
		for (var i = 0; i<facets.length; i++) {
			facets[i] = facets[i].replace(/^\s+/gm, ""); 
			facets[i] = facets[i].replace(/^.*solid.*$/gm, "");
			facets[i] = facets[i].replace(/^facet.*$/gm, "");
			facets[i] = facets[i].replace(/^.*loop.*$/gm, "");
			facets[i] = facets[i].replace(/^vertex /gm, "");
			facets[i] = facets[i].replace(/^\n/gm, "");
			facets[i] = facets[i].replace(/\n$/, "");
			
			if (facets[i] != "") {resultArrayOfStrings.push(facets[i]);}
		}
		
		return resultArrayOfStrings;	
	}


	this.parseStlFile = function(stlFileContent) {
		//console.log(stlFileContent);
		triangleCoordsAsStrings = this.splitStlFileContentToArrayOfStrings(stlFileContent);
		for (var i = 0; i < triangleCoordsAsStrings.length; i++) {
			var a = Array();
			
			var points = triangleCoordsAsStrings[i].split(/\n/);
			if (points.length == 3) {
				//console.log(points);
				var coordsOfAPoint = Array();
				coordsOfAPoint[0]= points[0].trim().split(" ");
				coordsOfAPoint[1]= points[1].trim().split(" ");
				coordsOfAPoint[2]= points[2].trim().split(" ");
				
				
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
		console.log("stl-import completed");
	}
	

}

var stl;

$(function() {
	stl = new Stl2Aframe('stlobject');
	console.log("stl-import started");
	stl.removeAllEntities();
//	stl.importStlFile("simple.stl");
//	stl.importStlFile("medium.stl");
//	stl.importStlFile("complex.stl");

	stl.importBinaryStlFile("binary.stl");



});
