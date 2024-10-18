import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Snackbar, Title } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import qs from 'qs';

// Validación del formulario con Yup
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid e-mail').required('e-mail is Required'),
  password: Yup.string().required('Password is Required').min(6, 'Password has to be 6 characters or longer'),
  first_name: Yup.string().required('First Name is Required'),
  last_name: Yup.string().required('Last Name is Required'),
  handle: Yup.string().required('A Handle is Required'),
  password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must be the same').required('Repeat Password'),
});

const initialValues = {
  first_name: '',
  last_name: '',
  handle: '',
  email: '',
  password: '',
  password_confirmation: '',
};

const Signup = ({ navigation }) => {
  const [serverError, setServerError] = useState(false); // Estado para manejar el error del servidor

  const handleSubmit = async (values) => {
    try {
      await axios.post('http://181.43.126.211:3001/api/v1/signup', qs.stringify({ user: values }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      setServerError(false); // Limpia el mensaje de error si el registro es exitoso
      navigation.navigate('Login'); // Redirige a la página de login después de un registro exitoso
    } catch (err) {
      setServerError(true);
      console.error('Error when sending the form:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Title>Create Account</Title>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              label="First Name"
              onChangeText={handleChange('first_name')}
              onBlur={handleBlur('first_name')}
              value={values.first_name}
              error={touched.first_name && Boolean(errors.first_name)}
              style={styles.input}
            />
            <TextInput
              label="Last Name"
              onChangeText={handleChange('last_name')}
              onBlur={handleBlur('last_name')}
              value={values.last_name}
              error={touched.last_name && Boolean(errors.last_name)}
              style={styles.input}
            />
            <TextInput
              label="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              error={touched.email && Boolean(errors.email)}
              style={styles.input}
              keyboardType="email-address"
            />
            <TextInput
              label="Handle"
              onChangeText={handleChange('handle')}
              onBlur={handleBlur('handle')}
              value={values.handle}
              error={touched.handle && Boolean(errors.handle)}
              style={styles.input}
            />
            <TextInput
              label="Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              error={touched.password && Boolean(errors.password)}
              style={styles.input}
              secureTextEntry
            />
            <TextInput
              label="Confirm Password"
              onChangeText={handleChange('password_confirmation')}
              onBlur={handleBlur('password_confirmation')}
              value={values.password_confirmation}
              error={touched.password_confirmation && Boolean(errors.password_confirmation)}
              style={styles.input}
              secureTextEntry
            />
            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
              Create Account
            </Button>
            <Snackbar
              visible={serverError}
              onDismiss={() => setServerError(false)}
              duration={3000}
            >
              Server Error. Try again later
            </Snackbar>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default Signup;
