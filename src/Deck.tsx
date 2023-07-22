import React, {useState, useEffect} from 'react';
import {
  Animated,
  Dimensions,
  View,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  StyleSheet,
  LayoutAnimation,
  UIManager,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

type CardProp = {id: number; text: string; uri: string};

type DeckProps = {
  data: CardProp[];
  renderCard(item: CardProp): JSX.Element;
  renderNoMoreCards(): JSX.Element;
  onSwipeRight(item: CardProp): () => {};
  onSwipeLeft(item: CardProp): () => {};
};

type SwipeDirection = 'left' | 'right';

const Deck = ({
  data,
  renderCard,
  renderNoMoreCards,
  onSwipeLeft,
  onSwipeRight,
}: DeckProps): JSX.Element => {
  const [index, setIndex] = useState(0);
  const [position] = useState(new Animated.ValueXY());

  useEffect(() => {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }, []);

  // reset the index to 0 when more data is loaded
  useEffect(() => {
    setIndex(0);
  }, [data]);

  const onSwipeComplete = (direction: SwipeDirection) => {
    const item = data[index];
    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
    position.setValue({x: 0, y: 0});
    setIndex(index + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: {x: 0, y: 0},
      useNativeDriver: false,
    }).start();
  };

  const forceSwipe = (direction: SwipeDirection) => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: {x, y: 0},
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (
      event: GestureResponderEvent,
      gesture: PanResponderGestureState,
    ) => {
      position.setValue({x: gesture.dx, y: gesture.dy});
    },
    onPanResponderRelease: (
      event: GestureResponderEvent,
      gesture: PanResponderGestureState,
    ) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe('left');
      } else {
        resetPosition();
      }
    },
  });

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg'],
    });
    const layout = position.getLayout();

    return {
      ...layout,
      transform: [{rotate}],
    };
  };

  const renderCards = () => {
    if (index >= data.length) {
      return renderNoMoreCards();
    }
    return data
      .map((card, cardIndex) => {
        if (cardIndex < index) {
          return null;
        }

        if (cardIndex === index) {
          return (
            <Animated.View
              key={card.id}
              style={[getCardStyle(), styles.cardStyle]}
              {...panResponder.panHandlers}>
              {renderCard(card)}
            </Animated.View>
          );
        }

        return (
          <Animated.View
            key={card.id}
            style={[styles.cardStyle, {top: 10 * (cardIndex - index)}]}>
            {renderCard(card)}
          </Animated.View>
        );
      })
      .reverse();
  };

  return <View style={styles.container}>{renderCards()}</View>;
};

// Set default props so that they are not required by the calling component.
// TODO: Implement functions in calling component(s) and remove defaults.
Deck.defaultProps = {
  onSwipeRight(item: CardProp) {
    console.log(`SwipeRight: ${item.id}`);
  },
  onSwipeLeft(item: CardProp) {
    console.log(`SwipeLeft: ${item.id}`);
  },
};

const styles = StyleSheet.create({
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH,
  },
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});

export default Deck;
