import { View, Text, Platform } from 'react-native'
import React, {useEffect, useState} from 'react'
import AppleHealthKit, { HealthInputOptions, HealthKitPermissions} from 'react-native-health';
import { initialize, requestPermission, readRecords } from 'react-native-health-connect';
import { TimeRangeFilter } from 'react-native-health-connect/lib/typescript/types/base.types';

const permissions: HealthKitPermissions = {
    permissions: {
      read:[AppleHealthKit.Constants.Permissions.Steps,
            AppleHealthKit.Constants.Permissions.FlightsClimbed,
            AppleHealthKit.Constants.Permissions.DistanceWalkingRunning
        ],
      write: [],
    }
  }

export default function useHealthDate(date: Date) {
    const [hasPermission, setHasPermission] = useState(false);
    const [steps, setSteps] = useState(0);
    const [flights, setFlights] = useState(0);
    const [distance, setDistance] = useState(0);

    // IOS healthkit
    useEffect(() => {
        if (Platform.OS !== 'ios'){
            return;
        }
        AppleHealthKit.isAvailable((err, isAvailable) => {
            if (err) {
                console.log("error initializing Healthkit: ", err);
                return;
            }
            if (!isAvailable){
                console.log("Apple HealthKit is not available on this device")
                return;
            }
            AppleHealthKit.initHealthKit(permissions, (err) => {
            if (err) {
                console.log("error initializing Healthkit: ", err);
                return;
            }
            setHasPermission(true);
            })});
    }, [])

    useEffect(() => {
        if (!hasPermission){
        return;
        }

        const options: HealthInputOptions = {
        date: date.toISOString(),
        includeManuallyAdded: false,
        }

        AppleHealthKit.getStepCount(options, (err, results) => {
        if (err){
            console.log("error getting step count: ", err);
            return;
        }
        console.log("results: ", results);
        setSteps(results.value);
        })

        AppleHealthKit.getFlightsClimbed(options, (err, results) => {
        if (err){
            console.log("error getting flights count: ", err);
            return;
        }
        console.log("results: ", results);
        setFlights(results.value);
        })

        AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
        if (err){
            console.log("error getting flights count: ", err);
            return;
        }
        console.log("results: ", results);
        setDistance(results.value);
        })    

    }, [hasPermission])
    const readSampleData = async () => {
        // initialize the client
        const isInitialized = await initialize();
        if (!isInitialized){
            return;
        }
      
        // request permissions
        await requestPermission([
          { accessType: 'read', recordType: 'Steps' },
          { accessType: 'read', recordType: 'Distance' },
          { accessType: 'read', recordType: 'FloorsClimbed'}
        ]);

        const timeRangeFilter: TimeRangeFilter = {
            operator: 'between',
            startTime: new Date(date.setHours(0,0,0,0)).toISOString(),
            endTime: new Date(date.setHours(23,59,59,999)).toISOString(),
        };

        // Steps
        const steps = await readRecords('Steps', {timeRangeFilter});
        const totalSteps = steps.reduce((sum, cur) => sum + cur.count, 0)
        setSteps(totalSteps);
        
        // Distance
        const distance = await readRecords('Distance', {timeRangeFilter});
        const totalDistance = distance.reduce((sum, cur) => sum + cur.distance.inMeters, 0)
        setDistance(totalDistance);
      
        // FloorsClimbed
        const FloorsClimbed = await readRecords('FloorsClimbed', {timeRangeFilter});
        const totalFloors = FloorsClimbed.reduce((sum, cur) => sum + cur.floors, 0)
        setFlights(totalFloors);
      };

    useEffect(() => {
        if (Platform.OS !== 'android'){
            return;
        }
        readSampleData();
    })

    return {
        steps,
        flights,
        distance
    }
}