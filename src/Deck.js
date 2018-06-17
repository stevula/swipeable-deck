import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  PanResponder,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_DURATION = 500;


const styles = StyleSheet.create({
  cardStyle: {
    position: 'absolute',
    width: '100%',
  },
});

class Deck extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };

    this.position = new Animated.ValueXY();
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, { dx, dy}) => {
        this.position.setValue({ x: dx, y: dy });
      },
      onPanResponderRelease: (event, { dx, dy}) => {
        if (dx < -SWIPE_THRESHOLD) {
          this.swipe('left');
        } else if (dx > SWIPE_THRESHOLD) {
          this.swipe('right');
        } else {
          this.resetPosition(true);
        }
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({ index: 0 });
    }
  }

  componentDidUpdate() {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.spring();
  }

  swipe(direction) {
    Animated.timing(this.position, {
      toValue: {
        x: direction === 'left' ? -SCREEN_WIDTH : SCREEN_WIDTH,
        y: 0
      },
      duration: SWIPE_DURATION,
    }).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete(direction) {
    const item = this.props.data[this.state.index];

    if (direction === 'left') {
      this.props.onSwipeLeft();
    } else if (direction === 'right') {
      this.props.onSwipeRight();
    }
    this.resetPosition();
    this.setState({ index: this.state.index + 1 });
  }

  resetPosition(shouldAnimate = false) {
    if (shouldAnimate) {
      Animated.spring(this.position, {
        toValue: { x: 0, y: 0 },
      }).start();
    } else {
      this.position.setValue({ x: 0, y: 0 });
    }
  }

  getTopCardStyle() {
    const rotate = this.position.x.interpolate({
      inputRange: [-500, 500],
      outputRange: ['-120deg', '120deg'],
    });

    return {
      ...this.position.getLayout(),
      transform: [{ rotate }]
    };
  }

  renderAnimatedCard(item, index, isTopCard) {
    const spreadProps = isTopCard ? this.panResponder.panHandlers : {};
    return (
      <Animated.View
        key={item.id}
        style={[
          styles.cardStyle,
          {
            top: 10 * (index - this.state.index),
          },
          isTopCard && this.getTopCardStyle(),
        ]}
        {...spreadProps}
      >
        {this.props.renderCard(item)}
      </Animated.View>
    );
  }

  renderCards() {
    if (this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards();
    }

    return this.props.data.map((item, index) => {
      if (index < this.state.index) return null;

      const isTopCard = index === this.state.index;
      return this.renderAnimatedCard(item, index, isTopCard);
    }).reverse();
  }

  render() {
    return (
      <View>
        {this.renderCards()}
      </View>
    );
  }
}

export default Deck;
