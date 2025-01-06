import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import config from './src/config';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import DiaryScreen from './src/screens/DiaryScreen';
import SettingsScreen from './src/screens/SettingScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import RegisterToHomeScreen from './src/screens/RegisterToHomeScreen';

const Stack = createStackNavigator();

const baseUrl = config.backendUrl;

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkDeviceRegistration = async () => {
      try {
        const deviceID = await DeviceInfo.getUniqueId();

        // 병렬 요청으로 데이터 가져오기
        const [userResponse, coupleResponse] = await Promise.all([
          axios.get(`${baseUrl}/auth/getUser`, { params: { ID: deviceID } }),
          axios.get(`${baseUrl}/auth/getCouple`, { params: { ID: deviceID } }),
        ]);

        if (userResponse.data.length === 0) {
          await axios.post(`${baseUrl}/auth/createUser`, { ID: deviceID });
        }
        console.log('coupleResponse.data:', coupleResponse.data[0]["coupleID"]);
        // 데이터 확인 후 초기 라우트 설정
        if (coupleResponse.data[0]["coupleID"]!== null) {
          setInitialRoute('Home');
        } else {
          setInitialRoute('Register');
        }
      } catch (error) {
        console.error('Error fetching device registration:', error);
        // 에러 발생 시 기본 라우트를 Register로 설정
        setInitialRoute('Register');
      }
    };

    checkDeviceRegistration();
  }, []);

  if (initialRoute === null) {
    // 로딩 화면
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Diary" component={DiaryScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Setting" component={SettingsScreen} />
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen name="Transition" component={RegisterToHomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
