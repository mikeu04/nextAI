// Convert user's speech to texts.

import { Button } from "antd";
import { AudioOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Speech from "speak-tts"; // convert text to speech

const VoiceInterface = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [speech, setSpeech] = useState();

  //   speech recognition

  //   using destruct解构语法 destruct the returning value of useSpeechRecognition()
  //   and store as variables in {...}
  const {
    transcript,
    listening,
    resetTranscript,
    browswerSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  //   Testing
  console.log("browser support:", browswerSupportsSpeechRecognition);
  console.log("microphone available:", isMicrophoneAvailable);

  useEffect(() => {
    const speech = new Speech();
    speech
      .init({
        volume: 1,
        lang: "en-US",
        rate: 1,
        pitch: 1,
        voice: "Google US English",
        splitSentences: true,
      })
      .then((data) => {
        // The "data" object contains the list of available voices and the voice synthesis params
        console.log("Speech is ready, voices are available", data);
        setSpeech(speech);
      })
      .catch((e) => {
        console.error("An error occured while initializing : ", e);
      });
  }, []);

  useEffect(() => {
    if (!listening && !!transcript) {
      console.log(transcript);
      setIsRecording(false);
    }
  }, [listening, transcript]);

  const talk = (what2say) => {
    speech
      .speak({
        text: what2say,
        queue: false, // current speech will be interrupted,
        listeners: {
          onstart: () => {
            console.log("Start utterance");
          },
          onend: () => {
            console.log("End utterance");
          },
          onresume: () => {
            console.log("Resume utterance");
          },
          onboundary: (event) => {
            console.log(
              event.name +
                " boundary reached after " +
                event.elapsedTime +
                " milliseconds."
            );
          },
        },
      })
      .then(() => {
        // if everyting went well, start listening again
        console.log("Success !");
        userStartConvo();
      })
      .catch((e) => {
        console.error("An error occurred :", e);
      });
  };

  const userStartConvo = () => {
    SpeechRecognition.startListening();
    setIsRecording(true);
    resetEverything();
  };

  const resetEverything = () => {
    resetTranscript();
  };

  const recordingClickHandler = () => {
    if (isRecording) {
      setIsRecording(false);
      SpeechRecognition.stopListening();
    } else {
      setIsRecording(true);
      SpeechRecognition.startListening();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        // set the distance between the bottom edge of the button and the bottom edge of its container to be #% of the user's windowHeight
        bottom: "15vh",
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Button
        type="primary"
        icon={<AudioOutlined />}
        sizse="large"
        danger={isRecording}
        onClick={recordingClickHandler}
        style={{ marginLeft: "5px" }}
      >
        {isRecording ? "Stop Recording..." : "Click to record"}
      </Button>
    </div>
  );
};

export default VoiceInterface;
