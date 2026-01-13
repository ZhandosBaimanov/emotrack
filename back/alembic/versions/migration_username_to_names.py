"""Replace username with first_name and last_name

Revision ID: replace_username_to_names
Revises: 9bb4261614e7_add_roles_and_emotions
Create Date: 2026-01-13

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'replace_username_to_names'
down_revision = '9bb4261614e7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Добавляем новые колонки
    op.add_column('users', sa.Column('first_name', sa.String(), nullable=True))
    op.add_column('users', sa.Column('last_name', sa.String(), nullable=True))
    
    # Копируем данные из username в first_name и last_name
    op.execute("UPDATE users SET first_name = username, last_name = ''")
    
    # Делаем колонки NOT NULL
    op.alter_column('users', 'first_name', existing_type=sa.String(), nullable=False)
    op.alter_column('users', 'last_name', existing_type=sa.String(), nullable=False)
    
    # Создаем индексы на новые колонки
    op.create_index(op.f('ix_users_first_name'), 'users', ['first_name'], unique=False)
    op.create_index(op.f('ix_users_last_name'), 'users', ['last_name'], unique=False)
    
    # Удаляем старую колонку username
    op.drop_index('ix_users_username', table_name='users')
    op.drop_column('users', 'username')


def downgrade() -> None:
    # Восстанавливаем колонку username
    op.add_column('users', sa.Column('username', sa.String(), nullable=True))
    
    # Копируем данные обратно
    op.execute("UPDATE users SET username = CONCAT(first_name, ' ', last_name)")
    
    # Делаем колонку NOT NULL
    op.alter_column('users', 'username', existing_type=sa.String(), nullable=False)
    
    # Создаем индекс
    op.create_index('ix_users_username', 'users', ['username'], unique=False)
    
    # Удаляем новые колонки
    op.drop_index(op.f('ix_users_first_name'), table_name='users')
    op.drop_index(op.f('ix_users_last_name'), table_name='users')
    op.drop_column('users', 'first_name')
    op.drop_column('users', 'last_name')
