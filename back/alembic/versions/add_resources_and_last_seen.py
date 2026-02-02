"""Add resources table and user last_seen

Revision ID: add_resources_table
Revises: add_file_fields_to_messages
Create Date: 2026-02-02 09:10:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_resources_table'
down_revision = 'add_file_fields_to_messages'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create resources table
    op.create_table('resources',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('file_path', sa.String(length=500), nullable=False),
        sa.Column('file_type', sa.String(length=50), nullable=False),
        sa.Column('file_size', sa.Integer(), nullable=False),
        sa.Column('psychologist_id', sa.Integer(), nullable=False),
        sa.Column('is_public', sa.Boolean(), nullable=True),
        sa.Column('tags', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_resources_created_at'), 'resources', ['created_at'], unique=False)
    op.create_index(op.f('ix_resources_id'), 'resources', ['id'], unique=False)
    op.create_index(op.f('ix_resources_psychologist_id'), 'resources', ['psychologist_id'], unique=False)
    op.create_foreign_key(None, 'resources', 'users', ['psychologist_id'], ['id'], ondelete='CASCADE')

    # Add last_seen to users
    op.add_column('users', sa.Column('last_seen', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    # Remove last_seen from users
    op.drop_column('users', 'last_seen')

    # Drop resources table
    op.drop_index(op.f('ix_resources_psychologist_id'), table_name='resources')
    op.drop_index(op.f('ix_resources_id'), table_name='resources')
    op.drop_index(op.f('ix_resources_created_at'), table_name='resources')
    op.drop_table('resources')
