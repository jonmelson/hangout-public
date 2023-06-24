import { Linking, Alert } from 'react-native';
import { EMAIL } from '@env';

export const formatInputPhoneNumber = (input: string) => {
  let phoneNumber = input.replace(/\D/g, '');

  if (phoneNumber.length > 3 && phoneNumber.length <= 6) {
    phoneNumber = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  } else if (phoneNumber.length > 6) {
    phoneNumber = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
      3,
      6,
    )}-${phoneNumber.slice(6)}`;
  }

  return phoneNumber;
};

export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+${match[1]} (${match[2]})-${match[3]}-${match[4]}`;
  } else {
    const match2 = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match2) {
      return `+1 (${match2[1]})-${match2[2]}-${match2[3]}`;
    }
  }
  return phoneNumber;
}

export const handleContactUsPress = async () => {
  const url = `mailto:${EMAIL}`;
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    Alert.alert(
      'Error',
      'No mail app found. Please download a mail app to send email.',
    );
  } else {
    Linking.openURL(url);
  }
};

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

export const reformatPhoneNumber = (phoneNumber: string) => {
  const digitsOnly = phoneNumber.replace(/[^0-9]/g, ''); // remove non-digits
  return `+1${digitsOnly}`; // add +1 to the beginning of the digits-only phone number
};

 