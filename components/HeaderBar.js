// Props: left/right { icon: { type, name }, handle: (function), disabled }
// title (text)
// style (obj)

import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Icon, Text } from 'native-base';

import font from 'read4me/config/font';
import { DARK_PRIMARY } from 'read4me/config/color';

export default class HeaderBar extends React.Component {
  render() {
    return (
      <View style={[styles.container, {...this.props.style}]}>
        {/* Left icon */}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={this.props.left.handle}
          disabled={!this.props.left || this.props.left.disabled}
        >
          {
            this.props.left ? (
              <Icon
                type={this.props.left.icon.type || 'Ionicons'}
                name={this.props.left.icon.name}
                style={[styles.icon, {
                  color: this.props.left.disabled
                    ? 'rgba(255, 255, 255, 0.4)'
                    : 'white'
                }]}
              />
            ) : null
          }
        </TouchableOpacity>

        {/* Body */}
        <View style={styles.body}>
          <Text numberOfLines={1} style={styles.text}>
            {this.props.title}
          </Text>
        </View>

        {/* Right icon */}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={this.props.right.handle}
          disabled={!this.props.right || this.props.right.disabled}
        >
          {
            this.props.right ? (
              <Icon
                type={this.props.right.icon.type || 'Ionicons'}
                name={this.props.right.icon.name}
                style={[styles.icon, {
                  color: this.props.right.disabled
                    ? 'rgba(255, 255, 255, 0.4)'
                    : 'white'
                }]}
              />
            ) : null
          }
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: DARK_PRIMARY
  },

  iconContainer: {
    flex: 1,
    minWidth: 50,
    maxWidth: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },

  icon: {
    color: 'white',
    fontSize: 20
  },

  body: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15
  },

  text: {
    color: 'white',
    fontSize: 16,
    fontFamily: font.medium
  }
});
