import React, { useEffect, useState } from 'react';
import { HStack, Avatar, Text, Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getUserByUsername } from '../../../services/userService';
import { profilePictureMap } from '../../../constants/profilePictureMap';

/**
 * Interface representing the props for the Username component.
 *
 * - username The username to display.
 * - color Optional color for the username text.
 */
interface UsernameProps {
  username: string;
  color?: string;
}

/**
 * Username component that displays a user's name with their profile picture.
 * Fetches user data to display the profile picture and provides navigation to the user's profile.
 *
 * @param username The username of the user.
 * @param color Optional color for the username text.
 */
const Username = ({ username, color }: UsernameProps) => {
  const [pfp, setPfp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  /**
   * Fetch the user's profile picture from the API.
   */
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserByUsername(username);
        setPfp(user.pfp || 'pfp1'); // Default to 'pfp1' if no profile picture is found.
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  /**
   * Handle profile click to navigate to the user's profile page.
   *
   * @param event Mouse event triggered by clicking the username or avatar.
   */
  const handleProfileClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/profile/${username}`);
  };

  if (isLoading) {
    return <Spinner size='sm' />;
  }

  return (
    <HStack
      spacing={2}
      cursor='pointer'
      onClick={handleProfileClick}
      align='center'
      transition='0.2s ease-in-out'
      _hover={{ filter: 'brightness(1.3)' }}>
      <Avatar
        size='sm'
        src={profilePictureMap[pfp as keyof typeof profilePictureMap]}
        name={username}
      />
      <Text
        fontWeight='medium'
        fontSize='md'
        transition='0.2s ease-in-out'
        textDecoration='none'
        color={color || 'inherit'}
        _hover={{ textDecoration: 'underline' }}>
        {username}
      </Text>
    </HStack>
  );
};

export default Username;
