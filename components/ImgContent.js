// Props: uri (string)

import React, { Component } from 'react';
import { StyleSheet, Image, Text } from 'react-native';

import font from 'read4me/config/font';

export default class ImgContent extends Component {
  render() {
    return this.props.uri ? (
      <Image
        style={{ height: 400 }}
        resizeMode={'contain'}
        source={{ uri: this.props.uri }}
      />
    ) : (
      <Text style={{
        fontFamily: font.book,
        fontSize: 16,
        lineHeight: 20,
        color: 'white'
      }}>
        No URL specified
      </Text>
    )
  }
}
