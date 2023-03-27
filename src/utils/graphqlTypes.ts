export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any
  /** The `Upload` scalar type represents a file upload. */
  Upload: any
}

export type Message = {
  __typename?: 'Message'
  /** Unique identifier for the resource. */
  id: Scalars['ID']
  /** Date and time when the resource was created. */
  createdAt: Scalars['DateTime']
  /** Date and time when the resource was last updated. */
  updatedAt: Scalars['DateTime']
  /** Content of the message */
  content: Scalars['String']
  /** The user who created the message. */
  user?: Maybe<User>
  /** The conversation the message belongs to. */
  conversation?: Maybe<Conversation>
}

export type Conversation = {
  __typename?: 'Conversation'
  /** Unique identifier for the resource. */
  id: Scalars['ID']
  /** Date and time when the resource was created. */
  createdAt: Scalars['DateTime']
  /** Date and time when the resource was last updated. */
  updatedAt: Scalars['DateTime']
  /** Get the first user of the conversation. */
  user1: User
  /** Get the second user of the conversation. */
  user2: User
  /** Get the last message of the conversation. */
  lastMessage?: Maybe<Message>
}

export type Image = {
  __typename?: 'Image'
  /** Unique identifier for the resource. */
  id: Scalars['ID']
  /** Date and time when the resource was created. */
  createdAt: Scalars['DateTime']
  /** Date and time when the resource was last updated. */
  updatedAt: Scalars['DateTime']
  /** Key of image */
  key: Scalars['ID']
  /** Blurhash of image */
  blurhash: Scalars['String']
}

export type User = {
  __typename?: 'User'
  /** Unique identifier for the resource. */
  id: Scalars['ID']
  /** Date and time when the resource was created. */
  createdAt: Scalars['DateTime']
  /** Date and time when the resource was last updated. */
  updatedAt: Scalars['DateTime']
  /** Username of user */
  username: Scalars['String']
  /** Get all friends of a user */
  friends?: Maybe<Array<User>>
  /** Get all received requests of a user */
  receivedRequests?: Maybe<Array<User>>
  /** Get all sent requests of a user */
  sentRequests?: Maybe<Array<User>>
  /** Avatar of a user */
  avatar?: Maybe<Image>
  /** Get all conversations of a user */
  conversations?: Maybe<Array<Conversation>>
}

export type TokensOutput = {
  __typename?: 'TokensOutput'
  /** Access Token of user */
  accessToken: Scalars['String']
  /** Access Token of user */
  refreshToken: Scalars['String']
}

export type SignInOutput = {
  __typename?: 'SignInOutput'
  /** Access Token of user */
  accessToken: Scalars['String']
  /** Access Token of user */
  refreshToken: Scalars['String']
  /** Current user */
  user: User
}

export type SignUpOutput = {
  __typename?: 'SignUpOutput'
  /** Access Token of user */
  accessToken: Scalars['String']
  /** Access Token of user */
  refreshToken: Scalars['String']
  /** Current user */
  user: User
}

export type CreateConversationOutput = {
  __typename?: 'CreateConversationOutput'
  /** The conversation created. */
  conversation: Conversation
  /** Whether the conversation was created or not. */
  created: Scalars['Boolean']
}

export type PaginationMessage = {
  __typename?: 'PaginationMessage'
  /** Total number of nodes */
  totalCount: Scalars['Int']
  nodes: Array<Message>
}

export type Query = {
  __typename?: 'Query'
  /** Get a user by args */
  FindOneUser?: Maybe<User>
  /** Find one conversation by id. */
  FindOneConversation?: Maybe<Conversation>
  /** Find one message by id. */
  FindOneMessage?: Maybe<Message>
  /** Pagination of messages. */
  PaginationMessage: PaginationMessage
  /** Logout current user */
  Logout: Scalars['Boolean']
  /** Get current user */
  Profile: User
}

export type QueryFindOneUserArgs = {
  input: FindOneUserInput
}

