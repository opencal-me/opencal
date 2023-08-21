export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** An ISO 8601-encoded date */
  Date: { input: string; output: string; }
  /** An ISO 8601-encoded datetime */
  DateTime: { input: string; output: string; }
};

export type Activity = Node & {
  __typename?: 'Activity';
  address?: Maybe<Scalars['String']['output']>;
  coordinates?: Maybe<Coordinates>;
  descriptionHtml?: Maybe<Scalars['String']['output']>;
  end: Scalars['DateTime']['output'];
  googleEventId: Scalars['String']['output'];
  handle: Scalars['String']['output'];
  /** ID of the object. */
  id: Scalars['ID']['output'];
  location?: Maybe<Scalars['String']['output']>;
  openings: Scalars['Int']['output'];
  owner: User;
  reservations: Array<Reservation>;
  start: Scalars['DateTime']['output'];
  storyImageUrl: Scalars['String']['output'];
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Coordinates = {
  __typename?: 'Coordinates';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

/** Autogenerated input type of CreateActivity */
export type CreateActivityInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  googleEventId: Scalars['String']['input'];
};

/** Autogenerated return type of CreateActivity. */
export type CreateActivityPayload = {
  __typename?: 'CreateActivityPayload';
  activity?: Maybe<Activity>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  errors?: Maybe<Array<InputFieldError>>;
  success: Scalars['Boolean']['output'];
};

/** Autogenerated input type of CreateReservation */
export type CreateReservationInput = {
  activityId: Scalars['ID']['input'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

/** Autogenerated return type of CreateReservation. */
export type CreateReservationPayload = {
  __typename?: 'CreateReservationPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  errors?: Maybe<Array<InputFieldError>>;
  reservation?: Maybe<Reservation>;
  success: Scalars['Boolean']['output'];
};

export type GoogleEvent = {
  __typename?: 'GoogleEvent';
  activity?: Maybe<Activity>;
  descriptionHtml?: Maybe<Scalars['String']['output']>;
  durationSeconds: Scalars['Int']['output'];
  end: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  location?: Maybe<Scalars['String']['output']>;
  start: Scalars['DateTime']['output'];
  title?: Maybe<Scalars['String']['output']>;
  viewerIsOrganizer: Scalars['Boolean']['output'];
};

export type Image = Node & {
  __typename?: 'Image';
  /** ID of the object. */
  id: Scalars['ID']['output'];
  signedId: Scalars['String']['output'];
  url: Scalars['String']['output'];
};


export type ImageUrlArgs = {
  size?: InputMaybe<ImageSize>;
};

export enum ImageSize {
  Lg = 'LG',
  Md = 'MD',
  Sm = 'SM'
}

export type InputFieldError = {
  __typename?: 'InputFieldError';
  field: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createActivity: CreateActivityPayload;
  createReservation: CreateReservationPayload;
  testMutation: TestMutationPayload;
  updateUser: UpdateUserPayload;
};


export type MutationCreateActivityArgs = {
  input: CreateActivityInput;
};


export type MutationCreateReservationArgs = {
  input: CreateReservationInput;
};


export type MutationTestMutationArgs = {
  input: TestMutationInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

/** An object with an ID. */
export type Node = {
  /** ID of the object. */
  id: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  activity?: Maybe<Activity>;
  activityStatus?: Maybe<Scalars['String']['output']>;
  announcement?: Maybe<Scalars['String']['output']>;
  /** When the server was booted. */
  bootedAt: Scalars['DateTime']['output'];
  contactEmail: Scalars['String']['output'];
  imageBySignedId?: Maybe<Image>;
  passwordStrength: Scalars['Float']['output'];
  testEcho: Scalars['String']['output'];
  user?: Maybe<User>;
  viewer?: Maybe<User>;
};


export type QueryActivityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryImageBySignedIdArgs = {
  signedId: Scalars['String']['input'];
};


export type QueryPasswordStrengthArgs = {
  password: Scalars['String']['input'];
};


export type QueryTestEchoArgs = {
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Reservation = Node & {
  __typename?: 'Reservation';
  activity: Activity;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  /** ID of the object. */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  status: ReservationStatus;
};

export enum ReservationStatus {
  Confirmed = 'CONFIRMED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type Subscription = {
  __typename?: 'Subscription';
  activityStatus?: Maybe<Scalars['String']['output']>;
  testSubscription: Scalars['Int']['output'];
};

export type TestModel = {
  __typename?: 'TestModel';
  birthday?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

/** Autogenerated input type of TestMutation */
export type TestMutationInput = {
  birthday?: InputMaybe<Scalars['Date']['input']>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

/** Autogenerated return type of TestMutation. */
export type TestMutationPayload = {
  __typename?: 'TestMutationPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  errors?: Maybe<Array<InputFieldError>>;
  model?: Maybe<TestModel>;
  success: Scalars['Boolean']['output'];
};

/** Autogenerated input type of UpdateUser */
export type UpdateUserInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Autogenerated return type of UpdateUser. */
export type UpdateUserPayload = {
  __typename?: 'UpdateUserPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  errors?: Maybe<Array<InputFieldError>>;
  success: Scalars['Boolean']['output'];
  user?: Maybe<User>;
};

export type User = Node & {
  __typename?: 'User';
  activities: Array<Activity>;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  googleEvents: Array<GoogleEvent>;
  /** ID of the object. */
  id: Scalars['ID']['output'];
  isAdmin: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};


export type UserGoogleEventsArgs = {
  query?: InputMaybe<Scalars['String']['input']>;
};
