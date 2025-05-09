'use server';
import { neon } from "@neondatabase/serverless";

export async function runMigration() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error('DATABASE_URL is not defined in environment variables');
    }

    const sql = neon(databaseUrl);
    
    try {
        // Split the migration into smaller parts to avoid template literal size limits
        await sql`
            -- Users table
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255),
                password VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await sql`
            -- Social accounts table
            CREATE TABLE social_accounts (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                provider VARCHAR(50) NOT NULL,
                provider_account_id VARCHAR(255) NOT NULL,
                access_token TEXT NOT NULL,
                refresh_token TEXT,
                token_expires_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, provider)
            );
        `;

        await sql`
            -- Posts table
            CREATE TABLE posts (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                social_account_id INTEGER REFERENCES social_accounts(id) ON DELETE CASCADE,
                provider_post_id VARCHAR(255) NOT NULL,
                content TEXT,
                media_url TEXT[],
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                scheduled_at TIMESTAMP WITH TIME ZONE,
                published_at TIMESTAMP WITH TIME ZONE,
                status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
                error_message TEXT,
                UNIQUE(user_id, provider_post_id)
            );
        `;

        await sql`
            -- Engagement metrics table
            CREATE TABLE engagement_metrics (
                id SERIAL PRIMARY KEY,
                post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
                likes INTEGER DEFAULT 0,
                comments INTEGER DEFAULT 0,
                shares INTEGER DEFAULT 0,
                views INTEGER DEFAULT 0,
                engagement_score FLOAT DEFAULT 0,
                collected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(post_id, collected_at)
            );
        `;

        await sql`
            -- Followers table
            CREATE TABLE followers (
                id SERIAL PRIMARY KEY,
                social_account_id INTEGER REFERENCES social_accounts(id) ON DELETE CASCADE,
                follower_count INTEGER NOT NULL,
                collected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(social_account_id, collected_at)
            );
        `;

        await sql`
            -- Create indexes
            CREATE INDEX idx_social_accounts_user_id ON social_accounts(user_id);
            CREATE INDEX idx_posts_user_id ON posts(user_id);
            CREATE INDEX idx_posts_social_account_id ON posts(social_account_id);
            CREATE INDEX idx_posts_scheduled_at ON posts(scheduled_at);
            CREATE INDEX idx_posts_published_at ON posts(published_at);
            CREATE INDEX idx_engagement_metrics_post_id ON engagement_metrics(post_id);
            CREATE INDEX idx_followers_social_account_id ON followers(social_account_id);
        `;

        await sql`
            -- Create function for updating timestamps
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `;

        await sql`
            -- Create triggers
            CREATE TRIGGER update_users_updated_at
                BEFORE UPDATE ON users
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();

            CREATE TRIGGER update_social_accounts_updated_at
                BEFORE UPDATE ON social_accounts
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();

            CREATE TRIGGER update_posts_updated_at
                BEFORE UPDATE ON posts
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        `;

        console.log('Migration completed successfully');
        return { success: true, message: 'Migration completed successfully' };
    } catch (error) {
        console.error('Error running migration:', error);
        throw error;
    }
}
