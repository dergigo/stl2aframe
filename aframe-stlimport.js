function Stl2Aframe(containerId) {
	this.containerEntity = document.getElementById(containerId);
	
	this.removeAllEntities = function() {
		var els = this.containerEntity.querySelectorAll('*');
		for (var i = 0; i < els.length; i++) {
			this.containerEntity.removeChild(els[i]);
		}
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

	this.binaryStlTypeSet = {
		 'jBinary.littleEndian': true,
		  header: ['array', 'char', 80],
		  number: 'uint32',
		  triangle: ['array', 'float32', 12],
		  choord: 'float32',
		  fnord: 'uint16',
		  textfile: 'string',
		};

	this.importBinaryStlFileFromUrl = function(myUrl) {
		var typeSet = this.binaryStlTypeSet;


		//TODO: REFACTOR:		
		jBinary.load(myUrl, typeSet, function (err, binary) {
			stl.importBinaryStlFileFromArrayBuffer(binary.view._view.buffer);
		});	
	}
	
	this.importBinaryStlFileFromArrayBuffer = function(myArrayBuffer) {
		var typeSet = this.binaryStlTypeSet;
		
		var binary = new jBinary(new jDataView(myArrayBuffer,0,myArrayBuffer.byteLength, littleEndian = true),typeSet);

		var header = binary.read('header');
		
		
		if(header.slice(0,5).join("")=="solid") {
			var asciiStlFile = (new jBinary(new jDataView(myArrayBuffer,0,myArrayBuffer.byteLength, littleEndian = true),typeSet)).read('textfile');
			this.parseStlFile(asciiStlFile);	
		} else {
			
			var numberOfTriangles = binary.read('number');
			for (var i = 0; i < numberOfTriangles; i++) {
				var a = binary.read('triangle');	
				this.containerEntity.append(this.generateTriangle(a[3]/1000,a[5]/1000,a[4]/1000,a[6]/1000,a[8]/1000,a[7]/1000,a[9]/1000,a[11]/1000,a[10]/1000));
				binary.read('fnord');
			}
		}

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
	stl = new Stl2Aframe('stlcontainer');
	console.log("stl-import started");
	stl.removeAllEntities();
//	stl.importStlFile("demostl/simple.stl");
//	stl.importStlFile("demostl/medium.stl");
//	stl.importStlFile("demostl/complex.stl");

	stl.importBinaryStlFileFromUrl("demostl/binary.stl");
//	stl.importBinaryStlFileFromUrl("demostl/binary2.stl");
});
