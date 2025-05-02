import { pgTable, serial, uuid, varchar, text, timestamp, boolean, integer, json, unique, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['viewer', 'editor', 'admin']);
export const platformEnum = pgEnum('platform', ['twitter', 'instagram', 'facebook', 'linkedin']);
export const contentTypeEnum = pgEnum('content_type', ['text', 'image', 'video', 'link', 'carousel']);
export const contentStatusEnum = pgEnum('content_status', ['draft', 'pending_approval', 'approved', 'scheduled', 'published', 'failed']);
export const approvalStatusEnum = pgEnum('approval_status', ['pending', 'approved', 'rejected']);
export const postStatusEnum = pgEnum('post_status', ['scheduled', 'published', 'failed']);
export const sentimentEnum = pgEnum('sentiment', ['positive', 'neutral', 'negative']);
export const notificationTypeEnum = pgEnum('notification_type', ['mention', 'comment', 'message', 'approval', 'system', 'alert']);
export const eventTypeEnum = pgEnum('event_type', ['post', 'campaign', 'meeting', 'deadline', 'other']);
export const recommendationTypeEnum = pgEnum('recommendation_type', ['content', 'timing', 'hashtags', 'audience']);
export const recommendationStatusEnum = pgEnum('recommendation_status', ['new', 'viewed', 'applied', 'dismissed']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  image: varchar('image', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  lastLogin: timestamp('last_login'),
  role: userRoleEnum('role').default('viewer').notNull(),
});

// Teams table
export const teams = pgTable('teams', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  createdById: uuid('created_by_id').notNull().references(() => users.id),
});

// Team members junction table
export const teamMembers = pgTable('team_members', {
  teamId: uuid('team_id').notNull().references(() => teams.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  role: userRoleEnum('role').notNull(),
  joinedAt: timestamp('joined_at').defaultNow(),
}, (table) => {
  return {
    pk: unique().on(table.teamId, table.userId),
  };
});

// Social accounts table
export const socialAccounts = pgTable('social_accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  platform: platformEnum('platform').notNull(),
  platformAccountId: varchar('platform_account_id', { length: 255 }).notNull(),
  accountName: varchar('account_name', { length: 100 }).notNull(),
  profileUrl: varchar('profile_url', { length: 255 }),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  tokenExpiresAt: timestamp('token_expires_at'),
  userId: uuid('user_id').notNull().references(() => users.id),
  teamId: uuid('team_id').references(() => teams.id),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    unq: unique().on(table.platform, table.platformAccountId),
  };
});

// Account metrics table
export const accountMetrics = pgTable('account_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  accountId: uuid('account_id').notNull().references(() => socialAccounts.id),
  date: timestamp('date').notNull(),
  followers: integer('followers').notNull(),
  following: integer('following'),
  postsCount: integer('posts_count'),
  engagementRate: integer('engagement_rate'),
  impressions: integer('impressions'),
  reach: integer('reach'),
  profileViews: integer('profile_views'),
}, (table) => {
  return {
    unq: unique().on(table.accountId, table.date),
  };
});

// Content table
export const content = pgTable('content', {
  id: uuid('id').defaultRandom().primaryKey(),
  teamId: uuid('team_id').notNull().references(() => teams.id),
  creatorId: uuid('creator_id').notNull().references(() => users.id),
  contentType: contentTypeEnum('content_type').notNull(),
  textContent: text('text_content'),
  mediaUrls: json('media_urls').$type<string[]>(),
  linkUrl: varchar('link_url', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  status: contentStatusEnum('status').default('draft').notNull(),
});

// Content approvals table
export const contentApprovals = pgTable('content_approvals', {
  id: uuid('id').defaultRandom().primaryKey(),
  contentId: uuid('content_id').notNull().references(() => content.id),
  reviewerId: uuid('reviewer_id').notNull().references(() => users.id),
  status: approvalStatusEnum('status').notNull(),
  comments: text('comments'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Platform posts table
export const platformPosts = pgTable('platform_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  contentId: uuid('content_id').notNull().references(() => content.id),
  accountId: uuid('account_id').notNull().references(() => socialAccounts.id),
  platformPostId: varchar('platform_post_id', { length: 255 }),
  scheduledTime: timestamp('scheduled_time'),
  publishedTime: timestamp('published_time'),
  status: postStatusEnum('status').notNull(),
  platformUrl: varchar('platform_url', { length: 255 }),
});

// Post metrics table
export const postMetrics = pgTable('post_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id').notNull().references(() => platformPosts.id),
  timestamp: timestamp('timestamp').notNull(),
  likes: integer('likes').default(0),
  comments: integer('comments').default(0),
  shares: integer('shares').default(0),
  saves: integer('saves').default(0),
  clicks: integer('clicks').default(0),
  impressions: integer('impressions').default(0),
  reach: integer('reach').default(0),
  videoViews: integer('video_views').default(0),
}, (table) => {
  return {
    unq: unique().on(table.postId, table.timestamp),
  };
});

// Comments table
export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id').notNull().references(() => platformPosts.id),
  platformCommentId: varchar('platform_comment_id', { length: 255 }).notNull(),
  authorName: varchar('author_name', { length: 100 }).notNull(),
  authorId: varchar('author_id', { length: 255 }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull(),
  sentiment: sentimentEnum('sentiment'),
}, (table) => {
  return {
    unq: unique().on(table.postId, table.platformCommentId),
  };
});

