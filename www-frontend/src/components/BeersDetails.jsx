import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native';
import ReviewForm from './Review'; // Make sure the ReviewForm is imported correctly

const BeerDetails = () => {
  const { id } = useParams();
  const navigation = useNavigation();
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchBeerDetails = async () => {
      try {
        const response = await axios.get(`http://181.43.126.211:3001/api/v1/beers/${id}`);
        setBeer(response.data);
      } catch (error) {
        console.error('Error fetching beer details:', error);
        setError('Failed to load beer details.');
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get('http://181.43.126.211:3001/api/v1/users/current');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchBeerDetails();
    fetchUser();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color="#F59A23" />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: beer.image_url }} style={styles.image} />
        <Text style={styles.title}>{beer.name}</Text>
        <Text style={styles.subtitle}>Brand: {beer.brand.name}</Text>
        <Text style={styles.subtitle}>Brewery: {beer.brand.brewery.name}</Text>
        <Text style={styles.text}>Style: {beer.style}</Text>
        <Text style={styles.text}>Hop: {beer.hop}</Text>
        <Text style={styles.text}>Yeast: {beer.yeast}</Text>
        <Text style={styles.text}>Malts: {beer.malts}</Text>
        <Text style={styles.text}>IBU: {beer.ibu}</Text>
        <Text style={styles.text}>Alcohol: {beer.alcohol}%</Text>
        <Text style={styles.text}>BLG: {beer.blg}</Text>
        <Text style={styles.text}>Average Rating: {beer.avg_rating}</Text>

        <Text style={styles.subtitle}>Bars Serving this Beer:</Text>
        {beer.bars.length > 0 ? (
          beer.bars.map((bar) => (
            <Text key={bar.id} style={styles.text}>
              {bar.name}
            </Text>
          ))
        ) : (
          <Text style={styles.text}>No bars currently serving this beer.</Text>
        )}

        <Button
          title="Write a Review"
          onPress={() => navigation.navigate('Review', { beerId: id })}
          color="#F59A23"
        />

        <Text style={styles.subtitle}>Reviews:</Text>
        {beer.reviews.length > 0 ? (
          beer.reviews.sort((a, b) => (a.user.id === user?.id ? -1 : 1)).map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <Text style={styles.reviewUser}>{review.user.name}</Text>
              <Text style={styles.reviewText}>Rating: {review.rating}</Text>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No reviews yet.</Text>
        )}

        <ReviewForm beerId={id} /> {/* Show the review form */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F59A23',
  },
  card: {
    backgroundColor: '#A36717',
    padding: 20,
    borderRadius: 10,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFF',
    marginTop: 10,
  },
  text: {
    color: '#FFF',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  reviewCard: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  reviewUser: {
    fontWeight: 'bold',
  },
  reviewText: {
    marginVertical: 2,
  },
});

export default BeerDetails;
