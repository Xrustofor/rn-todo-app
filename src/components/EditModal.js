import React, { useState } from "react";
import {Modal, TextInput, StyleSheet, Button, View, Alert} from 'react-native';
import { THEME } from "../thems";
import { AppButton } from "./ui/AppButton";

export const EditModal = ({ visible, onCancel, value, onSave }) => {

    const [title, setTitle] = useState(value)
    const saveHandler = () => {
        if(title.trim().length < 3){
            Alert.alert('Помилка', `мінімальна назва три символи зараз ${title.trim().length} символів`)
        }else{
            onSave(title)
        }
    }

    const cancelHandler = () => {
        setTitle(value)
        onCancel()
    }

    return (

        <Modal 
            visible={visible}
            animationType='slide'
            transparent={false}
        >
            <View style={ styles.wrap }>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                    placeholder="Веедіть назву"
                    autoCapitalize='none'
                    autoCorrect={false}
                />
                <View style={styles.buttons}>
                    <AppButton 
                        onPress={cancelHandler}
                        color={THEME.DANGER_COLOR}
                    >Відміти</AppButton>
                    <AppButton 
                        onPress={saveHandler}
                        color={THEME.MAIN_COLOR}
                    >Зберегти</AppButton>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
   wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center"
   }, 
   input: {
    padding: 10,
    borderBottomColor: THEME.MAIN_COLOR,
    borderBottomWidth: 2,
    width: '80%',
   },
   buttons: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
   }
})