// Dashboard configurations table
export const dashboardConfigs = pgTable('dashboard_configs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  name: varchar('name', { length: 100 }).notNull(),
  layout: json('layout').notNull(),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// AI recommendations table
export const aiRecommendations = pgTable('ai_recommendations', {
  id: uuid('id').defaultRandom().primaryKey(),
  accountId: uuid('account_id').notNull().references(() => socialAccounts.id),
  recommendationType: recommendationTypeEnum('recommendation_type').notNull(),
  content: json('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
  status: recommendationStatusEnum('status').default('new'),
});

// Notifications table
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  type: notificationTypeEnum('type').notNull(),
  content: text('content').notNull(),
  sourceId: varchar('source_id', { length: 255 }),
  sourceType: varchar('source_type', { length: 50 }),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Content calendar table
export const contentCalendar = pgTable('content_calendar', {
  id: uuid('id').defaultRandom().primaryKey(),
  teamId: uuid('team_id').notNull().references(() => teams.id),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  createdById: uuid('created_by_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Calendar events table
export const calendarEvents = pgTable('calendar_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  calendarId: uuid('calendar_id').notNull().references(() => contentCalendar.id),
  contentId: uuid('content_id').references(() => content.id),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  eventType: eventTypeEnum('event_type').notNull(),
  createdById: uuid('created_by_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Analytics reports table
export const analyticsReports = pgTable('analytics_reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  teamId: uuid('team_id').references(() => teams.id),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  dateRangeStart: timestamp('date_range_start').notNull(),
  dateRangeEnd: timestamp('date_range_end').notNull(),
  platforms: json('platforms').notNull().$type<string[]>(),
  metrics: json('metrics').notNull().$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow(),
  lastGenerated: timestamp('last_generated'),
  schedule: varchar('schedule', { length: 100 }),
});

// API rate limits table
export const apiRateLimits = pgTable('api_rate_limits', {
  id: uuid('id').defaultRandom().primaryKey(),
  accountId: uuid('account_id').notNull().references(() => socialAccounts.id),
  endpoint: varchar('endpoint', { length: 100 }).notNull(),
  requestsMade: integer('requests_made').default(0).notNull(),
  limitMax: integer('limit_max').notNull(),
  resetAt: timestamp('reset_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    unq: unique().on(table.accountId, table.endpoint),
  };
});

// User widgets table
export const userWidgets = pgTable('user_widgets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  dashboardId: uuid('dashboard_id').notNull().references(() => dashboardConfigs.id),
  widgetType: varchar('widget_type', { length: 50 }).notNull(),
  title: varchar('title', { length: 100 }),
  position: json('position').notNull(),
  config: json('config').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  socialAccounts: many(socialAccounts),
  teamMembers: many(teamMembers),
  dashboardConfigs: many(dashboardConfigs),
  notifications: many(notifications),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  socialAccounts: many(socialAccounts),
  content: many(content),
  contentCalendar: many(contentCalendar),
}));

export const socialAccountsRelations = relations(socialAccounts, ({ one, many }) => ({
  user: one(users, { fields: [socialAccounts.userId], references: [users.id] }),
  team: one(teams, { fields: [socialAccounts.teamId], references: [teams.id] }),
  platformPosts: many(platformPosts),
  accountMetrics: many(accountMetrics),
  aiRecommendations: many(aiRecommendations),
  apiRateLimits: many(apiRateLimits),
}));

export const contentRelations = relations(content, ({ one, many }) => ({
  team: one(teams, { fields: [content.teamId], references: [teams.id] }),
  creator: one(users, { fields: [content.creatorId], references: [users.id] }),
  contentApprovals: many(contentApprovals),
  platformPosts: many(platformPosts),
  calendarEvents: many(calendarEvents),
}));