import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Deck from './src/Deck';
import data from './src/data.json';

export default class App extends React.Component {
  renderCard = ({ id, text, uri }) => (
    <Card
      key={id}
      title={text}
      image={{ uri }}
    >
      <Text style={{ marginBottom: 10 }}>
        Card text
      </Text>
      <Button
        icon={{ name: 'code' }}
        backgroundColor="steelblue"
        title="Press me!"
      />
    </Card>
  );

  renderNoMoreCards = () => (
    <Card>
      <Text>
        You swiped them all, you maniac!
      </Text>
    </Card>
  );

  render() {
    return (
      <View style={styles.container}>
        <Deck
          data={data.items}
          renderCard={this.renderCard}
          renderNoMoreCards={this.renderNoMoreCards}
          onSwipeLeft={() => {}}
          onSwipeRight={() => {}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 20,
  },
});
