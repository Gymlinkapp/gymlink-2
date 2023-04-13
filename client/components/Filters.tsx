import { useState } from 'react';
import { Modal } from 'react-native';
import { FlatList } from 'react-native';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import {
  Filter,
  FilterValue,
  defaultFilters,
  genderValues,
  goalValues,
  goingTodayValues,
  skillLevelValues,
  workoutTypeValues,
} from '../utils/types/filter';
import { useAuth } from '../utils/context';
import { X } from 'phosphor-react-native';
import Button from './button';
import { BlurView } from 'expo-blur';
import { useMutation, useQueryClient } from 'react-query';
import api from '../utils/axiosStore';

export default function Filters() {
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [values, setValues] = useState<FilterValue[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [selectedValues, setSelectedValues] = useState<FilterValue[]>([]);
  const { setFilters, filters, token, setFeed, feed } = useAuth();

  // every time a user clicks save, we want to update the filters in the context, the transform the filters and send them to the server.

  const filterFeed = useMutation(
    async () => {
      // request.body = { filters: [ { filter: "goingToday", value: true }, { filter: "workout", value: ["back"] }, { filter: "gender", value: ["male", "female"] } ] }
      const transformedFilters = filters.map((filter) => {
        return {
          filter: filter.filter,
          value: filter.values.map((value) => value.value),
        };
      });

      try {
        return await api.post('/users.filterFeed', {
          token,
          filters: transformedFilters,
        });
      } catch (error) {
        console.log('error', error);
      }
    },
    {
      onSuccess: (data: any) => {
        setFeed(data.data.result.data.feed);
        console.log(feed.map((user) => user.gender));
        queryClient.invalidateQueries('user');
        queryClient.invalidateQueries('users');
      },
    }
  );

  const handleSave = () => {
    const groupedSelectedValues = selectedValues.reduce((acc, value) => {
      if (!acc[value.filter]) {
        acc[value.filter] = [];
      }
      acc[value.filter].push(value);
      return acc;
    }, {});

    setFilters((prev) => {
      // Create a copy of the previous state
      const newState = [...prev];

      Object.entries(groupedSelectedValues).forEach(([filterName, values]) => {
        const index = newState.findIndex((f) => f.filter === filterName);

        // @ts-ignore
        newState[index].values = values;
      });

      // check if the the filter is still selected as a value
      newState.forEach((filter) => {
        if (!groupedSelectedValues[filter.filter]) {
          const filterIndex = newState.findIndex(
            (f) => f.filter === filter.filter
          );
          if (filterIndex !== -1) {
            newState[filterIndex].values = [];
          }
        }
      });

      return newState;
    });

    filterFeed.mutate();

    setModalVisible(false);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    filterFeed.mutate();

    setModalVisible(false);
  };

  return (
    <View className='h-12 w-full py-2 pointer-events-none absolute top-0 z-50'>
      <FlatList
        data={filters}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.filter}
        renderItem={({ item: filter, index }) => (
          <>
            <BlurView
              intensity={25}
              className='bg-primaryDark/50 rounded-full overflow-hidden flex flex-row items-center  mr-1  px-4 py-0'
            >
              <TouchableOpacity
                onPress={() => {
                  // handleSelectOption(filter);
                  setModalVisible(true);
                  switch (filter.filter) {
                    case 'goingToday':
                      setValues(goingTodayValues);
                      break;
                    case 'workoutType':
                      setValues(workoutTypeValues);
                      break;
                    case 'skillLevel':
                      setValues(skillLevelValues);
                      break;
                    case 'gender':
                      setValues(genderValues);
                      break;
                    case 'goals':
                      setValues(goalValues);
                      break;
                    default:
                      break;
                  }
                  setModalTitle(filter.name);
                }}
              >
                <Text className='text-white font-MontserratMedium text-xs'>
                  {filter.values.length > 0
                    ? filter.values[0].name
                    : filter.name}
                </Text>
              </TouchableOpacity>
            </BlurView>

            {index === filters.length - 1 && (
              <TouchableOpacity
                onPress={() => clearFilters()}
                className='flex flex-row items-center bg-primaryWhite mr-1 rounded-full px-4 py-0'
              >
                <Text className='text-primaryDark font-MontserratMedium text-xs'>
                  Clear
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      />
      <Modal
        visible={modalVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className='flex-1 justify-end items-end w-full'>
          <View className='bg-primaryDark  w-full h-1/2 l p-12 rounded-2xl'>
            <View className='m-2 flex-row items-center w-full justify-between'>
              <Text className='text-white text-xl font-MontserratMedium'>
                {modalTitle}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <X color='#fff' />
              </TouchableOpacity>
            </View>
            <View className='flex-row flex-wrap flex-1'>
              {values.map((option: FilterValue) => (
                <TouchableOpacity
                  className={`py-4 px-8 
                    ${
                      selectedValues.find(
                        (selectedValue) => selectedValue.value === option.value
                      )
                        ? 'bg-primaryWhite'
                        : 'bg-secondaryDark'
                    }
                  rounded-md m-2`}
                  key={option.name}
                  onPress={() => {
                    // setSelectedValues([...selectedValues, option]);
                    // if options are true or false, only allow one to be selected
                    if (option.value === true || option.value === false) {
                      setSelectedValues([option]);
                    } else {
                      // if options are not true or false, allow multiple to be selected
                      if (
                        selectedValues.find(
                          (selectedValue) =>
                            selectedValue.value === option.value
                        )
                      ) {
                        setSelectedValues(
                          selectedValues.filter(
                            (selectedValue) =>
                              selectedValue.value !== option.value
                          )
                        );
                      } else {
                        setSelectedValues([
                          ...selectedValues,
                          {
                            filter: option.filter,
                            name: option.name,
                            value: option.value,
                          },
                        ]);
                      }
                    }
                  }}
                >
                  <Text
                    className={`${
                      selectedValues.find(
                        (selectedValue) => selectedValue.value === option.value
                      )
                        ? 'text-primaryDark'
                        : 'text-primaryWhite'
                    } font-MontserratMedium`}
                  >
                    {option.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className='flex-row w-full'>
              <Button
                variant='secondary'
                className='flex-1'
                onPress={() => clearFilters()}
              >
                Clear
              </Button>
              <Button
                variant='primary'
                className='flex-1'
                onPress={() => handleSave()}
              >
                Save
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
