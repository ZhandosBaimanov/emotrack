"""Add file fields to messages table

Revision ID: add_file_fields_to_messages
Revises: migration_username_to_names
Create Date: 2026-02-02 03:40:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_file_fields_to_messages'
down_revision = 'replace_username_to_names'
branch_labels = None
depends_on = None


def upgrade():
    # Add file-related columns to messages table
    op.add_column('messages', sa.Column('file_url', sa.String(), nullable=True))
    op.add_column('messages', sa.Column('file_name', sa.String(), nullable=True))
    op.add_column('messages', sa.Column('file_type', sa.String(), nullable=True))
    op.add_column('messages', sa.Column('file_size', sa.Integer(), nullable=True))
    
    # Make content nullable
    op.alter_column('messages', 'content',
                    existing_type=sa.Text(),
                    nullable=True)


def downgrade():
    # Remove file-related columns
    op.drop_column('messages', 'file_size')
    op.drop_column('messages', 'file_type')
    op.drop_column('messages', 'file_name')
    op.drop_column('messages', 'file_url')
    
    # Make content not nullable again
    op.alter_column('messages', 'content',
                    existing_type=sa.Text(),
                    nullable=False)
