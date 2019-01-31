// Props: files

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/styles/hljs';

import font from 'read4me/config/font';

export default class CodeContent extends Component {
  render() {
    return this.props.files ? (
      <View>
        {
          this.props.files.map((file, index) => (
            <View key={index} style={{ marginBottom: 20 }}>
              <Text style={styles.title}>
                {file.filename}
              </Text>

              <SyntaxHighlighter
              	language={file.language.toLowerCase()}
                style={dracula}
              	highlighter={"hljs"}
              >
              	{file.content}
              </SyntaxHighlighter>
            </View>
          ))
        }
      </View>
    ) : (
      <Text style={styles.title}>
        No file included
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: font.medium,
    marginBottom: 10,
    fontSize: 16,
    lineHeight: 20,
    color: 'white'
  }
});
