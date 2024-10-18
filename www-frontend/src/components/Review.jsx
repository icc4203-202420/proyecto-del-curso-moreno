import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, Alert } from 'react-native';

const initialState = {
  text: '',
  rating: 1,
  loading: false,
  error: null,
  success: false,
  beerName: ''
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_TEXT':
      return { ...state, text: action.payload };
    case 'SET_RATING':
      return { ...state, rating: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SUCCESS':
      return { ...state, success: action.payload };
    case 'SET_BEER_NAME':
      return { ...state, beerName: action.payload };
    default:
      return state;
  }
};

const ReviewForm = ({ route, navigation }) => {
  const { id } = route.params; // ID de la cerveza
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchBeerName = async () => {
      try {
        const response = await axios.get(`http://181.43.126.211:3001/api/v1/beers/${id}`);
        dispatch({ type: 'SET_BEER_NAME', payload: response.data.name });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch beer details.' });
      }
    };
    fetchBeerName();
  }, [id]);

  const handleTextChange = (text) => {
    dispatch({ type: 'SET_TEXT', payload: text });
  };

  const handleSubmit = async () => {
    if (state.text.trim().split(' ').length < 15) {
      dispatch({ type: 'SET_ERROR', payload: 'The review must have at least 15 words.' });
      return;
    }
    if (state.rating < 1 || state.rating > 5) {
      dispatch({ type: 'SET_ERROR', payload: 'Rating must be between 1 and 5.' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_SUCCESS', payload: false });

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://181.43.126.211:3001/api/v1/beers/${id}/reviews`, {
        review: {
          text: state.text,
          rating: state.rating
        }
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      dispatch({ type: 'SET_SUCCESS', payload: true });
      Alert.alert('Success', 'Review submitted successfully!');
      navigation.goBack(); // Regresar a la página anterior
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error.message);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to submit review.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{state.beerName || 'Beer Name'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Review Text"
        multiline
        numberOfLines={4}
        value={state.text}
        onChangeText={handleTextChange}
      />
      <Text>Your Rating: {state.rating}</Text>
      <Button title="Increase Rating" onPress={() => dispatch({ type: 'SET_RATING', payload: Math.min(state.rating + 1, 5) })} />
      <Button title="Decrease Rating" onPress={() => dispatch({ type: 'SET_RATING', payload: Math.max(state.rating - 1, 1) })} />
      {state.loading && <ActivityIndicator />}
      {state.error && <Text style={styles.errorText}>{state.error}</Text>}
      <Button title="Submit Review" onPress={handleSubmit} />
      <Button title="Cancel" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#A36717',
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ReviewForm;