export type QueryFindOneConversationArgs = {
  id?: InputMaybe<Scalars['ID']>
}

export type QueryFindOneMessageArgs = {
  id?: InputMaybe<Scalars['ID']>
}

export type QueryPaginationMessageArgs = {
  skip: Scalars['Int']
  take: Scalars['Int']
  sortBy?: InputMaybe<PaginationSortBy>
  where?: InputMaybe<Array<InputMaybe<PaginationMessageWhere>>>
}

export type FindOneUserInput = {
  /** Id of user */
  id?: InputMaybe<Scalars['ID']>
  /** Username of user */
  username?: InputMaybe<Scalars['String']>
}

export type PaginationSortBy = {
  /** Sort by date of creation */
  createdAt?: InputMaybe<SortDirection>
  /** Sort by date of last update */
  updatedAt?: InputMaybe<SortDirection>
}

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type PaginationMessageWhere = {
  /** Filter by id */
  id?: InputMaybe<Scalars['ID']>
  /** Filter by Conversation Id */
  conversationId?: InputMaybe<Scalars['ID']>
  /** Filter by createdAt date */
  createdAt?: InputMaybe<Scalars['DateTime']>
}

export type Mutation = {
  __typename?: 'Mutation'
  /** Update a user */
  UpdateUser: User
  /** Delete a user */
  DeleteUser: User
  /** Send a friend request */
  SendFriendRequest: User
  /** Accept a friend request */
  AcceptFriendRequest: User
  /** Decline a friend request */
  DeclineFriendRequest: User
  /** Cancel a friend request */
  CancelFriendRequest: User
  /** Remove a friend */
  RemoveFriend: User
  /** Create a new conversation. */
  CreateConversation: CreateConversationOutput
  /** Delete a conversation by id. */
  DeleteConversation: Scalars['ID']
  /** Close a conversation for user. */
  CloseConversation: Conversation
  /** Create a new message. */
  CreateMessage: Message
  /** Delete a message by id. */
  DeleteMessage: Scalars['ID']
  /** Sign up User */
  SignUp: SignUpOutput
  /** Sign in User */
  SignIn: SignInOutput
  /** Refresh Tokens of current user */
  RefreshTokens: TokensOutput
}

export type MutationUpdateUserArgs = {
  input: UpdateUserInput
}

export type MutationSendFriendRequestArgs = {
  username: Scalars['String']
}

export type MutationAcceptFriendRequestArgs = {
  id: Scalars['ID']
}

export type MutationDeclineFriendRequestArgs = {
  id: Scalars['ID']
}

export type MutationCancelFriendRequestArgs = {
  id: Scalars['ID']
}

export type MutationRemoveFriendArgs = {
  id: Scalars['ID']
}

export type MutationCreateConversationArgs = {
  input: CreateConversationInput
}

export type MutationDeleteConversationArgs = {
  id: Scalars['ID']
}

export type MutationCloseConversationArgs = {
  id: Scalars['ID']
}

export type MutationCreateMessageArgs = {
  input: CreateMessageInput
}

export type MutationDeleteMessageArgs = {
  id: Scalars['ID']
}

export type MutationSignUpArgs = {
  input: CreateUserInput
}

export type MutationSignInArgs = {
  username: Scalars['String']
  password: Scalars['String']
}

export type UpdateUserInput = {
  /** Username of user */
  username?: InputMaybe<Scalars['String']>
  /** Password of user */
  password?: InputMaybe<Scalars['String']>
  /** Avatar of user */
  avatar?: InputMaybe<Scalars['Upload']>
}

export type CreateConversationInput = {
  /** The user that will be part of the conversation. */
  userId: Scalars['ID']
}

export type CreateMessageInput = {
  /** Content of the message */
  content: Scalars['String']
  /** ID of the conversation */
  conversationId: Scalars['ID']
}

export type CreateUserInput = {
  /** Username of user */
  username: Scalars['String']
  /** Password of user */
  password: Scalars['String']
}
