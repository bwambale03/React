"""Initial schema with hashtags

Revision ID: bf0e4cac2611
Revises: 12693a21f2af
Create Date: 2025-03-06 14:02:54.879421

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision = 'bf0e4cac2611'
down_revision = '12693a21f2af'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('post', schema=None) as batch_op:
        batch_op.alter_column('hashtags',
               existing_type=sqlite.JSON(),
               type_=sa.String(length=255),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('post', schema=None) as batch_op:
        batch_op.alter_column('hashtags',
               existing_type=sa.String(length=255),
               type_=sqlite.JSON(),
               existing_nullable=True)

    # ### end Alembic commands ###
