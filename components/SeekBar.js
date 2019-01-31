// Props: max, value (int)
// setValue, pause (function)
// disabled (bool)

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'native-base';
import Slider from 'react-native-slider';

import { DARK_PRIMARY } from 'read4me/config/color';
import font from 'read4me/config/font';

export default class SeekBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 0,
      speed: 0,
      isPlaying: false
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {`${this.props.value}/${this.props.max}`}
          </Text>
        </View>

        <Slider
          disabled={this.props.disabled}
          maximumValue={this.props.max || 100}
          value={this.props.value}
          onSlidingStart={this.props.pause}
          onSlidingComplete={this.props.setValue}
          minimumTrackTintColor='#fff'
          maximumTrackTintColor='rgba(255, 255, 255, 0.14)'
          thumbStyle={styles.thumb}
          trackStyle={styles.track}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 60,
    maxHeight: 60,
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: DARK_PRIMARY
  },

  textContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  text: {
    fontFamily: font.book,
    fontSize: 14,
    color: 'white'
  },

  track: {
    height: 2,
    borderRadius: 1,
  },

  thumb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  }
});
