import pfp1 from './pfp1.jpg';
import pfp2 from './pfp2.jpg';
import pfp3 from './pfp3.jpg';
import pfp4 from './pfp4.jpg';

/**
 * Enum representing the available profile picture options.
 *
 * @enum {string}
 * @property {string} PFP1 - Represents the first profile picture option.
 * @property {string} PFP2 - Represents the second profile picture option.
 * @property {string} PFP3 - Represents the third profile picture option.
 * @property {string} PFP4 - Represents the fourth profile picture option.
 */
enum ProfilePictureOptions {
  PFP1 = 'pfp1',
  PFP2 = 'pfp2',
  PFP3 = 'pfp3',
  PFP4 = 'pfp4',
}

/**
 * Mapping of profile picture options to the imported image files.
 * Used to dynamically display the correct profile picture based on user selection.
 *
 * @constant
 * @type {Record<ProfilePictureOptions, string>}
 */
const profilePictureMap: Record<ProfilePictureOptions, string> = {
  [ProfilePictureOptions.PFP1]: pfp1,
  [ProfilePictureOptions.PFP2]: pfp2,
  [ProfilePictureOptions.PFP3]: pfp3,
  [ProfilePictureOptions.PFP4]: pfp4,
};

/**
 * Array of all available profile picture options, used to populate
 * profile picture selection components.
 *
 * @constant
 * @type {ProfilePictureOptions[]}
 */
const PROFILE_OPTIONS: ProfilePictureOptions[] = Object.values(ProfilePictureOptions);

export { profilePictureMap, PROFILE_OPTIONS };
