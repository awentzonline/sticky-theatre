!function(a,b){function c(){function c(b){b.alpha&&(r=new THREE.DeviceOrientationControls(m,!0),r.connect(),r.update(),o.addEventListener("click",k,!1),a.removeEventListener("deviceorientation",c,!0))}l=new THREE.Scene,m=new THREE.PerspectiveCamera(60,a.innerWidth/a.innerHeight,1,4e3),m.position.set(1,0,0),l.add(m),n=new THREE.WebGLRenderer({antialias:!0}),n.setClearColor(16777215),o=n.domElement,p=b.getElementById("scene"),p.appendChild(o),q=new THREE.StereoEffect(n),r=new THREE.MouseControls(m),a.addEventListener("deviceorientation",c,!0),a.addEventListener("resize",h,!0),a.addEventListener("click",f),h(),d(),s=new THREE.Clock,g()}function d(){var a=new THREE.AmbientLight(11184810),b="theatre0.json";l.add(a),l.fog=new THREE.FogExp2(16777215,.0025),e();var c=new THREE.ObjectLoader;c.load("models/"+b,function(a){a.traverse(function(a){a instanceof THREE.Mesh,0||(a.castShadow=!0,a.receiveShadow=!0)}),a.scale.set(3,3,3),a.traverse(function(a){switch(a.name){case"screen":var b=new THREE.MeshBasicMaterial({map:w,overdraw:!0,side:THREE.DoubleSide});a.material=b,m.lookAt(a.position);break;case"viewer":a.visible=!1,m.position.copy(a.position)}}),l.add(a)})}function e(){t=b.createElement("video"),t.loop=!0,t.src="videos/test7.mp4",t.load(),u=b.createElement("canvas"),u.width=480,u.height=320,v=u.getContext("2d"),v.fillStyle="#000000",v.fillRect(0,0,u.width,u.height),w=new THREE.Texture(u),w.minFilter=THREE.LinearFilter,w.magFilter=THREE.LinearFilter}function f(){t.paused?t.play():t.pause()}function g(){var a=(s.getElapsedTime(),s.getDelta());requestAnimationFrame(g),i(a),j(a)}function h(){var a=p.offsetWidth,b=p.offsetHeight;m.aspect=a/b,m.updateProjectionMatrix(),n.setSize(a,b),q.setSize(a,b)}function i(a){m.updateProjectionMatrix(),r.update(a)}function j(){t.readyState===t.HAVE_ENOUGH_DATA&&(v.drawImage(t,0,0),w&&(w.needsUpdate=!0)),q.render(l,m)}function k(){p.requestFullscreen?p.requestFullscreen():p.msRequestFullscreen?p.msRequestFullscreen():p.mozRequestFullScreen?p.mozRequestFullScreen():p.webkitRequestFullscreen&&p.webkitRequestFullscreen()}var l,m,n,o,p,q,r,s,t,u,v,w;c()}(window,document,void 0);