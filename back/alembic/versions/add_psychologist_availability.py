"""Add psychologist availability table

Revision ID: add_psychologist_availability
Revises: add_file_fields_to_messages
Create Date: 2026-02-02 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_psychologist_availability'
down_revision = 'add_file_fields_to_messages'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create psychologist_availability table
    op.create_table(
        'psychologist_availability',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('psychologist_id', sa.Integer(), nullable=False),
        sa.Column('available_date', sa.Date(), nullable=False),
        sa.Column('available_time', sa.Time(), nullable=False),
        sa.Column('is_available', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['psychologist_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('psychologist_id', 'available_date', 'available_time', name='unique_psychologist_availability')
    )
    op.create_index(op.f('ix_psychologist_availability_psychologist_id'), 'psychologist_availability', ['psychologist_id'], unique=False)
    op.create_index(op.f('ix_psychologist_availability_available_date'), 'psychologist_availability', ['available_date'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_psychologist_availability_available_date'), table_name='psychologist_availability')
    op.drop_index(op.f('ix_psychologist_availability_psychologist_id'), table_name='psychologist_availability')
    op.drop_table('psychologist_availability')
