import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Pressable} from 'react-native';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { Audio } from 'expo-av';
import * as FileSystem from  "expo-file-system";
import { writeAudioToFile } from '../utils/writeAudioTFile';
import { playFromPath } from '../utils/playFromPath';
import { fetchAudio } from '../utils/fetchAudio';




export default function SpeechToText() {
  const [borderColor,setBorderColor] = useState<"lightgray" | "lightgreen"> ( "lightgray");

  const [urlPath,setUrlPath] = useState("");
  const {state,startRecognizing,stopRecognizing,destoryRecognizer} = useVoiceRecognition();

    const listFiles = async ()=>{
      try{
        const result = await FileSystem.readAsStringAsync(
          FileSystem.documentDirectory + "/voiceRecording.txt",
        );
        if (result.length > 0) {
          const filename = result [0];
          const path = FileSystem.documentDirectory+filename;
          setUrlPath(path)
        }
      }catch (e){console.log('error', e)}
    };

  const handleSubmit = async () =>{
    if (!state.results [0]) return;
    try{
      //fetch the audio data file from the server(Blob data)
      const audioBlob = await fetchAudio(state.results[0]);

      const reader = new FileReader()
      reader.onload = async (e) => {
        if (e.target && typeof e.target.result === "string"){
          //actual data going to split  and process here
          const audioData = e.target.result.split(",")[1];
          //save data
          const path = await writeAudioToFile(audioData);
          // play audio
          setUrlPath(path);
          await playFromPath (path);
          destoryRecognizer();
        }
      };
      reader.readAsDataURL(audioBlob);
    }catch(e) {
      console.log(e);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{fontSize: 32, fontWeight:"bold", marginBottom: 30}}>InSync</Text>
      <Text style= {{textAlign: "center", color:"#333333", marginBottom: 5, fontSize: 12}}>Lorem ipsum dolor sit amet, consectetur adipisicing. </Text>
      
      
      <Pressable
      onPressIn={ () => {
        setBorderColor("lightgreen");
        startRecognizing();
      }}
      onPressOut={ () => {
        setBorderColor("lightgray");
        stopRecognizing();
        handleSubmit();
      }}
      style={{
        width:"50%",
        padding: 20,
        gap: 10,
        borderWidth: 5,
        alignItems:'center',
        borderRadius:10,
        borderColor: borderColor,
      }}>
      <Text>button </Text>
      </Pressable>
      <Text style={{marginVertical: 10, fontSize: 17}}>{JSON.stringify(state,null,2)}</Text>
      
      

    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor:"F5FCFF",
  },
});
