import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LockScreen = ({ navigation, route }) => {
  const [enteredPassword, setEnteredPassword] = useState('');
  const [savedPassword, setSavedPassword] = useState(null);

  useEffect(() => {
    const loadPassword = async () => {
      try {
        const password = await AsyncStorage.getItem('userPassword');
        setSavedPassword(password);
      } catch (error) {
        console.error('비밀번호 로드 오류:', error);
        Alert.alert('오류', '비밀번호를 로드할 수 없습니다.');
      }
    };

    loadPassword();
  }, []);

  const handleNumberPress = (num) => {
    if (enteredPassword.length < 4) {
      setEnteredPassword((prev) => prev + num);
    }
  };

  const handleSubmit = () => {
    if (enteredPassword === savedPassword) {
      Alert.alert('성공', '비밀번호가 맞습니다!', [
        { text: '확인', onPress: () => navigation.navigate('Home') },
      ]);
    } else {
      Alert.alert('오류', '비밀번호가 틀렸습니다.');
      setEnteredPassword('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>비밀번호를 입력하세요</Text>
      <Text style={styles.password}>{enteredPassword.replace(/./g, '●')}</Text>

      {/* 키패드 */}
      <View style={styles.keypad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((i) => (
            <TouchableOpacity
            key={i}
            style={styles.key}
            onPress={() => handleNumberPress(i.toString())}>
            <Text style={styles.keyText}>{i}</Text>
            </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={enteredPassword.length !== 4}>
        <Text style={styles.submitText}>확인</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  password: {
    fontSize: 32,
    letterSpacing: 8,
    marginBottom: 30,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
    justifyContent: 'center',
  },
  key: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    margin: 5,
    borderRadius: 10,
  },
  keyText: {
    fontSize: 24,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default LockScreen;
