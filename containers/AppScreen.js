import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, StatusBar, DrawerLayoutAndroid } from 'react-native';
import { Container, Content } from 'native-base';

import Tts from 'react-native-tts';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from 'react-native-fs';

import HeaderBar from 'read4me/components/HeaderBar';
import PlayControl from 'read4me/components/PlayControl';
import SeekBar from 'read4me/components/SeekBar';
import DrawerContent from 'read4me/components/DrawerContent';
import TextContent from 'read4me/components/TextContent';
import ImgContent from 'read4me/components/ImgContent';
import CodeContent from 'read4me/components/CodeContent';

import { WIDTH } from 'read4me/config/constants';
import { DARK_PRIMARY } from 'read4me/config/color';

import {
  transformTextFile, transformMediumPost
} from 'read4me/utils/transformer'

let index = 0;
export default class AppScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{}],
      file: '',
      isPlaying: false,
      playingMode: 0,
      docMode: 'TEXT',
      display: 'text'
    }
  }

  componentDidMount() {
    Tts.addEventListener('tts-start', event => {});
    Tts.addEventListener('tts-finish', (event) => {
      if (this.state.display != 'text') {
        this.setState({ isPlaying: false });
        return;
      }

      this.speak();
    });
    Tts.addEventListener('tts-cancel', event => {});
    Tts.setDefaultLanguage('en-US');
  }

  pickFile = () => {
    index = 0;
    Tts.getInitStatus().then(() => {
      DocumentPicker.show({
        filetype: [DocumentPickerUtil.allFiles()],
      }, (error,res) => {
        if (
          !res
          || (
            !res.fileName.endsWith('.txt')
            && !res.fileName.endsWith('.json')
          )
        ) {
          return;
        }

        this.setState({ file: res.fileName });
        RNFS.readFile(res.uri, 'utf8').then(buffer => {
          Tts.setDefaultLanguage('en-US');
          let data;
          switch (this.state.docMode) {
            case 'TEXT':
              data = transformTextFile(buffer);
              break;

            case 'MEDIUM_POST':
              data = transformMediumPost(buffer);
          }

          data.unshift({});
          this.setState({ data });
          index = 0;
          this.speak();
        }).catch(e => {
          alert(e);
        });
      });
    }).catch(e => alert(e));
  }

  speak = () => {
    index += 1;
    if (!this.state.isPlaying) {
      this.setState({ isPlaying: true });
    }

    let data = this.state.data;
    if (data.length == 1) {
      return;
    }

    if (index == data.length) {
      if (this.state.playingMode == 2) {
        return;
      }

      index = 0;
    }

    let next = data[index];
    if (next) {
      if (next.img) {
        Tts.speak('We have a picture');
        this.setState({ display: 'img' });
        return;
      }

      if (next.files) {
        Tts.speak('We have some code');
        this.setState({ display: 'code' });
        return;
      }

      this.setState({ display: 'text' });
      Tts.speak(next.text || '');
    }
  }

  render() {
    return (
      <DrawerLayoutAndroid
        ref={ref => this._drawer = ref}
        drawerWidth={Math.min(WIDTH * 0.75, 300)}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => (
          <DrawerContent
            currentMode={this.state.docMode}
            close={() => this._drawer.closeDrawer()}
            changeMode={mode => this.setState({ docMode: mode })}
          />
        )}
      >
        <Container>
          <StatusBar backgroundColor={DARK_PRIMARY} />
          <HeaderBar
            title={this.state.file || 'No file selected'}
            left={{
              icon: {
                name: 'md-menu'
              },
              handle: () => this._drawer.openDrawer()
            }}
            right={{
              icon: {
                name: 'md-folder'
              },
              handle: this.pickFile
            }}
          />

          <Content bounces={false} contentContainerStyle={styles.container}>
            <ScrollView bounces={false}>
              {
                this.state.display == 'text' && (
                  <TextContent
                    text={this.state.data[index] && this.state.data[index].text}
                    next={this.state.data[index + 1]}
                  />
                )
              }

              {
                this.state.display == 'img' && (
                  <ImgContent uri={this.state.data[index].img} />
                )
              }

              {
                this.state.display == 'code' && (
                  <CodeContent files={this.state.data[index].files}/>
                )
              }

            </ScrollView>
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
              this.speak();
            }}
            pause={() => {
              Tts.stop();
              if (index > 0) index -= 1;
              this.setState({ isPlaying: false });
            }}
            setSpeed={val => {
              Tts.setDefaultRate(val);
            }}
            setMode={mode => {
              this.setState({ playingMode: mode });
            }}
          />
        </Container>
      </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_PRIMARY,
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 30
  }
});
