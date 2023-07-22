/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Card} from '@rneui/base';
import {Button, withTheme} from '@rneui/themed';

import Deck from './src/Deck';

const IMAGE_URL_GENERATOR = 'https://picsum.photos/200/300';

const DATA = [
  {
    id: 1,
    text: 'Card #1',
    uri: IMAGE_URL_GENERATOR,
  },
  {
    id: 2,
    text: 'Card #2',
    uri: IMAGE_URL_GENERATOR,
  },
  {
    id: 3,
    text: 'Card #3',
    uri: IMAGE_URL_GENERATOR,
  },
  {
    id: 4,
    text: 'Card #4',
    uri: IMAGE_URL_GENERATOR,
  },
  {
    id: 5,
    text: 'Card #5',
    uri: IMAGE_URL_GENERATOR,
  },
  {
    id: 6,
    text: 'Card #6',
    uri: IMAGE_URL_GENERATOR,
  },
  {
    id: 7,
    text: 'Card #7',
    uri: IMAGE_URL_GENERATOR,
  },
  {
    id: 8,
    text: 'Card #8',
    uri: IMAGE_URL_GENERATOR,
  },
];

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const renderCard = (item: {id: number; text: string; uri: string}) => {
    return (
      <Card key={item.id}>
        <Card.Title>{item.text}</Card.Title>
        <Card.Image source={{uri: item.uri}} />
        <Text style={styles.text}>I can customize the Card further.</Text>
        <Button title="View Now!" buttonStyle={styles.button} />
      </Card>
    );
  };

  const renderNoMoreCards = () => {
    return (
      <Card>
        <Card.Title>All Done!</Card.Title>
        <Text style={styles.text}>There's no more content here!</Text>
        <Button title="Get more" buttonStyle={styles.button} />
      </Card>
    );
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Deck
            data={DATA}
            renderCard={renderCard}
            renderNoMoreCards={renderNoMoreCards}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'rgba(90, 154, 230, 1)',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 30,
  },
});

export default withTheme(App, '');
