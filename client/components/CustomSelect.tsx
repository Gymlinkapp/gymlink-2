import { useState } from 'react';
import { Modal } from 'react-native';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { View } from 'react-native';

export const CustomSelect = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setModalVisible(false);
    onSelect(option);
  };

  return (
    <View className='p-4 bg-secondaryDark rounded-md'>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text className='font-MontserratMedium text-white'>
          {selectedOption ? selectedOption.label : 'Select an option'}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className='flex-1 bg-primaryDark justify-center p-12'>
          {options.map((option) => (
            <TouchableOpacity
              className='py-4 px-8 bg-secondaryDark rounded-md mb-4'
              key={option.value}
              onPress={() => handleSelectOption(option)}
            >
              <Text className='text-white font-MontserratMedium'>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};
