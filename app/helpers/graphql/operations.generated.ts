import * as Types from './types.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type ActivityStatusBadgeSubscriptionVariables = Types.Exact<{ [key: string]: never; }>;


export type ActivityStatusBadgeSubscription = (
  { __typename?: 'Subscription' }
  & Pick<Types.Subscription, 'activityStatus'>
);

export type AppMenuQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AppMenuQuery = (
  { __typename?: 'Query' }
  & Pick<Types.Query, 'bootedAt'>
);

export type AppViewerFragment = (
  { __typename?: 'User' }
  & Pick<Types.User, 'firstName' | 'id' | 'isAdmin'>
);

export type AvatarFieldQueryVariables = Types.Exact<{
  signedId: Types.Scalars['String']['input'];
}>;


export type AvatarFieldQuery = (
  { __typename?: 'Query' }
  & { image: Types.Maybe<(
    { __typename?: 'Image' }
    & Pick<Types.Image, 'id' | 'url'>
  )> }
);

export type ContactEmailQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ContactEmailQuery = (
  { __typename?: 'Query' }
  & { email: Types.Query['contactEmail'] }
);

export type ErrorPageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ErrorPageQuery = (
  { __typename?: 'Query' }
  & { viewer: Types.Maybe<(
    { __typename?: 'User' }
    & Pick<Types.User, 'id' | 'firstName' | 'isAdmin'>
  )> }
);

export type HomePageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type HomePageQuery = (
  { __typename?: 'Query' }
  & Pick<Types.Query, 'announcement'>
  & { viewer: Types.Maybe<(
    { __typename?: 'User' }
    & Pick<Types.User, 'id' | 'firstName' | 'isAdmin'>
  )> }
);

export type PasswordWithStrengthCheckInputQueryVariables = Types.Exact<{
  password: Types.Scalars['String']['input'];
}>;


export type PasswordWithStrengthCheckInputQuery = (
  { __typename?: 'Query' }
  & Pick<Types.Query, 'passwordStrength'>
);

export type TestEmailQueryVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
  hasUser: Types.Scalars['Boolean']['input'];
}>;


export type TestEmailQuery = (
  { __typename?: 'Query' }
  & { user?: Types.Maybe<(
    { __typename?: 'User' }
    & Pick<Types.User, 'firstName' | 'id'>
  )> }
);

export type TestFeedSubscriptionVariables = Types.Exact<{ [key: string]: never; }>;


export type TestFeedSubscription = (
  { __typename?: 'Subscription' }
  & Pick<Types.Subscription, 'testSubscription'>
);

export type TestMutationVariables = Types.Exact<{
  input: Types.TestMutationInput;
}>;


export type TestMutation = (
  { __typename?: 'Mutation' }
  & { payload: (
    { __typename?: 'TestMutationPayload' }
    & { errors: Types.Maybe<Array<(
      { __typename?: 'InputFieldError' }
      & Pick<Types.InputFieldError, 'field' | 'message'>
    )>>, model: Types.Maybe<(
      { __typename?: 'TestModel' }
      & Pick<Types.TestModel, 'birthday' | 'id' | 'name'>
    )> }
  ) }
);

export type TestPageQueryVariables = Types.Exact<{
  name: Types.Scalars['String']['input'];
}>;


export type TestPageQuery = (
  { __typename?: 'Query' }
  & Pick<Types.Query, 'testEcho'>
  & { viewer: Types.Maybe<(
    { __typename?: 'User' }
    & Pick<Types.User, 'id' | 'firstName' | 'isAdmin'>
  )> }
);

export type UpdateUserMutationVariables = Types.Exact<{
  input: Types.UpdateUserInput;
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { payload: (
    { __typename?: 'UpdateUserPayload' }
    & { errors: Types.Maybe<Array<(
      { __typename?: 'InputFieldError' }
      & Pick<Types.InputFieldError, 'field' | 'message'>
    )>>, user: Types.Maybe<(
      { __typename?: 'User' }
      & Pick<Types.User, 'id'>
    )> }
  ) }
);

export type UserEmailChangedEmailQueryVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
}>;


export type UserEmailChangedEmailQuery = (
  { __typename?: 'Query' }
  & { user: Types.Maybe<(
    { __typename?: 'User' }
    & Pick<Types.User, 'email' | 'firstName' | 'id' | 'name'>
  )> }
);

export type UserEmailVerificationEmailQueryVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
}>;


export type UserEmailVerificationEmailQuery = (
  { __typename?: 'Query' }
  & { user: Types.Maybe<(
    { __typename?: 'User' }
    & Pick<Types.User, 'firstName' | 'id'>
  )> }
);

export type UserLoginPageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UserLoginPageQuery = (
  { __typename?: 'Query' }
  & { viewer: Types.Maybe<(
    { __typename?: 'User' }
    & Pick<Types.User, 'id' | 'firstName' | 'isAdmin'>
  )> }
);

export type UserPasswordChangedEmailQueryVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
}>;


export type UserPasswordChangedEmailQuery = (
  { __typename?: 'Query' }
  & { user: Types.Maybe<(
    { __typename?: 'User' }
    & Pick<Types.User, 'firstName' | 'id'>
  )> }
);

export type UserPasswordResetEmailQueryVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
}>;


export type UserPasswordResetEmailQuery = (
  { __typename?: 'Query' }
  & { user: Types.Maybe<(
    { __typename?: 'User' }
    & Pick<Types.User, 'firstName' | 'id'>
  )> }
);

