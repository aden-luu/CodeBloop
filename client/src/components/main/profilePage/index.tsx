import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, VStack, Grid, Spinner, AlertTitle, Alert } from '@chakra-ui/react';
import { getCommentByUsername } from '../../../services/commentService';
import { getAnswerByUsername } from '../../../services/answerService';
import { Answer, Question, Comment } from '../../../types';
import { getQuestionsByFilter } from '../../../services/questionService';
import { getUserByUsername } from '../../../services/userService';
import { profilePictureMap } from '../../../constants/profilePictureMap';
import CardListView from './card';

/**
 * ProfilePage component that displays a user's profile information, including
 * their bio, profile picture, and lists of questions, answers, and comments.
 * Fetches data based on the username in the URL parameters and displays it in
 * organized sections with loading and error handling.
 *
 */
const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [bio, setBio] = useState<string>('');
  const [pfp, setPfp] = useState<string>('');
  const [userQuestions, setUserQuestions] = useState<Question[]>([]);
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    /**
     * Function to retrieve the questions, answers, comments, and user objects that were produced by the current user.
     */
    const fetchUserData = async () => {
      try {
        const questions = await getQuestionsByFilter(undefined, undefined, username);
        const comments = await getCommentByUsername(username);
        const answers = await getAnswerByUsername(username);

        const user = await getUserByUsername(username);

        setBio(user.bio);
        setPfp(user.pfp || 'pfp1');

        setUserQuestions(questions);
        setUserComments(comments);
        setUserAnswers(answers);
      } catch (err) {
        setError('Error fetching user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (!username) {
    return (
      <Box textAlign='center' py={10}>
        <Text fontSize='lg'>Username not provided</Text>
      </Box>
    );
  }

  return (
    <Grid templateColumns='30% 70%' h='100vh'>
      {/* Left side */}
      <Box
        maxW='container.md'
        mx='auto'
        py={10}
        px={[4, 6, 10]}
        borderRight='2px solid black'
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='flex-start'
        minHeight='100vh'
        height='auto'>
        <Heading textAlign='center' mb={6} ml={[-4, -6, -10]} fontSize='5xl'>
          {username}
        </Heading>
        <VStack align='center' ml={[-4, -6, -10]}>
          <img
            src={profilePictureMap[pfp as keyof typeof profilePictureMap]}
            style={{
              width: '20vw',
              height: '20vw',
              borderRadius: '50%',
              border: '4px solid rgba(0, 0, 0, 0.1)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            }}></img>
        </VStack>
        <VStack align='start' mt={4} width='100%' textAlign='left'>
          <Heading fontSize='xl'>{username}&apos;s Bio</Heading>
          <Text p={4} ml='-4' borderRadius='md' width={['30vw', '25vw', '20vw']} textAlign='left'>
            {bio || 'No bio yet...'}
          </Text>
        </VStack>
      </Box>

      {/* Right side */}
      <Box w='100%' py={10} px={4}>
        {error ? (
          <Alert>
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        ) : (
          <Box>
            {isLoading ? (
              <Box textAlign='center' py={10}>
                <Spinner size='xl' />
              </Box>
            ) : (
              <VStack mb={4} align='stretch'>
                {/* Questions Section */}
                <CardListView items={userQuestions} type='question' />

                {/* Answers Section */}
                <CardListView items={userAnswers} type='answer' />

                {/* Comments Section */}
                <CardListView items={userComments} type='comment' />
              </VStack>
            )}
          </Box>
        )}
      </Box>
    </Grid>
  );
};

export default ProfilePage;
