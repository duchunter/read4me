import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  DrawerLayoutAndroid,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

import { pick, types } from "@react-native-documents/picker";
import RNFS from "react-native-fs";
import Tts from "react-native-tts";

import CodeContent from "@/components/CodeContent";
import DrawerContent from "@/components/DrawerContent";
import HeaderBar from "@/components/HeaderBar";
import ImgContent from "@/components/ImgContent";
import PlayControl from "@/components/PlayControl";
import SeekBar from "@/components/SeekBar";
import TextContent from "@/components/TextContent";

import color from "@/config/color";
import { WIDTH } from "@/config/constants";
import { transformMediumPost, transformTextFile } from "@/utils/transformer";

export default function Index() {
  const [data, setData] = useState<{ img?: any; files?: any; text: string }[]>([
    {
      text: "",
    },
  ]);
  const [file, setFile] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingMode, setPlayingMode] = useState(0);
  const [docMode, setDocMode] = useState("TEXT");
  const [display, setDisplay] = useState("text");

  const [currentIndex, setCurrentIndex] = useState(0);

  const drawerRef = useRef<DrawerLayoutAndroid>(null);

  const pickFile = async () => {
    try {
      await Tts.getInitStatus();
      const result = await pick({
        type: [types.allFiles],
      });

      const res = result[0];
      if (
        !res ||
        !res.name ||
        (!res.name.endsWith(".txt") && !res.name.endsWith(".json"))
      ) {
        return;
      }

      setFile(res.name);
      const buffer = await RNFS.readFile(res.uri, "utf8");

      Tts.setDefaultLanguage("en-US");
      let newData;
      switch (docMode) {
        case "TEXT":
          newData = transformTextFile(buffer);
          break;

        case "MEDIUM_POST":
          newData = transformMediumPost(buffer);
      }

      newData.unshift({});
      setData(newData);
      setCurrentIndex(0);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const speak = useCallback(() => {
    if (!isPlaying) {
      setIsPlaying(true);
    }

    if (data.length === 1) {
      return;
    }

    if (currentIndex === data.length) {
      if (playingMode === 2) {
        return;
      }

      setCurrentIndex(0);
    }

    const next = data[currentIndex];

    if (next) {
      if (next.img) {
        Tts.speak("We have a picture");
        setDisplay("img");
        return;
      }

      if (next.files) {
        Tts.speak("We have some code");
        setDisplay("code");
        return;
      }

      setDisplay("text");
      Tts.speak(next.text || "");
    }
  }, [currentIndex, data, isPlaying, playingMode]);

  useEffect(() => {
    Tts.addEventListener("tts-finish", () => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    });
    Tts.setDefaultLanguage("en-US");

    return () => {
      Tts.removeAllListeners("tts-finish");
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      speak();
    }
  }, [currentIndex, isPlaying, speak]);

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={Math.min(WIDTH * 0.75, 300)}
      drawerPosition={"left"}
      renderNavigationView={() => (
        <DrawerContent
          currentMode={docMode}
          close={() => drawerRef.current?.closeDrawer()}
          changeMode={(mode) => setDocMode(mode)}
        />
      )}
      style={{
        flex: 1,
        backgroundColor: color.DARK_PRIMARY,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingTop: StatusBar.currentHeight,
          paddingBottom: 40,
        }}
      >
        <StatusBar backgroundColor={color.DARK_PRIMARY} />
        <HeaderBar
          title={file || "No file selected"}
          left={{
            icon: {
              name: "menu",
            },
            handle: () => drawerRef.current?.openDrawer(),
          }}
          right={{
            icon: {
              name: "folder",
            },
            handle: pickFile,
          }}
        />

        <View style={styles.container}>
          <ScrollView bounces={false}>
            {display === "text" && (
              <TextContent
                text={data[currentIndex] && data[currentIndex].text}
                next={data[currentIndex + 1]}
              />
            )}

            {display === "img" && <ImgContent uri={data[currentIndex].img} />}

            {display === "code" && (
              <CodeContent files={data[currentIndex].files} />
            )}
          </ScrollView>
        </View>

        <SeekBar
          disabled={!data.length}
          max={data.length}
          value={currentIndex}
          pause={() => {
            Tts.stop();
            setIsPlaying(false);
          }}
          setValue={(value) => {
            setCurrentIndex(Math.floor(value));
            setIsPlaying(true);
          }}
        />

        <PlayControl
          isPlaying={isPlaying}
          forward={() => {
            Tts.stop();
            if (currentIndex >= data.length - 6) {
              setCurrentIndex(0);
            } else {
              setCurrentIndex((prevIndex) => prevIndex + 5);
            }
          }}
          backward={() => {
            Tts.stop();
            if (currentIndex <= 5) {
              setCurrentIndex(0);
            } else {
              setCurrentIndex((prevIndex) => prevIndex - 5);
            }
          }}
          play={() => {
            setIsPlaying(true);
          }}
          pause={() => {
            Tts.stop();
            if (currentIndex > 0) setCurrentIndex((prevIndex) => prevIndex - 1);
            setIsPlaying(false);
          }}
          setSpeed={(val) => {
            Tts.setDefaultRate(val);
          }}
          setMode={(mode) => {
            setPlayingMode(mode);
          }}
        />
      </View>
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.DARK_PRIMARY,
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 30,
  },
});
