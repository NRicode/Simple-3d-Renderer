//main logic

//data
let vertices = [];
let faces = [];

let width = window.innerWidth;
let height = window.innerHeight;

let camX = 0;
let camZ = 200;
let camY = 30;
let camSpeed = 0.1;

let camRotX = Math.PI;
let camRotY = 0;

function setup(){
	
	let cnv = createCanvas(width, height);
	cnv.parent('body');
	let objFile = new OBJFile(cube);
	let output = objFile.parse();
	
	vertices = output.models[0].vertices.slice(); //load vertices from .obj
	scaleVert(vertices, 50, -50, 50); //make object bigger and flip the y axis (original model seem to be upside down)
	
	//load facess
	for(f of output.models[0].faces){

		let face = {vertIndex: [], dist: null, color: []};
		for(item of f.vertices){
			face.vertIndex.push(item.vertexIndex);
		}
		faces.push(face);

	}
	
	//add render variables, the original static xyz position of vertices in world should not be modified to prevent weird results
	for(p of vertices){
		
		p.rend = {};
		p.rend.x = p.x;
		p.rend.y = p.y;
		p.rend.z = p.z;
		
	}
	
}

function draw() {
	
	background(255);
	
	//modify camera rotation value by mouse movement
	camRotX += movedX*deltaTime/10000;
	camRotY += movedY*deltaTime/10000;

	//prevent camera from flipping over when looking up and down
	if(camRotY > 1.5){
		camRotY = 1.5;
	}
	if(camRotY < -1.5){
		camRotY = -1.5
	}
	
	//pointer lock
	if(mouseIsPressed){
		
		document.getElementById("defaultCanvas0").requestPointerLock();
		
	}
	
	//calculate camera movement based on viewing angle (camRot)
	if(keyIsDown(87)){ //W
		
		camX += Math.sin(camRotX) * camSpeed * deltaTime;
		camZ += Math.cos(camRotX) * camSpeed * deltaTime;
		camY += Math.sin(camRotY) * camSpeed * deltaTime;
		
	}
	
	if(keyIsDown(83)){ //S
		
		camX -= Math.sin(camRotX) * camSpeed * deltaTime;
		camZ -= Math.cos(camRotX) * camSpeed * deltaTime;
		camY -= Math.sin(camRotY) * camSpeed * deltaTime;
		
	}
	
	if(keyIsDown(65)){ //A
		
		camX -= Math.cos(camRotX) * camSpeed * deltaTime;
		camZ += Math.sin(camRotX) * camSpeed * deltaTime;
		
	}
	
	if(keyIsDown(68)){ //D
		
		camX += Math.cos(camRotX) * camSpeed * deltaTime;
		camZ -= Math.sin(camRotX) * camSpeed * deltaTime;
		
	}
	
	for(p of vertices){
		
		//rend values need to be reset everytime we draw
		p.rend.x = p.x;
		p.rend.y = p.y;
		p.rend.z = p.z;
		
		//apply translation and rotation relative to camera
		p.rend.x -= camX;
		p.rend.y -= camY;
		p.rend.z -= camZ;
		
		rotX(p.rend, -camRotX); 
		rotY(p.rend, camRotY);
	}
	
	for(f of faces){
		
		/*basic z buffering, by geting the midpoint (barycentric coordinate) 
		of a face and calculating the distance relative to camera*/
		
		let divTotal = f.vertIndex.length; //for division later
		let averageTotalX = 0;
		let averageTotalY = 0;
		let averageTotalZ = 0;
		
		for(item of f.vertIndex){
			
			//-1 because array starts at 0
			averageTotalX += vertices[item-1].rend.x;
			averageTotalY += vertices[item-1].rend.y;
			averageTotalZ += vertices[item-1].rend.z;
			
		}
		
		averageTotalX = averageTotalX/divTotal;
		averageTotalY = averageTotalY/divTotal;
		averageTotalZ = averageTotalZ/divTotal;
		
		//distance from the middle of a face to camera
		f.dist = dist3d(0,0,0, averageTotalX, averageTotalY, averageTotalZ);
		
		
	}
	
	//sort all faces by .dist value for z buffering
	faces.sort(function(f1, f2){
		
		return f2.dist-f1.dist;

	});
	
	//in 3d projection 0, 0 coordinate should be at the middle of the screen rather than top left
	translate(width/2, height/2);
	
	fill(255,255,255);
	stroke(1);
	for(f1 of faces){
		
		
		let render = true;
		for(i=0; i<f1.vertIndex.length; i++){
				
			//make sure to not render faces if it is behind the camera (z < 0)
			//-1 because array start at 0
			if(vertices[f1.vertIndex[i]-1].rend.z < 0){
				render = false;
			}
				
		}
		
		if(render){
			
			beginShape(TRIANGLE_FAN);
			
			let polyArr = [];
			
				for(item of f1.vertIndex){
					
					let x = vertices[item-1].rend.x/vertices[item-1].rend.z * width/2;
					let y =  vertices[item-1].rend.y/vertices[item-1].rend.z * width/2;
					vertex(x, y); //add vertex to polygon
					polyArr.push([x,y]); //for basic raycasting
					
				}
			
			//simple raycast calculation
			if(inside([0,0], polyArr)){
			
				fill(255,0,0); //make intersecting polygon red
			
			}else{
				
				fill(255,255,255);
				
			}
			
			endShape();
		
		}
		
		
	}
	
	noStroke();
	fill(0, 255, 0);
	circle(0, 0, 5); //draw crosshair
	
	//translate back to initial position because p5js save 
	translate(-width/2, -height/2);
  
}