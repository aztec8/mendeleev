'use strict';
var dmitri = dmitri || {};

dmitri.app = {
	//constants
	TABLE_CAMERA_SPEED:.3,
	// variable properties
	atomRenderer: undefined,
	tableRenderer:undefined,
	//different scenes
	scene: undefined,
	atomScene:undefined,
	tableScene:undefined,
	camera: undefined,
	tableCamera:undefined,
	cameraControls: undefined,
	myobjects: [],
	paused: false,
	dt: 1/60,
	step: 0,
	atom: undefined,
	table:undefined,
	//application states
	state:0,
	STATE_PERIODIC_TABLE:0,
	STATE_ATOM_VIEW:1,

	/* Method Purpose: Initializes all variables for the app object*/
	init: function() {
		// get data
		dmitri.elements = elements;


		this.setupThreeJS();

		this.table = dmitri.table;
		this.table.init(this.tableScene);


		this.atom = dmitri.atom;
		this.atom.init(elements, document.querySelector('#atom'), this.atomScene); // "elements" is from data/elements.json 
		this.atom.build(1); // hydrogen. build() uses atomic numbers

		//this.createParticles();
		//set up front-canvas
		document.querySelector("#table").className = "front-canvas";

		this.update();
	},





  // createParticles: function() {
  //   var material = new THREE.ParticleBasicMaterial();

  //   for (var x = -5; x < 5; x++) {
  //     for (var y = -5; y < 5; y++) {
  //       var particle = new THREE.Particle(material);
  //       particle.position.set(x * 10, y * 10, 0);
  //       this.atomScene.add(particle);
  //     }
  //   }
  // },





  /* Method Purpose: Sets up the ThreeJS renderers and cameras*/
	setupThreeJS: function() {


		var canvas = document.querySelector('#model');
		var tablecanvas = document.querySelector('#table');



		// set renderer
		this.atomRenderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});
		this.atomRenderer.setSize( window.innerWidth, window.innerHeight );
		this.atomRenderer.setClearColor(0x000014, 1.0);
		this.atomRenderer.shadowMapEnabled = true;

		this.tableRenderer = new THREE.WebGLRenderer({antialias: true, canvas: tablecanvas});
		this.tableRenderer.setSize( window.innerWidth, window.innerHeight );
		this.tableRenderer.setClearColor(0x000014, 1.0);
		this.tableRenderer.shadowMapEnabled = true;









		// set scene
		//this.scene = new THREE.Scene();
		this.atomScene = new THREE.Scene();
		this.atomScene.fog = new THREE.FogExp2(0x9db3b5, 0.002);

		this.tableScene = new THREE.Scene();


		/* set camera */
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		// position
		this.camera.position.z = window.innerWidth/20;

		this.tableCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		this.tableCamera.position.x = 38;
		this.tableCamera.position.z = 55;
		this.tableCamera.position.y = -25;

		//this.tableCamera.position.z = window.innerWidth*0.1;
		// this.camera.position.z = 0;

		// this.cameraControls = new THREE.OrbitControls(this.camera, document.querySelector("#atom-wrapper"));
		//this.cameraControls = new THREE.OrbitControls(this.tableCamera, document.querySelector("#table-wrapper"));
		
		/*this.cameraControls.target.x = this.tableCamera.position.x;
		this.cameraControls.target.y = this.tableCamera.position.y;
		this.cameraControls.target.z = this.tableCamera.position.z;*/


		// add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x222222);
    // var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    var spotLight = new THREE.SpotLight( 0xffffff );
		    spotLight.position.y = 10;
		    spotLight.position.z = 30;
		    spotLight.castShadow = true;
    spotLight.lookAt(this.atomScene);
		var spotLight2 = new THREE.SpotLight( 0xffffff );
		    spotLight2.position.y = 10;
		    spotLight2.position.z = -30;
		    spotLight2.castShadow = true;
    spotLight2.lookAt(this.atomScene);
		var spotLight3 = new THREE.SpotLight( 0xffffff );
		    spotLight3.position.y = -10;
		    spotLight3.position.z = 30;
		    spotLight3.castShadow = true;
    spotLight3.lookAt(this.atomScene);

    this.atomScene.add(ambientLight);    
    this.atomScene.add(spotLight);
    this.atomScene.add(spotLight2);
    // this.atomScene.add( spotLight3 );

	},

	/* Method Purpose: Builds the new atom for the atomview */
	updateAtom: function(number,raw)
	{
		var atomicNumber = raw ? number + 1 : number;
		this.atom.build(atomicNumber);
		//this.state = this.STATE_ATOM_VIEW;
	},
				
	/* Method Purpose: Updates the canvas elements*/
	update: function(){
		// schedule next animation frame
		dmitri.animationID = requestAnimationFrame(this.update.bind(this));
		
		// PAUSED?
		if (dmitri.paused){
			this.drawPauseScreen();
			return;
		 }
		
		this.atom.animate();
		this.table.update();


		//console.log();
		//update table camera
		if (this.state == this.STATE_PERIODIC_TABLE)
			this.updateTableCamera();
		// DRAW	
		this.atomRenderer.render(this.atomScene, this.camera);
		this.tableRenderer.render(this.tableScene, this.tableCamera)
	},
	

			

	/* Method Purpose: Draws whatever is necessary for the pause screen*/
	drawPauseScreen: function(){
		// do something pause-like if you want
	},

	/* Method Purpose: Searches for an elements and if it's found switches to that element*/
	search: function(e) {
		var search = dmitri.search.value.toLowerCase();
		//console.log();

		//dmitri.table.blankElements();

		for (var i = 0; i < dmitri.elements.length; i++) {
			var el = dmitri.elements[i];
			var name = dmitri.elements[i].name.toLowerCase();

			var sub = name.substring(0,search.length);

			//console.log(sub);

			//console.log('hi');
			/* should probably do some regex here */


			if (dmitri.app.state == dmitri.app.STATE_ATOM_VIEW)
			{
				//
				if (search == name) {
					dmitri.app.atom.build(i, true);
				}
			}
			else if (dmitri.app.state == dmitri.app.STATE_PERIODIC_TABLE)
			{
				//console.log('hi');
				
				/*if (search == sub)
				{
					dmitri.table.highlightSingleElement(i,false);
				}
				else
				{
					dmitri.table.blankSingleElement(i,false);
				}*/
			}
		};
	},
	/* Method Purpose: Handles a mouse down event*/
	 doMousedown: function(event) {
	 	if (this.state == this.STATE_PERIODIC_TABLE)
	 	{
			this.table.doMousedown(event);
	 	}
   },
   /* Method Purpose: Handles a mouse up event*/
   doMouseup: function(e)
   {
   	if (this.state == this.STATE_PERIODIC_TABLE)
		{
	 	this.table.doMouseup(e);
	 	}
  	},
  	/* Method Purpose: Handles the keyboard controls for the tableview*/
  	updateTableCamera:function()
  	{
  		if (dmitri.keydown[dmitri.KEYBOARD["KEY_LEFT"]])
		{
			this.tableCamera.position.x -= this.TABLE_CAMERA_SPEED;
			//console.log(this.tableCamera);
		}
		if (dmitri.keydown[dmitri.KEYBOARD["KEY_RIGHT"]])
		{
			this.tableCamera.position.x += this.TABLE_CAMERA_SPEED;
			//console.log(this.tableCamera);
		}
		if (dmitri.keydown[dmitri.KEYBOARD["KEY_W"]])
		{
			if (this.tableCamera.position.z > 8.6) this.tableCamera.position.z -= this.TABLE_CAMERA_SPEED;
		}
		if (dmitri.keydown[dmitri.KEYBOARD["KEY_S"]])
		{
			if (this.tableCamera.position.z <= 66.2)this.tableCamera.position.z += this.TABLE_CAMERA_SPEED;
		}
		if (dmitri.keydown[dmitri.KEYBOARD["KEY_UP"]])
		{
			this.tableCamera.position.y += this.TABLE_CAMERA_SPEED;
		}
		if (dmitri.keydown[dmitri.KEYBOARD["KEY_DOWN"]])
		{
			this.tableCamera.position.y -= this.TABLE_CAMERA_SPEED;
		}

		if (dmitri.keydown[dmitri.KEYBOARD["KEY_R"]])
		{
			this.tableCamera.position.x = 50;
			this.tableCamera.position.z = 50;
			this.tableCamera.position.y = -25;
		}
  	},
  	/* Method Purpose: Displays the table and hides the appropriate UI elements*/
  	showTable:function()
  	{
  		this.state = this.STATE_PERIODIC_TABLE;

  		document.querySelector(".front-canvas").className = "";
        document.querySelector("#table").className = "front-canvas";
        document.querySelector("#key-wrapper").className = "";
        document.querySelector("#atom-back").className = "hide";
        document.querySelector("#shuffle-elements").className="";
  	},
  	/* Method Purpose: Starts the background music*/
  	startSoundtrack:function()
  	{
  		createjs.Sound.stop();
		createjs.Sound.play("soundtrack",{loop:-1,volume:0.5});
  	},
};