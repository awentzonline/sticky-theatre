// jshint devel:true
(function (window, document, undefined) {

var scene,
    camera,
    renderer,
    element,
    container,
    effect,
    controls,
    clock,
    video, videoImage, videoImageContext, videoTexture;

init();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1.0, 4000);
  camera.position.set(1, 0, 0);

  scene.add(camera);

  renderer = new THREE.WebGLRenderer({ antialiasing: true });
  // renderer.shadowMapEnabled = true;
  // renderer.shadowCameraNear = 3;
  // renderer.shadowCameraFar = camera.far;
  // renderer.shadowCameraFov = 50;
  // renderer.shadowMapBias = 0.0039;
  // renderer.shadowMapDarkness = 0.5;
  // renderer.shadowMapWidth = 1024;
  // renderer.shadowMapHeight = 1024;
  renderer.setClearColor(0xffffff);

  element = renderer.domElement;
  container = document.getElementById('scene');
  container.appendChild(element);
  effect = new THREE.StereoEffect(renderer);
  // Our initial control fallback with mouse/touch events in case DeviceOrientation is not enabled
  controls = new THREE.MouseControls(camera);
  // Our preferred controls via DeviceOrientation
  function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }
    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();
    element.addEventListener('click', fullscreen, false);
    window.removeEventListener('deviceorientation', setOrientationControls, true);
  }
  window.addEventListener('deviceorientation', setOrientationControls, true);
  window.addEventListener('resize', resize, true);
  window.addEventListener('click', toggleVideoPlay);
  resize();
  createScene();
  clock = new THREE.Clock();
  animate();
}

function createScene() {
  // Lighting
  var ambLight = new THREE.AmbientLight(0xaaaaaa);
  var levelFilename = 'theatre0.json';
  scene.add(ambLight);
  scene.fog = new THREE.FogExp2( 0xffffff, 0.0025 );

  setupVideoTexture();

  var loader = new THREE.ObjectLoader();
  loader.load('models/' + levelFilename, function (level) {
    level.traverse( function( node ) { if (node instanceof THREE.Mesh || true) { node.castShadow = true; node.receiveShadow = true; } } );
    level.scale.set(3, 3, 3);
    level.traverse(function(node) {
      switch (node.name) {
        case 'screen':
          var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
          node.material = movieMaterial;
          camera.lookAt(node.position);
          break;
        case 'viewer':
          node.visible = false;
          camera.position.copy(node.position);
          break;
        default:
          break;
      }
    });
    //var bbox = new THREE.Box3().setFromObject(level);
    scene.add(level);
  });
  //setupMovieMesh();
}

function setupVideoTexture() {
  // From: https://stemkoski.github.io/Three.js/Video.html
  ///////////
	// VIDEO //
	///////////

	// create the video element
	video = document.createElement( 'video' );
  video.loop = true;
	// video.id = 'video';
	// video.type = ' video/ogg; codecs="theora, vorbis" ';
	video.src = "videos/test7.mp4";
	video.load(); // must call after setting/changing source

	// alternative method --
	// create DIV in HTML:
	// <video id="myVideo" autoplay style="display:none">
	//		<source src="videos/sintel.ogv" type='video/ogg; codecs="theora, vorbis"'>
	// </video>
	// and set JS variable:
	// video = document.getElementById( 'myVideo' );

	videoImage = document.createElement( 'canvas' );
	videoImage.width = 480;
	videoImage.height = 320;

	videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	videoImageContext.fillStyle = '#000000';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
}

function setupMovieMesh() {
	var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
	// the geometry on which the movie will be displayed;
	// 		movie image will be scaled to fit these dimensions.
	var movieGeometry = new THREE.PlaneGeometry( 240, 160, 4, 4 );
	var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
	movieScreen.position.set(0, 50, 0);
	scene.add(movieScreen);


}

function toggleVideoPlay() {
  // gotta get that click on mobile
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}


function animate() {
  var elapsedSeconds = clock.getElapsedTime();
  var dt = clock.getDelta();
  requestAnimationFrame(animate);

  update(dt);
  render(dt);
}

function resize() {
  var width = container.offsetWidth;
  var height = container.offsetHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  effect.setSize(width, height);
}

function update(dt) {
  camera.updateProjectionMatrix();
  controls.update(dt);
}

function render(dt) {
  if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
		videoImageContext.drawImage( video, 0, 0 );
		if ( videoTexture ) {
			videoTexture.needsUpdate = true;
    }
	}
  effect.render(scene, camera);
}

function fullscreen() {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}

})(window, document, undefined);
