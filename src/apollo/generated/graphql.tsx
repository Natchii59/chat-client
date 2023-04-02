import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Upload: any;
};

export type Conversation = {
  /** Date and time when the resource was created. */
  createdAt: Scalars['DateTime'];
  /** Unique identifier for the resource. */
  id: Scalars['ID'];
  /** Get the last message of the conversation. */
  lastMessage?: Maybe<Message>;
  /** Date and time when the resource was last updated. */
  updatedAt: Scalars['DateTime'];
  /** Get the other user of the conversation. */
  user: User;
};

export type CreateConversationInput = {
  /** The user that will be part of the conversation. */
  userId: Scalars['ID'];
};

export type CreateConversationOutput = {
  /** The conversation created. */
  conversation: Conversation;
  /** Whether the conversation was created or not. */
  created: Scalars['Boolean'];
};

export type CreateMessageInput = {
  /** Content of the message */
  content: Scalars['String'];
  /** ID of the conversation */
  conversationId: Scalars['ID'];
};

export type CreateUserInput = {
  /** Password of user */
  password: Scalars['String'];
  /** Username of user */
  username: Scalars['String'];
};

export type FindOneUserInput = {
  /** Id of user */
  id?: InputMaybe<Scalars['ID']>;
  /** Username of user */
  username?: InputMaybe<Scalars['String']>;
};

export type Image = {
  /** Blurhash of image */
  blurhash: Scalars['String'];
  /** Date and time when the resource was created. */
  createdAt: Scalars['DateTime'];
  /** Unique identifier for the resource. */
  id: Scalars['ID'];
  /** Key of image */
  key: Scalars['ID'];
  /** Date and time when the resource was last updated. */
  updatedAt: Scalars['DateTime'];
};

export type Message = {
  /** Content of the message */
  content: Scalars['String'];
  /** The conversation the message belongs to. */
  conversation: Conversation;
  /** Date and time when the resource was created. */
  createdAt: Scalars['DateTime'];
  /** Unique identifier for the resource. */
  id: Scalars['ID'];
  /** Whether the message is modified */
  isModified: Scalars['Boolean'];
  /** Date and time when the resource was last updated. */
  updatedAt: Scalars['DateTime'];
  /** The user who created the message. */
  user: User;
};

export type Mutation = {
  /** Accept a friend request */
  AcceptFriendRequest: User;
  /** Cancel a friend request */
  CancelFriendRequest: User;
  /** Close a conversation for user. */
  CloseConversation: Conversation;
  /** Create a new conversation. */
  CreateConversation: CreateConversationOutput;
  /** Create a new message. */
  CreateMessage: Message;
  /** Decline a friend request */
  DeclineFriendRequest: User;
  /** Delete a conversation by id. */
  DeleteConversation: Scalars['ID'];
  /** Delete a message by id. */
  DeleteMessage: Scalars['ID'];
  /** Delete a user */
  DeleteUser: User;
  /** Refresh Tokens of current user */
  RefreshTokens: TokensOutput;
  /** Remove a friend */
  RemoveFriend: User;
  /** Send a friend request */
  SendFriendRequest: User;
  /** Sign in User */
  SignIn: User;
  /** Sign up User */
  SignUp: User;
  /** Update a message by id. */
  UpdateMessage: Message;
  /** Update a user */
  UpdateUser: User;
};


export type MutationAcceptFriendRequestArgs = {
  id: Scalars['ID'];
};


export type MutationCancelFriendRequestArgs = {
  id: Scalars['ID'];
};


export type MutationCloseConversationArgs = {
  id: Scalars['ID'];
};


export type MutationCreateConversationArgs = {
  input: CreateConversationInput;
};


export type MutationCreateMessageArgs = {
  input: CreateMessageInput;
};


export type MutationDeclineFriendRequestArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteConversationArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteMessageArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveFriendArgs = {
  id: Scalars['ID'];
};


export type MutationSendFriendRequestArgs = {
  username: Scalars['String'];
};


