import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import vector icons

const BeerList = ({ navigation }) => {
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBeers, setFilteredBeers] = useState([]);

  useEffect(() => {
    const fetchBeers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://181.43.126.211:3001/api/v1/beers');
        setBeers(response.data.beers);
        setFilteredBeers(response.data.beers);
      } catch (error) {
        console.error('Error fetching beers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeers();
  }, []);

  const handleSearch = () => {
    const filtered = beers.filter((beer) =>
      beer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBeers(filtered);
  };

  const handleViewDetails = (id) => {
    navigation.navigate('BeerDetails', { beerId: id });
  };

  const handleRateBeer = (id) => {
    navigation.navigate('BeerReview', { beerId: id });
  };

  const renderBeerItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.beerName}>{item.name}</Text>
      <Text style={styles.brewery}>Brewery: {item.brewery}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleViewDetails(item.id)}>
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.rateButton]} onPress={() => handleRateBeer(item.id)}>
          <Text style={styles.buttonText}>Rate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Beer List</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Beers"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Icon name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredBeers}
          renderItem={renderBeerItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    flex: 1,
    marginRight: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#A36717',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  beerName: {
    fontSize: 18,
    color: '#FFF',
  },
  brewery: {
    color: '#FFF',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#F59A23',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  rateButton: {
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default BeerList;
