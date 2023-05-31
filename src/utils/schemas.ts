import * as yup from 'yup';

export const phoneSchema = yup.object().shape({
  phone: yup
    .string()
    .matches(/^\d{3}[-.]?\d{3}[-.]?\d{4}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
});

export const verifyOTPSchema = yup.object().shape({
  verifyOTP: yup
    .string()
    .matches(/^\d{6}$/, 'OTP must be 6 digits')
    .required('OTP is required'),
});

export const fullNameSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
});

export const userNameSchema = yup.object().shape({
  userName: yup
    .string()
    .required()
    .max(20)
    .min(2)
    .matches(
      /^[a-zA-Z0-9_-]*[a-zA-Z0-9][a-zA-Z0-9_-]*$/,
      'Username can only contain letters, numbers, underscores, and hyphens',
    ),
});

export const shareSchema = yup.object().shape({
  title: yup.string().required(),
  details: yup.string(),
  address: yup.string().required(),
  startDate: yup.string().required(),
  endDate: yup.string().required(),
});
