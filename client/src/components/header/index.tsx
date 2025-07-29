import React from 'react';
import { Input, Button, Flex, Text, Spacer, Box, HStack, Image } from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import useHeader from '../../hooks/useHeader';
import useUserContext from '../../hooks/useUserContext';
import { profilePictureMap } from '../../constants/profilePictureMap';
import logo from '../../constants/logo.jpg';

/**
 * Header component that renders the main title, a search bar, and a logout button.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = () => {
  const { val, handleInputChange, handleKeyDown } = useHeader();
  const navigate = useNavigate();
  const { user } = useUserContext();

  /**
   * Handle logout by clearing user data from localStorage and navigating to login page
   */
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  /**
   * Handle title click to navigate to the home page
   */
  const handleTitleClick = () => {
    navigate('/home');
  };

  /**
   * Handle profile click to navigate to the user's profile page
   */
  const handleProfile = () => {
    navigate(`/profile/${user.username}`);
  };

  const navItems = [
    { path: '/home', label: 'Questions' },
    { path: '/tags', label: 'Tags' },
    { path: '/chats', label: 'Rooms' },
    { path: '/collections', label: 'Collections' },
  ];

  return (
    <Flex id='header' className='header' alignItems='center' p={4} bg='brand.600' color='white'>
      <Box onClick={handleTitleClick} cursor='pointer' paddingRight='4'>
        <Image src={logo} boxSize='50px' borderRadius='full' />
      </Box>
      <Text
        fontSize='2xl'
        color='brand.50'
        fontWeight='bold'
        mr={6}
        cursor='pointer'
        onClick={handleTitleClick}>
        CodeBloop
      </Text>

      <Spacer />

      <HStack align='stretch'>
        {navItems.map(item => (
          <NavLink to={item.path} key={item.path} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Box
                p={3}
                width='full'
                borderRadius='3xl'
                bg={isActive ? 'brand.50' : 'brand.300'}
                color={isActive ? 'brand.300' : 'brand.50'}
                _hover={{ bg: 'brand.50', color: 'brand.300' }}
                transition='all 0.2s ease-in-out'>
                <Text
                  color='inherit'
                  _hover={{ color: 'brand.700' }} // Explicit hover override for text
                >
                  {item.label}
                </Text>
              </Box>
            )}
          </NavLink>
        ))}
      </HStack>
      <Spacer />
      <Input
        id='searchBar'
        placeholder='Search ...'
        type='text'
        value={val}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        maxW='300px'
        bg='brand.50'
        color='black'
        mx={4}
      />
      <Button colorScheme='red' onClick={handleLogout} mr={4} variant='subtle'>
        Logout
      </Button>
      <Box onClick={handleProfile} cursor='pointer' paddingRight='4'>
        <Image
          src={profilePictureMap[user.pfp as keyof typeof profilePictureMap]}
          boxSize='50px'
          borderRadius='full'
        />
      </Box>
    </Flex>
  );
};

export default Header;
