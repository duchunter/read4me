import React, { Component } from 'react';
import { StyleSheet, View, FlatList, StatusBar } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import Tts from 'react-native-tts';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from 'react-native-fs';

import HeaderBar from 'read4me/components/HeaderBar';
import PlayControl from 'read4me/components/PlayControl';
import SeekBar from 'read4me/components/SeekBar';

import { DARK } from 'read4me/config/color';
import font from 'read4me/config/font';

let index = 0;
export default class AppScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      file: '',
      isPlaying: false,
      mode: 0
    }
  }

  componentDidMount() {
    Tts.addEventListener('tts-start', event => {});
    Tts.addEventListener('tts-finish', (event) => {
      this.speak();
    });
    Tts.addEventListener('tts-cancel', event => {});
    Tts.setDefaultLanguage('en-US');
  }

  pickFile = () => {
    index = 0;
    Tts.getInitStatus().then(() => {
      DocumentPicker.show({
        filetype: [DocumentPickerUtil.plainText()],
      },(error,res) => {
        if (!res) return;
        this.setState({ file: res.fileName });
        RNFS.readFile(res.uri, 'utf8').then(buffer => {
          Tts.setDefaultLanguage('en-US');
          let data = buffer.toString().split('\n').join(' ').split('.').filter(text => text);
          this.setState({ data });
          index = 0;
          this.speak();
        }).catch(e => {
          console.log(e);
        });
      });
    }).catch(e => console.log(e));
  }

  speak = () => {
    this.setState({ isPlaying: true });
    let data = this.state.data;
    if (data.length == 0) {
      return;
    }

    if (index == data.length) {
      if (this.state.mode == 2) {
        return;
      }

      index = 0;
    }

    let msg = data[index];
    index += 1;
    Tts.speak(msg);
  }

  render() {
    return (
      <Container>
        <StatusBar backgroundColor={DARK} />
        <HeaderBar
          title={this.state.file || 'No file selected'}
          left={{
            icon: {
              name: 'ios-arrow-down'
            },
            handle: () => {}
          }}
          right={{
            icon: {
              name: 'md-menu'
            },
            handle: this.pickFile
          }}
        />

        <Content bounces={false} contentContainerStyle={styles.container}>
          <FlatList
            bounces={false}
            data={this.state.data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <Text style={styles.text}>
                {item}
              </Text>
            )}
          />
        </Content>

        <SeekBar
          disabled={!this.state.data.length}
          max={this.state.data.length}
          value={index}
          pause={() => {
            Tts.stop();
            this.setState({ isPlaying: false });
          }}
          setValue={value => {
            index = Math.floor(value);
            this.speak();
          }}
        />

        <PlayControl
          isPlaying={this.state.isPlaying}
          forward={() => {
            Tts.stop();
            if (index >= this.state.data.length - 6) {
              index = 0;
            } else {
              index += 5;
              this.speak();
            }
          }}
          backward={() => {
            Tts.stop();
            if (index <= 5) {
              index = 0;
              this.speak();
            } else {
              index -= 5;
              this.speak();
            }
          }}
          play={() => {
            if (index > 0) index -= 1;
            this.speak();
          }}
          pause={() => {
            Tts.stop();
            this.setState({ isPlaying: false });
          }}
          setSpeed={val => {
            Tts.setDefaultRate(val);
          }}
          setMode={mode => {
            this.setState({ mode });
          }}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK,
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 30
  },

  text: {
    fontFamily: font.book,
    color: 'white'
  }
});