export type UserRegisterPageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UserRegisterPageQuery = (
  { __typename?: 'Query' }
  & { viewer: Types.Maybe<(
    { __typename?: 'User' }
    & Pick<Types.User, 'id' | 'firstName' | 'isAdmin'>
  )> }
);

export type UserRequestPasswordResetPageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UserRequestPasswordResetPageQuery = (
  { __typename?: 'Query' }
  & { viewer: Types.Maybe<(
    { __typename?: 'User' }
    & Pick<Types.User, 'id' | 'firstName' | 'isAdmin'>
  )> }
);

export type UserSettingsPageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UserSettingsPageQuery = (
  { __typename?: 'Query' }
  & { viewer: Types.Maybe<(
    { __typename?: 'User' }
    & Pick<Types.User, 'id' | 'firstName' | 'isAdmin' | 'avatarUrl' | 'email' | 'lastName' | 'name'>
  )> }
);

export type UserSettingsPageViewerFragment = (
  { __typename?: 'User' }
  & Pick<Types.User, 'avatarUrl' | 'email' | 'firstName' | 'lastName' | 'name'>
);

export type UserWelcomeEmailQueryVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
}>;


export type UserWelcomeEmailQuery = (
  { __typename?: 'Query' }
  & { user: Types.Maybe<(
    { __typename?: 'User' }
    & Pick<Types.User, 'firstName' | 'id'>
  )> }
);

export const AppViewerFragment = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<AppViewerFragment, unknown>;
export const UserSettingsPageViewerFragment = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserSettingsPageViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<UserSettingsPageViewerFragment, unknown>;
export const ActivityStatusBadgeSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ActivityStatusBadgeSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activityStatus"}}]}}]} as unknown as DocumentNode<ActivityStatusBadgeSubscription, ActivityStatusBadgeSubscriptionVariables>;
export const AppMenuQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppMenuQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bootedAt"}}]}}]} as unknown as DocumentNode<AppMenuQuery, AppMenuQueryVariables>;
export const AvatarFieldQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AvatarFieldQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"signedId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"image"},"name":{"kind":"Name","value":"imageBySignedId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"signedId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"signedId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<AvatarFieldQuery, AvatarFieldQueryVariables>;
export const ContactEmailQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ContactEmailQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"email"},"name":{"kind":"Name","value":"contactEmail"}}]}}]} as unknown as DocumentNode<ContactEmailQuery, ContactEmailQueryVariables>;
export const ErrorPageQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ErrorPageQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"viewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AppViewerFragment"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<ErrorPageQuery, ErrorPageQueryVariables>;
export const HomePageQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HomePageQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"announcement"}},{"kind":"Field","name":{"kind":"Name","value":"viewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AppViewerFragment"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<HomePageQuery, HomePageQueryVariables>;
export const PasswordWithStrengthCheckInputQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PasswordWithStrengthCheckInputQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passwordStrength"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}]}}]} as unknown as DocumentNode<PasswordWithStrengthCheckInputQuery, PasswordWithStrengthCheckInputQueryVariables>;
export const TestEmailQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TestEmailQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hasUser"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hasUser"}}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<TestEmailQuery, TestEmailQueryVariables>;
export const TestFeedSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TestFeedSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"testSubscription"}}]}}]} as unknown as DocumentNode<TestFeedSubscription, TestFeedSubscriptionVariables>;
export const TestMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TestMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TestMutationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"payload"},"name":{"kind":"Name","value":"testMutation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"model"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"birthday"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<TestMutation, TestMutationVariables>;
export const TestPageQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TestPageQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"testEcho"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]},{"kind":"Field","name":{"kind":"Name","value":"viewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AppViewerFragment"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<TestPageQuery, TestPageQueryVariables>;
export const UpdateUserMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"payload"},"name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const UserEmailChangedEmailQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserEmailChangedEmailQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UserEmailChangedEmailQuery, UserEmailChangedEmailQueryVariables>;
export const UserEmailVerificationEmailQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserEmailVerificationEmailQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UserEmailVerificationEmailQuery, UserEmailVerificationEmailQueryVariables>;
export const UserLoginPageQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserLoginPageQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"viewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AppViewerFragment"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<UserLoginPageQuery, UserLoginPageQueryVariables>;
export const UserPasswordChangedEmailQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserPasswordChangedEmailQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UserPasswordChangedEmailQuery, UserPasswordChangedEmailQueryVariables>;
export const UserPasswordResetEmailQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserPasswordResetEmailQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UserPasswordResetEmailQuery, UserPasswordResetEmailQueryVariables>;
export const UserRegisterPageQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserRegisterPageQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"viewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AppViewerFragment"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<UserRegisterPageQuery, UserRegisterPageQueryVariables>;
export const UserRequestPasswordResetPageQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserRequestPasswordResetPageQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"viewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AppViewerFragment"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<UserRequestPasswordResetPageQuery, UserRequestPasswordResetPageQueryVariables>;
export const UserSettingsPageQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserSettingsPageQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"viewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AppViewerFragment"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserSettingsPageViewerFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserSettingsPageViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<UserSettingsPageQuery, UserSettingsPageQueryVariables>;
export const UserWelcomeEmailQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserWelcomeEmailQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UserWelcomeEmailQuery, UserWelcomeEmailQueryVariables>;