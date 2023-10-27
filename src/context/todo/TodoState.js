import React, { useReducer, useContext } from "react";
import { Alert } from 'react-native';
import { TodoContext } from './todoContext';
import { todoReducer } from "./todoReducer";
import { ADD_TODO, CLEAR_ERROR, FETCH_TODOS, HIDE_LOADER, REMOVE_TODO, SHOW_ERROR, SHOW_LOADER, UPDATE_TODO } from "../types";
import { ScreenContext } from "../screen/screenContext";
import { Http } from '../../http'


export const TodoState = ({ children  }) => {
    const initialState = {
        todos: [],
        loading: false,
        error: null,
    }
      
    const { changeScreen } = useContext(ScreenContext)
    const [state, dispatch] = useReducer(todoReducer, initialState)


    const addTodo = async title => {
        clearError();
       try{
        const data = await Http.post(
            'https://rn-simple-project-default-rtdb.europe-west1.firebasedatabase.app/todos.json',
            { title }
        )
        dispatch({type: ADD_TODO, id: data.name, title})

       }catch(e){
        showError('Помилка при добавленні поля')
        console.log(e)
       }
    }
    const removeTodo = id => {
        const todo = state.todos.find(t => t.id === id)

        Alert.alert(
            'Виидалення картки',
            `Ви впевнені що хочете видалити "${todo.title}" ?`,
            [
            { text: 'Відміна', style: 'cancel'},
            { 
                text: 'Видалити',
                style: 'destructive',
                onPress: async () => {
                    changeScreen(null);
                    clearError()
                    try{
                        await Http.delete(`https://rn-simple-project-default-rtdb.europe-west1.firebasedatabase.app/todos/${id}.json`);
                        dispatch({type: REMOVE_TODO, id})
                    }catch(e){
                        showError('Помилка при видаленні поля')
                        console.log(e)
                    }
                }
            },
            ],
            { cancelable: false }
        );

       
    }

    const  fetchTodos = async () => {
        showLoader();
        clearError();
        try{
            const data = await Http.get( 'https://rn-simple-project-default-rtdb.europe-west1.firebasedatabase.app/todos.json')
            console.log('Data!', data);
            if(data !== null){
                const todos = Object.keys(data).map(key => ({ ...data[key], id: key }));
                dispatch({type: FETCH_TODOS, todos});
            }
            
        }catch(e){
            showError('Щось пішло не так...')
            console.log(e);
        } finally {
            hideLoader();
        }        
        
    }

    const updateTodo = async (id, title) => {
        showLoader();
        clearError();
        try{
            await Http.patch(`https://rn-simple-project-default-rtdb.europe-west1.firebasedatabase.app/todos/${id}.json`)
            dispatch({type: UPDATE_TODO, id, title});
        }catch(e){
            showError('Щось пішло не так при зміні данних...')
            console.log(e);
        } finally {
            hideLoader();
        }      
        
    }

    const showLoader = () => dispatch({type: SHOW_LOADER});
    const hideLoader = () => dispatch({type: HIDE_LOADER});
    const showError = error => dispatch({type: SHOW_ERROR, error});
    const clearError = () => dispatch({type: CLEAR_ERROR});

    return <TodoContext.Provider 
                value={{
                    todos: state.todos,
                    loading: state.loading,
                    error: state.error,
                    addTodo,
                    removeTodo,
                    updateTodo,
                    fetchTodos,
                }}
           >
            { children }
           </TodoContext.Provider>
}