export const useUtilities = () => {
  // Generates a random 13 character ID string
  const generateID = () => {
    return Math.random().toString(16).slice(2);
  };

  // Capitalizes the first letter of the passed 'string' and returns it.
  const capitalize = (string: string) => string?.charAt(0)?.toUpperCase() + string?.slice(1)

  // Creates a Deep Copy of the passed Object and returns it.
  const deepCopy = (obj: object) => JSON.parse(JSON.stringify(obj));

  // Returns the value of the key for the passed 'object' at the location of the passed 'path' if it exists, or undefined if it doesn't.
  const getObjectPathValue = (object: Object, path: string) => path.split(".").reduce((acc, val) => acc?.[val], object);

  // Returns whether or not the passed 'object' contains any key/value pairs.
  const isObjectEmpty = (object: Object) => (Object.keys(object).length <= 0 ? true : false);

  return { generateID, capitalize, deepCopy, getObjectPathValue, isObjectEmpty };
};