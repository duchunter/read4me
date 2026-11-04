import { MaterialIcons } from "@expo/vector-icons";
import { Icon, Text } from "native-base";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import color from "../config/color";
import { TTS_LANGUAGE } from "../config/constants";

const PlayMode = [
  {
    type: "MaterialIcons",
    name: "repeat",
  },
  {
    type: "MaterialIcons",
    name: "repeat-one",
  },
  {
    type: "MaterialIcons",
    name: "shuffle",
  },
];

const PlaySpeed = [
  {
    name: "x1",
    val: 1,
  },
  {
    name: "x1.25",
    val: 1.25,
  },
  {
    name: "x1.5",
    val: 1.5,
  },
  {
    name: "x0.5",
    val: 0.5,
  },
  {
    name: "x0.75",
    val: 0.75,
  },
];

interface PlayControlProps {
  play: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;
  setMode?: (mode: number) => void;
  forward: () => void;
  backward: () => void;
  isPlaying: boolean;
  language: number;
  setLanguage: (language: number) => void;
}

const PlayControl: React.FC<PlayControlProps> = ({
  play,
  pause,
  setSpeed,
  forward,
  backward,
  isPlaying,
  language,
  setLanguage,
}) => {
  const [mode, setMode] = useState(0);
  const [speed, setSpeedIndex] = useState(0);

  return (
    <View style={styles.container}>
      {/* Random/Repeat/Repeat All */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          const newMode = mode === PlayMode.length - 1 ? 0 : mode + 1;
          setMode(newMode);
        }}
      >
        <Icon
          as={MaterialIcons}
          name={PlayMode[mode].name}
          size="lg"
          color="white"
        />
      </TouchableOpacity>

      {/* Prev */}
      <TouchableOpacity onPress={backward} style={styles.button}>
        <Icon as={MaterialIcons} name="skip-previous" size="md" color="white" />
      </TouchableOpacity>

      {/* Stop/Start */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (isPlaying) {
            pause();
          } else {
            play();
          }
        }}
      >
        {isPlaying ? (
          <Icon
            as={MaterialIcons}
            name="pause-circle-outline"
            size="lg"
            color="white"
          />
        ) : (
          <Icon
            as={MaterialIcons}
            name="play-circle-outline"
            size="lg"
            color="white"
          />
        )}
      </TouchableOpacity>

      {/* Next */}
      <TouchableOpacity onPress={forward} style={styles.button}>
        <Icon as={MaterialIcons} name="skip-next" size="md" color="white" />
      </TouchableOpacity>

      {/* Speed */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          const newSpeed = speed === PlaySpeed.length - 1 ? 0 : speed + 1;
          setSpeedIndex(newSpeed);
          setSpeed(PlaySpeed[newSpeed].val);
        }}
      >
        <Text style={styles.speedText}>{PlaySpeed[speed].name}</Text>
      </TouchableOpacity>

      {/* Language */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setLanguage(language === TTS_LANGUAGE.length - 1 ? 0 : language + 1);
        }}
      >
        <Text style={styles.speedText}>{TTS_LANGUAGE[language].label}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PlayControl;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    minHeight: 100,
    maxHeight: 100,
    backgroundColor: color.DARK_PRIMARY,
  },

  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  speedText: {
    fontSize: 15,
    color: "white",
  },

  smallIcon: {
    fontSize: 23,
    color: "white",
  },

  mediumIcon: {
    fontSize: 37,
    color: "white",
  },

  bigIcon: {
    fontSize: 71,
    color: "white",
  },
});
