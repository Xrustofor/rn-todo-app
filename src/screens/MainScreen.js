import React, { useState, useEffect, useContext, useCallback } from "react";
import { StyleSheet, View, FlatList, Image, Dimensions } from 'react-native';
import { AddTodo } from '../components/AddTodo';
import { Todo } from '../components/Todo'
import { THEME } from "../thems";
import { TodoContext } from "../context/todo/todoContext";
import { ScreenContext } from "../context/screen/screenContext";
import { AppLoader } from "../components/ui/AppLoader";
import { AppText } from "../components/ui/AppText";
import { AppButton } from "../components/ui/AppButton";

export const MainScreen = () => {
  const { todos, addTodo, removeTodo, fetchTodos, loading, error } = useContext(TodoContext)
  const { changeScreen } = useContext(ScreenContext)
  const [deviceWidth, setDeviceWidth] = useState(Dimensions.get('window').width - THEME.PADDING_HORIZONTAL * 2);

  const loadTodos = useCallback(async () => await fetchTodos(), [fetchTodos])

  useEffect(() => {
    loadTodos()
  }, [])

  useEffect(() => {
    const update = () => {
      const width = Dimensions.get('window').width - THEME.PADDING_HORIZONTAL * 2
      setDeviceWidth(width)
    }
    const subscription =  Dimensions.addEventListener('change', update)

    return () => {
      subscription.remove('change', update)
    }
  })

  if(loading){ return <AppLoader/> }
  if(error){
    return (
      <View style={styles.center}>
        <AppText style={styles.error} >{error}</AppText>
        <AppButton onPress={loadTodos}>Повторити</AppButton>
      </View>
    )
  }

  let content = (
    <View style={{width: deviceWidth}}>
      <FlatList
          data={todos}
          keyExtractor={item => item.id.toString() }
          renderItem={({item}) => {
          return <Todo 
            onRemove={removeTodo}
            todo={item}
            onOpen={changeScreen}
          />
        }} 
      />
    </View>    
  )

  if(todos.length === 0) {
    content = <View style={styles.imagWrap}>
      <Image
        style={styles.image}
        source={require('../../assets/no-items.png')}
      />
      {/* <Image
        style={styles.image}
        source={{uri: 'https://w7.pngwing.com/pngs/1021/477/png-transparent-react-native-javascript-mobile-app-development-github-symmetry-mobile-app-development-electric-blue.png'}}
      /> */}
    </View>
  }

   return (
    <View>
        <AddTodo onSubmit={addTodo}/>
        { content }
    </View>
   ) 
}

const styles = StyleSheet.create({
  imagWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 20,
    color: THEME.DANGER_COLOR
  }
})