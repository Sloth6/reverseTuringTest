
// MAIN
// standard global variables
var container, scene, cssScene ,camera, renderer, game, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
// custom global variables
var rendererCSS;
var tabs = [];

var pi = 3.1415;
var current = 0;
var moving = false;
game = {
	players : ['b','b','b'],
	total : 3
};

game.players[Math.floor(Math.random()*game.total)] = 'p';

init(game);
animate();

function turn(n) {
	if(moving) return;
	moving = true;


	var from = tabs[current].planeMesh.position;
	// var sweep  = from.copy();
	current +=n;
	current = (current >= game.total) ? current = 0 : current; 
	current = (current < 0) ? current = game.total-1 : current;

	// camera.lookAt(tabs[current].planeMesh.position);
	var to = tabs[current].planeMesh.position;

	console.log('moving to ', current);
	var sum = game.total;
	var theta = (360/sum) * (pi/180); 
	var r = 400;
	
	// var tween = new TWEEN.Tween( { a: startAngle } )
 //    .to( { a: endAngle }, 1000 )
 //    .easing( TWEEN.Easing.Quadratic.InOut )
 //    .onUpdate( function () {
 //    	var x = Math.sin((this.a)) * r;
 //    	var z = Math.cos(this.a) * r;
	// 		camera.lookAt(new THREE.Vector3(x, from.y, z));
 //    })
 //    .onComplete(function() {
 //    	// camera.lookAt(to);
	// 		moving = false;
	// 	})
 //    .start();

	var tween = new TWEEN.Tween( { x:from.x, y: from.y, z:from.z } )
    .to( { x:to.x, y:to.y, z:to.z }, 1000 )
    .easing( TWEEN.Easing.Sinusoidal.Out)
    .onUpdate( function () {
			camera.lookAt(new THREE.Vector3(this.x*1000, 150, this.z*1000));
    })
    .onComplete(function() {
			moving = false;
		})
    .start();
}


// FUNCTIONS 		
function init(game) {
	// SCENE
	scene = new THREE.Scene();
	cssScene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,150,0);
	camera.lookAt(0,150,0);
	// RENDERER
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer(); 
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	// CONTROLS
	// controls = new THREE.OrbitControls( camera, renderer.domElement );
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);

	var sum = game.total;
	var theta = 360/sum; 
	var x, z;
	var r = 400;
	var pi = 3.1415;
	for (var i = 0; i < sum; i++) {
		var t = ((i * theta)* (pi/180))+ pi/2;
		x = Math.floor(Math.cos(t) * r);
		z = Math.floor(Math.sin(t) * r);
		if (game.players[i] == 'b') {
			var url = 'http://204.236.234.28:9002/bot?n=Bot_'+i;
		} else {
			var url = 'http://204.236.234.28:9002/hidden?n=Bot_'+i;
		}
		tabs.push(new Tab(x,z, 300, 240, (3*pi/2 - t), url, scene, cssScene));
	};
	console.log(camera);
	var few = tabs[current].planeMesh.position;
	camera.lookAt( new THREE.Vector3(few.x, 150, few.y));
	// create a renderer for CSS
	rendererCSS	= new THREE.CSS3DRenderer();
	rendererCSS.setSize( window.innerWidth, window.innerHeight );
	rendererCSS.domElement.style.position = 'absolute';
	rendererCSS.domElement.style.top	  = 0;
	rendererCSS.domElement.style.margin	  = 0;
	rendererCSS.domElement.style.padding  = 0;
	document.body.appendChild( rendererCSS.domElement );
	// when window resizes, also resize this renderer
	THREEx.WindowResize(rendererCSS, camera);

	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top      = 0;
	// make sure original renderer appears on top of CSS renderer
	renderer.domElement.style.zIndex   = 1;
	rendererCSS.domElement.appendChild( renderer.domElement );
}

function animate() {
  requestAnimationFrame( animate );
  TWEEN.update();
	render();		
	update();
}

var foo = 0;
var total = game.total;
function update() {
	for (var i = 0; i < total; i++) {
		if ( keyboard.pressed(''+i) ){
			if (i > current) {
				turn (i -current);
			} else {
				turn (current - i);
			}
		}

	}
	if ( keyboard.pressed('left')) {
		// console.log(current);
		turn(-1);
		// if (current == 0) moveTo(total-1);
		// moveTo(total- current);

	} else if ( keyboard.pressed('right')) {
		turn(1);
		// if (current == total-1) moveTo(0);
		// else moveTo(current+1);

	}
	// camera.lookAt(0,0,0);	
	// controls.update();
	stats.update();
}

function render() {
	renderer.render( scene, camera );
	rendererCSS.render(cssScene, camera);
}

function Tab(x, z, w, h, r, http, scene, cssScene) {
	var self = this;
	var planeMaterial = new THREE.MeshBasicMaterial(
		{color: 0x000000, opacity: 0.0, side: THREE.DoubleSide });
	self.planeGeometry = new THREE.PlaneGeometry( w,h );
	self.planeMesh= new THREE.Mesh( self.planeGeometry, planeMaterial );
	self.planeMesh.position.y += h/2;
	self.planeMesh.position.z  = z;
	self.planeMesh.position.x  = x;
	self.planeMesh.rotation.y = r;
	scene.add(self.planeMesh);

	// self.cssScene = new THREE.Scene();

	var element	= document.createElement('iframe');
	// webpage to be loaded into iframe
	element.src	= http;//"http://localhost:8080/";
	// width of iframe in pixels
	var elementWidth = 1024/2;
	// force iframe to have same relative dimensions as planeGeometry
	var aspectRatio = h / w;
	var elementHeight = elementWidth * aspectRatio;
	element.style.width  = elementWidth + "px";
	element.style.height = elementHeight + "px";

	// create a CSS3DObject to display element
	var cssObject = new THREE.CSS3DObject( element );
	// synchronize cssObject position/rotation with planeMesh position/rotation 
	cssObject.position = self.planeMesh.position;
	cssObject.rotation = self.planeMesh.rotation;
	// resize cssObject to same size as planeMesh (plus a border)
	var percentBorder = 0.00;
	cssObject.scale.x /= (1 + percentBorder) * (elementWidth / w);
	cssObject.scale.y /= (1 + percentBorder) * (elementWidth / w);
	// console.log(self.cssScene, cssObject);
	cssScene.add(cssObject);

}