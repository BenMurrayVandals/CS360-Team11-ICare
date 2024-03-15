export const getFormInfo = () => {
  const questionsBoilerplate = {
    email: {
      placeholder: "Enter your email",
      id: "Email",
      minLength: 3,
      maxLength: 254,
    },
    password: {
      id: "Password",
      minLength: 8,
      maxLength: 256,
    },
    username: {
      placeholder: "Enter your username",
      id: "Username",
      minLength: 3,
      maxLength: 50,
    },
    businessName: {
      placeholder: "Enter the name of your business",
      id: "BusinessName",
      minLength: 3,
      maxLength: 50,
    },
    firstName: {
      placeholder: "First name",
      id: "firstName",
    },
    lastName: {
      placeholder: "Last name",
      id: "lastName",
    },
    
  };

  return { questionsBoilerplate };
};
