// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger"),
cameraStartButton = document.querySelector("#camera--start"),
      cameraStopButton = document.querySelector("#camera--stop");
        //let there be light!
        const btnFlash = document.querySelector('.switch');

// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };
var track = null;

//have a console on mobile
const consoleOutput = document.getElementById("camDiv");
const log = function(msg){
	consoleOutput.innerText = `${consoleOutput.innerText}\n${JSON.stringify(msg)}`;
  console.log(msg);
}

//Test browser support
const SUPPORTS_MEDIA_DEVICES = 'mediaDevices' in navigator;
function startFlash(){
if (SUPPORTS_MEDIA_DEVICES) {
  //Get the environment camera (usually the second one)
  navigator.mediaDevices.enumerateDevices().then(devices => {
  
    const cameras = devices.filter((device) => device.kind === 'videoinput');

    if (cameras.length === 0) {
      log('No camera found on this device.');
    }
	  else
	  {
	 log('Camera found success'); 
	  }
    const camera = cameras[cameras.length - 1];

    // Create stream and get video track
    navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: camera.deviceId,
        facingMode: ['environment', 'user'],
        height: {ideal: 1080},
        width: {ideal: 1920}
      }
    }).then(stream => {
      const track = stream.getVideoTracks()[0];
  cameraView.srcObject = stream;
      //Create image capture object and get camera capabilities
      const imageCapture = new ImageCapture(track)
imageCapture.getPhotoCapabilities().then(capabilities => {
 	 log('Photo capabilities found success'); 

        if (capabilities.torch){
          btnFlash.addEventListener('click', function(){
          	try{
          	 	track.applyConstraints({
           	  	advanced: [{torch: true}]
          	  });
          	} catch(err){
            		log(err);
          	}
          });
        }else{
        	log("No torch found");
		btnFlash.addEventListener('click', function(){
          	try{
          	 	track.applyConstraints({
           	  	advanced: [{torch: false}]
          	  });
          	} catch(err){
            		log(err);
          	}
          });
        }
      });
    }).catch(log);
  }).catch(log);
  
  //The light will be on as long the track exists
  
  
}
}
// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
}
// Take a picture when cameraTrigger is tapped
cameraStartButton.onclick = function() 
{
	 log(' camera started on this device.');
cameraStart();
}

// Take a picture when cameraTrigger is tapped
cameraStopButton.onclick = function() {
	
 track.stop();
		 log(' camera stopped on this device.');

}
          btnFlash.onclick =  function(){
		   log('Flash found on this device. starting');
		 startFlash(); 
	  }

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
    // track.stop();
};
