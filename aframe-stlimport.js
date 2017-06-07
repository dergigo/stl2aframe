function stl(containerId) {
	this.containerEntity = document.getElementById(containerId);
	
	this.removeAllEntities = function() {
		var els = containerEntity.querySelectorAll('*');
		for (var i = 0; i < els.length; i++) {
			containerEntity.removeChild(els[i]);
		}
	}
	
	this.generateTestEntities = function() {
		var testEntity;
		testEntity = generateTriangle(1,0,0,0,1,0,0,0,1);
		containerEntity.append(testEntity);
		testEntity = generateTriangle(1,2,0,2,1,0,0,1,1);
		containerEntity.append(testEntity);
		testEntity = generateTriangle(1,2,0,0,1,0,0,1,1);
		containerEntity.append(testEntity);
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



	console.log("start stl-import");
	this.removeAllEntities();
	this.generateTestEntities();

}