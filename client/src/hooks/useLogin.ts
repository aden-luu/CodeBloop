import { useNavigate } from 'react-router-dom';
import { ChangeEvent, FormEvent, useState } from 'react';
import useLoginContext from './useLoginContext';
import {
  auth,
  createUserWithEmailAndPassword,
  googleProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '../firebaseConfig';
import { User } from '../types';
import { addUser, getUserByUsername } from '../services/userService';

/**
 * Represents a Firebase Error
 */
type FirebaseError = {
  code: string;
  message: string;
};

/**
 * Custom hook to handle login input and submission.
 *
 * @returns username - The current value of the username input.
 * @returns handleInputChange - Function to handle changes in the input field.
 * @returns handleSubmit - Function to handle login submission
 */
const useLogin = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useLoginContext();
  const [isSignup, setIsSignup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pfp, setPfp] = useState<string>('pfp1');
  const [bio, setBio] = useState<string>('');
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);
  const navigate = useNavigate();

  const handleBioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBio(e.target.value);
  };

  function isFirebaseError(err: unknown): err is FirebaseError {
    return typeof err === 'object' && err !== null && 'code' in err && 'message' in err;
  }

  /**
   * Function to handle the username change event.
   *
   * @param e - the event object.
   */
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  /**
   * Function to handle the email change event.
   *
   * @param e - the event object.
   */
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  /**
   * Function to handle the password change event.
   *
   * @param e - the event object.
   */
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  /**
   * Function to handle the login with email
   *
   * @param e - the event object.
   */
  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await getUserByUsername(username);
      const userCredential = await signInWithEmailAndPassword(auth, user.email, password);
      const firebaseUID = userCredential.user?.uid;

      if (!firebaseUID) {
        throw new Error('Firebase UID not found');
      }
      const userModel: User = {
        username,
        email: user.email,
        bio: '',
        pfp: '',
      };
      setUser(userModel);
      localStorage.setItem('user', JSON.stringify(userModel));
      navigate('/home');
    } catch (err) {
      setError('Login failed: Invalid username or password');
    }
  };

  /**
   * Function to handle the signup with email.
   *
   * @param e - the event object.
   */
  const handleEmailSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUID = userCredential.user?.uid;

      if (!firebaseUID) {
        throw new Error('Firebase UID not found');
      }

      const newUser: User = {
        username,
        email,
        pfp,
        bio,
      };
      const res = await addUser(newUser);
      if (res && res._id) {
        const userModel: User = newUser;
        setUser(userModel);
        localStorage.setItem('user', JSON.stringify(userModel));
        navigate('/home');
      }
    } catch (err) {
      if (isFirebaseError(err)) {
        if (err.code === 'auth/weak-password') {
          setError('Signup failed: Password should be at least 6 characters');
        } else if (err.code === 'auth/email-already-in-use') {
          setError('Signup failed: Email is already in use');
        } else {
          setError(`Signup failed: ${err.message}`);
        }
      } else if (err instanceof Error) {
        setError(`Signup failed: ${err.message}`);
      } else {
        setError('Signup failed: An unexpected error occurred');
      }
    }
  };

  /**
   * Function to handle the google login.
   *
   * @param e - the event object.
   */
  const handleGoogleLoginSuccess = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      try {
        const existingUser = await getUserByUsername(result.user.displayName || 'Google User');
        const userModel: User = {
          username: result.user.displayName || 'Google User',
          email: result.user.email ?? '',
          pfp: existingUser.pfp,
          bio: existingUser.bio,
        };
        setUser(userModel);
        localStorage.setItem('user', JSON.stringify(userModel));
        navigate('/home');
      } catch {
        setIsGoogleSignup(true);
        setUsername(result.user.displayName || 'Google User');
        setEmail(result.user.email ?? '');
        setIsSignup(true);
        setIsModalOpen(true);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Google login failed:', error);
    }
  };

  /**
   * Opens the modal and sets the mode to either sign up or log in.
   *
   * @param {boolean} signupMode - If true, sets the modal to sign-up mode; otherwise, sets it to log-in mode.
   */
  const openModal = (signupMode: boolean) => {
    setIsSignup(signupMode);
    setIsModalOpen(true);
  };

  /**
   * Closes the modal.
   */
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleGoogleSignup = async () => {
    try {
      const newUser: User = { username, email, pfp, bio };
      await addUser(newUser);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      navigate('/home');
    } catch {
      setError('Signup failed: An unexpected error occurred');
    }
  };

  /**
   * Handles the form submission for either signing up or logging in.
   * Prevents the default form submission behavior and calls the appropriate handler.
   *
   * @param {FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSignup) {
      if (isGoogleSignup) {
        // Handle Google-specific sign-up
        handleGoogleSignup();
      } else {
        // Handle regular email sign-up
        handleEmailSignup();
      }
    } else {
      handleEmailLogin(e);
    }
    closeModal();
  };

  return {
    username,
    email,
    password,
    pfp,
    bio,
    error,
    isModalOpen,
    isSignup,
    isGoogleSignup,
    handleUsernameChange,
    handleEmailChange,
    handlePasswordChange,
    setPfp,
    handleBioChange,
    handleGoogleLoginSuccess,
    closeModal,
    handleSubmit,
    openModal,
  };
};

export default useLogin;
