import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input } from "antd";
import { AudioOutlined } from "@ant-design/icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Speech from "speak-tts";

const { Search } = Input;

const DOMAIN = "http://localhost:5001";

const searchContainer = {
  display: "flex",
  justifyContent: "center",
};

const ChatComponent = (props) => {
  const { handleResp, isLoading, setIsLoading } = props;

  // Define a state variable to keep track of the search value
  const [searchValue, setSearchValue] = useState("");
  const [isChatModeOn, setIsChatModeOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speech, setSpeech] = useState();

  // speech recognation
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

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

  // If the user stops talking, stop recording
  // useEffect(() => {
  //   if (!listening && !!transcript) {
  //     (async () => await onSearch(transcript))();
  //     setIsRecording(false);
  //   }
  // }, [listening, transcript]);

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
        // userStartConvo();

        // Currently, user must click record again to start recording
        // To use the original way (user no need to click record again, comment this line and uncomment the above and the below function userStartConvo)
        resetEverything();
      })
      .catch((e) => {
        console.error("An error occurred :", e);
      });
  };

  // if everyting went well, start listening again
  // const userStartConvo = () => {
  //   SpeechRecognition.startListening();
  //   setIsRecording(true);
  //   resetEverything();
  // };

  const resetEverything = () => {
    resetTranscript();
  };

  const chatModeClickHandler = () => {
    setIsChatModeOn(!isChatModeOn);
    setIsRecording(false);
    SpeechRecognition.stopListening();
  };

  const recordingClickHandler = () => {
    if (isRecording) {
      setIsRecording(false);
      SpeechRecognition.stopListening();
      onSearch(transcript);
    } else {
      setIsRecording(true);
      SpeechRecognition.startListening();
    }
  };

  const onSearch = async (question) => {
    // Clear the search input when the user click "Search"
    setSearchValue("");
    setIsLoading(true);

    //After user clicks "Search", call API to get search result as response
    try {
      const response = await axios.get(`${DOMAIN}/chat`, {
        params: {
          question,
        },
      });
      handleResp(question, response.data);
      if (isChatModeOn) {
        talk(response.data);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
      handleResp(question, error);
    } finally {
      setIsLoading(false);
    }
  };

  //   obtain user's input everytime the user types in search box,
  //   and render search box accordingly
  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div style={searchContainer}>
      {!isChatModeOn && (
        <Search
          placeholder="Ask anything about the document you uploaded.."
          enterButton="Search"
          size="large"
          onSearch={onSearch}
          loading={isLoading}
          value={searchValue} // Control the value
          onChange={handleChange} // Update the value when changed
        />
      )}
      <Button
        type="primary"
        size="large"
        danger={isChatModeOn}
        onClick={chatModeClickHandler}
        style={{ marginLeft: "5px" }}
      >
        Chat Mode: {isChatModeOn ? "On" : "Off"}
      </Button>
      {isChatModeOn && (
        <Button
          type="primary"
          icon={<AudioOutlined />}
          size="large"
          danger={isRecording}
          onClick={recordingClickHandler}
          style={{ marginLeft: "5px" }}
        >
          {isRecording ? "Stop Recording.." : "Click to record"}
        </Button>
      )}
    </div>
  );
};

export default ChatComponent;
