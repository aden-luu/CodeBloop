import { Flex, Box, Image } from '@chakra-ui/react';
import { PROFILE_OPTIONS, profilePictureMap } from '../../../../constants/profilePictureMap';

/**
 * Interface representing the props for the ProfilePicker component.
 *
 * pfp - The current selected profile picture.
 * setPfp - Function to set the selected profile picture.
 */
interface ProfilePickerProps {
  pfp: string;
  setPfp: (value: string) => void;
}

/**
 * ProfilePicker component displays a list of selectable profile pictures.
 * Users can select a profile picture from the available options, which highlights
 * the selected picture with a teal border.
 *
 * @param pfp - The currently selected profile picture.
 * @param setPfp - Function to update the selected profile picture.
 */
const ProfilePicker = ({ pfp, setPfp }: ProfilePickerProps) => (
  <Flex>
    {PROFILE_OPTIONS.map((option, index) => (
      <Box
        key={index}
        p={1}
        cursor='pointer'
        onClick={() => setPfp(option)} // Set selected profile picture
      >
        <Image
          src={profilePictureMap[option]}
          border={pfp === option ? '2px solid teal' : '2px solid transparent'}
          boxSize='75px'
          borderRadius='full'
          alt={`Profile option ${index + 1}`}
        />
      </Box>
    ))}
  </Flex>
);

export default ProfilePicker;
