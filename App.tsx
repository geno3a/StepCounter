import {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import RingProgress from './src/components/RingProgress';
import Value from './src/components/Value';
import useHealthDate from './src/hooks/useHealthDate';
import {AntDesign} from '@expo/vector-icons';


const steps_goal = 10000;

export default function App() {
  const [date, setDate] = useState(new Date())
  const {steps, flights, distance} = useHealthDate(date);

  const changeDate = (numDays: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + numDays);
    setDate(newDate);
  }

  return (
    <View style={styles.container}>

      <View style = {styles.datePicker}>
        <AntDesign onPress={() => changeDate(-1)} name = 'left' size = {20} color='#C3FF53'  />
          <Text style = {styles.date}>
            {date.toDateString()}
          </Text>
        <AntDesign onPress = {() => changeDate(+1)} name = 'right' size = {20} color='#C3FF53'  />
      </View>

      <RingProgress radius = {150} strokeWidth={50} progress={steps/steps_goal}/>

      <View style = {styles.values}>
        <Value label = "Steps" value = {steps.toString()} />
        <Value label = "Distance" value = {`${(distance/1000).toFixed(2)} km`} />
        <Value label = "Flights Climbed" value = {flights.toString()} />
      </View>


      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    padding: 12,
  },
  values: {
    flexDirection: 'row',
    gap: 25,
    flexWrap: 'wrap',
    marginVertical: 100,
  },
  datePicker:{
    alignSelf: 'center',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  date: {
    color: 'white',
    fontWeight: '500',
    fontSize: 20,
    marginHorizontal: 20,
  },
  
});
