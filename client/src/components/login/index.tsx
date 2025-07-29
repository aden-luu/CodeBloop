import { Button, Flex, Text, VStack, Box, Heading, Image } from '@chakra-ui/react';
import useLogin from '../../hooks/useLogin';
import CustomModal from './modal';
import ProfilePicker from './modal/forms/ProfilePicker';
import TextInput from './modal/forms/TextInput';
import logo from '../../constants/logo.jpg';

/**
 * Login component renders a login interface that allows users to log in, sign up, or authenticate using Google SSO.
 * It also includes a modal for input fields based on the selected authentication method.
 *
 * @returns {JSX.Element} The Login component.
 */
const Login = () => {
  const {
    username,
    email,
    password,
    pfp,
    bio,
    error,
    handleUsernameChange,
    handleEmailChange,
    handlePasswordChange,
    setPfp,
    handleBioChange,
    handleGoogleLoginSuccess,
    isModalOpen,
    isSignup,
    isGoogleSignup,
    closeModal,
    handleSubmit,
    openModal,
  } = useLogin();

  let modalContent;
  if (isSignup) {
    if (isGoogleSignup) {
      modalContent = (
        <>
          <ProfilePicker pfp={pfp} setPfp={setPfp} />
          <TextInput placeholder='Bio' value={bio} onChange={handleBioChange} />
        </>
      );
    } else {
      modalContent = (
        <>
          <ProfilePicker pfp={pfp} setPfp={setPfp} />
          <TextInput placeholder='Username' value={username} onChange={handleUsernameChange} />
          <TextInput placeholder='Email' type='email' value={email} onChange={handleEmailChange} />
          <TextInput
            placeholder='Password'
            type='password'
            value={password}
            onChange={handlePasswordChange}
          />
          <TextInput placeholder='Bio' value={bio} onChange={handleBioChange} />
        </>
      );
    }
  } else {
    modalContent = (
      <>
        <TextInput placeholder='Username' value={username} onChange={handleUsernameChange} />
        <TextInput
          placeholder='Password'
          type='password'
          value={password}
          onChange={handlePasswordChange}
        />
      </>
    );
  }

  return (
    <Flex
      direction='column'
      align='center'
      p={8}
      minH='100vh'
      bgGradient='linear(to-b, brand.300, brand.50)'>
      <Box p={10} borderRadius='2xl' boxShadow='2xl' bg='brand.50' width='100%' maxW='md'>
        <Heading as='h1' fontSize='2xl' textAlign='center' mb={4} variant='highlight'>
          Welcome to CodeBloop!
        </Heading>

        {/* Logo Section */}
        <Image
          src={logo} // Replace with the correct path to your logo
          alt='CodeBloop Logo'
          boxSize='150px' // Adjust size as needed
          borderRadius='full' // Makes the image completely rounded
          boxShadow='xl' // Adds a shadow for depth
          mb={6} // Margin below the logo
          mx='auto' // Centers the image horizontally
        />

        <Text fontSize='md' textAlign='center' mb={6} variant='highlight'>
          Please login, sign up, or use Google SSO.
        </Text>

        {error && (
          <Text color='red.500' mb={4} textAlign='center'>
            {error}
          </Text>
        )}

        <VStack spacing={4}>
          <Button
            height='3rem'
            borderRadius='3xl'
            width='full'
            fontSize='lg'
            onClick={() => openModal(false)}>
            Login
          </Button>
          <Button
            variant='outline'
            height='3rem'
            borderRadius='3xl'
            fontSize='lg'
            width='full'
            onClick={() => openModal(true)}>
            Sign Up
          </Button>
          <Button
            width='full'
            height='3rem'
            borderRadius='3xl'
            fontSize='lg'
            onClick={handleGoogleLoginSuccess}>
            Sign in with Google
          </Button>
        </VStack>

        <CustomModal
          isOpen={isModalOpen}
          onClose={closeModal}
          isSignup={isSignup}
          onSubmit={handleSubmit}>
          <VStack spacing={4}>{modalContent}</VStack>
        </CustomModal>
      </Box>
    </Flex>
  );
};

export default Login;
