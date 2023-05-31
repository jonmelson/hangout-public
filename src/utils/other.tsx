export type GoingProps = {
  title: string;
  details: string;
  location: string;
  starts: string;
  ends: string;
};

export type AvatarProps = {
  source: string;
  name: string;
  size?: number;
  style?: any;
};

export type GradientButtonProps = {
  onPress: () => void;
  title?: string;
  size: number;
  disabled?: boolean;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
};

export type ButtonProps = {
  onPress: () => void;
  title?: string;
  size: number;
};

export interface User {
  about?: string;
  avatar: string;
  created_at?: string;
  first_name: string;
  id?: string;
  instagram?: string;
  last_active?: string;
  last_name?: string;
  location?: LocationMetaData[];
  onboarded?: boolean;
  phone?: string;
  twitter?: string;
  username?: string;
}

export type EventProps = {
  going: User[];
  id: string;
  user_id: string;
  title: string;
  details: string;
  location: LocationMetaData[];
  starts: string;
  ends: string;
  created_at: string;
  navigation: any;
  sessionId?: string;
};

export interface AvatarIconGroupProps {
  users: User[];
  userId: string;
}

export type LocationMetaData = {
  address: string;
  geometry: { lat: number; lng: number };
};

export interface GoingButtonProps {
  onPress: () => void;
  isGoing: boolean;
}

export interface GradientTextProps {
  text: string;
  style?: object;
}

export interface ShareModalProps {
  modalVisible: boolean;
  handleModalClose: () => void;
}

export type User2 = {
  about?: string;
  avatar?: string | null;
  created_at?: string;
  email?: string | null;
  first_name?: string;
  id?: string;
  instagram?: string;
  last_active?: string | null;
  last_name?: string;
  phone?: string;
  registered?: boolean;
  twitter?: string;
  username?: string;
};

export type Hangout = {
  going: User[];
  id: string;
  user_id: string;
  title: string;
  details: string;
  location: LocationMetaData[];
  starts: string;
  ends: string;
  created_at: string;
};

export type Section = {
  title: string;
  data: Hangout[];
};
