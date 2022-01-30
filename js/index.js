//const { type } = require("express/lib/response");

// required dom elements
const buttonEl = document.getElementById('button');
const messageEl = document.getElementById('message');
const titleEl = document.getElementById('real-time-title');

const garlicBool = document.getElementById('garlic');



// set initial state of application variables
messageEl.style.display = 'none';
let isRecording = false;
let socket;
let recorder;

// Ingredients
const ingredients = ["4 Tablespoons butter or olive oil",
  "1 medium onion, peeled and diced",
  "2 medium carrots, peeled and diced",
  "2 celery stalks, diced",
  "4 cloves garlic, peeled and minced",
  "4 ounces button or baby bella mushrooms, diced",
  "1/3 cup all-purpose or white whole wheat flour",
  "3 cups chicken stock",
  "2 cups milk",
  "3 cups shredded cooked chicken",
  "1 pound Yukon gold potatoes, diced",
  "1 cup frozen corn",
  "1 cup frozen peas",
  "1 teaspoon Italian seasoning, homemade or store-bought",
  "1/2 teaspoon salt",
  "1/2 teaspoon freshly-cracked black pepper"
]

const regex = /[^A-Za-z0-9]/g;

function queryIngredient(words) {
  console.log(words);
  ingredients.forEach(function (item, index) {
    ingredientsList = item.split(' ');
    const cleanedIngredients = ingredientsList.map(element => {
      return element.replace(regex, "");
    });
    const filteredArray = cleanedIngredients.filter(value => words.includes(value));
    console.log(filteredArray);
    if (filteredArray.length > 0) {
      return item[index];
    }
  });
  return null;
}

// runs real-time transcription and handles global variables
const run = async () => {
  if (isRecording) { 
    if (socket) {
      socket.send(JSON.stringify({terminate_session: true}));
      socket.close();
      socket = null;
    }

    if (recorder) {
      recorder.pauseRecording();
      recorder = null;
    }
  } else {
    const response = await fetch('http://localhost:8000'); // get temp session token from server.js (backend)
    const data = await response.json();

    if(data.error){
      alert(data.error)
    }
    
    const { token } = data;

    // establish wss with AssemblyAI (AAI) at 16000 sample rate
    socket = await new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);

    // handle incoming messages to display transcription to the DOM
    const texts = {};
    socket.onmessage = (message) => {
      let msg = '';
      const res = JSON.parse(message.data);
      texts[res.audio_start] = res.text;
      const keys = Object.keys(texts);
      keys.sort((a, b) => a - b);
      for (const key of keys) {
        if (texts[key]) {
          msg += ` ${texts[key]}`;
        }
      }
      messageEl.innerText = msg;
      ingredientDetails = queryIngredient(msg.split(' '));

      if (ingredientDetails) {
        buttonEl.addEventListener("start", function(){
          var speech = new SpeechSynthesisUtterance();
          speech.text = ingredientDetails;
          window.speechSynthesis.speak(speech);
      
          console.log("here")
      }, false);
      }

      

      // TTS queryIngredient(msg);
    };

    socket.onerror = (event) => {
      console.error(event);
      socket.close();
    }
    
    socket.onclose = event => {
      console.log(event);
      socket = null;
    }

    socket.onopen = () => {
      // once socket is open, begin recording
      messageEl.style.display = '';
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          recorder = new RecordRTC(stream, {
            type: 'audio',
            mimeType: 'audio/webm;codecs=pcm', // endpoint requires 16bit PCM audio
            recorderType: StereoAudioRecorder,
            timeSlice: 250, // set 250 ms intervals of data that sends to AAI
            desiredSampRate: 16000,
            numberOfAudioChannels: 1, // real-time requires only one channel
            bufferSize: 4096,
            audioBitsPerSecond: 128000,
            ondataavailable: (blob) => {
              const reader = new FileReader();
              reader.onload = () => {
                const base64data = reader.result;

                // audio data must be sent as a base64 encoded string
                if (socket) {
                  socket.send(JSON.stringify({ audio_data: base64data.split('base64,')[1] }));
                }
              };
              reader.readAsDataURL(blob);
            },
          });

          recorder.startRecording();
        })
        .catch((err) => console.error(err));
    };
  }

  isRecording = !isRecording;
  buttonEl.innerText = isRecording ? 'Stop' : 'Record';
  titleEl.innerText = isRecording ? 'Click stop to end recording!' : 'Click start to begin recording!'
};

buttonEl.addEventListener('click', () => run());