export type MutationSignInArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationSignUpArgs = {
  input: CreateUserInput;
};


export type MutationUpdateMessageArgs = {
  input: UpdateMessageInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type PaginationMessage = {
  nodes: Array<Message>;
  /** Total number of nodes */
  totalCount: Scalars['Int'];
};

export type PaginationMessageWhere = {
  /** Filter by Conversation Id */
  conversationId?: InputMaybe<Scalars['ID']>;
  /** Filter by createdAt date */
  createdAt?: InputMaybe<Scalars['DateTime']>;
  /** Filter by id */
  id?: InputMaybe<Scalars['ID']>;
};

export type PaginationSortBy = {
  /** Sort by date of creation */
  createdAt?: InputMaybe<SortDirection>;
  /** Sort by date of last update */
  updatedAt?: InputMaybe<SortDirection>;
};

export type Query = {
  /** Find one conversation by id. */
  FindOneConversation?: Maybe<Conversation>;
  /** Find one message by id. */
  FindOneMessage?: Maybe<Message>;
  /** Get a user by args */
  FindOneUser?: Maybe<User>;
  /** Logout current user */
  Logout: Scalars['Boolean'];
  /** Pagination of messages. */
  PaginationMessage: PaginationMessage;
  /** Get current user */
  Profile: User;
};


export type QueryFindOneConversationArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryFindOneMessageArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryFindOneUserArgs = {
  input: FindOneUserInput;
};


export type QueryPaginationMessageArgs = {
  skip: Scalars['Int'];
  sortBy?: InputMaybe<PaginationSortBy>;
  take: Scalars['Int'];
  where?: InputMaybe<Array<InputMaybe<PaginationMessageWhere>>>;
};

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type TokensOutput = {
  /** Access Token of user */
  accessToken: Scalars['String'];
  /** Access Token of user */
  refreshToken: Scalars['String'];
};

export type UpdateMessageInput = {
  /** Content of the message */
  content: Scalars['String'];
  /** ID of the message */
  id: Scalars['ID'];
};

export type UpdateUserInput = {
  /** Avatar of user */
  avatar?: InputMaybe<Scalars['Upload']>;
  /** Password of user */
  password?: InputMaybe<Scalars['String']>;
  /** Username of user */
  username?: InputMaybe<Scalars['String']>;
};

export type User = {
  /** Avatar of a user */
  avatar?: Maybe<Image>;
  /** Get all conversations of a user */
  conversations?: Maybe<Array<Conversation>>;
  /** Date and time when the resource was created. */
  createdAt: Scalars['DateTime'];
  /** Get all friends of a user */
  friends?: Maybe<Array<User>>;
  /** Unique identifier for the resource. */
  id: Scalars['ID'];
  /** Get all received requests of a user */
  receivedRequests?: Maybe<Array<User>>;
  /** Get all sent requests of a user */
  sentRequests?: Maybe<Array<User>>;
  /** Date and time when the resource was last updated. */
  updatedAt: Scalars['DateTime'];
  /** Username of user */
  username: Scalars['String'];
};

export type UserFragmentFragment = { id: string, username: string, createdAt: any, avatar?: { key: string, blurhash: string } | null, conversations?: Array<{ id: string, createdAt: any, user: { id: string, username: string, avatar?: { key: string, blurhash: string } | null }, lastMessage?: { id: string, content: string, createdAt: any } | null }> | null, friends?: Array<{ id: string, username: string, avatar?: { key: string, blurhash: string } | null }> | null, receivedRequests?: Array<{ id: string, username: string, avatar?: { key: string, blurhash: string } | null }> | null, sentRequests?: Array<{ id: string, username: string, avatar?: { key: string, blurhash: string } | null }> | null };

export type ProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileQuery = { Profile: { id: string, username: string, createdAt: any, avatar?: { key: string, blurhash: string } | null, conversations?: Array<{ id: string, createdAt: any, user: { id: string, username: string, avatar?: { key: string, blurhash: string } | null }, lastMessage?: { id: string, content: string, createdAt: any } | null }> | null, friends?: Array<{ id: string, username: string, avatar?: { key: string, blurhash: string } | null }> | null, receivedRequests?: Array<{ id: string, username: string, avatar?: { key: string, blurhash: string } | null }> | null, sentRequests?: Array<{ id: string, username: string, avatar?: { key: string, blurhash: string } | null }> | null } };

export type SignInMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignInMutation = { SignIn: { id: string, username: string, createdAt: any, avatar?: { key: string, blurhash: string } | null, conversations?: Array<{ id: string, createdAt: any, user: { id: string, username: string, avatar?: { key: string, blurhash: string } | null }, lastMessage?: { id: string, content: string, createdAt: any } | null }> | null, friends?: Array<{ id: string, username: string, avatar?: { key: string, blurhash: string } | null }> | null, receivedRequests?: Array<{ id: string, username: string, avatar?: { key: string, blurhash: string } | null }> | null, sentRequests?: Array<{ id: string, username: string, avatar?: { key: string, blurhash: string } | null }> | null } };

export type SignUpMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type SignUpMutation = { SignUp: { id: string, username: string, createdAt: any, avatar?: { key: string, blurhash: string } | null } };

export type MessageConversationFragment = { id: string, content: string, createdAt: any, isModified: boolean, user: { id: string, username: string, avatar?: { key: string, blurhash: string } | null } };

export type FindOneConversationQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type FindOneConversationQuery = { FindOneConversation?: { id: string, user: { id: string, username: string, avatar?: { key: string, blurhash: string } | null } } | null };

export type PaginationMessageQueryVariables = Exact<{
  skip: Scalars['Int'];
  take: Scalars['Int'];
  where?: InputMaybe<Array<InputMaybe<PaginationMessageWhere>> | InputMaybe<PaginationMessageWhere>>;
  sortBy?: InputMaybe<PaginationSortBy>;
}>;


export type PaginationMessageQuery = { PaginationMessage: { totalCount: number, nodes: Array<{ id: string, content: string, createdAt: any, isModified: boolean, user: { id: string, username: string, avatar?: { key: string, blurhash: string } | null } }> } };

export type CreateMessageMutationVariables = Exact<{
  input: CreateMessageInput;
}>;


export type CreateMessageMutation = { CreateMessage: { id: string, content: string, createdAt: any, isModified: boolean, conversation: { id: string, createdAt: any, user: { id: string, username: string, avatar?: { key: string, blurhash: string } | null } }, user: { id: string, username: string, avatar?: { key: string, blurhash: string } | null } } };

export type UpdateMessageMutationVariables = Exact<{
  input: UpdateMessageInput;
}>;


export type UpdateMessageMutation = { UpdateMessage: { id: string, content: string, createdAt: any, isModified: boolean, user: { id: string, username: string, avatar?: { key: string, blurhash: string } | null } } };

export type DeleteMessageMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteMessageMutation = { DeleteMessage: string };

export type CreateConversationMutationVariables = Exact<{
  input: CreateConversationInput;
}>;


export type CreateConversationMutation = { CreateConversation: { created: boolean, conversation: { id: string, createdAt: any, user: { id: string, username: string, avatar?: { key: string, blurhash: string } | null }, lastMessage?: { id: string, content: string, createdAt: any } | null } } };

export type CloseConversationMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CloseConversationMutation = { CloseConversation: { id: string } };

export type SendFriendRequestMutationVariables = Exact<{
  username: Scalars['String'];
}>;


export type SendFriendRequestMutation = { SendFriendRequest: { id: string, username: string, avatar?: { key: string, blurhash: string } | null } };

export type AcceptFriendRequestMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type AcceptFriendRequestMutation = { AcceptFriendRequest: { id: string } };

export type DeclineFriendRequestMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeclineFriendRequestMutation = { DeclineFriendRequest: { id: string } };

export type CancelFriendRequestMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CancelFriendRequestMutation = { CancelFriendRequest: { id: string } };

export type RemoveFriendMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RemoveFriendMutation = { RemoveFriend: { id: string } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { UpdateUser: { id: string, username: string, createdAt: any, avatar?: { key: string, blurhash: string } | null } };

export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  id
  username
  createdAt
  avatar {
    key
    blurhash
  }
  conversations {
    id
    createdAt
    user {
      id
      username
      avatar {
        key
        blurhash
      }
    }
    lastMessage {
      id
      content
      createdAt
    }
  }
  friends {
    id
    username
    avatar {
      key
      blurhash
    }
  }
  receivedRequests {
    id
    username
    avatar {
      key
      blurhash
    }
  }
  sentRequests {
    id
    username
    avatar {
      key
      blurhash
    }
  }
}
    `;
export const MessageConversationFragmentDoc = gql`
    fragment MessageConversation on Message {
  id
  content
  createdAt
  isModified
  user {
    id
    username
    avatar {
      key
      blurhash
    }
  }
}
    `;
export const ProfileDocument = gql`
    query Profile {
  Profile {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

/**
 * __useProfileQuery__
 *
 * To run a query within a React component, call `useProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useProfileQuery(baseOptions?: Apollo.QueryHookOptions<ProfileQuery, ProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
      }
export function useProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfileQuery, ProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
        }
export type ProfileQueryHookResult = ReturnType<typeof useProfileQuery>;
export type ProfileLazyQueryHookResult = ReturnType<typeof useProfileLazyQuery>;
export type ProfileQueryResult = Apollo.QueryResult<ProfileQuery, ProfileQueryVariables>;
export const SignInDocument = gql`
    mutation SignIn($username: String!, $password: String!) {
  SignIn(username: $username, password: $password) {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;
export type SignInMutationFn = Apollo.MutationFunction<SignInMutation, SignInMutationVariables>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignInMutation(baseOptions?: Apollo.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, options);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>;
export type SignInMutationOptions = Apollo.BaseMutationOptions<SignInMutation, SignInMutationVariables>;
export const SignUpDocument = gql`
    mutation SignUp($input: CreateUserInput!) {
  SignUp(input: $input) {
    id
    username
    createdAt
    avatar {
      key
      blurhash
    }
  }
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const FindOneConversationDocument = gql`
    query FindOneConversation($id: ID!) {
  FindOneConversation(id: $id) {
    id
    user {
      id
      username
      avatar {
        key
        blurhash
      }
    }
  }
}
    `;

/**
 * __useFindOneConversationQuery__
 *
 * To run a query within a React component, call `useFindOneConversationQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindOneConversationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindOneConversationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFindOneConversationQuery(baseOptions: Apollo.QueryHookOptions<FindOneConversationQuery, FindOneConversationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindOneConversationQuery, FindOneConversationQueryVariables>(FindOneConversationDocument, options);
      }
export function useFindOneConversationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindOneConversationQuery, FindOneConversationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindOneConversationQuery, FindOneConversationQueryVariables>(FindOneConversationDocument, options);
        }
export type FindOneConversationQueryHookResult = ReturnType<typeof useFindOneConversationQuery>;
export type FindOneConversationLazyQueryHookResult = ReturnType<typeof useFindOneConversationLazyQuery>;
export type FindOneConversationQueryResult = Apollo.QueryResult<FindOneConversationQuery, FindOneConversationQueryVariables>;
export const PaginationMessageDocument = gql`
    query PaginationMessage($skip: Int!, $take: Int!, $where: [PaginationMessageWhere], $sortBy: PaginationSortBy) {
  PaginationMessage(skip: $skip, take: $take, where: $where, sortBy: $sortBy) {
    totalCount
    nodes {
      ...MessageConversation
    }
  }
}
    ${MessageConversationFragmentDoc}`;

/**
 * __usePaginationMessageQuery__
 *
 * To run a query within a React component, call `usePaginationMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaginationMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaginationMessageQuery({
 *   variables: {
 *      skip: // value for 'skip'
 *      take: // value for 'take'
 *      where: // value for 'where'
 *      sortBy: // value for 'sortBy'
 *   },
 * });
 */
export function usePaginationMessageQuery(baseOptions: Apollo.QueryHookOptions<PaginationMessageQuery, PaginationMessageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PaginationMessageQuery, PaginationMessageQueryVariables>(PaginationMessageDocument, options);
      }
export function usePaginationMessageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PaginationMessageQuery, PaginationMessageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PaginationMessageQuery, PaginationMessageQueryVariables>(PaginationMessageDocument, options);
        }
export type PaginationMessageQueryHookResult = ReturnType<typeof usePaginationMessageQuery>;
export type PaginationMessageLazyQueryHookResult = ReturnType<typeof usePaginationMessageLazyQuery>;
export type PaginationMessageQueryResult = Apollo.QueryResult<PaginationMessageQuery, PaginationMessageQueryVariables>;
export const CreateMessageDocument = gql`
    mutation CreateMessage($input: CreateMessageInput!) {
  CreateMessage(input: $input) {
    ...MessageConversation
    conversation {
      id
      createdAt
      user {
        id
        username
        avatar {
          key
          blurhash
        }
      }
    }
  }
}
    ${MessageConversationFragmentDoc}`;
export type CreateMessageMutationFn = Apollo.MutationFunction<CreateMessageMutation, CreateMessageMutationVariables>;

/**
 * __useCreateMessageMutation__
 *
 * To run a mutation, you first call `useCreateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMessageMutation, { data, loading, error }] = useCreateMessageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateMessageMutation, CreateMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMessageMutation, CreateMessageMutationVariables>(CreateMessageDocument, options);
      }
export type CreateMessageMutationHookResult = ReturnType<typeof useCreateMessageMutation>;
export type CreateMessageMutationResult = Apollo.MutationResult<CreateMessageMutation>;
export type CreateMessageMutationOptions = Apollo.BaseMutationOptions<CreateMessageMutation, CreateMessageMutationVariables>;
export const UpdateMessageDocument = gql`
    mutation UpdateMessage($input: UpdateMessageInput!) {
  UpdateMessage(input: $input) {
    ...MessageConversation
  }
}
    ${MessageConversationFragmentDoc}`;
export type UpdateMessageMutationFn = Apollo.MutationFunction<UpdateMessageMutation, UpdateMessageMutationVariables>;

/**
 * __useUpdateMessageMutation__
 *
 * To run a mutation, you first call `useUpdateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMessageMutation, { data, loading, error }] = useUpdateMessageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMessageMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMessageMutation, UpdateMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMessageMutation, UpdateMessageMutationVariables>(UpdateMessageDocument, options);
      }
export type UpdateMessageMutationHookResult = ReturnType<typeof useUpdateMessageMutation>;
export type UpdateMessageMutationResult = Apollo.MutationResult<UpdateMessageMutation>;
export type UpdateMessageMutationOptions = Apollo.BaseMutationOptions<UpdateMessageMutation, UpdateMessageMutationVariables>;
export const DeleteMessageDocument = gql`
    mutation DeleteMessage($id: ID!) {
  DeleteMessage(id: $id)
}
    `;
export type DeleteMessageMutationFn = Apollo.MutationFunction<DeleteMessageMutation, DeleteMessageMutationVariables>;

/**
 * __useDeleteMessageMutation__
 *
 * To run a mutation, you first call `useDeleteMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMessageMutation, { data, loading, error }] = useDeleteMessageMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMessageMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMessageMutation, DeleteMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMessageMutation, DeleteMessageMutationVariables>(DeleteMessageDocument, options);
      }
export type DeleteMessageMutationHookResult = ReturnType<typeof useDeleteMessageMutation>;
export type DeleteMessageMutationResult = Apollo.MutationResult<DeleteMessageMutation>;
export type DeleteMessageMutationOptions = Apollo.BaseMutationOptions<DeleteMessageMutation, DeleteMessageMutationVariables>;
export const CreateConversationDocument = gql`
    mutation CreateConversation($input: CreateConversationInput!) {
  CreateConversation(input: $input) {
    created
    conversation {
      id
      createdAt
      user {
        id
        username
        avatar {
          key
          blurhash
        }
      }
      lastMessage {
        id
        content
        createdAt
      }
    }
  }
}
    `;
export type CreateConversationMutationFn = Apollo.MutationFunction<CreateConversationMutation, CreateConversationMutationVariables>;

/**
 * __useCreateConversationMutation__
 *
 * To run a mutation, you first call `useCreateConversationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateConversationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createConversationMutation, { data, loading, error }] = useCreateConversationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateConversationMutation(baseOptions?: Apollo.MutationHookOptions<CreateConversationMutation, CreateConversationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateConversationMutation, CreateConversationMutationVariables>(CreateConversationDocument, options);
      }
export type CreateConversationMutationHookResult = ReturnType<typeof useCreateConversationMutation>;
export type CreateConversationMutationResult = Apollo.MutationResult<CreateConversationMutation>;
export type CreateConversationMutationOptions = Apollo.BaseMutationOptions<CreateConversationMutation, CreateConversationMutationVariables>;
export const CloseConversationDocument = gql`
    mutation CloseConversation($id: ID!) {
  CloseConversation(id: $id) {
    id
  }
}
    `;
export type CloseConversationMutationFn = Apollo.MutationFunction<CloseConversationMutation, CloseConversationMutationVariables>;

/**
 * __useCloseConversationMutation__
 *
 * To run a mutation, you first call `useCloseConversationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCloseConversationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [closeConversationMutation, { data, loading, error }] = useCloseConversationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCloseConversationMutation(baseOptions?: Apollo.MutationHookOptions<CloseConversationMutation, CloseConversationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CloseConversationMutation, CloseConversationMutationVariables>(CloseConversationDocument, options);
      }
export type CloseConversationMutationHookResult = ReturnType<typeof useCloseConversationMutation>;
export type CloseConversationMutationResult = Apollo.MutationResult<CloseConversationMutation>;
export type CloseConversationMutationOptions = Apollo.BaseMutationOptions<CloseConversationMutation, CloseConversationMutationVariables>;
export const SendFriendRequestDocument = gql`
    mutation SendFriendRequest($username: String!) {
  SendFriendRequest(username: $username) {
    id
    username
    avatar {
      key
      blurhash
    }
  }
}
    `;
export type SendFriendRequestMutationFn = Apollo.MutationFunction<SendFriendRequestMutation, SendFriendRequestMutationVariables>;

/**
 * __useSendFriendRequestMutation__
 *
 * To run a mutation, you first call `useSendFriendRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendFriendRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendFriendRequestMutation, { data, loading, error }] = useSendFriendRequestMutation({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useSendFriendRequestMutation(baseOptions?: Apollo.MutationHookOptions<SendFriendRequestMutation, SendFriendRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendFriendRequestMutation, SendFriendRequestMutationVariables>(SendFriendRequestDocument, options);
      }
export type SendFriendRequestMutationHookResult = ReturnType<typeof useSendFriendRequestMutation>;
export type SendFriendRequestMutationResult = Apollo.MutationResult<SendFriendRequestMutation>;
export type SendFriendRequestMutationOptions = Apollo.BaseMutationOptions<SendFriendRequestMutation, SendFriendRequestMutationVariables>;
export const AcceptFriendRequestDocument = gql`
    mutation AcceptFriendRequest($id: ID!) {
  AcceptFriendRequest(id: $id) {
    id
  }
}
    `;
export type AcceptFriendRequestMutationFn = Apollo.MutationFunction<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>;

/**
 * __useAcceptFriendRequestMutation__
 *
 * To run a mutation, you first call `useAcceptFriendRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptFriendRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptFriendRequestMutation, { data, loading, error }] = useAcceptFriendRequestMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAcceptFriendRequestMutation(baseOptions?: Apollo.MutationHookOptions<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>(AcceptFriendRequestDocument, options);
      }
export type AcceptFriendRequestMutationHookResult = ReturnType<typeof useAcceptFriendRequestMutation>;
export type AcceptFriendRequestMutationResult = Apollo.MutationResult<AcceptFriendRequestMutation>;
export type AcceptFriendRequestMutationOptions = Apollo.BaseMutationOptions<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>;
export const DeclineFriendRequestDocument = gql`
    mutation DeclineFriendRequest($id: ID!) {
  DeclineFriendRequest(id: $id) {
    id
  }
}
    `;
export type DeclineFriendRequestMutationFn = Apollo.MutationFunction<DeclineFriendRequestMutation, DeclineFriendRequestMutationVariables>;

/**
 * __useDeclineFriendRequestMutation__
 *
 * To run a mutation, you first call `useDeclineFriendRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeclineFriendRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [declineFriendRequestMutation, { data, loading, error }] = useDeclineFriendRequestMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeclineFriendRequestMutation(baseOptions?: Apollo.MutationHookOptions<DeclineFriendRequestMutation, DeclineFriendRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeclineFriendRequestMutation, DeclineFriendRequestMutationVariables>(DeclineFriendRequestDocument, options);
      }
export type DeclineFriendRequestMutationHookResult = ReturnType<typeof useDeclineFriendRequestMutation>;
export type DeclineFriendRequestMutationResult = Apollo.MutationResult<DeclineFriendRequestMutation>;
export type DeclineFriendRequestMutationOptions = Apollo.BaseMutationOptions<DeclineFriendRequestMutation, DeclineFriendRequestMutationVariables>;
export const CancelFriendRequestDocument = gql`
    mutation CancelFriendRequest($id: ID!) {
  CancelFriendRequest(id: $id) {
    id
  }
}
    `;
export type CancelFriendRequestMutationFn = Apollo.MutationFunction<CancelFriendRequestMutation, CancelFriendRequestMutationVariables>;

/**
 * __useCancelFriendRequestMutation__
 *
 * To run a mutation, you first call `useCancelFriendRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelFriendRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelFriendRequestMutation, { data, loading, error }] = useCancelFriendRequestMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCancelFriendRequestMutation(baseOptions?: Apollo.MutationHookOptions<CancelFriendRequestMutation, CancelFriendRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelFriendRequestMutation, CancelFriendRequestMutationVariables>(CancelFriendRequestDocument, options);
      }
export type CancelFriendRequestMutationHookResult = ReturnType<typeof useCancelFriendRequestMutation>;
export type CancelFriendRequestMutationResult = Apollo.MutationResult<CancelFriendRequestMutation>;
export type CancelFriendRequestMutationOptions = Apollo.BaseMutationOptions<CancelFriendRequestMutation, CancelFriendRequestMutationVariables>;
export const RemoveFriendDocument = gql`
    mutation RemoveFriend($id: ID!) {
  RemoveFriend(id: $id) {
    id
  }
}
    `;
export type RemoveFriendMutationFn = Apollo.MutationFunction<RemoveFriendMutation, RemoveFriendMutationVariables>;

/**
 * __useRemoveFriendMutation__
 *
 * To run a mutation, you first call `useRemoveFriendMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFriendMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeFriendMutation, { data, loading, error }] = useRemoveFriendMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveFriendMutation(baseOptions?: Apollo.MutationHookOptions<RemoveFriendMutation, RemoveFriendMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveFriendMutation, RemoveFriendMutationVariables>(RemoveFriendDocument, options);
      }
export type RemoveFriendMutationHookResult = ReturnType<typeof useRemoveFriendMutation>;
export type RemoveFriendMutationResult = Apollo.MutationResult<RemoveFriendMutation>;
export type RemoveFriendMutationOptions = Apollo.BaseMutationOptions<RemoveFriendMutation, RemoveFriendMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
  UpdateUser(input: $input) {
    id
    username
    createdAt
    avatar {
      key
      blurhash
    }
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;