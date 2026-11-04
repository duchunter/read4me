import { Dimensions, Platform } from 'react-native';

// UI
const { height, width } = Dimensions.get('screen');
export const HEIGHT = height;
export const WIDTH = width;

// PLATFORM
export const IS_IOS = Platform.OS === 'ios';

// OTHER
export const DOC_MODE = ['TEXT', 'MEDIUM_POST']

// TTS voices, cycled by the language button in PlayControl
export const TTS_LANGUAGE = [
  {
    label: 'EN',
    locale: 'en-US',
    picturePrompt: 'We have a picture',
    codePrompt: 'We have some code',
  },
  {
    label: 'VI',
    locale: 'vi-VN',
    picturePrompt: 'Có một hình ảnh',
    codePrompt: 'Có một đoạn code',
  },
];
