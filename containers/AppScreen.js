import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import Tts from 'react-native-tts';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from 'react-native-fs';

let index = 0;
export default class AppScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
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
    let data = this.state.data;
    if (data.length == 0 || index == data.length) {
      return;
    }

    let msg = data[index];
    index += 1;
    Tts.speak(msg);
  }

  render() {
    return (
      <Container>
        <Content>
          <Button onPress={this.pickFile}>
            <Text>Choose file</Text>
          </Button>
          <Button onPress={Tts.stop}>
            <Text>Stop</Text>
          </Button>
          <Button onPress={() => {
            if (index > 0) index -= 1;
            this.speak();
          }}>
            <Text>Resume</Text>
          </Button>
          <View style={{ height: 300, flex: 1 }}>
            <FlatList
              bounces={false}
              data={this.state.data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <Text>{item}</Text>
              )}
            />
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({

});
