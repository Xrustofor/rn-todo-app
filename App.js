import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Font from 'expo-font';
import { Entypo } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { MainLayout } from './src/MainLayout';
import { TodoState } from './src/context/todo/TodoState';
import { ScreenState } from './src/context/screen/ScreenState';

SplashScreen.preventAutoHideAsync();


export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded] = Font.useFonts({
    'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
    'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf')
  });


  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(Entypo.font);
        await fontsLoaded;
      } catch (e) { console.warn(e) }
        finally { setIsReady(true) }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <View 
      onLayout={onLayoutRootView}
      style={styles.wrapper}
    >
      <ScreenState>
        <TodoState>
          <MainLayout/>
        </TodoState>
      </ScreenState>      
    </View>
  );
}


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
}
})

