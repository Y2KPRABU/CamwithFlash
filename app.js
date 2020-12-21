
//have a console on mobile
const consoleOutput = document.getElementById("camDiv");
const log = function(msg){
	consoleOutput.innerText = `${consoleOutput.innerText}\n${JSON.stringify(msg)}`;
  console.log(msg);
}

//Test browser support
const SUPPORTS_MEDIA_DEVICES = 'mediaDevices' in navigator;

if (SUPPORTS_MEDIA_DEVICES) {
  //Get the environment camera (usually the second one)
  navigator.mediaDevices.enumerateDevices().then(devices => {
  
    const cameras = devices.filter((device) => device.kind === 'videoinput');

    if (cameras.length === 0) {
      log('No camera found on this device.');
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

      //Create image capture object and get camera capabilities
      const imageCapture = new ImageCapture(track)
imageCapture.getPhotoCapabilities().then(capabilities => {
 
        //let there be light!
        const btn = document.querySelector('.switch');
        if (capabilities.torch){
          btn.addEventListener('click', function(){
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
        }
      });
    }).catch(log);
  }).catch(log);
  
  //The light will be on as long the track exists
  
  
}
