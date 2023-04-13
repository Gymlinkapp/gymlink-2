import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Layout from '../layouts/layout';
import React, { useEffect, useRef, useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import Loading from '../components/Loading';
import { useAuth } from '../utils/context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Filters from '../components/Filters';
import { FilterType } from '../utils/types/filter';

function splitArrayIntoColumns(array: any[] = [], numColumns: number) {
  const columnArrays = Array.from({ length: numColumns }, () => []);
  array.forEach((item, index) => {
    columnArrays[index % numColumns].push(item);
  });
  return columnArrays;
}

export default function HomeScreen({ navigation, route }) {
  const INITIAL_SCROLL_POSITION = 250;
  const { token, user, setUser, filters, setFilters, feed, setFeed } =
    useAuth();
  const flatListRef = useRef(null);
  const [columnData, setColumnData] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(INITIAL_SCROLL_POSITION);
  const { data: users } = useUsers(token);

  const [hasInitialScrolled, setHasInitialScrolled] = useState(false);

  const isLoading = !users;

  function handlescroll(e) {
    setScrollPosition(e.nativeEvent.contentOffset.y);
  }

  useEffect(() => {
    if (user) {
      setFilters([
        {
          filter: FilterType.GOING_TODAY,
          name: 'Going Today',
          values: [
            {
              name: user.filterGoingToday ? 'Yes' : 'No',
              value: user.filterGoingToday,
              filter: FilterType.GOING_TODAY,
            },
          ],
        },
        {
          filter: FilterType.WORKOUT_TYPE,
          name: 'Workout Type',
          values: user.filterWorkout.map((workout) => {
            return {
              name: workout,
              value: workout,
              filter: FilterType.WORKOUT_TYPE,
            };
          }),
        },
        {
          filter: FilterType.SKILL_LEVEL,
          name: 'Skill Level',
          values: user.filterSkillLevel.map((skill) => {
            return {
              name: skill,
              value: skill,
              filter: FilterType.SKILL_LEVEL,
            };
          }),
        },
        {
          filter: FilterType.GENDER,
          name: FilterType.GENDER,
          values: user.filterGender.map((gender) => {
            return {
              name: gender,
              value: gender,
              filter: 'gender',
            };
          }),
        },
        {
          filter: FilterType.GOALS,
          name: 'Goals',
          values: user.filterGoals.map((goal) => {
            return {
              name: goal,
              value: goal,
              filter: FilterType.GOALS,
            };
          }),
        },
      ]);
    }
    if (!isLoading && users) {
      setFeed(users);
      const numColumns = 3;
      const scrollFactors = Array.from({ length: numColumns }, (__, index) => {
        if (index === 1) {
          return Math.random() * 0.1 + 0.05;
        } else {
          return Math.random() * 0.2 + 0.1;
        }
      });

      const columns = splitArrayIntoColumns(feed, numColumns);
      const columnData = columns.map((column, index) => {
        return {
          data: column,
          scrollFactor: scrollFactors[index],
        };
      });
      setColumnData(columnData);

      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: INITIAL_SCROLL_POSITION - 200,
          animated: true,
        });
        setHasInitialScrolled(true);
      }, 500);
    }
  }, [isLoading, users, feed, user]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Layout navigation={navigation}>
      <LinearGradient
        pointerEvents='none'
        colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
        className='absolute -top-[100px] z-50 w-full h-80'
        start={[0, 0]}
        end={[0, 1]}
      />

      <Filters />
      <FlatList
        ref={flatListRef}
        data={columnData}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{ flex: 1 }}
        onScroll={handlescroll}
        initialScrollIndex={0}
        initialNumToRender={10}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        className='min-h-full'
        renderItem={({ item: column, index }) => {
          return (
            <FlatList
              data={column.data} // use the filtered arrays for each column
              keyExtractor={(item) => item.id}
              className='flex-1'
              listKey={`${index + Math.random()}`}
              style={{
                transform: [
                  {
                    translateY:
                      -(scrollPosition - INITIAL_SCROLL_POSITION) *
                      column.scrollFactor,
                  },
                ],
              }}
              renderItem={({ item: user, index }) => (
                <TouchableOpacity
                  className='h-[250px] m-[0.5px] relative overflow-hidden rounded-3xl justify-end'
                  onPress={() => {
                    navigation.navigate('Profile', {
                      user: user,
                    });
                  }}
                >
                  <View className='z-50 p-4'>
                    <View className='overflow-hidden rounded-full w-8 h-8'>
                      <BlurView
                        className='bg-primaryDark/20 w-full h-full rounded-full justify-center items-center'
                        intensity={25}
                      >
                        <Text className=' text-white font-MontserratRegular'>
                          {user.age}
                        </Text>
                      </BlurView>
                    </View>
                    <Text className='text-white font-MontserratBold text-xl'>
                      {user.firstName}
                    </Text>
                  </View>
                  <View className='absolute top-0 left-0 w-full h-full'>
                    <LinearGradient
                      pointerEvents='none'
                      colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
                      className='absolute bottom-0 left-0 z-50 w-full h-full'
                      locations={[0, 0.5]}
                      // bottom to top
                      start={[0, 1]}
                      end={[1, 0]}
                    />
                    <Image
                      source={{ uri: user.images[0] }}
                      className='w-full h-full object-cover'
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
          );
        }}
      />
    </Layout>
  );
}
