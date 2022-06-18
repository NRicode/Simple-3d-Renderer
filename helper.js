//helper functions
function rotX(ref, angle){
	
	//rotate on y axis, (x and z coordinate modified)
	if(angle){
		
		let newX = ref.z * Math.sin(angle) + ref.x * Math.cos(angle);
		let newZ = ref.z * Math.cos(angle) - ref.x * Math.sin(angle);
		ref.x = newX;
		ref.z = newZ;
	
	}
	
}

function rotY(ref, angle){
	
	//rotate on x axis, (y and z coordinate modified)
	if(angle){
	
		let newY = ref.y * Math.cos(angle) - ref.z * Math.sin(angle);
		let newZ = ref.y * Math.sin(angle) + ref.z * Math.cos(angle);
		ref.y = newY;
		ref.z = newZ;
	
	}
	
}

function scaleVert(vertices, scaleX, scaleY, scaleZ){
	
	//scale model
	for(v of vertices){
		
		v.x *= scaleX;
		v.y *= scaleY;
		v.z *= scaleZ;
		
	}
	
}

function dist3d(x1,y1,z1, x2,y2,z2){
	
	return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2) + Math.pow(z2-z1, 2), 2);
	
}

//point inside polygon copy paste
function inside(point, vs) {

    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};
