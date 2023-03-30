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
  DateTime: any
  Upload: any
}

export type Conversation = {
  __typename?: 'Conversation'
  /** Date and time when the resource was created. */
  createdAt: Scalars['DateTime']
  /** Unique identifier for the resource. */
  id: Scalars['ID']
  /** Get the last message of the conversation. */
  lastMessage?: Maybe<Message>
  /** Date and time when the resource was last updated. */
  updatedAt: Scalars['DateTime']
  /** Get the first user of the conversation. */
  user1: User
  /** Get the second user of the conversation. */
  user2: User
}

export type CreateConversationInput = {
  /** The user that will be part of the conversation. */
  userId: Scalars['ID']
}

export type CreateConversationOutput = {
  __typename?: 'CreateConversationOutput'
  /** The conversation created. */
  conversation: Conversation
  /** Whether the conversation was created or not. */
  created: Scalars['Boolean']
}

export type CreateMessageInput = {
  /** Content of the message */
  content: Scalars['String']
  /** ID of the conversation */
  conversationId: Scalars['ID']
}

export type CreateUserInput = {
  /** Password of user */
  password: Scalars['String']
  /** Username of user */
  username: Scalars['String']
}

export type FindOneUserInput = {
  /** Id of user */
  id?: InputMaybe<Scalars['ID']>
  /** Username of user */
  username?: InputMaybe<Scalars['String']>
}

export type Image = {
  __typename?: 'Image'
  /** Blurhash of image */
  blurhash: Scalars['String']
  /** Date and time when the resource was created. */
  createdAt: Scalars['DateTime']
  /** Unique identifier for the resource. */
  id: Scalars['ID']
  /** Key of image */
  key: Scalars['ID']
  /** Date and time when the resource was last updated. */
  updatedAt: Scalars['DateTime']
}

export type Message = {
  __typename?: 'Message'
  /** Content of the message */
  content: Scalars['String']
  /** The conversation the message belongs to. */
  conversation?: Maybe<Conversation>
  /** Date and time when the resource was created. */
  createdAt: Scalars['DateTime']
  /** Unique identifier for the resource. */
  id: Scalars['ID']
  /** Whether the message is modified */
  isModified: Scalars['Boolean']
  /** Date and time when the resource was last updated. */
  updatedAt: Scalars['DateTime']
  /** The user who created the message. */
  user?: Maybe<User>
}

export type Mutation = {
  __typename?: 'Mutation'
  /** Accept a friend request */
  AcceptFriendRequest: User
  /** Cancel a friend request */
  CancelFriendRequest: User
  /** Close a conversation for user. */
  CloseConversation: Conversation
  /** Create a new conversation. */
  CreateConversation: CreateConversationOutput
  /** Create a new message. */
  CreateMessage: Message
  /** Decline a friend request */
  DeclineFriendRequest: User
  /** Delete a conversation by id. */
  DeleteConversation: Scalars['ID']
  /** Delete a message by id. */
  DeleteMessage: Scalars['ID']
  /** Delete a user */
  DeleteUser: User
  /** Refresh Tokens of current user */
  RefreshTokens: TokensOutput
  /** Remove a friend */
  RemoveFriend: User
  /** Send a friend request */
  SendFriendRequest: User
  /** Sign in User */
  SignIn: SignInOutput
  /** Sign up User */
  SignUp: SignUpOutput
  /** Update a message by id. */
  UpdateMessage: Message
  /** Update a user */
  UpdateUser: User
}

export type MutationAcceptFriendRequestArgs = {
  id: Scalars['ID']
}

export type MutationCancelFriendRequestArgs = {
  id: Scalars['ID']
}

export type MutationCloseConversationArgs = {
  id: Scalars['ID']
}

export type MutationCreateConversationArgs = {
  input: CreateConversationInput
}

export type MutationCreateMessageArgs = {
  input: CreateMessageInput
}

export type MutationDeclineFriendRequestArgs = {
  id: Scalars['ID']
}

export type MutationDeleteConversationArgs = {
  id: Scalars['ID']
}

export type MutationDeleteMessageArgs = {
  id: Scalars['ID']
}

export type MutationRemoveFriendArgs = {
  id: Scalars['ID']
}

export type MutationSendFriendRequestArgs = {
  username: Scalars['String']
}

export type MutationSignInArgs = {
  password: Scalars['String']
  username: Scalars['String']
}

export type MutationSignUpArgs = {
  input: CreateUserInput
}

export type MutationUpdateMessageArgs = {
  input: UpdateMessageInput
}

export type MutationUpdateUserArgs = {
  input: UpdateUserInput
}

export type PaginationMessage = {
  __typename?: 'PaginationMessage'
  nodes: Array<Message>
  /** Total number of nodes */
  totalCount: Scalars['Int']
}

export type PaginationMessageWhere = {
  /** Filter by Conversation Id */
  conversationId?: InputMaybe<Scalars['ID']>
  /** Filter by createdAt date */
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** Filter by id */
  id?: InputMaybe<Scalars['ID']>
}

export type PaginationSortBy = {
  /** Sort by date of creation */
  createdAt?: InputMaybe<SortDirection>
  /** Sort by date of last update */
  updatedAt?: InputMaybe<SortDirection>
}

export type Query = {
  __typename?: 'Query'
  /** Find one conversation by id. */
  FindOneConversation?: Maybe<Conversation>
  /** Find one message by id. */
  FindOneMessage?: Maybe<Message>
  /** Get a user by args */
  FindOneUser?: Maybe<User>
  /** Logout current user */
  Logout: Scalars['Boolean']
  /** Pagination of messages. */
  PaginationMessage: PaginationMessage
  /** Get current user */
  Profile: User
}

export type QueryFindOneConversationArgs = {
  id?: InputMaybe<Scalars['ID']>
}

export type QueryFindOneMessageArgs = {
  id?: InputMaybe<Scalars['ID']>
}

export type QueryFindOneUserArgs = {
  input: FindOneUserInput
}

export type QueryPaginationMessageArgs = {
  skip: Scalars['Int']
  sortBy?: InputMaybe<PaginationSortBy>
  take: Scalars['Int']
  where?: InputMaybe<Array<InputMaybe<PaginationMessageWhere>>>
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

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type TokensOutput = {
  __typename?: 'TokensOutput'
  /** Access Token of user */
  accessToken: Scalars['String']
  /** Access Token of user */
  refreshToken: Scalars['String']
}

export type UpdateMessageInput = {
  /** Content of the message */
  content: Scalars['String']
  /** ID of the message */
  id: Scalars['ID']
}

export type UpdateUserInput = {
  /** Avatar of user */
  avatar?: InputMaybe<Scalars['Upload']>
  /** Password of user */
  password?: InputMaybe<Scalars['String']>
  /** Username of user */
  username?: InputMaybe<Scalars['String']>
}

export type User = {
  __typename?: 'User'
  /** Avatar of a user */
  avatar?: Maybe<Image>
  /** Get all conversations of a user */
  conversations?: Maybe<Array<Conversation>>
  /** Date and time when the resource was created. */
  createdAt: Scalars['DateTime']
  /** Get all friends of a user */
  friends?: Maybe<Array<User>>
  /** Unique identifier for the resource. */
  id: Scalars['ID']
  /** Get all received requests of a user */
  receivedRequests?: Maybe<Array<User>>
  /** Get all sent requests of a user */
  sentRequests?: Maybe<Array<User>>
  /** Date and time when the resource was last updated. */
  updatedAt: Scalars['DateTime']
  /** Username of user */
  username: Scalars['String']
}
