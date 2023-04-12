import { TouchableOpacity, View, Text } from 'react-native';
import AuthLayout from '../../layouts/AuthLayout';
import { useState } from 'react';
import Button from '../../components/button';

export default function AssignExcercise({ route, navigation }) {
  const { exercise, days, edit } = route.params;

  const [values, setValue] = useState<string[]>([]);
  const [items, setItems] = useState([
    { label: 'Monday', values: 'monday' },
    { label: 'Tuesday', values: 'tuesday' },
    { label: 'Wednesday', values: 'wednesday' },
    { label: 'Thursday', values: 'thursday' },
    { label: 'Friday', values: 'friday' },
    { label: 'Saturday', values: 'saturday' },
    { label: 'Sunday', values: 'sunday' },
  ]);
  const isSelected = (item: { label: string; values: string }) =>
    values.includes(item.values);

  const assignExercise = {
    exercise,
    days: values,
  };
  return (
    <AuthLayout
      title={`Assign ${exercise}`}
      description='Select day of the week.'
    >
      <View className='flex-row flex-wrap'>
        {items
          .filter((item) => !days.includes(item.values))
          .map((item, idx) => (
            <TouchableOpacity
              className={`${
                isSelected(item) ? 'bg-white' : 'bg-secondaryDark'
              } m-1 px-6 py-4 rounded-full`}
              key={idx}
              onPress={() => {
                if (isSelected(item)) {
                  // if the item is already selected, remove it from the array
                  setValue(values.filter((val) => val !== item.values));
                } else {
                  // if the item is not selected, add it to the array
                  setValue([...values, item.values]);
                }
              }}
            >
              <Text
                className={`font-MontserratRegular ${
                  isSelected(item) ? 'text-primaryDark' : 'text-white'
                }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
      <Button
        variant='primary'
        onPress={() => {
          // navigate back and pass the `values` array to the previous screen
          if (edit) {
            navigation.navigate('EditSplit', { assignExercise });
          } else {
            navigation.navigate('UserGymSplit', { assignExercise });
          }
        }}
      >
        Done
      </Button>
      <Button
        variant='secondary'
        onPress={() => {
          navigation.goBack();
        }}
      >
        Cancel
      </Button>
    </AuthLayout>
  );
}
