/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {primary: '#1f145c', while: '#fff', }

const App = () => {
  const [textInput, setTextInput] = React.useState('');
  const [todos, setTodos] = React.useState([])
  React.useEffect(() => {
    getTodoFromUserDevice()
  }, [])
  React.useEffect(() => {
    saveTodoToUserDevice(todos)
  }, [todos])

  const ListItem = ({todo}) => {
    return <View style={styles.listItem}>
      <View style={{flex: 1}}>
      <Text style={{fontWeight: 'bold', fontSize: 15, color: COLORS.primary, textDecorationLine: todo?.completed? 'line-through': 'none',}}>
      {todo?.task}
      </Text>
      </View>
      {
        !todo?.completed && (  
      <TouchableOpacity style={[styles.actionIcon]} onPress={() => markTodoComplete(todo?.id)}>
        <Icon name='done' size={20} color={COLORS.while} />
      </TouchableOpacity>
        )}
      <TouchableOpacity style={[styles.actionIcon, {backgroundColor:"red"}]} onPress={() => deleteTodo(todo?.id)}>
        <Icon name='delete' size={20} color={COLORS.while} />
      </TouchableOpacity>
    </View>;
  };


  const saveTodoToUserDevice = async todos=> {
    try {
      const stringifyTodos = JSON.stringify(todos)
      await AsyncStorage.setItem('todos', stringifyTodos)
    } catch (e) {
      console.log(e);
      // saving error
    }
  }

  const getTodoFromUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if(todos != null) {
        setTodos(JSON.parse(todos))
      }
    }catch(error) {
      console.log(error);
    }
  };

  const addTodo = () => {
    if(textInput == "") {
      Alert.alert("Error", 'Please enter a todo', [{text: 'Ok'}])

    } else {
      
          // console.log(textInput);
          const newTodo = {
            id:Math.random(),
            task: textInput,
            completed: false,
          };
          setTodos([...todos, newTodo])
          setTextInput('')
    }
  }

  const markTodoComplete = todoid => {
    // console.log(todoid);

    const newTodos = todos.map((item) => {
      if (item.id == todoid) {
        return {...item, completed: true}
      }
      return item;
    })
    setTodos(newTodos)
  }

  const deleteTodo = (todoid) => {
    const newTodos = todos.filter(item => item.id != todoid)
    setTodos(newTodos)
  }

  const clearTodos = () => {
    Alert.alert("Delete All", 'Are you sure you want to delete all todos?',[{
      text: 'Yes',
      onPress: () => setTodos([])
    },
  {text: 'No'}
  ])
  }

  return <SafeAreaView style={{flex:1,backgroundColor:COLORS.while}}>
    <View style={styles.header}>
      <Text style={{fontWeight: 'bold', fontSize: 20, color: COLORS.primary}}>Todo App</Text>
      <Icon name="delete" size={30} color="red" onPress={clearTodos}/>
    </View>
    <FlatList 
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{padding: 20, paddingBottom: 100}}
    data={todos} renderItem={({item})=> <ListItem todo={item} />}
    />
    <View style={styles.footer}>
      <View style={styles.inputContainer}>
        <TextInput placeholder='Add Todo' 
        value={textInput}
        onChangeText={(text) =>setTextInput(text)}/>
      </View>
    <TouchableOpacity onPress={addTodo}>
      <View style={styles.iconContainer}>
        <Icon name="add" size={25} color={COLORS.while}/>
      </View>
    </TouchableOpacity>
    </View>
  </SafeAreaView>
}

const styles = StyleSheet.create({ 

  actionIcon: {
    height: 25,
    width:25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3,
  },

  listItem: {
    padding: 20,
    backgroundColor: COLORS.while,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },

  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    color: COLORS.while,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: COLORS.while,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 50,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default App;
