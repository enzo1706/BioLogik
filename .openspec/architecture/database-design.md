# Database Design

## User
- id
- name
- email
- password_hash
- role

## Subscription
- id
- user_id
- plan
- status

## Meal
- id
- title
- calories
- protein
- carbs
- fats
- stock

## Order
- id
- user_id
- status
- total

## PatientProgress
- id
- user_id
- weight
- body_fat
- muscle_mass

## Appointment
- id
- nutritionist_id
- patient_id
- date