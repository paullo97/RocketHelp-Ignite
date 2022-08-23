import { Roboto_400Regular, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto';
import { NativeBaseProvider, StatusBar } from 'native-base';
import React from 'react';
import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';
import { Theme } from './src/styles/theme';

export default function App() {
    const [fontLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

    return (
        <NativeBaseProvider theme={Theme}>
            <StatusBar backgroundColor="transparent" barStyle='light-content' translucent></StatusBar>
            {fontLoaded ? <Routes/> : <Loading/>}
        </NativeBaseProvider>
    );
}