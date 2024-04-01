// Import necessary modules from React Native
import React, { Component } from 'react';
import { View, Text, Pressable, StyleSheet, Image, TouchableOpacity } from 'react-native';
// Import responsive screen library for percentage-based dimensions
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// Import voice recognition module
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from "@react-native-voice/voice";

// Define types for props and state
type Props = {
  onSpeechStart: () => void;
  onSpeechEnd: (result: any[]) => void;
  logout: () => Promise<void>; // Add logout prop
};

type State = {
  recognized: string;
  pitch: string;
  error: string;
  end: string;
  started: boolean;
  results: string[];
  partialResults: string[];
  recording: boolean;
  res: string;
};

class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // Initialize state
    this.state = {
      recognized: "",
      pitch: "",
      error: "",
      end: "",
      started: false,
      results: [],
      partialResults: [],
      recording: false,
      res: "",
    };
    // Bind event handlers
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }

  // Remove event listeners when component is unmounted
  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  componentDidMount() {
    // Additional initialization if needed
  }

  // Event handlers for speech recognition
  onSpeechStart = (e: any) => {
    console.log("onSpeechStart: ", e);
    this.setState({
      started: true,
    });
  };

  onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    console.log("onSpeechRecognized: ", e);
    this.setState({
      recognized: "√",
    });
  };

  onSpeechEnd = (e: any) => {
    console.log("onSpeechEnd: ", e);
    this.setState({
      end: "√",
      started: false,
    });
    this.props.onSpeechEnd(this.state.results);
  };

  onSpeechError = (e: SpeechErrorEvent) => {
    console.log("onSpeechError: ", e);
    this.setState({
      error: JSON.stringify(e.error),
    });
  };

  onSpeechResults = (e: SpeechResultsEvent) => {
    console.log("onSpeechResults: ", e);
    this.setState({
      results: e.value!,
    });
  };

  onSpeechPartialResults = (e: SpeechResultsEvent) => {
    console.log("onSpeechPartialResults: ", e);
    this.setState({
      partialResults: e.value!,
    });
  };

  onSpeechVolumeChanged = (e: any) => {
    console.log("onSpeechVolumeChanged: ", e);
    this.setState({
      pitch: e.value,
    });
  };

  // Start speech recognition
  _startRecognizing = async () => {
    this.setState({
      recognized: "",
      pitch: "",
      error: "",
      started: false,
      results: [],
      partialResults: [],
      end: "",
    });
    try {
      await Voice.start("en-US");
      this.props.onSpeechStart();
      // Send recognized text to API
      Voice.onSpeechResults = (e: SpeechResultsEvent) => {
        if (e.value && e.value.length > 0) {
          const recognizedText = e.value[0];
          this.sendToAPI(recognizedText);
        }
      };
    } catch (e) {
      console.error(e);
    }
  };

  // Send recognized text to API
  sendToAPI = async (text: string) => {
    try {
      const response = await fetch('https://voice.api.globalmarketplaceapps.com/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      // Handle the response from the API
      this.handleAPIResponse(data);
    } catch (error) {
      console.error('Error sending to API:', error);
    }
  };

  // Handle API response
  handleAPIResponse = (response: any) => {
    this.setState({ res: response });
  };

  // Stop speech recognition
  _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  // Cancel speech recognition
  _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  // Destroy speech recognizer
  _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    this.setState({
      recognized: "",
      pitch: "",
      error: "",
      started: false,
      results: [],
      partialResults: [],
      end: "",
    });
  };

  // Render recording button
  renderRecordingButton = () => {
    if (this.state.recording) {
      return (
        <TouchableOpacity onPress={this.handleRecordingToggle}>
          <Image
            source={require('../../public/images/voiceLoading.gif')}
            style={styles.recordingIcon}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={this.handleRecordingToggle}>
          <Image
            source={require('../../public/images/recordingIcon.png')}
            style={styles.recordingIcon}
          />
        </TouchableOpacity>
      );
    }
  };

  // Handle logout
  handleLogout = async () => {
    await this.props.logout();
  };

  // Handle recording toggle
  handleRecordingToggle = () => {
    this.setState({ recording: true });
    this._startRecognizing();
    setTimeout(() => {
      this.setState({ recording: false });
    }, 5000);
  };

  // Render component
  render(): React.ReactNode {
    return (
      <View style={styles.maincontainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: wp(4), marginTop: hp(2) }}>
          <Pressable onPress={this.handleLogout}>
            <Text style={{ color: 'blue', fontWeight: 'bold' }}>Sign Out</Text>
          </Pressable>
        </View>

        <View style={styles.logoContainer}>
          <Image source={require('../../public/images/logo.png')} style={styles.logo} />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Hi! I'm Cloudy</Text>
          <Text style={{ fontSize: hp(2), fontWeight: '500', color: '#6B7280', textAlign: 'center', marginTop: hp(1), margin: hp(1) }}>Now you can interact with our AI agent to get answers for your queries!</Text>
        </View>

        <View style={styles.messageContainer}>
          <View style={styles.cardContainer}>
            <View style={styles.cardContent}>
              <Image source={require('../../public/images/logo.png')} style={styles.cardlogo} />
              <View style={styles.textContainer}>
                <Text style={styles.cardText}>Loan Calculation</Text>
                <Text style={styles.cardTextTwo}>Empowering your financial decisions with smart numbers!</Text>
              </View>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.cardContent}>
              <Image source={require('../../public/images/logo.png')} style={styles.cardlogo} />
              <View style={styles.textContainer}>
                <Text style={styles.cardText}>Stop unauthorized transactions</Text>
                <Text style={styles.cardTextTwo}>Notify your bank immediately to prevent any more unauthorised transactions</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {this.renderRecordingButton()}
        </View>
        <View>{this.state.res}</View>
      </View>
    );
  }
}

// Styles for the component
const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: hp(5),
  },
  logo: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
  },
  titleContainer: {
    flex: 1,
    marginTop: hp(2),
  },
  title: {
    fontSize: wp(5),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#374151',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(2),
    marginLeft: hp(1),
    marginRight: hp(1),
  },
  recordingIcon: {
    width: hp(12),
    height: hp(12),
    borderRadius: hp(5),
  },
  messageContainer: {
    alignItems: 'stretch',
    marginBottom: hp(10),
  },
  cardContainer: {
    backgroundColor: '#F3E5F5',
    padding: wp(4),
    borderRadius: wp(5),
    margin: hp(2),
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: wp(2),
  },
  cardlogo: {
    height: hp(4),
    width: hp(4),
    borderRadius: hp(2),
    marginRight: wp(5),
  },
  textContainer: {
    flex: 1,
  },
  cardText: {
    fontSize: wp(4.8),
    fontWeight: 'bold',
    color: '#374151',
  },
  cardTextTwo: {
    fontSize: wp(4.2),
    color: '#6B7280',
  },
});

export default Home;
