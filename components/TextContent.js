// Props: text, next (string)

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import font from 'read4me/config/font';

export default class TextContent extends Component {
  getNextText = () => {
    let next = this.props.next;
    if (!next) {
      return 'End of file';
    }

    if (next.files) {
      return '(Some code)';
    }

    if (next.img) {
      return '(Image)';
    }

    return next.text;
  }
  
  render() {
    return (
      <View>
        <Text style={styles.text}>
          {this.props.text}
        </Text>

        <Text style={styles.text}>
          {'\n\nNext: ' + this.getNextText()}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontFamily: font.book,
    fontSize: 16,
    lineHeight: 20,
    color: 'white'
  }
});
