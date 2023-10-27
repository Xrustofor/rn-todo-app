import React, {useState} from "react"; 
import { StyleSheet, View, Keyboard, TextInput, Alert } from 'react-native'
import { AntDesign } from '@expo/vector-icons';

import { THEME } from "../thems";

export const AddTodo = ({ onSubmit }) => {
    const [ value, setValue ] = useState('');

    const pressHandler = () => {
        if(value.trim()) {
            onSubmit(value);
            setValue('');
            Keyboard.dismiss();
        }else{
            Alert.alert('Назва справи не може бути пустим')
        }        
    }

    return (
        <View style={styles.block}>
            <TextInput 
                style={styles.input}
                onChangeText={setValue}
                value={value}
                placeholder="Введіть назву справи"
                autoCorrect={false}
                autoCapitalize="none"
              />
              <AntDesign.Button name="pluscircleo" onPress={pressHandler}>Додати</AntDesign.Button>
        </View>
    )
}

const styles = StyleSheet.create({
    block: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        marginBottom: 15
    },
    input: {
        width: '60%',
        borderBottomColor: THEME.MAIN_COLOR,
        borderStyle: 'solid',
        borderBottomWidth: 2,
    }
})