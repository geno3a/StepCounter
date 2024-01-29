import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import SVG, {Circle, CircleProps} from 'react-native-svg'
import Animated, {useAnimatedProps, useSharedValue, withTiming} from 'react-native-reanimated'
import { AntDesign } from '@expo/vector-icons';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type RingProgressProps = {
    radius?: number;
    strokeWidth?: number;
    progress: number
}

const color = '#EE0F55';

const RingProgress = ({radius = 100, strokeWidth = 35, progress}: RingProgressProps) => {
  const innerRadius = radius - strokeWidth / 2  
  const circumference = 2 * Math.PI * innerRadius;

  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(progress, {duration: 1500})
  }, [progress])

  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: [circumference * fill.value, circumference],
  }));

  const circleDefaultProps: CircleProps = {
    r: innerRadius,
    cx: radius,
    cy: radius,
    originX: radius,
    originY: radius,
    strokeWidth: strokeWidth,
    stroke: color,
    strokeLinecap: 'round',
    rotation: '-90',
  };
  return (
    <View style = {{
        width: radius * 2, 
        height: radius * 2, 
        alignSelf: 'center',
    }}>
      <SVG>
        {/* Background */}
        <Circle {...circleDefaultProps} opacity = {0.2} />
        {/* Progress */}
        <AnimatedCircle animatedProps = {animatedProps} {...circleDefaultProps} />
        <AntDesign 
            name = "arrowright" 
            size = {strokeWidth * 0.8} 
            color = "black" 
            style = {{
            position: 'absolute',
            alignSelf: 'center',
            top: strokeWidth * 0.1,
        }}/>
      </SVG>
    </View>
  )
}

export default RingProgress;