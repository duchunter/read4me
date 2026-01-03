import Slider from "@react-native-community/slider";
import { Text } from "native-base";
import React from "react";
import { StyleSheet, View } from "react-native";

import color from "@/config/color";

interface SeekBarProps {
  max: number;
  value: number;
  setValue: (value: number) => void;
  pause: () => void;
  disabled?: boolean;
}

const SeekBar: React.FC<SeekBarProps> = ({
  max,
  value,
  setValue,
  pause,
  disabled,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{`${value}/${max}`}</Text>
      </View>

      <Slider
        disabled={disabled}
        maximumValue={max || 100}
        value={value}
        onSlidingStart={pause}
        onSlidingComplete={setValue}
        minimumTrackTintColor="#fff"
        maximumTrackTintColor="rgba(255, 255, 255, 0.14)"
      />
    </View>
  );
};

export default SeekBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 60,
    maxHeight: 60,
    justifyContent: "center",
    paddingHorizontal: 15,
    backgroundColor: color.DARK_PRIMARY,
  },

  textContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  text: {
    fontSize: 14,
    color: "white",
  },
});
