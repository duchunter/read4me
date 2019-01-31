// Props: play, pause, setSpeed, setMode, forward, backward (function)
// isPlaying (bool)

import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Icon, Text } from 'native-base';

import font from 'read4me/config/font';
import { DARK_PRIMARY } from 'read4me/config/color';

const PlayMode = [
  {
    type: 'MaterialIcons',
    name: 'repeat'
  },
  {
    type: 'MaterialIcons',
    name: 'repeat-one'
  },
  {
    type: 'MaterialIcons',
    name: 'shuffle'
  },
];

const PlaySpeed = [
  {
    name: 'x1',
    val: 0.5
  },
  {
    name: 'x1.25',
    val: 0.5 * 1.25
  },
  {
    name: 'x1.5',
    val: 0.5 * 1.5
  },
  {
    name: 'x0.5',
    val: 0.5 * 0.5
  },
  {
    name: 'x0.75',
    val: 0.5 * 0.75
  },
];

export default class PlayControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 0,
      speed: 0
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* Random/Repeat/Repeat All */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            let mode = this.state.mode;
            mode = (mode == PlayMode.length - 1) ? 0 : mode + 1;
            this.setState({ mode });
          }}
        >
          <Icon
            type={PlayMode[this.state.mode].type}
            name={PlayMode[this.state.mode].name}
            style={styles.smallIcon}
          />
        </TouchableOpacity>

        {/* Prev */}
        <TouchableOpacity
          onPress={this.props.backward}
          style={styles.button}
        >
          <Icon
            type={'MaterialIcons'}
            name={'skip-previous'}
            style={styles.mediumIcon}
          />
        </TouchableOpacity>

        {/* Stop/Start */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.props.isPlaying ? this.props.pause() : this.props.play();
          }}
        >
          {
            this.props.isPlaying ? (
              <Icon
                type={'MaterialIcons'}
                name={'pause-circle-outline'}
                style={styles.bigIcon}
              />
            ) : (
              <Icon
                type={'MaterialIcons'}
                name={'play-circle-outline'}
                style={styles.bigIcon}
              />
            )
          }
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity
          onPress={this.props.forward}
          style={styles.button}
        >
          <Icon
            type={'MaterialIcons'}
            name={'skip-next'}
            style={styles.mediumIcon}
          />
        </TouchableOpacity>

        {/* Speed */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            let speed = this.state.speed;
            speed = (speed == PlaySpeed.length - 1) ? 0 : speed + 1;
            this.setState({ speed });
            this.props.setSpeed(PlaySpeed[speed].val)
          }}
        >
          <Text style={styles.speedText}>
            {PlaySpeed[this.state.speed].name}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    minHeight: 100,
    maxHeight: 100,
    backgroundColor: DARK_PRIMARY
  },

  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  speedText: {
    fontSize: 15,
    color: 'white',
    fontFamily: font.medium
  },

  smallIcon: {
    fontSize: 23,
    color: 'white'
  },

  mediumIcon: {
    fontSize: 37,
    color: 'white'
  },

  bigIcon: {
    fontSize: 71,
    color: 'white'
  }
});
