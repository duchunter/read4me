// Props:
// currentMode (string)
// close, changeMode (function)

import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';

import { DARK_SECONDARY, BLUE_PRIMARY } from 'read4me/config/color';
import { DOC_MODE } from 'read4me/config/constants';
import font from 'read4me/config/font';

export default class DrawerContent extends React.Component {
  parseTitle = (text) => {
    let title = text.toLowerCase().split('_').join(' ');
    return title[0].toUpperCase() + title.slice(1);
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>
          Mode:
        </Text>

        {
          DOC_MODE.map(mode => (
            <Text
              key={mode}
              onPress={() => {
                if (this.props.currentMode != mode) {
                  this.props.changeMode(mode);
                }
                this.props.close();
              }}
              style={[
                styles.text,
                {
                  color: this.props.currentMode == mode ? BLUE_PRIMARY : 'white'
                }
              ]}
            >
              {this.parseTitle(mode)}
            </Text>
          ))
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '5%',
    backgroundColor: DARK_SECONDARY
  },

  title: {
    fontFamily: font.medium,
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20,
    color: 'white',
  },

  text: {
    fontFamily: font.book,
    fontSize: 16,
    color: 'white',
    marginBottom: 10
  }
});
