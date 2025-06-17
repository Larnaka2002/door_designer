from flask_wtf import FlaskForm
from wtforms import FloatField, SelectField
from wtforms.validators import InputRequired

class ProfileForm(FlaskForm):
    groove_depth = FloatField("Глубина паза (мм)", default=10.0, validators=[InputRequired()])
    groove_width = FloatField("Ширина паза (мм)", default=10.0, validators=[InputRequired()])
    groove_side = SelectField("Сторона паза", choices=[
        ('inner', 'Внутрь'),
        ('outer', 'Наружу'),
        ('both', 'С обеих сторон')
    ])


