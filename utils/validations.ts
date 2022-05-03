export const isValidEmail = (email: string): boolean => {
  const match = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  return !!match;
};

export const isEmail = (email: string): string | undefined => {
  return isValidEmail(email)
    ? undefined
    : 'email is not valid';
}

export const registerValidParams = (email: string, password: string, name: string): string[] => {
  const errors: string[] = [];

  // email is required
  if (email === '') {
    errors.push('email is required');
  }

  // password is required
  if (password === '') {
    errors.push('password is required');
  }

  // name is required
  if (name === '') {
    errors.push('name is required');
  }

  // password must be at least 6 characters
  if (password.length < 6) {
    errors.push('password must be at least 6 characters');
  }

  // email must be valid
  if (!isValidEmail(email)) {
    errors.push('email is not valid');
  }

  return errors;
}

export const loginValidParams = (email: string, password: string): string[] => {
  const errors: string[] = [];

  // email is required
  if (email === '') {
    errors.push('email is required');
  }

  // password is required
  if (password === '') {
    errors.push('password is required');
  }

  // email must be valid
  if (!isValidEmail(email)) {
    errors.push('email is not valid');
  }

  return errors;
}

